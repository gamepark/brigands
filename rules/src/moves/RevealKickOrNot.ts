import GameState from "../GameState";
import GameView from "../GameView";
import { isThiefState } from "../PlayerState";
import Partner from "../types/Partner";
import MoveType from "./MoveType";

type RevealKickOrNot = {
    type: typeof MoveType.RevealKickOrNot
}

export default RevealKickOrNot

export type RevealKickOrNotView = RevealKickOrNot & {
    partnersArray:Partner[][]
}

export function revealKickOrNot(state:GameState | GameView){
    state.readyToKickPartners = true
}

export function revealKickOrNotView(state:GameView, move:RevealKickOrNotView){
    console.log("move.partners : ",move.partnersArray)
    state.players.filter(isThiefState).forEach((p, index) => {
        p.partner = move.partnersArray[index]
    })
    
    state.readyToKickPartners = true
}