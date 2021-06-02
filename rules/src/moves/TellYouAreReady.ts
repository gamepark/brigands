import GameState from "../GameState";
import GameView from "../GameView";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";

type TellYouAreReady = {
    type:MoveType.TellYouAreReady
    playerId:PlayerRole
}

export default TellYouAreReady

export function tellYouAreReady(state:GameState|GameView, move:TellYouAreReady){
    state.players.find(p => p.role === move.playerId)!.isReady = true
} 