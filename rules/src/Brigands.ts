import {SecretInformation, SimultaneousGame} from '@gamepark/rules-api'
import GameState from './GameState'
import GameView from './GameView'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import {isGameOptions, BrigandsOptions, BrigandsPlayerOptions} from './BrigandsOptions'
import Phase from './types/Phase'
import PlayerState, { isPrinceState, isThiefState, ThiefState } from './PlayerState'
import DistrictName from './types/DistrictName'
import District from './types/District'
import { shuffle } from 'lodash'
import { EventArray } from './material/Events'
import { DistrictArray } from './material/Districts'
import PlayerRole from './types/PlayerRole'
import Partner, { getPartnersView } from './types/Partner'
import { drawEvent } from './moves/DrawEvent'
import PlacePartner, { placePartner } from './moves/PlacePartner'
import { tellYouAreReady } from './moves/TellYouAreReady'
import { moveOnNextPhase } from './moves/MoveOnNextPhase'
import PlacePatrol, { placePatrol } from './moves/PlacePatrol'
import { revealPartnersDistricts } from './moves/RevealPartnersDistricts'
import TokenAction from './types/TokenAction'
import { rollDice } from './material/Dice'
import Event from './types/Event'
import BetGold from './moves/BetGold'
import TakeToken from './moves/TakeToken'

export default class Brigands extends SimultaneousGame<GameState, Move, PlayerRole>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerRole> {

  constructor(state: GameState)
  constructor(options: BrigandsOptions)
  constructor(arg: GameState | BrigandsOptions) {
    if (isGameOptions(arg)) {

      const game:GameState = {
        players: setupPlayers(arg.players),
        city: setupCity(),
        phase:Phase.NewDay,
        eventDeck:setupEventDeck(),
        event:-1,
        districtResolved:undefined
      }
      game.city.find(d => d.name === DistrictName.Treasure)!.gold = 0

      super(game)
    } else {
      super(arg)
    }
  }



  /**
   * @return True when game is over
   */
  isOver(): boolean {
    return this.state.phase === undefined
  }
  isActive(playerId:PlayerRole):boolean{
    const player = this.state.players.find(p => p.role === playerId)
    if (!player) return false
    switch (this.state.phase){
      case Phase.Planning:
        return isThiefState(player) && player.isReady === false
      case Phase.Patrolling:
        return this.state.players.find(isPrinceState)!.abilities[1] === false ? isPrinceState(player) && player.isReady === false : isThiefState(player) && player.isReady == false
      case Phase.Solving:
        if (!isThiefState(player) || (this.state.districtResolved !== DistrictName.Harbor && this.state.districtResolved !== DistrictName.Tavern)){
          return false
        } else {
          return player.partner.some(p => p.district === this.state.districtResolved)
        }
      default :
        return false
      }
  }

  getLegalMoves(role:PlayerRole): Move[] {
    const player = this.state.players.find(p => p.role === role)
    if (player === undefined){
      return []
    } else if (isPrinceState(player)){
      if (this.state.phase === Phase.Patrolling){
        if (player.patrols.some(pat => pat === -1)){
          const placePatrolsMoves:PlacePatrol[] = []
          for (let i=1;i<8;i++){
            player.patrols.forEach((pat, index) => pat === -1 && !player.patrols.includes(i) && placePatrolsMoves.push({type:MoveType.PlacePatrol, district:i,patrolNumber:index}))
          }
          return placePatrolsMoves
        } else {
          return [{type:MoveType.TellYouAreReady,playerId:player.role}]
        }

      } else {
        return []
      }
    } else {    //isThief
      if (this.state.phase === Phase.Planning){
        if(player.partner.some(part => part.district === undefined)){
          const placePartnersMoves:PlacePartner[] = []
          for (let i=2;i<8;i++){
            player.partner.forEach((part, index) => part.district === undefined && placePartnersMoves.push({type:MoveType.PlacePartner,playerId:player.role, district:i, partnerNumber:index}))
          }
          return placePartnersMoves
        } else {
          return [{type:MoveType.TellYouAreReady, playerId:player.role}]
        }
      } else if (this.state.phase === Phase.Solving && this.state.districtResolved !== undefined ){
        if (this.state.city[this.state.districtResolved].name !== DistrictName.Tavern && this.state.city[this.state.districtResolved].name !== DistrictName.Harbor){
          return []
        } else {
          if (this.state.city[this.state.districtResolved].name === DistrictName.Tavern){
            const tavernMoves:BetGold[] = []
            for (let i=0;i<(this.state.players.find(p => p.role === role)!.gold);i++){
              tavernMoves.push({type:MoveType.BetGold, role, gold:i})
            }
            return tavernMoves
          } else {
            const harborMoves:TakeToken[] = []
            const takeableTokens:TokenAction[] = getTokensInBank(this.state.players.find(p => p.role === role) as ThiefState)

            for (let i=0;i<=takeableTokens.length;i++){
              harborMoves.push({type:MoveType.TakeToken, role, token:takeableTokens[i]})
            }
            return harborMoves
          }
        }
      } else {
        return []
      }
    }
  }

