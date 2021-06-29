import {rollDice} from '../material/Dice'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import Event from '../types/Event'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class CityHall extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.length === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    }
    if (this.district.dice === undefined) {
      if (partners.every(partner => partner.solvingDone === true)) {
        return {
          type: MoveType.TakeBackPartner,
          thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.CityHall))!,
          district: DistrictName.CityHall
        }
      } else {
        const event: Event = EventArray[this.state.event]
        const additionalDice = this.isDistrictEvent() ? event.numberOfDice! : 0
        return {
          type: MoveType.ThrowDice, dice: rollDice(2 + additionalDice),
          district: DistrictName.CityHall
        }
      }
    } else if (partners.every(p => p.solvingDone === true)) {
      return {
        type: MoveType.SpareGoldOnTreasure, gold: this.district.dice.reduce((acc, cv) => acc + cv) % partners.length,
        district: DistrictName.CityHall
      }
    } else {
      return {
        type: MoveType.GainGold, gold: Math.floor(this.district.dice.reduce((acc, cv) => acc + cv) / partners.length),
        player: this.getThieves().find(p => p.partners.filter(part => part.district === DistrictName.CityHall).some(part => part.solvingDone !== true))!,
        district: DistrictName.CityHall
      }
    }
  }
}