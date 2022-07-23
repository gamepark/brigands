import {getTokensInBank} from '../Brigands'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import TakeToken, {takeTokenMove} from '../moves/TakeToken'
import {ThiefState} from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import TokenAction from '../types/TokenAction'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Harbor extends DistrictRules {
  isThiefActive(thief: ThiefState): boolean {
    return (thief.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2))) !== undefined) || (this.state.tutorial && thief.role === PlayerRole.YellowThief)
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {

    const harborMoves: TakeToken[] = []
    if (thief.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))) {
      const availableTokens: TokenAction[] = getTokensInBank(thief)
      for (let i = 0; i < availableTokens.length; i++) {
        harborMoves.push(takeTokenMove(thief.role))
      }
    }

    // TO DO : Delete getThiefLegalMoves when we can control AutoMoves in Tutorial

    if (this.state.tutorial && harborMoves.length === 0) {
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}]
    } else {
      return harborMoves
    }
  }

  getAutomaticMove(): Move | void {
    if (!this.getThieves().some(p => p.partners.some(part => part.district === DistrictName.Harbor))) {
      if (this.state.tutorial && this.state.eventDeck.length >= 4) {

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}
      }
    }
    const tokensToTake = this.isDistrictEvent() ? 3 : 2
    const thiefWithPartnerDone = this.getThieves().find(thief => {
      const partners = thief.partners.filter(part => part.district === DistrictName.Harbor)
      if (partners.length === 0) return false
      return partners.some(partner => partner.tokensTaken === tokensToTake) || getTokensInBank(thief).length === 0
    })
    if (thiefWithPartnerDone) {
      return {type: MoveType.TakeBackPartner, thief: thiefWithPartnerDone.role, district: DistrictName.Harbor}
    }
  }
}