import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import {isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Treasure extends DistrictRules {
  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.length === 0) {
      if (this.state.tutorial && this.state.eventDeck.length >= 4) {

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
      }
    }
    if (partners.every(partner => partner.solvingDone === true)) {
      return {
        type: MoveType.TakeBackPartner,
        thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure))!.role,
        district: DistrictName.Treasure
      }
    } else {
      if (this.district.dice === undefined) {
        if (this.getThieves().filter(t => t.partners.some(part => isPartner(part) && part.district === DistrictName.Treasure)).length === 1) {
          return {
            type: MoveType.GainGold, district: DistrictName.Treasure,
            thief: this.getThieves().filter(t => t.partners.some(part => isPartner(part) && part.district === DistrictName.Treasure))[0].role,
            gold: this.district.gold!,
            noShare: true
          }
        } else {
          return {
            type: MoveType.GainGold, gold: Math.floor(this.district.gold! / partners.length),
            thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Treasure))!.role,
            district: DistrictName.Treasure
          }
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

  getThiefLegalMoves(): Move[] {

    // TO DO : Delete getThiefLegalMoves when we can control AutoMoves in Tutorial

    if (this.state.tutorial) {
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}]
    } else return []
  }

  isThiefActive(thief: ThiefState): boolean {

    // TO DO : Delete isThiefActive when we can control AutoMoves in Tutorial

    return this.state.tutorial && thief.role === PlayerRole.YellowThief
  }
}