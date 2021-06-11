import GameState from "../GameState";
import GameView from "../GameView";
import { ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type TakeBackPartner = {
    type:MoveType.TakeBackPartner
    thief:ThiefState
    district:DistrictName
}

export default TakeBackPartner

export function takeBackPartner(state:GameState|GameView, move:TakeBackPartner){
    delete (state.players.find(p => p.role === move.thief.role)! as ThiefState).partner.find(p => p.district === move.district)!.solvingDone
    delete (state.players.find(p => p.role === move.thief.role)! as ThiefState).partner.find(p => p.district === move.district)!.district

    if (move.district === DistrictName.Market || move.district === DistrictName.Jail){
        delete state.city.find(d => d.name === move.district)!.dice
    }



}