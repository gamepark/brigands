import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Palace extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.length === 0) {
      if (this.state.tutorial && this.state.eventDeck.length >= 4) {

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}
      }
    }
    if (partners.length > this.maxPartners()) {
      return {type: MoveType.ArrestPartners}
    }
    const thief = this.getThieves().find(thief => thief.partners.some(partner => partner.district === DistrictName.Palace))!
    const partner = thief.partners.find(part => part.district === DistrictName.Palace)!
    if (!partner.solvingDone) {
      return {type: MoveType.GainGold, gold: 5, thief: thief.role, district: DistrictName.Palace}
    } else {
      return {type: MoveType.TakeBackPartner, thief: thief.role, district: DistrictName.Palace}
    }
  }

  maxPartners() {
    if (this.isDistrictEvent()) return 4
    else if (this.state.players.length >= 4) return 2
    else return 1
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