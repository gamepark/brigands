import {Action, SecretInformation, SimultaneousGame, Undo} from '@gamepark/rules-api'
import {shuffle} from 'lodash'
import {BrigandsOptions, BrigandsPlayerOptions, isGameOptions} from './BrigandsOptions'
import canUndo from './canUndo'
import District from './districts/District'
import DistrictName, {districtNames} from './districts/DistrictName'
import GameState from './GameState'
import GameView from './GameView'
import {EventArray} from './material/Events'
import {arrestPartners} from './moves/ArrestPartners'
import {betGold} from './moves/BetGold'
import {drawEvent, getDrawEventView} from './moves/DrawEvent'
import {gainGold} from './moves/GainGold'
import {judgePrisoners} from './moves/JudgePrisoners'
import {kickOrNot} from './moves/KickOrNot'
import Move from './moves/Move'
import {moveOnDistrictResolved} from './moves/MoveOnDistrictResolved'
import {moveOnNextPhase} from './moves/MoveOnNextPhase'
import {movePartner} from './moves/MovePartner'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import {getPlacePartnerView, placePartner} from './moves/PlacePartner'
import {placePatrol} from './moves/PlacePatrol'
import {placeToken} from './moves/PlaceToken'
import {playHeadStart} from './moves/PlayHeadStart'
import {resolveStealToken} from './moves/ResolveStealToken'
import {getRevealGoldsView, revealGolds} from './moves/RevealGolds'
import {getRevealKickOrNotView, revealKickOrNot} from './moves/RevealKickOrNot'
import {getRevealPartnersDistrictView, revealPartnersDistricts} from './moves/RevealPartnersDistricts'
import {solvePartner} from './moves/SolvePartner'
import {spareGoldOnTreasure} from './moves/SpareGoldOnTreasure'
import {takeBackPartner} from './moves/TakeBackPartner'
import {takeToken} from './moves/TakeToken'
import {tellYouAreReady} from './moves/TellYouAreReady'
import {throwDice} from './moves/ThrowDice'
import NewDay from './phases/NewDay'
import Patrolling from './phases/Patrolling'
import Phase from './phases/Phase'
import {PhaseRules} from './phases/PhaseRules'
import Planning from './phases/Planning'
import Solving from './phases/Solving'
import PlayerState, {isPrinceState, isThief, isThiefState, PrinceState, ThiefState} from './PlayerState'
import {getPartnersView} from './types/Partner'
import PlayerRole from './types/PlayerRole'
import {ThiefView} from './types/Thief'
import TokenAction from './types/TokenAction'

export default class Brigands extends SimultaneousGame<GameState, Move, PlayerRole>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerRole>, Undo<GameState, Move, PlayerRole> {

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
        districtResolved: undefined
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

  getPhaseRules(): PhaseRules {
    switch (this.state.phase) {
      case Phase.NewDay:
        return new NewDay(this.state)
      case Phase.Planning:
        return new Planning(this.state)
      case Phase.Patrolling:
        return new Patrolling(this.state)
      case Phase.Solving:
        return new Solving(this.state)
      default:
        throw new Error('Game is over')
    }
  }

  isActive(playerId: PlayerRole): boolean {
    const player = this.state.players.find(p => p.role === playerId)
    if (!player) return false
    return isThief(player) ? this.getPhaseRules().isThiefActive(player) : this.getPhaseRules().isPrinceActive(player)
  }

  getLegalMoves(role: PlayerRole): Move[] {
    const player = this.state.players.find(p => p.role === role)
    if (player === undefined) return []
    return isThief(player) ? this.getPhaseRules().getThiefLegalMoves(player) : this.getPhaseRules().getPrinceLegalMoves(player)
  }

