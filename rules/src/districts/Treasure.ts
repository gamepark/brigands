import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import Partner from '../types/Partner'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Treasure extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partnersOnTreasure: Partner[] = []
    this.getThieves().forEach(p => p.partners.forEach(part => part.district === DistrictName.Treasure && partnersOnTreasure.push(part)))
    let countPartnersOnTreasure: number = partnersOnTreasure.length
    if (countPartnersOnTreasure === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else if (partnersOnTreasure.every(p => p.solvingDone === true)) {
      return {
        type: MoveType.TakeBackPartner,
        thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure))!,
        district: DistrictName.Treasure
      }
    } else {
      if (this.district.dice === undefined) {
        return {
          type: MoveType.GainGold, gold: Math.floor(this.district.gold! / countPartnersOnTreasure),
          player: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure))!,
          district: DistrictName.Treasure
        }
      } else {
        return {
          type: MoveType.GainGold, gold: this.district.dice[0],
          player: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure && part.solvingDone !== true))!,
          district: DistrictName.Treasure
        }
      }
    }
  }
}