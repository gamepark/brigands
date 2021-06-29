import {getTokensInBank} from '../Brigands'
import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import TakeToken from '../moves/TakeToken'
import {ThiefState} from '../PlayerState'
import Partner from '../types/Partner'
import TokenAction from '../types/TokenAction'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Jail extends DistrictRules {
  isThiefActive(thief: ThiefState): boolean {
    return thief.partners.find(p => p.district === DistrictName.Jail && p.tokensTaken === 0) !== undefined
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
    const partnersOnJail: Partner[] = []
    this.getThieves().forEach(p => p.partners.forEach(part => part.district === DistrictName.Jail && partnersOnJail.push(part)))
    if (partnersOnJail.every(p => p.tokensTaken === 1)) {
      console.log('end Jail')
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else if (partnersOnJail.every(p => p.solvingDone === true)) {
      return  // Partner made a 2 or 3 and must take a token
    } else if (this.state.city.find(d => d.name === DistrictName.Jail)!.dice === undefined) {
      return {type: MoveType.ThrowDice, dice: rollDice(1), district: DistrictName.Jail}
    } else if (this.state.city.find(d => d.name === DistrictName.Jail)!.dice![0] === 4) {
      return {
        type: MoveType.TakeBackPartner,
        thief: this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Jail && part.solvingDone !== true))!,
        district: DistrictName.Jail
      }
    } else {
      let thief = this.getThieves().find(p => p.partners.some(part => part.district === DistrictName.Jail && part.solvingDone !== true))!
      return {
        type: MoveType.SolvePartner,
        thief,
        partnerNumber: thief.partners.findIndex(part => part.district === DistrictName.Jail && part.solvingDone !== true)!
      }    // Jailed Partners have to take a token
    }
  }
}