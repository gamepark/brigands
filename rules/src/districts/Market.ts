import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Market extends DistrictRules {
  getAutomaticMove(): Move | void {
    const thief = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Market))
    if (!thief) {
      if (this.state.tutorial && this.state.eventDeck.length >= 4) {

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}
      }
    }

    const partnersOfOneColor = thief.partners.filter(part => part.district === DistrictName.Market)

    if (partnersOfOneColor.some(part => part.solvingDone === true)) {
      return {type: MoveType.TakeBackPartner, thief: thief.role, district: DistrictName.Market}
    } else {
      return {
        type: MoveType.GainGold, gold: partnersOfOneColor.length * (partnersOfOneColor.length + 1) + (this.isDistrictEvent() ? 5 : 0), thief: thief.role,
        district: DistrictName.Market
      }
    }
  }

  getThiefLegalMoves(): Move[] {

    // TO DO : Delete getThiefLegalMoves when we can control AutoMoves in Tutorial

    if (this.state.tutorial) {
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}]
    } else return []
  }

  isThiefActive(thief: ThiefState): boolean {

    // TO DO : Delete isThiefActive when we can control AutoMoves in Tutorial

    return this.state.tutorial && thief.role === PlayerRole.YellowThief
  }
}