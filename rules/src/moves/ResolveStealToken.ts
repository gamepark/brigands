import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isThief, isThiefState, ThiefState} from '../PlayerState'
import {isPartnerView} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type ResolveStealToken = {
  type: MoveType.ResolveStealToken
  steals: Steal[]
}

export type ResolveStealTokenView = ResolveStealToken & {
  steals: Steal[]
}

export type Steal = {
  thief: PlayerRole
  victim: PlayerRole
  gold: number
}

export default ResolveStealToken

export function resolveStealToken(state: GameState | GameView, {steals}: ResolveStealToken) {

  steals.forEach(steal => {

    const thieves = getThieves(state)
    const thief = thieves.find(p => p.role === steal.thief)!
    const victim = thieves.find(p => p.role === steal.victim)!

    if (isThiefState(thief)) {
      thief.gold += steal.gold
    }
    if (isThiefState(victim)) {
      victim.gold = Math.max(victim.gold - steal.gold, 0)
    }
  })

  for (const player of state.players) {
    if (isThief(player)) {
      player.tokens.steal = player.tokens.steal.filter(ts => {
        if (ts === -1) {
          return true
        } else {
          const partner = player.partners[ts]
          return isPartnerView(partner) || partner.district !== state.city[state.districtResolved!].name
        }
      })
    }
  }

}

export function createSteals(state: GameState): Steal[] {

  const districtResolved: DistrictName = state.city[state.districtResolved!].name
  const thieves = state.players.filter(isThiefState)
  const resultArray: Steal[] = []

  thieves.forEach(thief => {
    if (thief.partners.some((part, index) => part.district === districtResolved && thief.tokens.steal.some(ts => ts === index))) {
      // thief has a Steal Token to use
      if (thieves.filter(p => p.partners.some(part => part.district === districtResolved)).length !== 1) {
        // thief isn't alone on the district
        if (thieves.filter(p => p.partners.some(part => part.district === districtResolved)).length === 2) {
          const victim: ThiefState = thieves.filter(p => p.partners.some(part => part.district === districtResolved)).find(p => p.role !== thief.role)!
          // thief meet only one player
          if (victim.partners.filter(part => part.district === districtResolved).length === 1) {
            //There is only one victim, not 2 or 3
            resultArray.push({thief: thief.role, victim: victim.role, gold: Math.min(3, victim.gold)})
          } else {
            // There is more victims
            resultArray.push({
              thief: thief.role, victim: victim.role, gold: Math.min(victim.partners.filter(part => part.district === districtResolved).length, victim.gold)
            })
          }
        } else {
          // Thief meet more than one player
          const victims: ThiefState[] = thieves.filter(p => p.partners.some(part => part.district === districtResolved))
          victims.forEach(victim => resultArray.push({
            thief: thief.role, victim: victim.role, gold: Math.min(victim.gold, victim.partners.filter(part => part.district === districtResolved).length)
          }))
        }
      }
    }
  })

  return resultArray
}

export function isResolveStealToken(move: Move | MoveView): move is ResolveStealToken {
  return move.type === MoveType.ResolveStealToken
}
