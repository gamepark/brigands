import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import PlayerRole from "../types/PlayerRole";
import TokenAction from "../types/TokenAction";
import MoveType from "./MoveType";

type PlaceToken = {
    type:MoveType.PlaceToken
    tokenAction:TokenAction
    partnerNumber:number
    role:PlayerRole
}

export default PlaceToken

export function placeToken(state:GameState|GameView, move:PlaceToken){
    const player : ThiefState = (state.players.find(p => p.role === move.role) as ThiefState)
    switch(move.tokenAction){
        case TokenAction.Stealing:
            player.tokens.steal[player.tokens.steal.findIndex(t => t === -1)] = move.partnerNumber
            break

        case TokenAction.Kicking:
            player.tokens.kick[player.tokens.kick.findIndex(t => t === -1)] = move.partnerNumber
            break

        case TokenAction.Fleeing:
            player.tokens.move[player.tokens.move.findIndex(t => t === -1)] = move.partnerNumber
            break
    }
    
}
