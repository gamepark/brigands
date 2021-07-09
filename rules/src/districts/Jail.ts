import {getTokensInBank} from '../Brigands'
import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import TakeToken from '../moves/TakeToken'
import {ThiefState} from '../PlayerState'
import TokenAction from '../types/TokenAction'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Jail extends DistrictRules {
  isThiefActive(thief: ThiefState): boolean {
    return getTokensInBank(thief).length !== 0 && thief.partners.find(p => p.district === DistrictName.Jail && p.tokensTaken === 0) !== undefined
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    const jailMoves: TakeToken[] = []
    if (thief.partners.find(p => p.district === DistrictName.Jail && (p.tokensTaken === 0))) {
      const availableTokens: TokenAction[] = getTokensInBank(thief)
      for (let i = 0; i < availableTokens.length; i++) {
        jailMoves.push({type: MoveType.TakeToken, role: thief.role, token: availableTokens[i]})
      }
    }
    return jailMoves
  }

  getAutomaticMove(): Move | void {
    const partners = this.getDistrictPartners()
    if (partners.every(p => p.tokensTaken === 1)) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    }
    if (partners.every(p => p.solvingDone === true)) {
      return // Partner made a 2 or 3 and must take a token
    }
    if (this.district.dice === undefined) {
      return {type: MoveType.ThrowDice, dice: rollDice(1), district: DistrictName.Jail}
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