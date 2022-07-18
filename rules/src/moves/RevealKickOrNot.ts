import {isThisPartnerHasAnyToken} from '../Brigands'
import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isPrinceState, PrinceState, ThiefState} from '../PlayerState'
import Partner, {isPartner} from '../types/Partner'
import MoveType from './MoveType'

type RevealKickOrNot = {
  type: typeof MoveType.RevealKickOrNot
}

export default RevealKickOrNot

export type RevealKickOrNotView = RevealKickOrNot & {
  partnersArray: Partner[][]
}

export function revealKickOrNot(state: GameState | GameView) {

  const thieves = getThieves(state)
  const districtResolved: DistrictName = state.city[state.districtResolved!].name

  thieves.forEach(thief => {
    thief.partners.forEach((part, index) => {
      if (isPartner(part) && part.kickOrNot !== undefined) {
        if (part.kickOrNot !== false) {
          const victimThief = thieves.find(p => p.role === part.kickOrNot)!
          const indexOfVictimPartnerWithNoToken: number = victimThief.partners.findIndex((victim, index) => isPartner(victim) && victim.district === districtResolved && !isThisPartnerHasAnyToken(victimThief, index))
          if (indexOfVictimPartnerWithNoToken !== -1) {
            (victimThief.partners[indexOfVictimPartnerWithNoToken] as Partner).district = state.city[state.districtResolved! + 1].name
          } else {
            const indexOfVictimPartnerWithToken: number = victimThief.partners.findIndex((victim, index) => isPartner(victim) && victim.district === districtResolved && isThisPartnerHasAnyToken(victimThief, index))
            if (indexOfVictimPartnerWithToken !== -1) {
              (victimThief.partners[indexOfVictimPartnerWithToken] as Partner).district = state.city[state.districtResolved! + 1].name
              victimThief.tokens.move.splice(victimThief.tokens.move.indexOf(indexOfVictimPartnerWithToken), 1)
            }
          }
          if (state.city[state.districtResolved! + 1].name === DistrictName.Jail) {
            (state.players.find(isPrinceState)! as PrinceState).victoryPoints++
          }
        }
        thief.tokens.kick.splice(thief.tokens.kick.indexOf(index), 1)
        delete part.kickOrNot
      }
    })
  })
}

export function revealKickOrNotView(state: GameView, move: RevealKickOrNotView) {
  getThieves(state).forEach((p, index) => {
    for (let i = 0; i < p.partners.length; i++) {
      const partner = p.partners[i]
      const kickOrNot = move.partnersArray[index][i].kickOrNot
      if (isPartner(partner) && kickOrNot !== undefined) {
        partner.kickOrNot = kickOrNot
      }
    }
  })
  revealKickOrNot(state)
}

export function getRevealKickOrNotView(thieves: ThiefState[]): RevealKickOrNotView {
  return {type: MoveType.RevealKickOrNot, partnersArray: thieves.map(thief => thief.partners)}
}
