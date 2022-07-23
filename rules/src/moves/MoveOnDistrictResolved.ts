import GameState from '../GameState'
import GameView, {getPrince, getThieves} from '../GameView'
import Phase from '../phases/Phase'
import {PrinceState, ThiefState} from '../PlayerState'
import {isPartner} from '../types/Partner'
import {ThiefView} from '../types/Thief'
import MoveType from './MoveType'

type MoveOnDistrictResolved = {
  type: MoveType.MoveOnDistrictResolved
  districtResolved: number
}

export default MoveOnDistrictResolved

export function moveOnDistrictResolved(state: GameState | GameView, move: MoveOnDistrictResolved) {
  const district = state.city[move.districtResolved]

  if (move.districtResolved === 7) {
    const prince = getPrince(state)
    const thieves = getThieves(state)
    delete state.currentDistrict
    takeBackPatrols(prince)
    cleanPartners(thieves)
    for (const thief of thieves) {
      thief.tokens = thief.tokens.filter(token => token !== district.name)
    }
    cleanAbilities(prince)
    state.players.forEach(p => p.isReady = false)
    state.phase = Phase.NewDay
  } else {
    getThieves(state).forEach(p => p.partners.filter(part => isPartner(part) && part.district === district.name).forEach(part => {
      delete part.solvingDone
      delete part.tokensTaken
    }))

    delete district.dice
    state.currentDistrict!++
  }
}

function cleanAbilities(prince: PrinceState) {
  prince.abilities = [false, false, false]
}

function takeBackPatrols(prince: PrinceState) {
  prince.patrols[0] = -1
  prince.patrols[1] = -1
  prince.patrols[2] = -1
}

function cleanPartners(thieves: (ThiefState | ThiefView)[]) {
  thieves.forEach(p => p.partners.forEach(part => {
    delete part.goldForTavern
    delete part.solvingDone
    delete part.tokensTaken
  }))
}
