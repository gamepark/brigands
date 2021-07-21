import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import { ThiefState } from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Convoy extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.length === 0) {
      if (this.state.tutorial === true && this.state.eventDeck.length >= 4){

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
      }
    }
    if (this.district.dice === undefined) {
      if (partners.every(p => p.solvingDone === true)) {
        return {
          type: MoveType.TakeBackPartner,
          thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Convoy))!.role,
          district: DistrictName.Convoy
        }
      } else {
        if (partners.length < (this.state.players.length < 5 ? 2 : 3)) {
          return {type: MoveType.ArrestPartners}
        } else {
          return {type: MoveType.ThrowDice, dice: rollDice(this.isDistrictEvent() ? 6 : 4), district: DistrictName.Convoy}
        }
      }
    } else if (partners.every(p => p.solvingDone === true)) {
      return {
        type: MoveType.SpareGoldOnTreasure, gold: this.district.dice.reduce((acc, cv) => acc + cv) % partners.length, district: DistrictName.Convoy
      }
    } else {
      return {
        type: MoveType.GainGold, gold: Math.floor(this.district.dice.reduce((acc, cv) => acc + cv) / partners.length),
        thief: this.getThieves().find(p => p.partners.filter(part => part.district === DistrictName.Convoy).some(part => part.solvingDone !== true))!.role,
        district: DistrictName.Convoy
      }
    }
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {

    // TO DO : Delete getThiefLegalMoves when we can control AutoMoves in Tutorial

    if (this.state.tutorial === true){
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}]
    } else return []
  }

  isThiefActive(thief: ThiefState): boolean {

  // TO DO : Delete isThiefActive when we can control AutoMoves in Tutorial

    return this.state.tutorial === true && thief.role === PlayerRole.YellowThief
  }

}