import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Market extends DistrictRules {
  getAutomaticMove(): Move | void {
    const thief = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Market))
    if (!thief) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    }
    if (this.district.dice === undefined) {
      return {type: MoveType.ThrowDice, dice: rollDice(this.isDistrictEvent() ? 2 : 1), district: DistrictName.Market}
    }
    const partner = thief.partners.find(partner => partner.district === DistrictName.Market)!
    if (!partner.solvingDone) {
      return {type: MoveType.GainGold, gold: this.district.dice.reduce((acc, vc) => acc + vc), player: thief, district: DistrictName.Market}
    } else {
      return {type: MoveType.TakeBackPartner, thief: thief, district: DistrictName.Market}
    }
  }
}