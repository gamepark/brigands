import {rollDice} from '../material/Dice'
import BetGold from '../moves/BetGold'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import PlayerRole from '../types/PlayerRole'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Tavern extends DistrictRules {
  isThiefActive(thief: ThiefState): boolean {
    return (thief.partners.find(p => p.district === DistrictName.Tavern && p.goldForTavern === undefined) !== undefined) || (this.state.tutorial === true && thief.role === PlayerRole.YellowThief)
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    const tavernMoves: BetGold[] = []
    if (thief.partners.find(p => p.district === DistrictName.Tavern)) {
      if (thief.partners.filter(p => p.district === DistrictName.Tavern).find(p => p.goldForTavern === undefined)) {
        for (let i = 0; i < Math.min(this.state.players.find(p => p.role === thief.role)!.gold + 1, 6); i++) {
          tavernMoves.push({type: MoveType.BetGold, role: thief.role, gold: i})
        }
      }
    }
    if (this.state.tutorial === true && tavernMoves.length === 0){
      return [{type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}]
    } else {
      return tavernMoves
    }
  }

  getAutomaticMove(): Move | void {
    // Actually simultaneous Phase, but can be better if sequential for animations ?
    const thief = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Tavern))
    if (!thief) {
      if (this.state.tutorial === true && this.state.eventDeck.length >= 4){

        // TO DO : Delete when we can control AutoMoves in Tutorial

        return
      } else {
        return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
      }
    }
    const thiefWithBet = this.getThieves().find(thief => thief.partners.find(partner => partner.district === DistrictName.Tavern && partner.goldForTavern !== undefined))
    if (thiefWithBet === undefined) {
      return
    }
    if (this.district.dice === undefined) {
      return {type: MoveType.ThrowDice, dice: rollDice(this.isDistrictEvent() ? 4 : 3), district: DistrictName.Tavern}   // Roll 3 dices and not only 1 (or 4 if event)
    }
    const partner = thiefWithBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!
    if (partner.solvingDone) {
      return {type: MoveType.TakeBackPartner, thief: thiefWithBet.role, district: DistrictName.Tavern}
    } else {
      return {
        type: MoveType.GainGold,
        gold: betResultv2(partner.goldForTavern!, this.district.dice),
        thief: thiefWithBet.role, district: DistrictName.Tavern
      }
    }
  }
}

function betResult(goldBet: number, dice: number, isEvent: boolean): number {
  if (isEvent) {
    return dice === 2 ? 0 : goldBet * 3
  } else {
    switch (dice) {
      case 2 :
        return 0
      case 3:
        return goldBet * 2
      case 4:
        return goldBet * 3
      default:
        return 0
    }
  }
}

function betResultv2(goldBet:number, dice:number[]):number{
  const arrayOfTwos = dice.filter(face => face === 2)
  const arrayOfThrees = dice.filter(face => face === 3)
  const arrayOfFours = dice.filter(face => face === 4)
  if (arrayOfFours.length === 4 || arrayOfThrees.length === 4 ||arrayOfTwos.length === 4){
    return goldBet * 4
  } else if (arrayOfFours.length === 3 || arrayOfThrees.length === 3 ||arrayOfTwos.length === 3){
    return goldBet * 3
  } else if (arrayOfFours.length === 2 || arrayOfThrees.length === 2 ||arrayOfTwos.length === 2){
    return goldBet * 2
  } else return 0

}