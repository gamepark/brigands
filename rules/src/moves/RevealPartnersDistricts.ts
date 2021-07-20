import GameState from '../GameState'
import GameView from '../GameView'
import Phase from '../phases/Phase'
import {isThief, ThiefState} from '../PlayerState'
import Partner from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type RevealPartnersDistricts = {
  type: typeof MoveType.RevealPartnersDistricts
}

type PartnerObject = { partners: Partner[], role: PlayerRole }

export type RevealPartnersDistrictsView = RevealPartnersDistricts & {
  partnersObject: PartnerObject[]
}

export default RevealPartnersDistricts

export function revealPartnersDistricts(state: GameState | GameView) {
  state.phase = Phase.Solving
  state.districtResolved = 0
}

export function revealPartnersDistrictsInView(state: GameView, move: RevealPartnersDistrictsView) {
  state.players.filter(isThief).forEach(thief => {
    thief.partners = move.partnersObject.find(obj => obj.role === thief.role)!.partners
  })
  state.districtResolved = 0
  state.phase = Phase.Solving
}

export function isRevealPartnersDistrict(move: Move | MoveView): move is RevealPartnersDistricts {
  return move.type === MoveType.RevealPartnersDistricts
}

export function getRevealPartnersDistrictView(thieves: ThiefState[]): RevealPartnersDistrictsView {
  return {type: MoveType.RevealPartnersDistricts, partnersObject: thieves.map(thief => ({partners: thief.partners, role: thief.role}))}
}
