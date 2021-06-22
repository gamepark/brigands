import { isThisPartnerHasAnyToken, isThisPartnerHasKickToken, isThisPartnerHasMoveToken, isThisPartnerHasStealToken } from "../Brigands";
import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, isThiefState, PrinceState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import Thief from "../types/Thief";
import MoveType from "./MoveType";

type ArrestPartners = {
    type:MoveType.ArrestPartners
}

export default ArrestPartners

export function arrestPartners(state:GameState | GameView){

    const prince : PrinceState = state.players.find(isPrinceState) as PrinceState
    const thieves : ThiefState[] = state.players.filter(isThiefState) as ThiefState[]

    thieves.forEach(p => p.partner.forEach((part, index) => {
        if (part.district === state.city[state.districtResolved!].name){
            part.district = DistrictName.Jail ;
            prince.victoryPoints++
            if (isThisPartnerHasStealToken(p, index)){
                p.tokens.steal.splice(p.tokens.steal.findIndex(ts => ts === index),1)
            } else if (isThisPartnerHasKickToken(p, index)){
                p.tokens.kick.splice(p.tokens.kick.findIndex(tk => tk === index),1)
            } else if (isThisPartnerHasMoveToken(p, index)){
                p.tokens.steal.splice(p.tokens.move.findIndex(tm => tm === index),1)
            }
        }
    }))

    if(prince.patrols.find(p => p === state.city[state.districtResolved!].name)){
        prince.patrols[(state.players.find(isPrinceState)! as PrinceState).patrols.findIndex(p => p === state.city[state.districtResolved!].name)] = -1
        if (prince.abilities[1] === state.city[state.districtResolved!].name){
            prince.abilities[1] = false
        }
    }
}

