import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, isThiefState, PrinceState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type ArrestPartners = {
    type:MoveType.ArrestPartners
}

export default ArrestPartners

export function arrestPartners(state:GameState | GameView){
    (state.players.filter(isThiefState) as ThiefState[]).forEach(p => p.partner.forEach(part => {
        if (part.district === state.city[state.districtResolved!].name){
            part.district = DistrictName.Jail ;
            (state.players.find(isPrinceState)! as PrinceState).victoryPoints++
        }
    }))

    if((state.players.find(isPrinceState)! as PrinceState).patrols.find(p => p === state.city[state.districtResolved!].name)){
        (state.players.find(isPrinceState)! as PrinceState).patrols[(state.players.find(isPrinceState)! as PrinceState).patrols.findIndex(p => p === state.city[state.districtResolved!].name)] = -1
    }
}

