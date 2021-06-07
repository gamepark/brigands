import GameState from "../GameState";
import GameView from "../GameView";
import { playerColors } from "../PlayerColor";
import { ThiefState } from "../PlayerState";
import MoveType from "./MoveType";

type GainGold = {
    type:MoveType.GainGold
    gold:number
    player:ThiefState
}

export default GainGold

export function gainGold(state:GameState | GameView, move:GainGold){
    (state.players.find(p => p.role === move.player.role) as ThiefState).gold += move.gold
}

// Need a View version here