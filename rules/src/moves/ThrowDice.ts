import GameState from "../GameState";
import GameView from "../GameView";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type ThrowDice = {
    type:MoveType.ThrowDice
    dice:number[]
    district:DistrictName
}

export default ThrowDice

export function throwDice(state:GameState|GameView, move:ThrowDice){
    state.city.find(d => d.name === move.district)!.dice = move.dice
}