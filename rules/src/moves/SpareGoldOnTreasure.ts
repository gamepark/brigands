import GameState from "../GameState";
import GameView from "../GameView";
import DistrictName from "../types/DistrictName";
import Move from "./Move";
import MoveType from "./MoveType";

type SpareGoldOnTreasure = {
    type:MoveType.SpareGoldOnTreasure
    gold:number
    district:DistrictName
}

export default SpareGoldOnTreasure

export function spareGoldOnTreasure(state:GameState | GameView, move:SpareGoldOnTreasure){
    console.log("In SpareGold; Gold : ", move.gold)
    state.city.find(d => d.name === DistrictName.Treasure)!.gold! += move.gold
    delete state.city.find(d => d.name === move.district)!.dice

}