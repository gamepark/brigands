import {rollDice} from '../material/Dice'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import Event from '../types/Event'
import Partner from '../types/Partner'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class CityHall extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partnersOnCityHall: Partner[] = []
    this.getThieves().forEach(p => p.partners.forEach(part => part.district === DistrictName.CityHall && partnersOnCityHall.push(part)))
    let countPartnersOnCityHall: number = partnersOnCityHall.length
    if (countPartnersOnCityHall === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else if (this.district.dice === undefined) {
      if (partnersOnCityHall.every(p => p.solvingDone === true)) {
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
    } else if (partnersOnCityHall.every(p => p.solvingDone === true)) {
      return {
        type: MoveType.SpareGoldOnTreasure, gold: this.district.dice.reduce((acc, cv) => acc + cv) % countPartnersOnCityHall,
        district: DistrictName.CityHall
      }
    } else {
      return {
        type: MoveType.GainGold, gold: Math.floor(this.district.dice.reduce((acc, cv) => acc + cv) / countPartnersOnCityHall),
        player: this.getThieves().find(p => p.partners.filter(part => part.district === DistrictName.CityHall).some(part => part.solvingDone !== true))!,
        district: DistrictName.CityHall
      }
    }
  }
}