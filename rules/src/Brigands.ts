import {SecretInformation, SimultaneousGame} from '@gamepark/rules-api'
import GameState from './GameState'
import GameView from './GameView'
import {drawCard} from './moves/DrawCard'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import {spendGold} from './moves/SpendGold'
import {isGameOptions, BrigandsOptions, BrigandsPlayerOptions} from './BrigandsOptions'
import PlayerColor from './PlayerColor'
import Phase from './types/Phase'
import PlayerState from './PlayerState'
import DistrictName from './types/DistrictName'
import Token from './types/Token'
import Card from './types/Card'
import TokenAction from './types/TokenAction'
import District from './types/District'
import { shuffle } from 'lodash'
import { EventArray } from './material/Events'
import { DistrictArray } from './material/Districts'

/**
 * Your Board Game rules must extend either "SequentialGame" or "SimultaneousGame".
 * When there is at least on situation during the game where multiple players can act at the same time, it is a "SimultaneousGame"
 * If the game contains information that players does not know (dices, hidden cards...), it must implement "IncompleteInformation".
 * If the game contains information that some players know, but the other players does not, it must implement "SecretInformation" instead.
 * Later on, you can also implement "Competitive", "Undo", "TimeLimit" and "Eliminations" to add further features to the game.
 */
export default class Brigands extends SimultaneousGame<GameState, Move, PlayerColor>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerColor> {

  constructor(state: GameState)
  constructor(options: BrigandsOptions)
  constructor(arg: GameState | BrigandsOptions) {
    if (isGameOptions(arg)) {

      const game:GameState = {
        players: setupPlayers(arg.players),
        city: setupCity(),
        dice:[],
        phase:Phase.NewDay,
        eventDeck:setupEventDeck(),
        event:undefined,
        districtResolved:undefined
      }

      super(game)
    } else {
      super(arg)
    }
  }

  /**
   * @return True when game is over
   */
  isOver(): boolean {
    return false
  }

  /**
   * Retrieves the player which must act. It is used to secure the game and prevent players from acting outside their turns.
   * Only required in a SequentialGame.
   * @return The identifier of the player whose turn it is
   */
  getActivePlayer(): PlayerColor | undefined {
    return undefined // You must return undefined only when game is over, otherwise the game will be blocked.
  }

  /**
   * Return the exhaustive list of moves that can be played by the active player.
   * This is used for 2 features:
   * - security (preventing unauthorized moves from being played);
   * - "Dummy players": when a player leaves a game, it is replaced by a "Dummy" that plays random moves, allowing the other players to finish the game.
   * In a SimultaneousGame, as multiple players can be active you will be passed a playedId as an argument.
   * If the game allows a very large (or infinite) number of moves, instead of implementing this method, you can implement instead:
   * - isLegal(move: Move):boolean, for security; and
   * - A class that implements "Dummy" to provide a custom Dummy player.
   */
  getLegalMoves(): Move[] {
    return [
      {type: MoveType.SpendGold, playerId: this.getActivePlayer()!, quantity: 5},
      {type: MoveType.DrawCard, playerId: this.getActivePlayer()!}
    ]
  }

  /**
   * This is the one and only play where you will update the game's state, depending on the move that has been played.
   *
   * @param move The move that should be applied to current state.
   */
  play(move: Move): void {
    switch (move.type) {
      case MoveType.SpendGold:
        return spendGold(this.state, move)
      case MoveType.DrawCard:
        return drawCard(this.state, move)
    }
  }

