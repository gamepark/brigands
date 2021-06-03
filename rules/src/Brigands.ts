import {GameSpeed, SecretInformation, SimultaneousGame} from '@gamepark/rules-api'
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
import { ThiefView } from './types/Thief'

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