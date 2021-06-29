import {getTokensInBank} from '../Brigands'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import TakeToken from '../moves/TakeToken'
import {ThiefState} from '../PlayerState'
import TokenAction from '../types/TokenAction'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Harbor extends DistrictRules {
  isThiefActive(thief: ThiefState): boolean {
    return thief.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2))) !== undefined
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    const harborMoves: TakeToken[] = []
    if (thief.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))) {
      const availableTokens: TokenAction[] = getTokensInBank(thief)
      for (let i = 0; i < availableTokens.length; i++) {
        harborMoves.push({type: MoveType.TakeToken, role: thief.role, token: availableTokens[i]})
      }
    }
    return harborMoves
  }

  getAutomaticMove(): Move | void {
    if (this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Harbor)) === undefined) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else {
      const anyThiefWhoTookTokens = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Harbor && part.tokensTaken === (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))
      const anyThiefWhoCantTakeAnymore = this.getThieves().find(p => getTokensInBank(p).length === 0 && p.partners.find(part => part.district === DistrictName.Harbor))
      if (anyThiefWhoTookTokens) {
        return {type: MoveType.TakeBackPartner, thief: anyThiefWhoTookTokens, district: DistrictName.Harbor}
      }
      if (anyThiefWhoCantTakeAnymore) {
        return {type: MoveType.TakeBackPartner, thief: anyThiefWhoCantTakeAnymore, district: DistrictName.Harbor}
      }
    }
  }
}