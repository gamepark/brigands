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
    console.log("TakeToken joué :", move)
    if ((state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.tokensTaken === undefined){
        (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.tokensTaken = 1
    } else {
        (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.tokensTaken!++
    }
    switch(move.token){
        case TokenAction.Stealing:
            (state.players.find(p => p.role === move.role) as ThiefState).tokens.steal.push(-1) 
            break
        case TokenAction.Kicking:
            (state.players.find(p => p.role === move.role) as ThiefState).tokens.kick.push(-1)
            break
        case TokenAction.Fleeing:
            (state.players.find(p => p.role === move.role) as ThiefState).tokens.move.push(-1)
            break
    }
    
}