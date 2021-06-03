import GameState from "../GameState"
import GameView from "../GameView"
import { isThiefState } from "../PlayerState"
import Partner from "../types/Partner"
import Phase from "../types/Phase"
import MoveType from "./MoveType"

type RevealPartnersDistricts = {
    type: typeof MoveType.RevealPartnersDistricts 
}

export type RevealPartnersDistrictsView = RevealPartnersDistricts & {
    partnersArray:Partner[][]
}

export default RevealPartnersDistricts

export function revealPartnersDistricts(state:GameState | GameView){
    state.phase = Phase.Solving
    state.districtResolved = 0;
}

export function revealPartnersDistrictsInView(state:GameView, move:RevealPartnersDistrictsView){
    state.players.filter(isThiefState).forEach((p, index) => {
        p.partner = move.partnersArray[index]
    })
    state.districtResolved = 0;
    state.phase = Phase.Solving
}