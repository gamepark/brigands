import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, isThiefState, PrinceState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type JudgePrisoners = {
    type:MoveType.JudgePrisoners  
}

export default JudgePrisoners

export function judgePrisoners(state:GameState | GameView){
    const prince : PrinceState = state.players.find(isPrinceState) as PrinceState ;
    const thieves : ThiefState[] = state.players.filter(isThiefState) as ThiefState[] ;
    prince.abilities[0] = true
    prince.patrols[prince.patrols.findIndex(pat => pat === -1)] = -2
    
    thieves.forEach(t => t.partner.forEach(part => {
        if (part.district === DistrictName.Jail){
            delete part.district
            prince.victoryPoints +=2
        }
    }))
}