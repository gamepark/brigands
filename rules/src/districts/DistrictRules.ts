import GameState from '../GameState'
import {EventArray} from '../material/Events'
import Move from '../moves/Move'
import {isThiefState, ThiefState} from '../PlayerState'
import Event from '../types/Event'
import District from './District'

export abstract class DistrictRules {
  state: GameState
  district: District

  constructor(state: GameState, district: District) {
    this.state = state
    this.district = district
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