import District from './districts/District'
import DistrictName from './districts/DistrictName'
import Move from './moves/Move'
import Phase from './phases/Phase'
import PlayerState from './PlayerState'

type GameState = {
  players: PlayerState[]
  city: District[]
  phase?: Phase
  deck: DistrictName[]
  dayCards: DistrictName[]
  nextMoves: Move[]
  currentDistrict?: number // TODO: delete
  tutorial: boolean
}

export default GameState