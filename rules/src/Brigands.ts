import {Action, RandomMove, SecretInformation, SimultaneousGame, TimeLimit, Undo} from '@gamepark/rules-api'
import {shuffle} from 'lodash'
import {actionTypes} from './ActionType'
import {BrigandsOptions, BrigandsPlayerOptions, isGameOptions} from './BrigandsOptions'
import canUndo from './canUndo'
import CityHall from './districts/CityHall'
import Convoy from './districts/Convoy'
import District from './districts/District'
import DistrictName, {districtNames} from './districts/DistrictName'
import Harbor from './districts/Harbor'
import Jail from './districts/Jail'
import Market from './districts/Market'
import Palace from './districts/Palace'
import Tavern from './districts/Tavern'
import Treasure from './districts/Treasure'
import GameState from './GameState'
import GameView from './GameView'
import {EventArray} from './material/Events'
import {arrestPartners} from './moves/ArrestPartners'
import {betGold} from './moves/BetGold'
import {drawEvent, drawEventMove, getDrawEventView} from './moves/DrawEvent'
import {gainGold} from './moves/GainGold'
import {judgePrisoners} from './moves/JudgePrisoners'
import Move from './moves/Move'
import {moveOnDistrictResolved} from './moves/MoveOnDistrictResolved'
import {moveOnNextPhase, moveOnNextPhaseMove} from './moves/MoveOnNextPhase'
import {movePartner} from './moves/MovePartner'
import MoveRandomized from './moves/MoveRandomized'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import {placeMeeple, placeMeepleMove} from './moves/PlaceMeeple'
import {placeToken, placeTokenMove} from './moves/PlaceToken'
import {playHeadStart} from './moves/PlayHeadStart'
import {randomizeThrowDices, throwDices} from './moves/PlayThrowDicesResult'
import {resolveStealToken} from './moves/ResolveStealToken'
import {getRevealGoldsView, revealGolds} from './moves/RevealGolds'
import {getRevealPartnersDistrictView, revealPartnersDistricts} from './moves/RevealPartnersDistricts'
import {solvePartner} from './moves/SolvePartner'
import {spareGoldOnTreasure} from './moves/SpareGoldOnTreasure'
import {spendGold} from './moves/SpendGold'
import {spendTokens} from './moves/SpendTokens'
import {takeBackMeeple, takeBackMeepleMove} from './moves/TakeBackMeeple'
import {takeBackPartner} from './moves/TakeBackPartner'
import {takeToken, takeTokenMove} from './moves/TakeToken'
import {tellYouAreReady, tellYouAreReadyMove} from './moves/TellYouAreReady'
import Phase from './phases/Phase'
import PlayerState, {isPrinceState, isThiefState} from './PlayerState'
import PlayerView from './PlayerView'
import {getPartnersView} from './types/Partner'
import PlayerRole from './types/PlayerRole'

