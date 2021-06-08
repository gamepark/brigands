import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";

type BetGold = {
    type:MoveType.BetGold
    role:PlayerRole
    gold:number
}

export default BetGold

export function betGold(state:GameState | GameView, move:BetGold){
    (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Tavern)!.goldForTavern = move.gold
}