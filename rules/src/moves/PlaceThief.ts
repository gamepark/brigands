import GameState from "../GameState";
import { isPrinceState, isThiefState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import { isNotThiefView } from "../types/Thief";
import MoveType from "./MoveType";

type PlaceThief = {
    type:MoveType.PlaceThief
    playerId:PlayerRole
    district:DistrictName
}

export default PlaceThief

export function placeThief(state:GameState, move:PlaceThief){
    const p = state.players.filter(isThiefState)                //.find(p => p.role === move.playerId)!
}