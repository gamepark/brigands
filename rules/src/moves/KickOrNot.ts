import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {getPartners, isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type KickOrNot = {
  type: MoveType.KickOrNot
  kickerRole: PlayerRole
  playerToKick: false | PlayerRole
}

export default KickOrNot

export type KickOrNotView = {
  type: MoveType.KickOrNot
  kickerRole: PlayerRole
}

export function kickOrNot(state: GameState | GameView, move: KickOrNot) {
  const kicker = getThieves(state).find(p => p.role === move.kickerRole)!
  const district = state.city[state.districtResolved!]
  const partner = getPartners(kicker).filter(isPartner).find((partner, index) => partner.district === district.name && kicker.tokens.kick.some(t => t === index) && partner.kickOrNot === undefined)!
  partner.kickOrNot = move.playerToKick
}

export function kickOrNotInView(state: GameView, move: KickOrNot | KickOrNotView) {
  if (!isKickOrNotView(move)) {
    kickOrNot(state, move)
  }
}

export function isKickOrNotView(move: KickOrNot | KickOrNotView): move is KickOrNotView {
  return (move as KickOrNot).playerToKick === undefined
}
