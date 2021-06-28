import GameState from "../GameState";
import GameView, {getThieves} from '../GameView'
import {isThiefState, ThiefState} from '../PlayerState'
import DistrictName from "../types/DistrictName";
import MoveType from "./MoveType";

type TakeBackPartner = {
    type:MoveType.TakeBackPartner
    thief:ThiefState
    district:DistrictName
}

export default TakeBackPartner

export function takeBackPartner(state:GameState|GameView, move:TakeBackPartner){
    const thief = getThieves(state).find(p => p.role === move.thief.role)!
    if (!isThiefState(thief)) throw new Error('Thief State expected')
    if (move.district === DistrictName.Jail){
        delete thief.partners.find(p => p.district === move.district  && p.solvingDone !== true)!.district
    } else {
        delete thief.partners.find(p => p.district === move.district)!.solvingDone
        delete thief.partners.find(p => p.district === move.district)!.district
    }

    if (move.district === DistrictName.Market || move.district === DistrictName.Jail || move.district === DistrictName.Tavern){
        delete state.city.find(d => d.name === move.district)!.dice
    }
}