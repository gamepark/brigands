import {Action, SecretInformation, SimultaneousGame, TimeLimit, Undo} from '@gamepark/rules-api'
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
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import {placeMeeple, placeMeepleMove} from './moves/PlaceMeeple'
import {placeToken, placeTokenMove} from './moves/PlaceToken'
import {playHeadStart} from './moves/PlayHeadStart'
import {resolveStealToken} from './moves/ResolveStealToken'
import {getRevealGoldsView, revealGolds} from './moves/RevealGolds'
import {getRevealPartnersDistrictView, revealPartnersDistricts} from './moves/RevealPartnersDistricts'
import {solvePartner} from './moves/SolvePartner'
import {spareGoldOnTreasure} from './moves/SpareGoldOnTreasure'
import {takeBackMeeple, takeBackMeepleMove} from './moves/TakeBackMeeple'
import {takeBackPartner} from './moves/TakeBackPartner'
import {takeToken, takeTokenMove} from './moves/TakeToken'
import {tellYouAreReady, tellYouAreReadyMove} from './moves/TellYouAreReady'
import {throwDice} from './moves/ThrowDice'
import NewDay from './phases/NewDay'
import Phase from './phases/Phase'
import {PhaseRules} from './phases/PhaseRules'
import Planning from './phases/Planning'
import Solving from './phases/Solving'
import PlayerState, {isPrinceState, isThief, isThiefState} from './PlayerState'
import PlayerView from './PlayerView'
import {getPartnersView} from './types/Partner'
import PlayerRole from './types/PlayerRole'

export default class Brigands extends SimultaneousGame<GameState, Move, PlayerRole>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerRole>,
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

  getPhaseRules(): PhaseRules | void {
    switch (this.state.phase) {
      case Phase.NewDay:
        return new NewDay(this.state)
      case Phase.Planning:
        return new Planning(this.state)
      case Phase.Solving:
        return new Solving(this.state)
    }
  }

  isTurnToPlay(playerId: PlayerRole): boolean {
    const player = this.state.players.find(player => player.role === playerId)!
    if (this.state.phase === Phase.Planning) {
      return !player.isReady
    }
    const phaseRules = this.getPhaseRules()
    if (!player || !phaseRules) return false
    return isThief(player) ? phaseRules.isThiefActive(player) : phaseRules.isPrinceActive(player)
  }

  getLegalMoves(role: PlayerRole): Move[] {
    const player = this.state.players.find(player => player.role === role)!
    if (this.state.phase === Phase.Planning) {
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
    }
    const phaseRules = this.getPhaseRules()!
    return isThief(player) ? phaseRules.getThiefLegalMoves(player) : phaseRules.getPrinceLegalMoves(player)
  }

  getAutomaticMoves(): Move[] {
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
          const moves: Move[] = []
          for (const player of this.state.players) {
            for (let meeple = 0; meeple < player.meeples.length; meeple++){
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
        return getDistrictRules(this.state, district).getAutomaticMoves()
      default:
        return []
    }
  }

  play(move: Move): void {
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
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistricts(this.state)
      case MoveType.ThrowDice:
        return throwDice(this.state, move)
      case MoveType.TakeBackPartner:
        return takeBackPartner(this.state, move)
      case MoveType.SpareGoldOnTreasure:
        return spareGoldOnTreasure(this.state, move)
      case MoveType.SolvePartner:
        return solvePartner(this.state, move)
      case MoveType.GainGold:
        return gainGold(this.state, move)
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
          const {gold, partners, ...thiefView} = player
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

  getMoveView(move: Move, _playerId?: PlayerRole): MoveView {
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

  canUndo(action: Action<Move, PlayerRole>, consecutiveActions: Action<Move, PlayerRole>[]): boolean {
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

  getPlayerMoveView(move: Move, playerId: PlayerRole): MoveView {
    return this.getMoveView(move, playerId)
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

function getDistrictRules(state: GameState, districtName: DistrictName) {
  const district = state.city.find(district => district.name === districtName)!
  switch (districtName) {
    case DistrictName.Jail:
      return new Jail(state, district)
    case DistrictName.Tavern:
      return new Tavern(state, district)
    case DistrictName.Convoy:
      return new Convoy(state, district)
    case DistrictName.Market:
      return new Market(state, district)
    case DistrictName.Palace:
      return new Palace(state, district)
    case DistrictName.CityHall:
      return new CityHall(state, district)
    case DistrictName.Harbor:
      return new Harbor(state, district)
    case DistrictName.Treasure:
      return new Treasure(state, district)
  }
}