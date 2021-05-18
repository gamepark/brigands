import PlayerState from './PlayerState'
import District from './types/District'
import Phase from './types/Phase'

type GameState = {
  players: PlayerState[]
  city: number[]
  dice:number[]
  phase?:Phase
  eventDeck:number[]
  event?:number
  districtResolved?:number
}

export default GameState