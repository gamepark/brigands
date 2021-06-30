import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Palace extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.length === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
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
    if (this.isDistrictEvent()) return 3
    else if (this.state.players.length >= 4) return 2
    else return 1
  }
}