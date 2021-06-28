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
    if (move.district === DistrictName.Jail){
        delete (state.players.find(p => p.role === move.thief.role)! as ThiefState).partners.find(p => p.district === move.district  && p.solvingDone !== true)!.district
    } else {
        delete (state.players.find(p => p.role === move.thief.role)! as ThiefState).partners.find(p => p.district === move.district)!.solvingDone
        delete (state.players.find(p => p.role === move.thief.role)! as ThiefState).partners.find(p => p.district === move.district)!.district
    }

    if (move.district === DistrictName.Market || move.district === DistrictName.Jail || move.district === DistrictName.Tavern){
        delete state.city.find(d => d.name === move.district)!.dice
    }



}