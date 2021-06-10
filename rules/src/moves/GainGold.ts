import GameState from "../GameState";
import GameView from "../GameView";
import { playerColors } from "../PlayerColor";
import { isThiefState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import { isPartnerView } from "../types/Partner";
import { isNotThiefView, ThiefView } from "../types/Thief";
import MoveType from "./MoveType";

type GainGold = {
    type:MoveType.GainGold
    gold:number
    player:ThiefState
    district:DistrictName
}

export type GainGoldInView = {
    type:MoveType.GainGold
    player:ThiefView
    district:DistrictName
    gold:number
}

export default GainGold

export function gainGold(state:GameState | GameView, move:GainGold){

    if (move.district === DistrictName.Treasure){
        if (state.city.find(d => d.name === DistrictName.Treasure)!.dice === undefined) {
            state.city.find(d => d.name === DistrictName.Treasure)!.dice = [move.gold]
        }
        state.city.find(d => d.name === DistrictName.Treasure)!.gold! -= move.gold      
    }

    const player = state.players.find(p => p.role === move.player.role) as ThiefState | ThiefView ;

    if (isNotThiefView(player)){
        player.gold += move.gold
    }

    player.partner.find(part => !isPartnerView(part) && part.district === move.district && part.solvingDone !== true)!.solvingDone = true
}