  /**
   * This is the one and only play where you will update the game's state, depending on the move that has been played.
   *
   * @param move The move that should be applied to current state.
   */
  play(move: Move): void {
    switch (move.type) {
      case MoveType.DrawEvent:
        return drawEvent(this.state)
      case MoveType.PlacePartner:
        return placePartner(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.MoveOnNextPhase:
        return moveOnNextPhase(this.state)
      case MoveType.PlacePatrol:
        return placePatrol(this.state, move)
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistricts(this.state)
    }
  }

  
  // VERY IMPORTANT: you should never change the game state in here.
  // Indeed, getAutomaticMove will never be called in replays, for example.

  getAutomaticMove(): void | Move {

      if (this.state.phase === Phase.NewDay){
        return {type:MoveType.DrawEvent}
      }
      if (this.state.phase === Phase.Planning &&  (this.state.players.filter(isThiefState) as ThiefState[]).every(p => p.isReady === true)){
        return {type:MoveType.MoveOnNextPhase}
      }
      if (this.state.phase === Phase.Patrolling && this.state.players.find(isPrinceState)!.isReady === true){
        return {type:MoveType.RevealPartnersDistricts}
      }
      if (this.state.districtResolved !== undefined && (this.state.city[this.state.districtResolved].name !== DistrictName.Tavern && this.state.city[this.state.districtResolved].name !== DistrictName.Harbor)) {
        const districtEvent:Event = EventArray[this.state.event]
        const actualDistrict : District = this.state.city[this.state.districtResolved]
        switch(actualDistrict.name){

          case DistrictName.Market :
            const thiefOnMarket:ThiefState | undefined = (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.find(part => part.district === DistrictName.Market))
            if ( thiefOnMarket === undefined){    // Plus de comparses sur le marché
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else if (actualDistrict.dice === undefined){    // Aucun dé lancé
              return {type:MoveType.ThrowDice, dice:districtEvent.district === DistrictName.Market ? rollDice(2) : rollDice(1), district:actualDistrict.name}
            } else if (thiefOnMarket.partner.find(part => part.district === DistrictName.Market)!.solvingDone === false){     // Le comparse n'a pas encore pris son argent
              return {type:MoveType.GainGold, gold:actualDistrict.dice!.reduce((acc, vc) => acc + vc), player:thiefOnMarket}
            } else {    // Le comparse doit rentrer à la maison
              return {type:MoveType.TakeBackPartner, thief:thiefOnMarket, district:actualDistrict.name}
            }

          case DistrictName.Palace :
            let partnersOnPalace:number = 0 ;
            (this.state.players.filter(isThiefState) as ThiefState[]).forEach(p => partnersOnPalace += p.partner.filter(part => part.district === DistrictName.Palace).length)
            if (partnersOnPalace > (districtEvent.district === DistrictName.Palace ? 3 : 2)){
              return // return PutPartnerInPrison
            } else if (partnersOnPalace === 0){
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else {
              const thiefOnPalace:ThiefState = (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.find(part => part.district === DistrictName.Palace)!)!
              if (thiefOnPalace.partner.find(part => part.district === DistrictName.Palace)!.solvingDone === false){
                return {type:MoveType.GainGold, gold:5, player:thiefOnPalace}
              } else {
                return {type:MoveType.TakeBackPartner, thief:thiefOnPalace, district:actualDistrict.name}
              }
            }
          case DistrictName.CityHall : 
            const partnersOnCityHall:Partner[] = [] ;
            (this.state.players.filter(isThiefState) as ThiefState[]).forEach(p => p.partner.forEach(part => part.district === actualDistrict.name && partnersOnCityHall.push(part)))  ;
            let countPartnersOnCityHall:number = partnersOnCityHall.length ;
            if (countPartnersOnCityHall === 0){
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else if (actualDistrict.dice == undefined){
              if (partnersOnCityHall.every(p => p.solvingDone === true)){
                return {type:MoveType.TakeBackPartner, thief: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))! , district:actualDistrict.name}
              } else {
                return {type:MoveType.ThrowDice, dice:rollDice(districtEvent.numberOfDice!+2), district:actualDistrict.name}
              }
            } else if (partnersOnCityHall.every(p => p.solvingDone === true)){
              return {type:MoveType.SpareGoldOnTreasure, gold:actualDistrict.dice.reduce((acc, cv) => acc+cv)%countPartnersOnCityHall,district:actualDistrict.name}
            } else {
              return {type:MoveType.GainGold, gold:actualDistrict.dice.reduce((acc, cv) => acc+cv)/countPartnersOnCityHall, player: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))! }
            }

          case DistrictName.Treasure :
            const partnersOnTreasure:Partner[] = [] ;
            (this.state.players.filter(isThiefState) as ThiefState[]).forEach(p => p.partner.forEach(part => part.district === actualDistrict.name && partnersOnTreasure.push(part)))  ;
            let countPartnersOnTreasure:number = partnersOnTreasure.length ;
            if (countPartnersOnTreasure === 0){
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else if (partnersOnTreasure.every(p => p.solvingDone === true)){
              return {type:MoveType.TakeBackPartner, thief: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))! , district:actualDistrict.name}
            } else {
              if (actualDistrict.dice === undefined){
                return {type:MoveType.GainGold, gold:actualDistrict.gold!/countPartnersOnTreasure, player: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))!, district:actualDistrict.name }
              } else {
                return {type:MoveType.GainGold, gold:actualDistrict.dice[0], player: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))!, district:actualDistrict.name}
              }
            }

          case DistrictName.Jail :
            const partnersOnJail:Partner[] = [] ;
            (this.state.players.filter(isThiefState) as ThiefState[]).forEach(p => p.partner.forEach(part => part.district === actualDistrict.name && partnersOnJail.push(part)));
            if (partnersOnJail.every(p => p.solvingDone === true)){
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else if (this.state.city.find(d => d.name === actualDistrict.name)!.dice === undefined){
              return {type:MoveType.ThrowDice, dice:rollDice(1), district:actualDistrict.name}
            } else if (this.state.city.find(d => d.name === actualDistrict.name)!.dice![0] === 4) {
              return {type:MoveType.TakeBackPartner, thief: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))! , district:actualDistrict.name}
            } else {
              return {type:MoveType.SolvePartner, 
                      thief: (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))! ,
                      partnerNumber:(this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.some(part => part.district === actualDistrict.name))!.partner.findIndex(part => part.district === DistrictName.Jail && part.solvingDone !== true)!}
            }

          case DistrictName.Tavern :    // Actually simultaneous Phase, but can be better if sequatialized for animations ?
            if ((this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.find(part => part.district === DistrictName.Tavern)) === undefined){
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else {
              const anyThiefWhoBet:ThiefState | undefined = (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined))
              if (anyThiefWhoBet === undefined){
                return
              } else if (actualDistrict.dice === undefined){
                return {type:MoveType.ThrowDice, dice:rollDice(1), district:actualDistrict.name}
              } else if (anyThiefWhoBet.partner.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.solvingDone === true){
                return {type:MoveType.TakeBackPartner, thief: anyThiefWhoBet , district:actualDistrict.name}
              } else {
                return {type:MoveType.GainGold, gold:betResult(anyThiefWhoBet.partner.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.goldForTavern!,actualDistrict.dice[0], EventArray[this.state.event].district === DistrictName.Tavern), player: anyThiefWhoBet, district:actualDistrict.name}
              }
            }
          
          case DistrictName.Harbor :
            if ((this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.find(part => part.district === DistrictName.Harbor)) === undefined){
              return {type:MoveType.MoveOnDistrictResolved, districtResolved:this.state.districtResolved}
            } else {
              const anyThiefWhoTookTokens:ThiefState | undefined = (this.state.players.filter(isThiefState) as ThiefState[]).find(p => p.partner.find(part => part.district === DistrictName.Harbor && part.tokensTaken === (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))
              if (anyThiefWhoTookTokens){
                return {type:MoveType.TakeBackPartner, thief: anyThiefWhoTookTokens , district:actualDistrict.name}
              }
            }
        } 
      } 
    return
  }

  getView(playerId?: PlayerRole): GameView {
    return {...this.state,
       eventDeck: this.state.eventDeck.length, 
       players: this.state.players.map(player => {
         if (isPrinceState(player) || player.role === playerId){
          return player
         } else {
           const {gold, partner, ...thiefView} = player
           return {
             ...thiefView, 
             partner:this.state.phase === Phase.Solving ? partner : getPartnersView(partner)
           }
         }
       })
      }
  }


  getPlayerView(playerId: PlayerRole): GameView {
    console.log(playerId)
    return this.getView(playerId)
  }

  /**
   * If you game has incomplete information, sometime you need to alter a Move before it is sent to the players and spectator.
   * For example, if a card is revealed, the id of the revealed card should be ADDED to the Move in the MoveView
   * Sometime, you will hide information: for example if a player secretly choose a card, you will hide the card to the other players or spectators.
   *
   * @param move The move that has been played
   * @return What a person should know about the move that was played
   */
  getMoveView(move: Move, playerId?: PlayerRole): MoveView {
    switch (move.type) {
      case MoveType.DrawEvent:
        return {...move, event: this.state.event}
      case MoveType.PlacePartner :
        if (playerId === move.playerId){
          return move
        } else {
          return {type:MoveType.PlacePartner,playerId:move.playerId,partner:getPartnersView((this.state.players.find(p=>p.role === move.playerId) as ThiefState).partner) }
        }
      case MoveType.RevealPartnersDistricts:
        const partnersArray:Partner[][] = []
        this.state.players.forEach(player => {
          if (player.role !== PlayerRole.Prince){
            partnersArray.push((player as ThiefState).partner)
          }
        })

        return {type:MoveType.RevealPartnersDistricts, partnersArray}
      default:
        return move
    }
  }

  /**
   * If you game has secret information, sometime you need to alter a Move depending on which player it is.
   * For example, if a card is drawn, the id of the revealed card should be ADDED to the Move in the MoveView, but only for the played that draws!
   * Sometime, you will hide information: for example if a player secretly choose a card, you will hide the card to the other players or spectators.
   *
   * @param move The move that has been played
   * @param playerId Identifier of the player seeing the move
   * @return What a person should know about the move that was played
   */
  getPlayerMoveView(move: Move, playerId: PlayerRole): MoveView {
    return this.getMoveView(move, playerId)
  }
}

