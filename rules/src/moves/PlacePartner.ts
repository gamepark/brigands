import { GameSpeed, getGameView } from "@gamepark/rules-api";
import GameState from "../GameState";
import GameView from "../GameView";
import { isPrinceState, isThiefState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import Partner, { isPartnerView, PartnerView } from "../types/Partner";
import PlayerRole from "../types/PlayerRole";
import { isNotThiefView, ThiefView } from "../types/Thief";
import MoveType from "./MoveType";

type PlacePartner = {
    type:MoveType.PlacePartner
    playerId:PlayerRole
    district:DistrictName
    partnerNumber:number
}

export type PlacePartnerView = {
    type:MoveType.PlacePartner
    playerId:PlayerRole
    partner:(PartnerView | Partner)[]
}

export default PlacePartner

export function placePartner(state:GameState | GameView, move:PlacePartner){
    (state.players.filter(isThiefState).find(p => p.role === move.playerId)! as ThiefState)
        .partner[move.partnerNumber].district = move.district
}

export function placePartnerInView(state:GameView, move:PlacePartner | PlacePartnerView){
    if(isPlacePartnerView(move)){
        (state.players.filter(isThiefState).find(p => p.role === move.playerId)! as ThiefView)
            .partner = move.partner
    } else {
        placePartner(state,move)
    }

}

export function isPlacePartnerView(move:PlacePartner | PlacePartnerView):move is PlacePartnerView{
    return (move as PlacePartnerView).partner !== undefined
}

