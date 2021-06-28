import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import DistrictName from '../types/DistrictName'
import {isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import TokenAction from '../types/TokenAction'
import MoveType from './MoveType'

type TakeToken = {
    type:MoveType.TakeToken
    role:PlayerRole
    token:TokenAction
}

export default TakeToken

export function takeToken(state:GameState | GameView, move:TakeToken){
    const thief = getThieves(state).find(p => p.role === move.role)!
    if (state.city[state.districtResolved!].name === DistrictName.Jail){
        thief.partners.find(p => isPartner(p) && p.district === state.city[state.districtResolved!].name && p.tokensTaken === undefined)!.tokensTaken = 1
    } else {
        if (thief.partners.find(p => isPartner(p) && p.district === state.city[state.districtResolved!].name)!.tokensTaken === undefined){
            thief.partners.find(p => isPartner(p) && p.district === state.city[state.districtResolved!].name)!.tokensTaken = 1
        } else {
            thief.partners.find(p => isPartner(p) && p.district === state.city[state.districtResolved!].name)!.tokensTaken!++
        }
    }

    switch(move.token){
        case TokenAction.Stealing:
            thief.tokens.steal.push(-1)
            break
        case TokenAction.Kicking:
            thief.tokens.kick.push(-1)
            break
        case TokenAction.Fleeing:
            thief.tokens.move.push(-1)
            break
    }
    
}