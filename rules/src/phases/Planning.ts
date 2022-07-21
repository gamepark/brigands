import {isThisPartnerHasAnyToken} from '../Brigands'
import DistrictName from '../districts/DistrictName'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import PlaceMeeple, {placeMeepleMove} from '../moves/PlaceMeeple'
import PlaceToken from '../moves/PlaceToken'
import TellYouAreReady from '../moves/TellYouAreReady'
import {ThiefState} from '../PlayerState'
import TokenAction from '../types/TokenAction'
import {PhaseRules} from './PhaseRules'

export default class Planning extends PhaseRules {
  isThiefActive(thief: ThiefState): boolean {
    return !thief.isReady
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    if (thief.isReady) {
      return []
    }
    const planningMoves: (PlaceMeeple | PlaceToken | TellYouAreReady)[] = []
    if (thief.partners.every(part => part.district !== undefined)) {
      planningMoves.push({type: MoveType.TellYouAreReady, playerId: thief.role})
    }
    thief.partners.forEach((part, index) => {
      if (part.district === undefined) {
        for (let i = 2; i < 9; i++) {
          planningMoves.push(placeMeepleMove(thief.role, i, index))
        }
      } else if (!isThisPartnerHasAnyToken(thief, index) && part.district !== DistrictName.Jail) {
        const playableTokens: TokenAction[] = getTokensInHand(thief)
        for (let j = 0; j < playableTokens.length; j++) {
          planningMoves.push({type: MoveType.PlaceToken, partnerNumber: index, role: thief.role, tokenAction: playableTokens[j]})
        }
      }
    })
    return planningMoves
  }

  getAutomaticMove(): Move | void {
    if (this.getThieves().every(p => p.isReady)) {
      return {type: MoveType.MoveOnNextPhase}
    }
  }
}

function getTokensInHand(thief: ThiefState): TokenAction[] {
  const result: TokenAction[] = []
  for (let i = 0; i < thief.tokens.steal.length; i++) {
    thief.tokens.steal[i] === -1 && result.push(TokenAction.Stealing)
  }
  for (let i = 0; i < thief.tokens.kick.length; i++) {
    thief.tokens.kick[i] === -1 && result.push(TokenAction.Kicking)
  }
  for (let i = 0; i < thief.tokens.move.length; i++) {
    thief.tokens.move[i] === -1 && result.push(TokenAction.Fleeing)
  }
  return result
}