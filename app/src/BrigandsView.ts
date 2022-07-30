import canUndo from '@gamepark/brigands/canUndo'
import GameView from '@gamepark/brigands/GameView'
import {arrestPartners} from '@gamepark/brigands/moves/ArrestPartners'
import {betGold} from '@gamepark/brigands/moves/BetGold'
import {drawDayCardInView} from '@gamepark/brigands/moves/DrawDayCard'
import {gainGold} from '@gamepark/brigands/moves/GainGold'
import {judgePrisoners} from '@gamepark/brigands/moves/JudgePrisoners'
import {moveOnDistrictResolved} from '@gamepark/brigands/moves/MoveOnDistrictResolved'
import {moveOnNextPhase} from '@gamepark/brigands/moves/MoveOnNextPhase'
import {movePartner} from '@gamepark/brigands/moves/MovePartner'
import MoveType from '@gamepark/brigands/moves/MoveType'
import MoveView from '@gamepark/brigands/moves/MoveView'
import {placeMeeple} from '@gamepark/brigands/moves/PlaceMeeple'
import {placeToken} from '@gamepark/brigands/moves/PlaceToken'
import {playHeadStart} from '@gamepark/brigands/moves/PlayHeadStart'
import {resolveStealToken} from '@gamepark/brigands/moves/ResolveStealToken'
import {revealGoldsInView} from '@gamepark/brigands/moves/RevealGolds'
import {revealPartnersDistrictsInView} from '@gamepark/brigands/moves/RevealPartnersDistricts'
import {solvePartner} from '@gamepark/brigands/moves/SolvePartner'
import {spareGoldOnTreasure} from '@gamepark/brigands/moves/SpareGoldOnTreasure'
import {spendGold} from '@gamepark/brigands/moves/SpendGold'
import {spendTokens} from '@gamepark/brigands/moves/SpendTokens'
import {takeBackMeeple} from '@gamepark/brigands/moves/TakeBackMeeple'
import {takeBackPartner} from '@gamepark/brigands/moves/TakeBackPartner'
import {takeToken} from '@gamepark/brigands/moves/TakeToken'
import {tellYouAreReady} from '@gamepark/brigands/moves/TellYouAreReady'
import {throwDices} from '@gamepark/brigands/moves/PlayThrowDicesResult'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Action, Game, Undo} from '@gamepark/rules-api'
import SetSelectedHeadStart, {resetSelectedHeadStart, ResetSelectedHeadStart, setSelectedHeadStart} from './localMoves/SetSelectedHeadStart'
import SetSelectedPartner, {resetSelectedPartner, ResetSelectedPartner, setSelectedPartner} from './localMoves/SetSelectedPartner'
import SetSelectedPatrol, {resetSelectedPatrol, ResetSelectedPatrol, setSelectedPatrol} from './localMoves/SetSelectedPatrol'
import SetSelectedTokenInHand, {resetSelectedTokenInHand, ResetSelectedTokenInHand, setSelectedTokenInHand} from './localMoves/SetSelectedTokenInHand'
import SetSelectedTokensInBank, {resetSelectedTokensInBank, ResetSelectedTokensInBank, setSelectedTokensInBank} from './localMoves/SetSelectedTokensInBank'

type LocalMove = MoveView | SetSelectedPartner | ResetSelectedPartner | SetSelectedTokensInBank | ResetSelectedTokensInBank | SetSelectedTokenInHand
  | ResetSelectedTokenInHand
  | SetSelectedPatrol | ResetSelectedPatrol | SetSelectedHeadStart | ResetSelectedHeadStart

export default class BrigandsView implements Game<GameView, MoveView>, Undo<GameView, MoveView, PlayerRole> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  play(move: LocalMove): void {
    switch (move.type) {
      case MoveType.TakeToken:
        return takeToken(this.state, move)
      case MoveType.DrawDayCard:
        return drawDayCardInView(this.state, move)
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
        return revealPartnersDistrictsInView(this.state, move)
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
      case 'SetSelectedTokenInHand':
        return setSelectedTokenInHand(this.state, move)
      case 'ResetSelectedTokenInHand':
        return resetSelectedTokenInHand(this.state)
      case 'SetSelectedPatrol':
        return setSelectedPatrol(this.state, move)
      case 'ResetSelectedPatrol':
        return resetSelectedPatrol(this.state)
      case 'SetSelectedHeadStart':
        return setSelectedHeadStart(this.state)
      case 'ResetSelectedHeadStart':
        return resetSelectedHeadStart(this.state)
    }
  }

  canUndo(action: Action<MoveView, PlayerRole>, consecutiveActions: Action<MoveView, PlayerRole>[]): boolean {
    return canUndo(action, consecutiveActions)
  }

}