import {rollDice} from '../material/Dice'
import {EventArray} from '../material/Events'
import BetGold from '../moves/BetGold'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Tavern extends DistrictRules {
  isThiefActive(thief: ThiefState): boolean {
    return thief.partners.find(p => p.district === DistrictName.Tavern && p.goldForTavern === undefined) !== undefined
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    const tavernMoves: BetGold[] = []
    if (thief.partners.find(p => p.district === DistrictName.Tavern)) {
      if (thief.partners.filter(p => p.district === DistrictName.Tavern).find(p => p.goldForTavern === undefined)) {
        for (let i = 0; i < (this.state.players.find(p => p.role === thief.role)!.gold + 1); i++) {
          tavernMoves.push({type: MoveType.BetGold, role: thief.role, gold: i})
        }
      }
    }
    return tavernMoves
  }

  getAutomaticMove(): Move | void {
    // Actually simultaneous Phase, but can be better if sequatialized for animations ?
    if (this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Tavern)) === undefined) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else {
      const anyThiefWhoBet = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined))
      if (anyThiefWhoBet === undefined) {
        return
      } else if (this.district.dice === undefined) {
        return {type: MoveType.ThrowDice, dice: rollDice(1), district: DistrictName.Tavern}
      } else if (anyThiefWhoBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.solvingDone) {
        return {type: MoveType.TakeBackPartner, thief: anyThiefWhoBet, district: DistrictName.Tavern}
      } else {
        return {
          type: MoveType.GainGold,
          gold: betResult(anyThiefWhoBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.goldForTavern!, this.district.dice[0], EventArray[this.state.event].district === DistrictName.Tavern),
          player: anyThiefWhoBet, district: DistrictName.Tavern
        }
      }
    }
  }
}

function betResult(goldBet: number, dice: number, isEvent: boolean): number {
  if (isEvent) {
    return dice[0] === 2 ? 0 : goldBet * 3
  } else {
    switch (dice[0]) {
      case 2 :
        return 0
      case 3:
        return goldBet * 2
      case 4:
        return goldBet * 4
      default:
        return 0
    }
  }
}