import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import { ThiefState } from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Market extends DistrictRules {
  getAutomaticMove(): Move | void {
    const thief = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Market))
    if (!thief) {
      if (this.state.tutorial === true && this.state.eventDeck.length >= 4){

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
      }
    }
    if (this.district.dice === undefined) {
      return {type: MoveType.ThrowDice, dice: rollDice(this.isDistrictEvent() ? 2 : 1), district: DistrictName.Market}
    }
    const partner = thief.partners.find(partner => partner.district === DistrictName.Market)!
    if (!partner.solvingDone) {
      return {type: MoveType.GainGold, gold: this.district.dice.reduce((acc, vc) => acc + vc), thief: thief.role, district: DistrictName.Market}
    } else {
      return {type: MoveType.TakeBackPartner, thief: thief.role, district: DistrictName.Market}
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