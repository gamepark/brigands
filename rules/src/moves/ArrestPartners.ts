import {isThisPartnerHasKickToken, isThisPartnerHasMoveToken, isThisPartnerHasStealToken} from '../Brigands'
import GameState from '../GameState'
import GameView, {getPrince, isGameView} from '../GameView'
import {isThief, isThiefState} from '../PlayerState'
import DistrictName from '../types/DistrictName'
import {getPartners, isPartner} from '../types/Partner'
import MoveType from './MoveType'

type ArrestPartners = {
    type:MoveType.ArrestPartners
}

export default ArrestPartners

export function arrestPartners(state:GameState | GameView){

    const prince = getPrince(state)
    const thieves = isGameView(state) ? state.players.filter(isThief) : state.players.filter(isThiefState)

    thieves.forEach(p => getPartners(p).filter(isPartner).forEach((part, index) => {
        if (part.district === state.city[state.districtResolved!].name){
            part.district = DistrictName.Jail ;
            prince.victoryPoints++
            if (isThisPartnerHasStealToken(p, index)){
                p.tokens.steal.splice(p.tokens.steal.findIndex(ts => ts === index),1)
            } else if (isThisPartnerHasKickToken(p, index)){
                p.tokens.kick.splice(p.tokens.kick.findIndex(tk => tk === index),1)
            } else if (isThisPartnerHasMoveToken(p, index)){
                p.tokens.steal.splice(p.tokens.move.findIndex(tm => tm === index),1)
            }
        }
    }))

    if(prince.patrols.find(p => p === state.city[state.districtResolved!].name)){
        prince.patrols[getPrince(state).patrols.findIndex(p => p === state.city[state.districtResolved!].name)] = -1
        if (prince.abilities[1] === state.city[state.districtResolved!].name){
            prince.abilities[1] = false
        }
    }
}

