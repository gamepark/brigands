import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";
import {isThisPartnerHasAnyToken, isThisPartnerHasKickToken} from "../Brigands"

type MovePartner = {
    type:MoveType.MovePartner
    role:PlayerRole | false
    kicker?:PlayerRole
}

export default MovePartner

export function movePartner(state:GameState | GameView, move:MovePartner){
    const actualDistrict:DistrictName = state.city[state.districtResolved!].name
    if (move.role === false){

    } else {
        
        const nextDistrict:DistrictName = state.city[state.districtResolved!+1].name
        const player:ThiefState = state.players.find(p => p.role === move.role)! as ThiefState
        if (player.tokens.move.find(tm => tm === player.partner.findIndex(part => part.district === actualDistrict)) !== undefined){
            player.tokens.move.splice(player.tokens.move.findIndex(tm => tm === player.partner.findIndex(part => part.district === actualDistrict)),1)
        }
        player.partner.filter(part => part.district === actualDistrict)[0].district = nextDistrict
    }

    if (move.kicker){
        const kicker : ThiefState = (state.players.find(p => p.role === move.kicker)! as ThiefState) ;
        delete kicker.partner.find((part, index) => part.district === actualDistrict && isThisPartnerHasKickToken(kicker, index))!.kickOrNot
    }

}