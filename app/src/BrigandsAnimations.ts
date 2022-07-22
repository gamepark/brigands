import GameView, {getThieves} from '@gamepark/brigands/GameView'
import MoveType from '@gamepark/brigands/moves/MoveType'
import MoveView from '@gamepark/brigands/moves/MoveView'
import {Steal} from '@gamepark/brigands/moves/ResolveStealToken'
import {isPartner} from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Animations} from '@gamepark/react-client'

const brigandsAnimations: Animations<GameView, MoveView, PlayerRole> = {

  getAnimationDuration(move: MoveView, {state}) {

    if (move.type === MoveType.ArrestPartners && getThieves(state).some(p => p.partners.some(part => isPartner(part) && part.district === state.city[state.currentDistrict!].name))) {
      return 2
    } else if (move.type === MoveType.BetGold) {
      return 2
    } else if (move.type === MoveType.GainGold) {
      return 2
    } else if (move.type === MoveType.MoveOnDistrictResolved) {
      return 1
    } else if (move.type === MoveType.SpareGoldOnTreasure) {
      return 2
    } else if (move.type === MoveType.TakeBackPartner) {
      return 1
    } else if (move.type === MoveType.ThrowDice) {
      return move.dice.length === 0 ? 0 : 2
    } else if (move.type === MoveType.ResolveStealToken) {
      const stealResult: Steal[] = []
      move.steals.forEach(s => {
        if (stealResult.find(sr => sr.thief === s.thief) === undefined) {
          stealResult.push(s)
        }
      })
      return resolveStealDurationUnit * stealResult.length
    } else if (move.type === MoveType.MovePartner) {
      return 0
    } else if (move.type === MoveType.DrawEvent) {
      return 6
    } else if (move.type === MoveType.JudgePrisoners) {
      return 2
    } else if (move.type === MoveType.PlayHeadStart) {
      return 2
    } else if (move.type === MoveType.RevealPartnersDistricts) {
      return 5
    }

    return 0
  }

}

export const resolveStealDurationUnit: number = 2

export default brigandsAnimations