function setupPlayers(players: BrigandsPlayerOptions[]): PlayerState[]{

  if (players.every(p => p.id !== PlayerRole.Prince)){
    throw 'ERROR : No Prince in the composition !';       // Renvoyer une erreur
  } else {
    return players.map((options) => (
    
      options.id === PlayerRole.Prince 
      ? {
          role:options.id,
          gold:0,
          isReady:false,
          victoryPoints : 0,
          patrols : [-1,-1],
          abilities : [false,false,false]
        } 
      : {
          role:options.id,
          gold:2,
          isReady:false,
          partner:[{},{},{}],
          tokens:{steal:[],kick:[],move:[]},
        }
    
    )) 
  }

}

function betResult(goldBet:number, dice:number, isEvent:boolean):number{
    if(isEvent === true){
      return dice[0] === 2 ? 0 : goldBet*3
    } else {
      switch(dice[0]){
        case 2 :
          return 0
        case 3:
          return goldBet*2
        case 4:
          return goldBet*4
        default:
          return 0
      }
    }
}

function setupCity():District[]{
  const districtArray = Array.from(DistrictArray.keys())
  const jail:number = districtArray.shift()!
  const result:number[] = shuffle(districtArray)
  result.unshift(jail)
  return result.map((districtKey) => ({name:DistrictArray[districtKey].name, gold:DistrictArray[districtKey].name === DistrictName.Treasure ? 0 : undefined}))

}

function setupEventDeck():number[]{
  const result = shuffle(Array.from(EventArray.keys()))
  return result.slice(0,6)
}

function getTokensInBank(thief:ThiefState):TokenAction[]{
  const result:TokenAction[] = []
  if (thief.tokens.steal.length > 0){
    result.push(TokenAction.Stealing)
    if (thief.tokens.steal.length > 1){
      result.push(TokenAction.Stealing)
    }
  }

  if (thief.tokens.kick.length > 0){
    result.push(TokenAction.Kicking)
    if (thief.tokens.kick.length > 1){
      result.push(TokenAction.Kicking)
    }
  }

  if (thief.tokens.move.length > 0){
    result.push(TokenAction.Fleeing)
    if (thief.tokens.move.length > 1){
      result.push(TokenAction.Fleeing)
    }
  }

  return result

}