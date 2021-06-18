import GameState from "../GameState";
import GameView from "../GameView";
import { isThiefState, ThiefState } from "../PlayerState";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";
import {isThisPartnerHasStealToken} from '../Brigands'
import { isNotThiefView, ThiefView } from "../types/Thief";
import DistrictName from "../types/DistrictName";
import { placeToken } from "./PlaceToken";
import { rollDice } from "../material/Dice";
import { isPartnerView } from "../types/Partner";

type ResolveStealToken = {
    type:MoveType.ResolveStealToken
    steals:Steal[]
}

export type ResolveStealTokenView = ResolveStealToken & {
    steals:Steal[]
}

type Steal = {
    thief:PlayerRole
    victim:PlayerRole
    gold:number
}

export default ResolveStealToken

export function resolveStealToken(state:GameState| GameView, {steals}:ResolveStealToken){

    steals.forEach(steal => {

        const thief = state.players.find(p => p.role === steal.thief)! as (ThiefState | ThiefView) ; 
        const victim = state.players.find(p => p.role === steal.victim)! as (ThiefState | ThiefView) ;

        if (isNotThiefView(thief)){
            thief.gold += steal.gold
        }
        if (isNotThiefView(victim)){
            console.log("prise d'or chez la victime. Vicitm: ", victim)
            victim.gold = Math.max(victim.gold-steal.gold, 0)
        }
    }) ;

    for (const player of state.players){
        if (isThiefState(player)){
            player.tokens.steal = player.tokens.steal.filter(ts => {
                if (ts === -1){
                    return true
                } else {
                    const partner = player.partner[ts]
                    return isPartnerView(partner) || partner.district !== state.city[state.districtResolved!].name
                }
            })
        }
    }
    
}

export function createSteals(state:GameState):Steal[]{

    const districtResolved:DistrictName = state.city[state.districtResolved!].name
    const thieves:ThiefState[] = (state.players.filter(isThiefState) as ThiefState[]) ;
    const resultArray:Steal[] = []

    thieves.forEach(thief => {
        if (thief.partner.some((part, index) => part.district === districtResolved && thief.tokens.steal.some(ts => ts === index))){
            // thief has a Steal Token to use
            if (thieves.filter(p => p.partner.some(part => part.district === districtResolved)).length !== 1){
                // thief isn't alone on the district
                if (thieves.filter(p => p.partner.some(part => part.district === districtResolved)).length === 2){
                    const victim:ThiefState = thieves.filter(p => p.partner.some(part => part.district === districtResolved)).find(p => p.role !== thief.role)!
                    // thief meet only one player
                    if (victim.partner.filter(part => part.district === districtResolved).length === 1) {
                        //There is only one victim, not 2 or 3
                        resultArray.push({thief:thief.role, victim:victim.role, gold:Math.min(3, victim.gold)})
                    } else {
                        // There is more victims
                        resultArray.push({thief:thief.role, victim:victim.role, gold:Math.min(victim.partner.filter(part => part.district === districtResolved).length, victim.gold)})
                    }
                } else {
                    // Thief meet more than one player
                    const victims : ThiefState[] = thieves.filter(p => p.partner.some(part => part.district === districtResolved))
                    victims.forEach(victim => resultArray.push({thief:thief.role, victim:victim.role, gold:Math.min(victim.gold, victim.partner.filter(part => part.district === districtResolved).length)}))
                }
            }
        }
    })
    
    return resultArray
}