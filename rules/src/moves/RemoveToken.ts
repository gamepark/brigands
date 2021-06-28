import {isThisPartnerHasKickToken} from '../Brigands'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import TokenAction from '../types/TokenAction'
import MoveType from './MoveType'

type RemoveToken = {
    type:MoveType.RemoveToken
    role:PlayerRole
    tokenAction:TokenAction
    indexPartner:number
}

export default RemoveToken

export function removeToken(state:GameState | GameView, move:RemoveToken){
    const player = getThieves(state).find(p => p.role === move.role)!
    switch(move.tokenAction){
        case TokenAction.Stealing : {
            player.tokens.steal.splice(player.tokens.steal.indexOf(move.indexPartner), 1)
            break
        }
        case TokenAction.Kicking : {
            player.tokens.kick.splice(player.tokens.kick.indexOf(move.indexPartner), 1)
            break
        }
        case TokenAction.Fleeing : {
            player.tokens.move.splice(player.tokens.move.indexOf(move.indexPartner), 1)
            break
        }

    }

    if (state.readyToKickPartners === true && getThieves(state).every(p => p.partners.every((part, index) => isPartner(part) && part.district !== state.city[state.districtResolved!].name || !isThisPartnerHasKickToken(p, index) ))){
        delete state.readyToKickPartners
    }

    player.isReady = false
}
