import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";
import {isThisPartnerHasAnyToken, isThisPartnerHasKickToken, isThisPartnerHasMoveToken} from "../Brigands"
import Partner from "../types/Partner";

type MovePartner = {
    type:MoveType.MovePartner
    role:PlayerRole | false
    kicker?:PlayerRole
    runner?:PlayerRole
}

export default MovePartner

export function movePartner(state:GameState | GameView, move:MovePartner){

    const actualDistrict:DistrictName = state.city[state.districtResolved!].name
    const nextDistrict:DistrictName = state.city[state.districtResolved!+1].name
    const player:ThiefState = move.runner ? state.players.find(p => p.role === move.runner)! as ThiefState : state.players.find(p => p.role === move.role)! as ThiefState

    if (move.role === false){

        if (move.runner){
            if (player.partners.some((part, index) => part.district === actualDistrict && isThisPartnerHasMoveToken(player, index))){
                player.tokens.move.splice(player.tokens.move.findIndex(tm => tm === player.partners.findIndex((part, index) => part.district === actualDistrict && isThisPartnerHasMoveToken(player, index))),1)
            }
        }

    } else {
        if (player.partners.some((part, index) => part.district === actualDistrict && isThisPartnerHasMoveToken(player, index))){
            player.tokens.move.splice(player.tokens.move.findIndex(tm => tm === player.partners.findIndex((part, index) => part.district === actualDistrict && isThisPartnerHasMoveToken(player, index))),1)
        }
        player.partners.filter(part => part.district === actualDistrict)[0].district = nextDistrict
    }

    if (move.kicker){
        const kicker : ThiefState = (state.players.find(p => p.role === move.kicker)! as ThiefState) ;
        delete kicker.partners.find((part, index) => part.district === actualDistrict && isThisPartnerHasKickToken(kicker, index))!.kickOrNot
    }

}