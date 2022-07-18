import {rollDice} from '../material/Dice'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import Event from '../types/Event'
import {isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class CityHall extends DistrictRules {
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
    if (this.district.dice === undefined) {
      if (partners.every(partner => partner.solvingDone === true)) {
        return {
          type: MoveType.TakeBackPartner,
          thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.CityHall))!.role,
          district: DistrictName.CityHall
        }
      } else {
        const event: Event = EventArray[this.state.event]
        const additionalDice = this.isDistrictEvent() ? event.numberOfDice! : 0
        return {
          type: MoveType.ThrowDice, dice: rollDice(additionalDice),
          district: DistrictName.CityHall
        }
      }
    } else if (this.getThieves().filter(t => t.partners.some(part => isPartner(part) && part.district === DistrictName.CityHall)).length === 1) {
      return {
        type: MoveType.GainGold, district: DistrictName.CityHall,
        thief: this.getThieves().filter(t => t.partners.some(part => isPartner(part) && part.district === DistrictName.CityHall))[0].role,
        gold: (this.getThieves().length < 3 ? 7 : 10) + (this.district.dice.length !== 0 ? this.district.dice.reduce((acc, cv) => acc + cv) : 0),
        noShare: true
      }
    } else if (partners.every(p => p.solvingDone === true)) {
      return {
        type: MoveType.SpareGoldOnTreasure,
        gold: ((this.getThieves().length < 3 ? 7 : 10) + (this.district.dice.length !== 0 ? this.district.dice.reduce((acc, cv) => acc + cv) : 0)) % partners.length,
        district: DistrictName.CityHall
      }
    } else {
      return {
        type: MoveType.GainGold,
        gold: Math.floor(((this.getThieves().length < 3 ? 7 : 10) + (this.district.dice.length !== 0 ? this.district.dice.reduce((acc, cv) => acc + cv) : 0)) / partners.length),
        thief: this.getThieves().find(p => p.partners.filter(part => part.district === DistrictName.CityHall).some(part => part.solvingDone !== true))!.role,
        district: DistrictName.CityHall
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