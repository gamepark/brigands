import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import {getPartners, isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type TakeBackPartner = {
  type: MoveType.TakeBackPartner
  thief: PlayerRole
  district: DistrictName
}

export default TakeBackPartner

export function takeBackPartner(state: GameState | GameView, move: TakeBackPartner) {
  const thief = getThieves(state).find(p => p.role === move.thief)!
  const partners = getPartners(thief).filter(isPartner)
  if (move.district === DistrictName.Jail) {
    delete partners.find(p => p.district === move.district && p.solvingDone !== true)!.district
  } else {
    delete partners.find(p => p.district === move.district)!.solvingDone
    delete partners.find(p => p.district === move.district)!.district
  }

  if (move.district === DistrictName.Market || move.district === DistrictName.Jail || move.district === DistrictName.Tavern) {
    delete state.city.find(d => d.name === move.district)!.dice
  }
}