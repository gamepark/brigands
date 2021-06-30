import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Treasure extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.length === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    }
    if (partners.every(partner => partner.solvingDone === true)) {
      return {
        type: MoveType.TakeBackPartner,
        thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure))!.role,
        district: DistrictName.Treasure
      }
    } else {
      if (this.district.dice === undefined) {
        return {
          type: MoveType.GainGold, gold: Math.floor(this.district.gold! / partners.length),
          thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure))!.role,
          district: DistrictName.Treasure
        }
      } else {
        return {
          type: MoveType.GainGold, gold: this.district.dice[0],
          thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure && part.solvingDone !== true))!.role,
          district: DistrictName.Treasure
        }
      }
    }
  }
}