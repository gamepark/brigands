import GameState from '../GameState'
import GameView, {getPrince} from '../GameView'
import MoveType from './MoveType'

type PlacePatrol = {
    type:MoveType.PlacePatrol
    patrolNumber:number
    district:number
}

export default PlacePatrol

export function placePatrol(state:GameState|GameView, move:PlacePatrol){
    const prince = getPrince(state)
    prince.patrols[move.patrolNumber] = move.district
    if (move.patrolNumber === 2){
        prince.gold -=5
        prince.abilities[2] = true
    }
}