import {getTokensInBank} from '../Brigands'
import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type SolvePartner = {
  type: MoveType.SolvePartner
  thief: PlayerRole
  partnerNumber: number
}

export default SolvePartner

export function solvePartner(state: GameState | GameView, move: SolvePartner) {
  const thief = getThieves(state).find(p => p.role === move.thief)!
  thief.partners[move.partnerNumber].solvingDone = true
  if (getTokensInBank(thief).length === 0) {
    thief.partners[move.partnerNumber].tokensTaken = 1
  } else {
    thief.partners[move.partnerNumber].tokensTaken = 0
  }

  if (state.city[state.currentDistrict!].name === DistrictName.Jail) {
    delete state.city[state.currentDistrict!].dice
  }
}