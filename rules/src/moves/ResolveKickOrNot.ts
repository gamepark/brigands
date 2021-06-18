import GameState from "../GameState";
import GameView from "../GameView";
import { isThiefState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";

type ResolveKickOrNot = {
    type:MoveType.ResolveKickOrNot
}

export default ResolveKickOrNot

export function resolveKickOrNot(state:GameState | GameView){
    const thieves:ThiefState[] = (state.players.filter(isThiefState) as ThiefState[]) ;
    const nextDistrict:DistrictName = state.city[state.districtResolved!+1].name ;
    const partnersToKickArray:{role:PlayerRole, indexPartner:number}[] = [] ;

   thieves.forEach(p => p.partner.forEach(part => {               // Looking for the partners to kick
        if (part.kickOrNot !== undefined && part.kickOrNot !== false){
            partnersToKickArray.push(part.kickOrNot)
        }
    }))

    const partnersToKickWithoutDoublesArray:{role:PlayerRole, indexPartner:number}[] = [...new Set(partnersToKickArray)] ;

    partnersToKickWithoutDoublesArray.forEach(object => {                       // Kick them (only once !)
        thieves.find(p => p.role === object.role)!.partner[object.indexPartner].district = nextDistrict
    })

    thieves.forEach(p => p.partner.forEach((part, index) => {                                       // Return of the tokens in bank
        delete part.kickOrNot
        if (part.district === state.city[state.districtResolved!].name && p.tokens.kick.some(t => t === index)){
            delete p.tokens.kick[p.tokens.kick.findIndex(ts => ts === index)]
        }
    }))

    delete state.readyToKickPartners

}