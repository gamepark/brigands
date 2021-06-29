import GameState from "../GameState"
import GameView from "../GameView"
import { isThief } from "../PlayerState"
import Partner from "../types/Partner"
import Phase from "../phases/Phase"
import MoveType from "./MoveType"
import PlayerRole from "../types/PlayerRole"
import Move from "./Move"
import MoveView from "./MoveView"

type RevealPartnersDistricts = {
    type: typeof MoveType.RevealPartnersDistricts 
}

export type RevealPartnersDistrictsView = RevealPartnersDistricts & {
    partnersObject:{partners:Partner[], role:PlayerRole}[]
}

export default RevealPartnersDistricts

export function revealPartnersDistricts(state:GameState | GameView){
    state.phase = Phase.Solving
    state.districtResolved = 0;
}

export function revealPartnersDistrictsInView(state:GameView, move:RevealPartnersDistrictsView){
    state.players.filter(isThief).forEach(p => {
        p.partners = move.partnersObject.find(obj => obj.role === p.role)!.partners
    })
    state.districtResolved = 0;
    state.phase = Phase.Solving
}

export function isRevealPartnersDistrict(move: Move | MoveView): move is RevealPartnersDistricts {
    return move.type === MoveType.RevealPartnersDistricts
  }