import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isPrinceState, PrinceState} from '../PlayerState'
import {isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type MovePartner = {
  type: MoveType.MovePartner
  role: PlayerRole | false
  kicker?: PlayerRole
  runner?: PlayerRole
}

export default MovePartner

export function movePartner(state: GameState | GameView, move: MovePartner) {
  const actualDistrict: DistrictName = state.city[state.currentDistrict!].name
  const nextDistrict: DistrictName = state.city[state.currentDistrict! + 1].name
  const thieves = getThieves(state)
  const thief = move.runner ? thieves.find(p => p.role === move.runner)! : thieves.find(p => p.role === move.role)!
  if (move.role === false) {
  } else {
    thief.partners.filter(isPartner).filter(part => part.district === actualDistrict)[0].district = nextDistrict
    if (nextDistrict === DistrictName.Jail) {
      (state.players.find(isPrinceState) as PrinceState).victoryPoints++
    }
  }
}
