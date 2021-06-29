import PlayerState from './PlayerState'
import District from './types/District'
import Phase from './phases/Phase'

type GameState = {
  players: PlayerState[]
  city: District[]
  phase?:Phase
  eventDeck:number[]
  event:number
  districtResolved?:number
  readyToKickPartners?:true
}

export default GameState