export default class Brigands extends SimultaneousGame<GameState, Move, PlayerRole>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerRole>,
    RandomMove<GameState, Move, MoveRandomized>,
    Undo<GameState, Move, PlayerRole>,
    TimeLimit<GameState, Move, PlayerRole> {

  constructor(state: GameState)
  constructor(options: BrigandsOptions)
  constructor(arg: GameState | BrigandsOptions) {
    if (isGameOptions(arg)) {
      const game: GameState = {
        players: setupPlayers(arg.players),
        city: setupCity(),
        phase: Phase.NewDay,
        eventDeck: setupEventDeck(),
        event: -1,
        nextMoves: [],
        currentDistrict: undefined,
        tutorial: false
      }
      game.city.find(d => d.name === DistrictName.Treasure)!.gold = 0
      super(game)
    } else {
      super(arg)
    }
  }

  isOver(): boolean {
    return this.state.phase === undefined
  }

  isTurnToPlay(playerId: PlayerRole): boolean {
    const player = this.state.players.find(player => player.role === playerId)!
    switch (this.state.phase) {
      case Phase.Planning:
        return !player.isReady
      case Phase.Solving:
        const district = getCurrentDistrict(this.state)
        if (!player.action && player.tokens.includes(district)) {
          return true
        }
        return getDistrictRules(this.state, district).isTurnToPlay(player)
      default:
        return false
    }
  }

  getLegalMoves(role: PlayerRole): Move[] {
    const player = this.state.players.find(player => player.role === role)!
    switch (this.state.phase) {
      case Phase.Planning:
        if (player.isReady) return []
        const moves: Move[] = []
        if (player.meeples.includes(null)) {
          for (let meeple = 0; meeple < player.meeples.length; meeple++) {
            if (!player.meeples[meeple]) {
              for (const district of districtNames) {
                if (canPlaceMeeple(player, district)) {
                  moves.push(placeMeepleMove(role, district, meeple))
                }
              }
            }
          }
        } else {
          moves.push(tellYouAreReadyMove(role))
        }
        const teamsDistrictsWithoutToken = getDistrictsCanPlaceToken(player)
        if (teamsDistrictsWithoutToken.length > 0) {
          for (let token = 0; token < player.tokens.length; token++) {
            if (player.tokens[token] === null) {
              for (const district of teamsDistrictsWithoutToken) {
                moves.push(placeTokenMove(role, token, district))
              }
            }
          }
        }
        return moves
      case Phase.Solving:
        const district = getCurrentDistrict(this.state)
        if (!player.meeples.includes(district)) {
          return []
        }
        if (!player.action && player.tokens.includes(district)) {
          return [] // TODO: choose action moves
        }
        return getDistrictRules(this.state, district).getLegalMoves(player)
      default:
        return []
    }
  }

  getAutomaticMoves(): Move[] {
    if (this.state.nextMoves.length > 0) {
      return [this.state.nextMoves[0]]
    }
    switch (this.state.phase) {
      case Phase.NewDay:
        return [...this.state.players.filter(p => p.tokens.length < MAX_ACTIONS).map(p => takeTokenMove(p.role)), drawEventMove, moveOnNextPhaseMove]
      case Phase.Planning:
        return this.state.players.every(player => player.isReady) ? [moveOnNextPhaseMove] : []
      case Phase.Solving:
        const district = getCurrentDistrict(this.state)
        if (this.state.players.some(player => player.tokens.includes(district) && !player.action)) {
          return []
        }
        for (const actionType of actionTypes) {
          const players = this.state.players.filter(player => player.action?.type === actionType)
          if (players.length > 0) {
            // TODO: resolve action
          }
        }
        if (patrolInDistrict(this.state, district)) {
          return arrestEveryone(this.state, district)
        }
        return getDistrictRules(this.state, district).getAutomaticMoves()
      default:
        return []
    }
  }

  randomize(move: Move): Move & MoveRandomized {
    if (move.type === MoveType.ThrowDices) {
      return randomizeThrowDices(move)
    }
    return move
  }

  play(move: MoveRandomized): void {
    if (this.state.nextMoves.length && this.state.nextMoves[0].type === move.type) {
      this.state.nextMoves.pop()
    }
    switch (move.type) {
      case MoveType.TakeToken:
        return takeToken(this.state, move)
      case MoveType.DrawEvent:
        return drawEvent(this.state)
      case MoveType.MoveOnNextPhase:
        return moveOnNextPhase(this.state)
      case MoveType.PlaceMeeple:
        return placeMeeple(this.state, move)
      case MoveType.PlaceToken:
        return placeToken(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.TakeBackMeeple:
        return takeBackMeeple(this.state, move)
      case MoveType.GainGold:
        return gainGold(this.state, move)
      case MoveType.SpendTokens:
        return spendTokens(this.state, move)
      case MoveType.SpendGold:
        return spendGold(this.state, move)
      case MoveType.ThrowDices:
        return throwDices(this.state, move)
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistricts(this.state)
      case MoveType.TakeBackPartner:
        return takeBackPartner(this.state, move)
      case MoveType.SpareGoldOnTreasure:
        return spareGoldOnTreasure(this.state, move)
      case MoveType.SolvePartner:
        return solvePartner(this.state, move)
      case MoveType.BetGold:
        return betGold(this.state, move)
      case MoveType.MoveOnDistrictResolved:
        return moveOnDistrictResolved(this.state, move)
      case MoveType.ArrestPartners:
        return arrestPartners(this.state)
      case MoveType.ResolveStealToken:
        return resolveStealToken(this.state, move)
      case MoveType.MovePartner :
        return movePartner(this.state, move)
      case MoveType.JudgePrisoners :
        return judgePrisoners(this.state)
      case MoveType.PlayHeadStart :
        return playHeadStart(this.state, move)
      case MoveType.RevealGolds :
        return revealGolds(this.state)
    }
  }

  getView(playerId?: PlayerRole): GameView {
    return {
      ...this.state,
      eventDeck: this.state.eventDeck.length,
      players: this.state.players.map(player => {
        if (this.state.phase === undefined || isPrinceState(player) || player.role === playerId) {
          return player
        } else {
          const {partners, ...thiefView} = player
          return {
            ...thiefView,
            partners: this.state.phase === Phase.Solving ? partners : getPartnersView(partners)
          }
        }
      })
    }
  }


  getPlayerView(playerId: PlayerRole): GameView {
    return this.getView(playerId)
  }

  getMoveView(move: MoveRandomized, _playerId?: PlayerRole): MoveView {
    switch (move.type) {
      case MoveType.DrawEvent:
        return getDrawEventView(this.state)

      case MoveType.RevealPartnersDistricts:
        return getRevealPartnersDistrictView(this.getThieves())

      case MoveType.RevealGolds:
        return getRevealGoldsView(this.getThieves())

      default:
        return move
    }
  }

  getPlayerMoveView(move: MoveRandomized, playerId: PlayerRole): MoveView {
    return this.getMoveView(move, playerId)
  }

  canUndo(action: Action<MoveRandomized, PlayerRole>, consecutiveActions: Action<MoveRandomized, PlayerRole>[]): boolean {
    return canUndo(action, consecutiveActions)
  }

  giveTime(): number {
    switch (this.state.phase) {
      case Phase.Planning:
        return 120
      case Phase.Solving:
        return 30
      default:
        return 0
    }
  }

  getThieves() {
    return this.state.players.filter(isThiefState)
  }
}

export function setupPlayers(players: BrigandsPlayerOptions[]): PlayerState[] {

  if (players.every(p => p.id !== PlayerRole.Prince)) {
    throw 'ERROR : No Prince in the composition !'       // Renvoyer une erreur
  } else {
    return players.map((options) => (

      options.id === PlayerRole.Prince
        ? {
          role: options.id,
          meeples: [null, null, null],
          tokens: [],
          gold: 0,
          isReady: false,
          victoryPoints: 0,
          patrols: [-1, -1, -1],
          abilities: [false, false, false]
        }
        : {
          role: options.id,
          meeples: [null, null, null],
          tokens: [],
          gold: 0,
          isReady: false,
          partners: [{}, {}, {}]
        }

    ))
  }

}


function setupCity(): District[] {
  const districts = shuffle(districtNames.filter(district => district !== DistrictName.Jail))
  districts.push(DistrictName.Jail)
  return districts.map(district => ({name: district, gold: district === DistrictName.Treasure ? 0 : undefined}))

}

function setupEventDeck(): number[] {
  const result = shuffle(Array.from(EventArray.keys()))
  return result.slice(0, 6)
}

export function canPlaceMeeple(player: PlayerState | PlayerView, district: DistrictName) {
  return player.role === PlayerRole.Prince || district !== DistrictName.Jail // TODO: remove cards taken by Prince spy
}

export const MAX_ACTIONS = 6

export function getDistrictsCanPlaceToken(player: PlayerState | PlayerView) {
  return districtNames.filter(d => player.meeples.includes(d) && canPlaceMeeple(player, d) && !player.tokens.includes(d))
}

export function getCurrentDistrict(state: GameState | GameView) {
  return state.city.find(district => state.players.some(player => player.meeples.includes(district.name)))?.name ?? DistrictName.Jail
}

export function patrolInDistrict(state: GameState | GameView, district: DistrictName) {
  const player = state.players.find(player => player.role === PlayerRole.Prince)
  if (!player) {
    // TODO: Patrols in 2 player game
    return false
  }
  return player.meeples.includes(district)
}

export function getDistrictRules(state: GameState | GameView, district: DistrictName = getCurrentDistrict(state)) {
  switch (district) {
    case DistrictName.Jail:
      return new Jail(state)
    case DistrictName.Tavern:
      return new Tavern(state)
    case DistrictName.Convoy:
      return new Convoy(state)
    case DistrictName.Market:
      return new Market(state)
    case DistrictName.Palace:
      return new Palace(state)
    case DistrictName.CityHall:
      return new CityHall(state)
    case DistrictName.Harbor:
      return new Harbor(state)
    case DistrictName.Treasure:
      return new Treasure(state)
  }
}

export function arrestEveryone(state: GameState | GameView, district: DistrictName) {
  const moves: Move[] = []
  for (const player of state.players) {
    for (let meeple = 0; meeple < player.meeples.length; meeple++) {
      const meepleLocation = player.meeples[meeple]
      if (meepleLocation === district) {
        if (player.role !== PlayerRole.Prince && meeple < 3) {
          moves.unshift(placeMeepleMove(player.role, DistrictName.Jail, meeple))
        } else {
          moves.push(takeBackMeepleMove(player.role, meeple))
        }
      }
    }
  }
  return moves
}