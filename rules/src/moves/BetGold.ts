import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";
import { isNotThiefView, ThiefView } from "../types/Thief";

type BetGold = {
    type:MoveType.BetGold
    role:PlayerRole
    gold:number
}

export default BetGold

export function betGold(state:GameState | GameView, move:BetGold){

    const player = state.players.find(p => p.role === move.role) as ThiefState | ThiefView ;

    (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Tavern && p.goldForTavern === undefined)!.goldForTavern = move.gold ;
    if (isNotThiefView(player)){
        player.gold -= move.gold
    }
}