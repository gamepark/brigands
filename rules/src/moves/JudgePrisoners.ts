import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getPrince, getThieves} from '../GameView'
import {isPartnerView} from '../types/Partner'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type JudgePrisoners = {
  type: MoveType.JudgePrisoners
}

export default JudgePrisoners

export function judgePrisoners(state: GameState | GameView) {
  const prince = getPrince(state)
  const thieves = getThieves(state)
  prince.abilities[0] = true

  thieves.forEach(thief => thief.partners.forEach(partner => {
    if (!isPartnerView(partner) && partner.district === DistrictName.Jail) {
      delete partner.district
      prince.victoryPoints += 2
    }
  }))

  prince.patrols[getPrince(state).patrols.findIndex(p => p === state.city[state.currentDistrict!].name)] = -1
}

export function isJudgePrisoners(move: Move | MoveView): move is JudgePrisoners {
  return move.type === MoveType.JudgePrisoners
}
