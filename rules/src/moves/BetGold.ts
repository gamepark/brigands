import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isThiefState} from '../PlayerState'
import DistrictName from '../districts/DistrictName'
import {isPartnerView} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type BetGold = {
    type:MoveType.BetGold
    role:PlayerRole
    gold:number
}

export default BetGold

export function betGold(state:GameState | GameView, move:BetGold){

    const player = getThieves(state).find(p => p.role === move.role)!;

    player.partners.find(p => !isPartnerView(p) && p.district === DistrictName.Tavern && p.goldForTavern === undefined)!.goldForTavern = move.gold
    if (isThiefState(player)){
        player.gold -= move.gold
    }
}

export function isBetGold(move: Move | MoveView): move is BetGold {
    return move.type === MoveType.BetGold
  }