  play(move: Move): void {
    switch (move.type) {
      case MoveType.DrawEvent:
        return drawEvent(this.state)
      case MoveType.PlacePartner:
        return placePartner(this.state, move)
      case MoveType.PlaceToken:
        return placeToken(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.MoveOnNextPhase:
        return moveOnNextPhase(this.state)
      case MoveType.PlacePatrol:
        return placePatrol(this.state, move)
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistricts(this.state)
      case MoveType.ThrowDice:
        return throwDice(this.state, move)
      case MoveType.TakeToken:
        return takeToken(this.state, move)
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
      case MoveType.KickOrNot :
        return kickOrNot(this.state, move)
      case MoveType.RevealKickOrNot :
        return revealKickOrNot(this.state)
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

  getAutomaticMove(): Move | void {
    if (this.isOver()) return
    if ((princeWin(this.state) || lastTurnIsOver(this.state))) return {type: MoveType.RevealGolds}
    return this.getPhaseRules().getAutomaticMove()
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

  getMoveView(move: Move, playerId?: PlayerRole): MoveView {
    switch (move.type) {
      case MoveType.DrawEvent:
        return getDrawEventView(this.state)

      case MoveType.PlacePartner :
        if (playerId === move.playerId) {
          return move
        } else {
          return getPlacePartnerView(this.getThieves().find(p => p.role === move.playerId)!, move)
        }

      case MoveType.RevealPartnersDistricts:
        return getRevealPartnersDistrictView(this.getThieves())

      case MoveType.KickOrNot:
        if (playerId === move.kickerRole) {
          return move
        } else {
          return {type: MoveType.KickOrNot, kickerRole: move.kickerRole}
        }

      case MoveType.RevealKickOrNot:
        return getRevealKickOrNotView(this.getThieves())

      case MoveType.RevealGolds:
        return getRevealGoldsView(this.getThieves())

      default:
        return move
    }
  }

  canUndo(action: Action<Move, PlayerRole>, consecutiveActions: Action<Move, PlayerRole>[]): boolean {
    return canUndo(action, consecutiveActions)
  }

  getPlayerMoveView(move: Move, playerId: PlayerRole): MoveView {
    return this.getMoveView(move, playerId)
  }

  getThieves() {
    return this.state.players.filter(isThiefState)
  }
}

function princeWin(state: GameState): boolean {
  const prince: PrinceState = state.players.find(isPrinceState)!
  const numberOfPlayers: number = state.players.length
  return prince.victoryPoints >= numberOfPlayers * 10
}

function lastTurnIsOver(state: GameState): boolean {
  return state.phase === Phase.NewDay && state.eventDeck.length === 0

}

function setupPlayers(players: BrigandsPlayerOptions[]): PlayerState[] {

  if (players.every(p => p.id !== PlayerRole.Prince)) {
    throw 'ERROR : No Prince in the composition !'       // Renvoyer une erreur
  } else {
    return players.map((options) => (

      options.id === PlayerRole.Prince
        ? {
          role: options.id,
          gold: 0,
          isReady: false,
          victoryPoints: 0,
          patrols: [-1, -1, -1],
          abilities: [false, false, false]
        }
        : {
          role: options.id,
          gold: 3,
          isReady: false,
          partners: [{}, {}, {}],
          tokens: {steal: [], kick: [], move: []}
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

export function getTokensInBank(thief: ThiefState | ThiefView): TokenAction[] {
  const result: TokenAction[] = []
  for (let i = 0; i < 2 - thief.tokens.steal.length; i++) {
    result.push(TokenAction.Stealing)
  }
  for (let i = 0; i < 2 - thief.tokens.kick.length; i++) {
    result.push(TokenAction.Kicking)
  }
  for (let i = 0; i < 2 - thief.tokens.move.length; i++) {
    result.push(TokenAction.Fleeing)
  }

  return result

}

export function isThisPartnerHasAnyToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.steal.some(t => t === partnerNumber) || thief.tokens.kick.some(t => t === partnerNumber) || thief.tokens.move.some(t => t === partnerNumber)
}

export function isThisPartnerHasStealToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.steal.some(t => t === partnerNumber)
}

export function isThisPartnerHasKickToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.kick.some(t => t === partnerNumber)
}

export function isThisPartnerHasMoveToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.move.some(t => t === partnerNumber)
}