import District from './districts/District'
import Phase from './phases/Phase'
import PlayerState from './PlayerState'

type GameState = {
  players: PlayerState[]
  city: District[]
  phase?: Phase
  eventDeck: number[]
  event: number
  districtResolved?: number
  tutorial: boolean
}

export default GameState