import GameState from './GameState'
import PlayerState, { ThiefState } from './PlayerState'
import PlayerView from './PlayerView'
import PlayerRole from './types/PlayerRole'

/**
 * In here, you describe what a GameView will look like at any time during a game.
 * It usually derives from the GameState, because only a few properties change.
 */
// Here is a example of a "Game View": the deck content is hidden, instead it is replaced with the number of cards remaining inside
type GameView = Omit<GameState, 'eventDeck' | 'players' > & {
  eventDeck: number,
  players:PlayerView[]
  
}

export default GameView