  /**
   * Here you can return the moves that should be automatically played when the game is in a specific state.
   * Here is an example from monopoly: you roll a dice, then move you pawn accordingly.
   * A first solution would be to do both state updates at once, in a "complex move" (RollDiceAndMovePawn).
   * However, this first solution won't allow you to animate step by step what happened: the roll, then the pawn movement.
   * "getAutomaticMove" is the solution to trigger multiple moves in a single action, and still allow for step by step animations.
   * => in that case, "RollDice" could set "pawnMovement = x" somewhere in the game state. Then getAutomaticMove will return "MovePawn" when
   * "pawnMovement" is defined in the state.
   * Of course, you must return nothing once all the consequences triggered by a decision are completed.
   * VERY IMPORTANT: you should never change the game state in here. Indeed, getAutomaticMove will never be called in replays, for example.
   *
   * @return The next automatic consequence that should be played in current game state.
   */
  getAutomaticMove(): void | Move {
    /**
     * Example:
     * for (const player of this.state.players) {
     *   if (player.mustDraw) {
     *     return {type: MoveType.DrawCard, playerId: player.color}
     *   }
     * }
     */
    return
  }

  /**
   * If you game has incomplete information, you must hide some of the game's state to the players and spectators.
   * @return What a person can see from the game state
   */
  getView(): GameView {
    return {...this.state, eventDeck: this.state.eventDeck.length}
  }

  /**
   * If you game has "SecretInformation", you must also implement "getPlayerView", returning the information visible by a specific player.
   * @param playerId Identifier of the player
   * @return what the player can see
   */
  getPlayerView(playerId: PlayerColor): GameView {
    console.log(playerId)
    // Here we could, for example, return a "playerView" with only the number of cards in hand for the other player only.
    return {...this.state, eventDeck: this.state.eventDeck.length}
  }

  /**
   * If you game has incomplete information, sometime you need to alter a Move before it is sent to the players and spectator.
   * For example, if a card is revealed, the id of the revealed card should be ADDED to the Move in the MoveView
   * Sometime, you will hide information: for example if a player secretly choose a card, you will hide the card to the other players or spectators.
   *
   * @param move The move that has been played
   * @return What a person should know about the move that was played
   */
  getMoveView(move: Move): MoveView {
    return move
  }

  /**
   * If you game has secret information, sometime you need to alter a Move depending on which player it is.
   * For example, if a card is drawn, the id of the revealed card should be ADDED to the Move in the MoveView, but only for the played that draws!
   * Sometime, you will hide information: for example if a player secretly choose a card, you will hide the card to the other players or spectators.
   *
   * @param move The move that has been played
   * @param playerId Identifier of the player seeing the move
   * @return What a person should know about the move that was played
   */
  getPlayerMoveView(move: Move, playerId: PlayerColor): MoveView {
    return move
  }
}

function setupPlayers(players: BrigandsPlayerOptions[]): PlayerState[]{

  return players.map((options) => ({
    color:options.id, 
    role:options.id === PlayerColor.Prince 
    ? {victoryPoints:0,
      patrols:[DistrictName.Hand, DistrictName.Hand],
      gold:0,
      goldInTreasure:0} 
    : {gold:3,
      partner:[{position:DistrictName.Hand},{position:DistrictName.Hand},{position:DistrictName.Hand}],
      tokens:setupTokens()}

  }))

}

// function setupDeck(color:PlayerColor):Card[]{
//   return [{color,district:DistrictName.CityHall},{color,district:DistrictName.Harbor},{color,district:DistrictName.Jail},{color,district:DistrictName.Market},{color,district:DistrictName.Palace},{color,district:DistrictName.Tavern},{color,district:DistrictName.Treasure}]
// }

function setupTokens():Token[]{
  return [{action:TokenAction.Stealing, isOwned:false},{action:TokenAction.Stealing, isOwned:false},{action:TokenAction.Kicking, isOwned:false},{action:TokenAction.Kicking, isOwned:false},{action:TokenAction.Fleeing, isOwned:false},{action:TokenAction.Fleeing, isOwned:false}]
}

function setupCity():number[]{
  const districtArray = Array.from(DistrictArray.keys())
  const jail:number = districtArray.shift()!
  const result:number[] = shuffle(districtArray)
  result.unshift(jail)
  return result

}

function setupEventDeck():number[]{
  return shuffle(Array.from(EventArray.keys()))
}