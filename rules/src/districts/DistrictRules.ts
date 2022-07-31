import GameState from '../GameState'
import GameView from '../GameView'
import {gainGoldMove} from '../moves/GainGold'
import Move from '../moves/Move'
import {ThrowDicesRandomized} from '../moves/PlayThrowDicesResult'
import SpendGold from '../moves/SpendGold'
import SpendTokens from '../moves/SpendTokens'
import {takeBackMeepleMove} from '../moves/TakeBackMeeple'
import TakeToken from '../moves/TakeToken'
import PlayerState from '../PlayerState'
import PlayerView from '../PlayerView'
import DistrictName from './DistrictName'

export abstract class DistrictRules {
  state: GameState | GameView
  abstract district: DistrictName

  constructor(state: GameState | GameView) {
    this.state = state
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
    return player.meeples.reduce((sum, meeple) => meeple === this.district ? sum + 1 : sum, 0)
  }

  isTurnToPlay(player: PlayerState): boolean {
    return player.meeples.includes(this.district)
  }

  getLegalMoves(_player: PlayerState): Move[] {
    return []
  }

  hasDayCard() {
    return this.state.dayCards.includes(this.district)
  }

  shareGold(gold: number): Move[] {
    const moves: Move[] = []
    const meeples = this.countMeeples()
    const meepleShare = Math.floor(gold / meeples)
    for (const player of this.state.players) {
      const meeples = this.countPlayerMeeples(player)
      if (meeples > 0) {
        moves.push(gainGoldMove(player.role, meeples * meepleShare))
      }
    }
    return moves
  }

  onTakeToken(_move: TakeToken) {
  }

  onSpendTokens(_move: SpendTokens) {
  }

  onSpendGold(_move: SpendGold) {
  }

  onThrowDices(_move: ThrowDicesRandomized) {
  }
}