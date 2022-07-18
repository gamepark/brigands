import {Action} from '@gamepark/rules-api'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlayerRole from './types/PlayerRole'

export default function canUndo(action: Action<Move | MoveView, PlayerRole>, consecutiveActions: Action<Move | MoveView, PlayerRole>[]): boolean {

  switch (action.move.type) {
    case MoveType.PlacePartner:
    case MoveType.PlaceToken: {
      return !consecutiveActions.some(consecAction => consecAction.playerId === action.playerId && consecAction.move.type === MoveType.TellYouAreReady)
    }
    case MoveType.TellYouAreReady: {
      if (action.playerId === PlayerRole.Prince) {
        return false
      } else {
        return !action.consequences.some(consequence => consequence.type === MoveType.MoveOnNextPhase)
          && !consecutiveActions.some(consecutiveAction => consecutiveAction.consequences.some(consequence => consequence.type === MoveType.MoveOnNextPhase))
      }
    }
    case MoveType.PlacePatrol:
    case MoveType.JudgePrisoners:
    case MoveType.PlayHeadStart:
      return !consecutiveActions.some(consecutiveAction => consecutiveAction.move.type === MoveType.TellYouAreReady)
    case MoveType.TakeToken:
      return !action.consequences.some(consequence => consequence.type === MoveType.MoveOnDistrictResolved)
        && !consecutiveActions.some(consecutiveAction => consecutiveAction.consequences.some(consequence => consequence.type === MoveType.MoveOnDistrictResolved))
    case MoveType.KickOrNot:
      return !action.consequences.some(consequence => consequence.type === MoveType.RevealKickOrNot)
        && !consecutiveActions.some(consecutiveAction => consecutiveAction.consequences.some(consequence => consequence.type === MoveType.RevealKickOrNot))
    default:
      return false
  }

}

