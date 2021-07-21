import {getTokensInBank} from '../Brigands'
import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import TakeToken from '../moves/TakeToken'
import {ThiefState} from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import TokenAction from '../types/TokenAction'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Jail extends DistrictRules {

  
  isThiefActive(thief: ThiefState): boolean {
    return (getTokensInBank(thief).length !== 0 && thief.partners.find(p => p.district === DistrictName.Jail && p.tokensTaken === 0) !== undefined) || (this.state.tutorial === true && thief.role === PlayerRole.YellowThief)
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    const jailMoves: TakeToken[] = []
    if (thief.partners.find(p => p.district === DistrictName.Jail && (p.tokensTaken === 0))) {
      const availableTokens: TokenAction[] = getTokensInBank(thief)
      for (let i = 0; i < availableTokens.length; i++) {
        jailMoves.push({type: MoveType.TakeToken, role: thief.role, token: availableTokens[i]})
      }
    }
    if (this.state.tutorial === true && jailMoves.length === 0){
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}]
    } else {
      return jailMoves
    }
  }

  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    const isTutorial = this.state.tutorial
    if (partners.every(p => p.tokensTaken === 1)) {
      if (this.state.tutorial === true && this.state.eventDeck.length >= 4){

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
      }
    }
    if (partners.every(p => p.solvingDone === true)) {
      return // Partner made a 2 or 3 and must take a token
    }
    if (this.district.dice === undefined) {

      // --- --- TO DO : Delete parts linked to Tutorial when scripting random will be implemented --- ---

      if (!isTutorial || this.state.eventDeck.length !== 5){
        return {type: MoveType.ThrowDice, dice: rollDice(1), district: DistrictName.Jail}
      } else {
        console.log("roll special tuto")
        return partners.length === 2 ? {type: MoveType.ThrowDice, dice: [4], district: DistrictName.Jail} : {type: MoveType.ThrowDice, dice: [3], district: DistrictName.Jail}
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
  }
}