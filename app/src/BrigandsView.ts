import canUndo from '@gamepark/brigands/canUndo'
import GameView from '@gamepark/brigands/GameView'
import {arrestPartners} from '@gamepark/brigands/moves/ArrestPartners'
import {betGold} from '@gamepark/brigands/moves/BetGold'
import {drawEventInView} from '@gamepark/brigands/moves/DrawEvent'
import {gainGold} from '@gamepark/brigands/moves/GainGold'
import {judgePrisoners} from '@gamepark/brigands/moves/JudgePrisoners'
import {kickOrNotInView} from '@gamepark/brigands/moves/KickOrNot'
import {moveOnDistrictResolved} from '@gamepark/brigands/moves/MoveOnDistrictResolved'
import {moveOnNextPhase} from '@gamepark/brigands/moves/MoveOnNextPhase'
import {movePartner} from '@gamepark/brigands/moves/MovePartner'
import MoveType from '@gamepark/brigands/moves/MoveType'
import MoveView from '@gamepark/brigands/moves/MoveView'
import {placePartnerInView} from '@gamepark/brigands/moves/PlacePartner'
import {placePatrol} from '@gamepark/brigands/moves/PlacePatrol'
import {placeToken} from '@gamepark/brigands/moves/PlaceToken'
import {playHeadStart} from '@gamepark/brigands/moves/PlayHeadStart'
import {resolveStealToken} from '@gamepark/brigands/moves/ResolveStealToken'
import {revealGoldsInView} from '@gamepark/brigands/moves/RevealGolds'
import {revealKickOrNotView} from '@gamepark/brigands/moves/RevealKickOrNot'
import {revealPartnersDistrictsInView} from '@gamepark/brigands/moves/RevealPartnersDistricts'
import {solvePartner} from '@gamepark/brigands/moves/SolvePartner'
import {spareGoldOnTreasure} from '@gamepark/brigands/moves/SpareGoldOnTreasure'
import {takeBackPartner} from '@gamepark/brigands/moves/TakeBackPartner'
import {takeToken} from '@gamepark/brigands/moves/TakeToken'
import {tellYouAreReady} from '@gamepark/brigands/moves/TellYouAreReady'
import {throwDice} from '@gamepark/brigands/moves/ThrowDice'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Action, Game, Undo} from '@gamepark/rules-api'
import SetSelectedPartner, { resetSelectedPartner, ResetSelectedPartner, setSelectedPartner } from './localMoves/SetSelectedPartner'
import SetSelectedTokensInBank, { resetSelectedTokensInBank, ResetSelectedTokensInBank, setSelectedTokensInBank } from './localMoves/SetSelectedTokensInBank'

type LocalMove = MoveView | SetSelectedPartner | ResetSelectedPartner | SetSelectedTokensInBank | ResetSelectedTokensInBank

export default class BrigandsView implements Game<GameView, MoveView>, Undo<GameView, MoveView, PlayerRole> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  /**
   * In this method, inside the view, we must return any move that the frontend can fully anticipate.
   * The reason why it should be anticipated instead of waiting for the backend to provide with all the automatic consequences is latency.
   * If the backend takes time to reply, maybe we will have the reply while we are animating the first consequences. The player won't notice the latency!
   *
   * @return A MoveView which can be completely anticipated by the player or the spectator
   */
  getAutomaticMove(): void | MoveView {
    return
  }

  /**
   * This is where a move is reproduced on the browser of a player. Most move will be treated the exact same way on both server and client side,
   * however some moves, that involved hiding information or discovering hidden information, will receive a different treatment than in the main rules class.
   *
   * @param move The move that must be applied in the browser of the player or the spectator
   */
  play(move: LocalMove): void {
    switch (move.type) {
      case MoveType.DrawEvent:
        return drawEventInView(this.state, move)
      case MoveType.PlacePartner:
        return placePartnerInView(this.state,move)
      case MoveType.PlaceToken:
        return placeToken(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state,move)
      case MoveType.MoveOnNextPhase:
        return moveOnNextPhase(this.state)
      case MoveType.PlacePatrol:
        return placePatrol(this.state, move)
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistrictsInView(this.state, move)
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
      case MoveType.KickOrNot:
        return kickOrNotInView(this.state, move)
      case MoveType.RevealKickOrNot:
        return revealKickOrNotView(this.state, move)
      case MoveType.MovePartner:
        return movePartner(this.state, move)
      case MoveType.JudgePrisoners:
        return judgePrisoners(this.state)
      case MoveType.PlayHeadStart :
        return playHeadStart(this.state, move)
      case MoveType.RevealGolds:
        return revealGoldsInView(this.state, move)
      case 'SetSelectedPartner':
        return setSelectedPartner(this.state, move)
      case 'ResetSelectedPartner':
        return resetSelectedPartner(this.state)
      case 'SetSelectedTokensInBank':
        return setSelectedTokensInBank(this.state, move)
      case 'ResetSelectedTokensInBank':
        return resetSelectedTokensInBank(this.state)
      
    }
  }

  canUndo(action: Action<MoveView, PlayerRole>, consecutiveActions: Action<MoveView, PlayerRole>[]): boolean {
    return canUndo(action, consecutiveActions)
  }

}