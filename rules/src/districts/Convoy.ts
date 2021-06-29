import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import Partner from '../types/Partner'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Convoy extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partnersOnConvoy: Partner[] = []
    this.getThieves().forEach(p => p.partners.forEach(part => part.district === DistrictName.Convoy && partnersOnConvoy.push(part)))
    let countPartnersOnConvoy: number = partnersOnConvoy.length
    if (countPartnersOnConvoy === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else if (this.district.dice === undefined) {
      if (partnersOnConvoy.every(p => p.solvingDone === true)) {
        return {
          type: MoveType.TakeBackPartner,
          thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Convoy))!,
          district: DistrictName.Convoy
        }
      } else {
        if (partnersOnConvoy.length < (this.state.players.length < 5 ? 2 : 3)) {
          return {type: MoveType.ArrestPartners}
        } else {
          return {type: MoveType.ThrowDice, dice: rollDice(this.isDistrictEvent() ? 6 : 4), district: DistrictName.Convoy}
        }
      }
    } else if (partnersOnConvoy.every(p => p.solvingDone === true)) {
      return {
        type: MoveType.SpareGoldOnTreasure, gold: this.district.dice.reduce((acc, cv) => acc + cv) % countPartnersOnConvoy, district: DistrictName.Convoy
      }
    } else {
      return {
        type: MoveType.GainGold, gold: Math.floor(this.district.dice.reduce((acc, cv) => acc + cv) / countPartnersOnConvoy),
        player: this.getThieves().find(p => p.partners.filter(part => part.district === DistrictName.Convoy).some(part => part.solvingDone !== true))!,
        district: DistrictName.Convoy
      }
    }
  }
}