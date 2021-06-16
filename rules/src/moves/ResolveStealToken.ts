import GameState from "../GameState";
import GameView from "../GameView";
import { isThiefState, ThiefState } from "../PlayerState";
import PlayerRole from "../types/PlayerRole";
import MoveType from "./MoveType";
import {isThisPartnerHasStealToken} from '../Brigands'
import { isNotThiefView, ThiefView } from "../types/Thief";

type ResolveStealToken = {
    type:MoveType.ResolveStealToken
}

export default ResolveStealToken

export function resolveStealToken(state:GameState | GameView){
    const thieves:ThiefState[] = (state.players.filter(isThiefState) as ThiefState[])
    const resolvingArray:{role:PlayerRole, deltaGold:number}[] = []
    thieves.map(thief => resolvingArray.push({role:thief.role, deltaGold:0}))

    const colorsOfPartnersOnDistrict:PlayerRole[] = []
    const colorsOfThievesWhoHaveToSteal:PlayerRole[] = []
    thieves.forEach(p => p.partner.forEach(part => part.district === state.city[state.districtResolved!].name && colorsOfPartnersOnDistrict.push(p.role)))
    thieves.forEach(p => p.partner.forEach((part, index) => part.district === state.city[state.districtResolved!].name && isThisPartnerHasStealToken(p, index) && colorsOfThievesWhoHaveToSteal.push(p.role)))

    if ([...new Set(colorsOfPartnersOnDistrict)].length === 2){         // 1vs1 situation, don't need resolvingArray
        colorsOfThievesWhoHaveToSteal.forEach(stealer => {
        const vulnerableOtherPlayers: PlayerRole[] = colorsOfPartnersOnDistrict.filter(color => color !== stealer)        
            // const minGold:number = Math.min(thieves.find(p => p.role === vulnerableOtherPlayers[0])!.gold,3) ; 
            const minGold = 3
            const playerStealer = state.players.find(p => p.role === stealer) as ThiefState | ThiefView ;
            const playerVictim = state.players.find(p => p.role === vulnerableOtherPlayers[0]) as ThiefState | ThiefView ;

            if(isNotThiefView(playerStealer)){
                playerStealer.gold += minGold ;
            }
            if(isNotThiefView(playerVictim)){
                playerVictim.gold -= minGold ;
            }
        }) 
    } else {
        colorsOfThievesWhoHaveToSteal.forEach(stealer => {          // XvsX situation, must use resolvingArray

            const vulnerableOtherPlayers: PlayerRole[] = colorsOfPartnersOnDistrict.filter(color => color !== stealer)
            vulnerableOtherPlayers.forEach(vulnerable => {
                resolvingArray.find(p => p.role === stealer)!.deltaGold ++
                resolvingArray.find(p => p.role === vulnerable)!.deltaGold -- 
            })
        }) 
        
        resolvingArray.forEach(thief => {
            
            const player = state.players.find(p => p.role === thief.role) as ThiefState | ThiefView ;

            if(isNotThiefView(player)){
                player.gold += thief.deltaGold ;
                if (player.gold < 0){
                    player.gold = 0
                }
            }
        })
    }

    thieves.forEach(p => p.partner.forEach((part, index) => {                                       // Return of the tokens in bank
        if (part.district === state.city[state.districtResolved!].name && p.tokens.steal.some(t => t === index)){
            delete p.tokens.steal[p.tokens.steal.findIndex(ts => ts === index)]
        }
    }))

}