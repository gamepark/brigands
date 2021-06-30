import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isThiefState} from '../PlayerState'
import {isPartnerView} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type BetGold = {
  type: MoveType.BetGold
  role: PlayerRole
  gold: number
}

export default BetGold

export function betGold(state: GameState | GameView, move: BetGold) {
  const thief = getThieves(state).find(p => p.role === move.role)!
  const partner = thief.partners.find(partner => !isPartnerView(partner) && partner.district === DistrictName.Tavern && partner.goldForTavern === undefined)!
  partner.goldForTavern = move.gold
  if (isThiefState(thief)) {
    thief.gold -= move.gold
  }
}

export function isBetGold(move: Move | MoveView): move is BetGold {
  return move.type === MoveType.BetGold
}
