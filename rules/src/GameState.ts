import District from './districts/District'
import Move from './moves/Move'
import Phase from './phases/Phase'
import PlayerState from './PlayerState'

type GameState = {
  players: PlayerState[]
  city: District[]
  phase?: Phase
  eventDeck: number[]
  event: number
  nextMoves: Move[]
  currentDistrict?: number // TODO: delete
  tutorial: boolean
}

export default GameState