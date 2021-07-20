import PlayerState from './PlayerState'
import District from './districts/District'
import Phase from './phases/Phase'

type GameState = {
  players: PlayerState[]
  city: District[]
  phase?:Phase
  eventDeck:number[]
  event:number
  districtResolved?:number
  tutorial:boolean
}

export default GameState