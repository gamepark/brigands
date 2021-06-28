import GameState from '../GameState'
import GameView from '../GameView'
import {isThief, isThiefState} from '../PlayerState'
import DistrictName from '../types/DistrictName'
import Partner, {PartnerView} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import {ThiefView} from '../types/Thief'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type PlacePartner = {
    type:MoveType.PlacePartner
    playerId:PlayerRole
    district:DistrictName
    partnerNumber:number
}

export type PlacePartnerView = {
    type:MoveType.PlacePartner
    playerId:PlayerRole
    partner:(PartnerView | Partner)[]
}

export default PlacePartner

export function placePartner(state:GameState | GameView, move:PlacePartner){
    const player = state.players.find(p => p.role === move.playerId)!
    if (!isThiefState(player)) throw new Error('Thief State expected')
    player.partners[move.partnerNumber].district = move.district
}

export function placePartnerInView(state:GameView, move:PlacePartner | PlacePartnerView){
    if(isPlacePartnerView(move)){
        state.players = state.players.map(p => p.role === move.playerId ? {...p, partners: move.partner} : p)
    } else {
        placePartner(state,move)
    }
}

export function isPlacePartnerView(move:PlacePartner | PlacePartnerView):move is PlacePartnerView{
    return (move as PlacePartnerView).partner !== undefined
}

export function isPlacePartner(move: Move | MoveView): move is PlacePartner {
    return move.type === MoveType.PlacePartner
  }

