import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Jail extends DistrictRules {
  district = DistrictName.Jail

  /*isThiefActive(thief: ThiefState): boolean {
    return (thief.tokens.length < MAX_ACTIONS && thief.partners.find(p => p.district === DistrictName.Jail && p.tokensTaken === 0) !== undefined)
      || (this.state.tutorial && thief.role === PlayerRole.YellowThief)
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    const jailMoves: TakeToken[] = []
    if (thief.partners.find(p => p.district === DistrictName.Jail && (p.tokensTaken === 0))) {
      if (thief.tokens.length < MAX_ACTIONS) {
        jailMoves.push(takeTokenMove(thief.role))
      }
    }
    if (this.state.tutorial && jailMoves.length === 0) {
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}]
    } else {
      return jailMoves
    }
  }*/

  /*getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    const thievesOnJail = this.getThieves().filter(p => p.partners.some(part => isPartner(part) && part.district === DistrictName.Jail))
    const isTutorial = this.state.tutorial

    if (this.state.players.find(isPrinceState)!.patrols.some(pat => pat === DistrictName.Jail)) {
      return {type: MoveType.JudgePrisoners}
    }

    if (thievesOnJail.every(p => p.partners.every(part => part.district !== DistrictName.Jail || part.solvingDone === true && (part.tokensTaken === 1 || p.tokens.length === MAX_ACTIONS)))) {
      if (this.state.tutorial && this.state.eventDeck.length >= 4) {

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.currentDistrict!}
      }
    }
    if (partners.every(p => p.solvingDone === true)) {
      return // Partner made a 2 or 3 and must take a token
    }
    if (this.district.dice === undefined) {

      // --- --- TO DO : Delete parts linked to Tutorial when scripting random will be implemented --- ---

      if (!isTutorial || this.state.eventDeck.length !== 5) {
        return {type: MoveType.ThrowDice, dice: rollDice(1), district: DistrictName.Jail}
      } else {
        return partners.length === 2 ? {type: MoveType.ThrowDice, dice: [4], district: DistrictName.Jail} : {
          type: MoveType.ThrowDice, dice: [3], district: DistrictName.Jail
        }
      }

      // --- --- END TO DO --- --- 

    }
    const thief = this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Jail && part.solvingDone !== true))!
    if (this.district.dice[0] === 4) {
      return {
        type: MoveType.TakeBackPartner,
        thief: thief.role,
        district: DistrictName.Jail
      }
    } else {
      // Jailed Partners have to take a token
      return {
        type: MoveType.SolvePartner,
        thief: thief.role,
        partnerNumber: thief.partners.findIndex(part => part.district === DistrictName.Jail && part.solvingDone !== true)!
      }
    }
  }*/
}