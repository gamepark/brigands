import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getPrince, getThieves} from '../GameView'
import {getPartners, isPartner} from '../types/Partner'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type ArrestPartners = {
  type: MoveType.ArrestPartners
}

export default ArrestPartners

export function arrestPartners(state: GameState | GameView) {
  const prince = getPrince(state)
  const thieves = getThieves(state)
  const district = state.city[state.currentDistrict!]

  thieves.forEach(thief => getPartners(thief).filter(isPartner).forEach(partner => {
    if (partner.district === district.name) {
      partner.district = DistrictName.Jail
      delete partner.kickOrNot
      prince.victoryPoints++
    }
  }))

  if (prince.patrols.find(p => p === state.city[state.currentDistrict!].name)) {
    prince.patrols[getPrince(state).patrols.findIndex(p => p === state.city[state.currentDistrict!].name)] = -1
    if (prince.abilities[1] === state.city[state.currentDistrict!].name) {
      prince.abilities[1] = false
    }
  }
}

export function isArrestPartners(move: Move | MoveView): move is ArrestPartners {
  return move.type === MoveType.ArrestPartners
}
