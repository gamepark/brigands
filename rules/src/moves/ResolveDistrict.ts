import GameState from "../GameState";
import GameView from "../GameView";
import { rollDice } from "../material/Dice";
import { EventArray } from "../material/Events";
import { isThiefState, ThiefState } from "../PlayerState";
import DistrictName from "../types/DistrictName";
import Partner from "../types/Partner";
import Phase from "../types/Phase";
import PlayerRole from "../types/PlayerRole";
import TokenAction from "../types/TokenAction";
import MoveType from "./MoveType";

type ResolveDistrict = {
    type:MoveType.ResolveDistrict
    district:DistrictName
    role?:PlayerRole
    gold?:number
    tokenActionArray?:TokenAction[]
    diceResult?:number[]
}

export default ResolveDistrict

export function resolveDistrict(state:GameState | GameView, move:ResolveDistrict){
    console.log("-----------------Dans ResolveDistrict !-----------------")
    switch(move.district){
        case DistrictName.Jail:
            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => 
                player.partner.filter(partner => partner.district === DistrictName.Jail).forEach(partner => (rollDice(1)[0] === 4) && (delete partner.district))
            )
            // Resolve Patrols ? Maybe a Power in Phase.Patrolling ?
            moveOnNextDistrict(state, state.districtResolved!)
            break

        case DistrictName.CityHall:
            const diceToRoll :number = EventArray[state.event].district === DistrictName.CityHall ? EventArray[state.event].numberOfDice! + 2 : 2
            state.city[state.districtResolved!].dice = rollDice(diceToRoll)                                                                                                                  // Tirage de deux dés
            const partnersOnCityHall:PlayerRole[] = [];                                                                                                                             // Joueurs prétendant au partage
            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => 
                player.partner.filter(partner => partner.district === DistrictName.CityHall).forEach(_ => partnersOnCityHall.push(player.role)))                                    // Init des joueurs prétendant au partage
            const sharedPartsCityHall = Math.floor(state.city[state.districtResolved!].dice!.reduce((acc, vc) => acc + vc)/partnersOnCityHall.length)                                                                 // Part à donner à chaque comparse
            state.city.find(d => d.name === DistrictName.Treasure)!.gold = state.city[state.districtResolved!].dice!.reduce((acc, vc) => acc + vc) % partnersOnCityHall.length      // Reste à poser sur le trésor
            partnersOnCityHall.forEach(role => (state.players.filter(isThiefState) as ThiefState[]).find(p => p.role === role)!.gold += sharedPartsCityHall )                               // Attribution des parts
            delete state.city[state.districtResolved!].dice ;                                                                                                                       // Clean

            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => 
                player.partner.filter(partner => partner.district === DistrictName.CityHall).forEach(partner => delete partner.district))                                           // Clean

            moveOnNextDistrict(state, state.districtResolved!) 
            break

        case DistrictName.Market:
            const isMarketEvent:number = EventArray[state.event].district === DistrictName.Market ? 1 : 0 ;
            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => {
                player.partner.filter(partner => partner.district === DistrictName.Market).forEach(partner => {
                    state.city.find(c => c.name === DistrictName.Market)!.dice = rollDice(1+isMarketEvent)
                    player.gold += state.city.find(c => c.name === DistrictName.Market)!.dice![0]
                    delete partner.district
                    console.log("player :",player.role,"get",state.city.find(c => c.name === DistrictName.Market)!.dice![0],"gold")
                    delete state.city.find(c => c.name === DistrictName.Market)!.dice
                })            
                
            })
            moveOnNextDistrict(state, state.districtResolved!)
            break

        case DistrictName.Palace:
            const partnersOnPalace:{partner:Partner, role:PlayerRole}[] = [];
            const isPalaceEvent:number = EventArray[state.event].district === DistrictName.Palace ? 1 : 0 ;
            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => 
                player.partner.forEach(partner => partner.district === DistrictName.Palace && partnersOnPalace.push({partner, role:player.role})))
            if (partnersOnPalace.length>(2 + isPalaceEvent)){
                for (const item of partnersOnPalace){
                    (state.players.filter(isThiefState) as ThiefState[]).find(p => p.role === item.role)!.partner.find(p => p.district === item.partner.district)!.district = DistrictName.Jail    
                }
            } else {
                for (const item of partnersOnPalace){
                    console.log("+5 gold for : ", (state.players.filter(isThiefState) as ThiefState[]).find(p => p.role === item.role)!) ;
                    (state.players.filter(isThiefState) as ThiefState[]).find(p => p.role === item.role)!.gold += 5
                    delete (state.players.filter(isThiefState) as ThiefState[]).find(p => p.role === item.role)!.partner.find(p => p.district === item.partner.district)!.district
                }
                
            }
            (moveOnNextDistrict(state, state.districtResolved!))
            break

        case DistrictName.Treasure:
            const partnersOnTreasure:PlayerRole[] = [];                                                                                                                             // Joueurs prétendant au partage
            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => 
                player.partner.filter(partner => partner.district === DistrictName.Treasure).forEach(_ => partnersOnTreasure.push(player.role)))                                    // Init des joueurs prétendant au partage
            const sharedPartsTreasure = Math.floor(state.city[state.districtResolved!].gold!/partnersOnTreasure.length)  
            state.city[state.districtResolved!].gold! -= sharedPartsTreasure*partnersOnTreasure.length                                                               // Part à donner à chaque comparse
            partnersOnTreasure.forEach(role => (state.players.filter(isThiefState) as ThiefState[]).find(p => p.role === role)!.gold += sharedPartsTreasure ) ;                              // Attribution des parts

            (state.players.filter(isThiefState) as ThiefState[]).forEach(player => 
                player.partner.filter(partner => partner.district === DistrictName.Treasure).forEach(partner => delete partner.district))                                           // Clean

            moveOnNextDistrict(state, state.districtResolved!) 
            break

        case DistrictName.Tavern:
            (state.players.find(p => p.role === move.role) as ThiefState).gold -= move.gold!
            state.city[state.districtResolved!].dice = rollDice(1)
            const isTavernEvent:number = EventArray[state.event].district === DistrictName.Tavern ? 1 : 0
            switch(state.city[state.districtResolved!].dice![0]){
                case 3 :
                    (state.players.find(p => p.role === move.role) as ThiefState).gold += move.gold!*(2+isTavernEvent)
                    break
                case 4 :
                    (state.players.find(p => p.role === move.role) as ThiefState).gold += move.gold!*3
                    break
            }
            delete state.city[state.districtResolved!].dice
            delete (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Tavern)!.district;
            (state.players.find(p => p.role === move.role) as ThiefState).partner.filter(p => p.district === DistrictName.Tavern).length === 0 && (state.players.find(p => p.role === move.role) as ThiefState).isReady === true
            break

        case DistrictName.Harbor:
            move.tokenActionArray!.forEach(token => {
                switch(token){
                    case TokenAction.Stealing:
                        (state.players.find(p => p.role === move.role) as ThiefState).tokens.steal.push(-1)
                        break
                    case TokenAction.Kicking:
                        (state.players.find(p => p.role === move.role) as ThiefState).tokens.kick.push(-1)
                        break
                    case TokenAction.Fleeing:
                        (state.players.find(p => p.role === move.role) as ThiefState).tokens.move.push(-1)
                }
            })
            
            delete (state.players.find(p => p.role === move.role) as ThiefState).partner.find(p => p.district === DistrictName.Harbor)!.district;
            (state.players.find(p => p.role === move.role) as ThiefState).partner.filter(p => p.district === DistrictName.Harbor).length === 0 && (state.players.find(p => p.role === move.role) as ThiefState).isReady === true
        }

        

}

function moveOnNextDistrict(state:GameState | GameView, districtResolved:number){
    if (districtResolved === 6){
        delete state.districtResolved 
        state.phase = Phase.NewDay
    } else {
        state.districtResolved! ++
    }
}

