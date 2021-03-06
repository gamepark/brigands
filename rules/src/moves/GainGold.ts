import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {isThiefState} from '../PlayerState'
import {isPartner, isPartnerView} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type GainGold = {
  type: MoveType.GainGold
  thief: PlayerRole // TODO: rename
  gold: number
  district: DistrictName // TODO: remove
  noShare?: true // TODO: remove
}

export default GainGold

export function gainGoldMove(thief: PlayerRole, gold: number): GainGold {
  return {type: MoveType.GainGold, thief, gold, district: DistrictName.Jail}
}

export function gainGold(state: GameState | GameView, move: GainGold) {

  const thief = getThieves(state).find(p => p.role === move.thief)!

  if (move.noShare === true) {
    if (move.district === DistrictName.CityHall || move.district === DistrictName.Convoy) {
      if (isThiefState(thief)) {
        thief.gold += move.gold
      }
      thief.partners.forEach(part => {
        if (isPartner(part) && part.district === move.district) {
          part.solvingDone = true
        }
      })
      delete state.city.find(d => d.name === move.district)!.dice
    } else {
      if (isThiefState(thief)) {
        thief.gold += move.gold
      }
      thief.partners.forEach(part => {
        if (isPartner(part) && part.district === DistrictName.Treasure) {
          part.solvingDone = true
        }
      })
      state.city.find(d => d.name === move.district)!.gold = 0
    }
  } else {

    if (move.district === DistrictName.Treasure) {
      const treasure = state.city.find(d => d.name === DistrictName.Treasure)!
      if (treasure.dice === undefined) {
        treasure.dice = [move.gold]
      }
      treasure.gold! -= move.gold
    }

    if (isThiefState(thief)) {
      thief.gold += move.gold
    }

    if (move.district === DistrictName.Market) {
      thief.partners.forEach(part => {
        if (isPartner(part) && part.district === DistrictName.Market) {
          part.solvingDone = true
        }
      })
    } else {
      const partner = thief.partners.find(partner => !isPartnerView(partner) && partner.district === move.district && partner.solvingDone !== true)!
      partner.solvingDone = true
    }

  }

}

export function isGainGold(move: Move | MoveView): move is GainGold {
  return move.type === MoveType.GainGold
}
