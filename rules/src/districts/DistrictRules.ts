import GameState from '../GameState'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import {takeBackMeepleMove} from '../moves/TakeBackMeeple'
import PlayerState, {isThiefState, ThiefState} from '../PlayerState'
import Event from '../types/Event'
import District from './District'
import DistrictName from './DistrictName'

export abstract class DistrictRules {
  state: GameState
  district: District

  constructor(state: GameState, district: District) {
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
    return this.state.players.reduce((sum, player) => sum + this.countPlayerMeeples(player), 0)
  }

  countPlayerMeeples(player: PlayerState) {
    return player.meeples.reduce((sum, meeple) => meeple === this.district.name ? sum + 1 : sum, 0)
  }

  isThiefActive(_thief: ThiefState): boolean {
    return false
  }

  getThiefLegalMoves(_thief: ThiefState): Move[] {
    return []
  }

  getAutomaticMove(): Move | void {
  }

  getThieves() {
    return this.state.players.filter(isThiefState)
  }

  isDistrictEvent() {
    const event: Event = EventArray[this.state.event]
    return event.district === this.district.name
  }

  getDistrictPartners() {
    return this.getThieves().flatMap(thief => thief.partners.filter(partner => partner.district === this.district.name))
  }
}