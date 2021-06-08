import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import TokenAction from "../types/TokenAction";
import MoveType from "./MoveType";

type TakeToken = {
    type:MoveType.TakeToken
    role:PlayerRole
    token:TokenAction
}

export default TakeToken

export function takeToken(state:GameState | GameView, move:TakeToken){
    if ((state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.tokensTaken === undefined){
        (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.tokensTaken = 1
    } else {
        (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.tokensTaken!++
    }
}