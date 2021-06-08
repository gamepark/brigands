import GameState from "../GameState";
import GameView from "../GameView";
import { playerColors } from "../PlayerColor";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type GainGold = {
    type:MoveType.GainGold
    gold:number
    player:ThiefState
    district?:DistrictName
}

export default GainGold

export function gainGold(state:GameState | GameView, move:GainGold){
    if (move.district ===  DistrictName.Treasure){
        if (state.city.find(d => d.name === DistrictName.Treasure)!.dice === undefined) {
            state.city.find(d => d.name === DistrictName.Treasure)!.dice = [move.gold]
        }
        state.city.find(d => d.name === DistrictName.Treasure)!.gold! -= move.gold      
    }
    (state.players.find(p => p.role === move.player.role) as ThiefState).gold += move.gold
}

// Need a View version here