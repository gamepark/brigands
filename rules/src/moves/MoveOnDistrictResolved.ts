import GameState from '../GameState'
import GameView, {getPrince, getThieves} from '../GameView'
import Phase from '../phases/Phase'
import {isThiefState, PrinceState, ThiefState} from '../PlayerState'
import { isPartner } from '../types/Partner'
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
    const thieves = getThieves(state).filter(isThiefState)
    delete state.districtResolved
    takeBackPatrols(prince)
    cleanPartners(thieves)
    cleanTokens(thieves)
    cleanAbilities(prince)
    state.players.forEach(p => p.isReady = false)
    state.phase = Phase.NewDay
  } else {
    getThieves(state).forEach(p => p.partners.filter(part => isPartner(part) && part.district === district.name).forEach(part => {
      isPartner(part) && delete part.kickOrNot ;
      delete part.solvingDone ;
      delete part.tokensTaken ;
    }))

    delete district.dice
    state.districtResolved!++
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

function cleanPartners(thieves: ThiefState[]) {
  thieves.forEach(p => p.partners.forEach(part => {
    delete part.goldForTavern
    delete part.solvingDone
    delete part.tokensTaken
  }))
}

export function cleanTokens(thieves: ThiefState[]) {
  for (const thief of thieves) {
    for (let i = 0; i < thief.tokens.steal.length; i++) {
      if (thief.tokens.steal[i] >= 0) {
        thief.tokens.steal.splice(i, 1)
      }
    }
    for (let i = 0; i < thief.tokens.kick.length; i++) {
      if (thief.tokens.kick[i] >= 0) {
        thief.tokens.kick.splice(i, 1)
      }
    }
    for (let i = 0; i < thief.tokens.move.length; i++) {
      if (thief.tokens.move[i] >= 0) {
        thief.tokens.move.splice(i, 1)
      }
    }
  }
}