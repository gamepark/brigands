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
    if (state.city[state.districtResolved!].name === DistrictName.Jail){
        (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === state.city[state.districtResolved!].name && p.tokensTaken === undefined)!.tokensTaken = 1
    } else {
        if ((state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === state.city[state.districtResolved!].name)!.tokensTaken === undefined){
            (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === state.city[state.districtResolved!].name)!.tokensTaken = 1
        } else {
            (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === state.city[state.districtResolved!].name)!.tokensTaken!++
        }
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