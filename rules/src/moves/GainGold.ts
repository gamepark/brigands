import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isThiefState} from '../PlayerState'
import {isPartnerView} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type GainGold = {
  type: MoveType.GainGold
  gold: number
  thief: PlayerRole
  district: DistrictName
}

export default GainGold

export function gainGold(state: GameState | GameView, move: GainGold) {
  if (move.district === DistrictName.Treasure) {
    const treasure = state.city.find(d => d.name === DistrictName.Treasure)!
    if (treasure.dice === undefined) {
      treasure.dice = [move.gold]
    }
    treasure.gold! -= move.gold
  }

  const thief = getThieves(state).find(p => p.role === move.thief)!
  if (isThiefState(thief)) {
    thief.gold += move.gold
  }
  const partner = thief.partners.find(partner => !isPartnerView(partner) && partner.district === move.district && partner.solvingDone !== true)!
  partner.solvingDone = true
}

export function isGainGold(move: Move | MoveView): move is GainGold {
  return move.type === MoveType.GainGold
}
