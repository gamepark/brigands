import GameState from "../GameState"
import GameView from "../GameView"
import { isThief } from "../PlayerState"
import Partner from "../types/Partner"
import Phase from "../phases/Phase"
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
    state.players.filter(isThief).forEach((p, index) => {
        p.partners = move.partnersArray[index]
    })
    state.districtResolved = 0;
    state.phase = Phase.Solving
}