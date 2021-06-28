import GameState from '../GameState'
import GameView, {getPrince, getThieves} from '../GameView'
import DistrictName from '../types/DistrictName'
import {isPartnerView} from '../types/Partner'
import MoveType from './MoveType'

type JudgePrisoners = {
    type:MoveType.JudgePrisoners  
}

export default JudgePrisoners

export function judgePrisoners(state:GameState | GameView){
    const prince = getPrince(state)
    const thieves = getThieves(state)
    prince.abilities[0] = true
    prince.patrols[prince.patrols.findIndex(pat => pat === -1)] = -2
    
    thieves.forEach(t => t.partners.forEach(partner => {
        if (!isPartnerView(partner) && partner.district === DistrictName.Jail){
            delete partner.district
            prince.victoryPoints +=2
        }
    }))
}