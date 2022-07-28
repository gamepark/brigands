import GameState from '../GameState'
import GameView from '../GameView'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import SpendTokens from '../moves/SpendTokens'
import {takeBackMeepleMove} from '../moves/TakeBackMeeple'
import TakeToken from '../moves/TakeToken'
import PlayerState, {isThiefState} from '../PlayerState'
import PlayerView from '../PlayerView'
import Event from '../types/Event'
import District from './District'
import DistrictName from './DistrictName'

export abstract class DistrictRules {
  state: GameState | GameView
  district: District

  constructor(state: GameState | GameView, district: District) {
    this.state = state
    this.district = district
  }

  getAutomaticMoves(): Move[] {
    return []
  }

  takeBackMeeplesMoves(): Move[] {
    const moves: Move[] = []
    for (const player of this.state.players) {
      for (let meeple = 0; meeple < player.meeples.length; meeple++) {
        if (player.meeples[meeple] === DistrictName.Market) {
          moves.push(takeBackMeepleMove(player.role, meeple))
        }
      }
    }
    return moves
  }

  countMeeples() {
    let meeples = 0
    for (const player of this.state.players) {
      meeples += this.countPlayerMeeples(player)
    }
    return meeples
  }

  countPlayerMeeples(player: PlayerState | PlayerView) {
    return player.meeples.reduce((sum, meeple) => meeple === this.district.name ? sum + 1 : sum, 0)
  }

  isTurnToPlay(player: PlayerState): boolean {
    return player.meeples.includes(this.district.name)
  }

  getLegalMoves(_player: PlayerState): Move[] {
    return []
  }

  onTakeToken(_move: TakeToken) {
  }

  onSpendTokens(_move: SpendTokens) {
  }

  getThieves() {
    return this.state.players.filter(isThiefState)
  }

  isDistrictEvent() {
    const event: Event = EventArray[this.state.event]
    return event.district === this.district.name
  }
}