import {isThisPartnerHasKickToken, isThisPartnerHasMoveToken, isThisPartnerHasStealToken} from '../Brigands'
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
  const district = state.city[state.districtResolved!]

  thieves.forEach(thief => getPartners(thief).filter(isPartner).forEach((partner, index) => {
    if (partner.district === district.name) {
      partner.district = DistrictName.Jail
      prince.victoryPoints++
      if (isThisPartnerHasStealToken(thief, index)) {
        thief.tokens.steal.splice(thief.tokens.steal.findIndex(ts => ts === index), 1)
      } else if (isThisPartnerHasKickToken(thief, index)) {
        thief.tokens.kick.splice(thief.tokens.kick.findIndex(tk => tk === index), 1)
      } else if (isThisPartnerHasMoveToken(thief, index)) {
        thief.tokens.move.splice(thief.tokens.move.findIndex(tm => tm === index), 1)
      }
    }
  }))

  if (prince.patrols.find(p => p === state.city[state.districtResolved!].name)) {
    prince.patrols[getPrince(state).patrols.findIndex(p => p === state.city[state.districtResolved!].name)] = -1
    if (prince.abilities[1] === state.city[state.districtResolved!].name) {
      prince.abilities[1] = false
    }
  }
}

export function isArrestPartners(move: Move | MoveView): move is ArrestPartners {
  return move.type === MoveType.ArrestPartners
}
