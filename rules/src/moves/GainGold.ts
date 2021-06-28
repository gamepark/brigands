import GameState from '../GameState'
import GameView from '../GameView'
import {isThief, isThiefState, ThiefState} from '../PlayerState'
import DistrictName from '../types/DistrictName'
import {isPartnerView} from '../types/Partner'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type GainGold = {
    type:MoveType.GainGold
    gold:number
    player:ThiefState
    district:DistrictName
}

export default GainGold

export function gainGold(state:GameState | GameView, move:GainGold){

    if (move.district === DistrictName.Treasure){
        if (state.city.find(d => d.name === DistrictName.Treasure)!.dice === undefined) {
            state.city.find(d => d.name === DistrictName.Treasure)!.dice = [move.gold]
        }
        state.city.find(d => d.name === DistrictName.Treasure)!.gold! -= move.gold      
    }

    const player = state.players.find(p => p.role === move.player.role)!

    if (isThiefState(player)){
        player.gold += move.gold
    }
    if (isThief(player))
    player.partners.find(part => !isPartnerView(part) && part.district === move.district && part.solvingDone !== true)!.solvingDone = true
}

export function isGainGold(move: Move | MoveView): move is GainGold {
    return move.type === MoveType.GainGold
  }