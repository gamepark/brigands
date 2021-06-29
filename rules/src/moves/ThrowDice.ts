import GameState from "../GameState";
import GameView from "../GameView";
import DistrictName from "../districts/DistrictName";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type ThrowDice = {
    type:MoveType.ThrowDice
    dice:number[]
    district:DistrictName
}

export default ThrowDice

export function throwDice(state:GameState|GameView, move:ThrowDice){
    state.city.find(d => d.name === move.district)!.dice = move.dice
}

export function isThrowDice(move:Move | MoveView):move is ThrowDice{
    return move.type === MoveType.ThrowDice
}