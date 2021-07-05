import {isThisPartnerHasKickToken, isThisPartnerHasMoveToken} from '../Brigands'
import DistrictName from '../districts/DistrictName'
import GameState from '../GameState'
import GameView, {getThieves} from '../GameView'
import { isPrinceState, PrinceState } from '../PlayerState'
import {getPartners, isPartner} from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import MoveType from './MoveType'

type MovePartner = {
  type: MoveType.MovePartner
  role: PlayerRole | false
  kicker?: PlayerRole
  runner?: PlayerRole
}

export default MovePartner

export function movePartner(state: GameState | GameView, move: MovePartner) {
  const actualDistrict: DistrictName = state.city[state.districtResolved!].name
  const nextDistrict: DistrictName = state.city[state.districtResolved! + 1].name
  const thieves = getThieves(state)
  const thief = move.runner ? thieves.find(p => p.role === move.runner)! : thieves.find(p => p.role === move.role)!
  const movingPartnerIndex = thief && thief.partners.filter(isPartner).findIndex((part, index) => part.district === actualDistrict && isThisPartnerHasMoveToken(thief, index))
  if (move.role === false) {
    if (move.runner) {
      if (movingPartnerIndex !== -1) {
        thief.tokens.move.splice(thief.tokens.move.findIndex(tm => tm === movingPartnerIndex), 1)
      }
    }
  } else {
    if (movingPartnerIndex !== -1) {
      thief.tokens.move.splice(thief.tokens.move.findIndex(tm => tm === movingPartnerIndex), 1)
    }
    thief.partners.filter(isPartner).filter(part => part.district === actualDistrict)[0].district = nextDistrict
    if (nextDistrict === DistrictName.Jail){
      (state.players.find(isPrinceState) as PrinceState).victoryPoints++
    }
  }

  if (move.kicker) {
    const kicker = thieves.find(p => p.role === move.kicker)!
    delete getPartners(kicker).filter(isPartner).find((part, index) => part.district === actualDistrict && isThisPartnerHasKickToken(kicker, index))!.kickOrNot
  }
}
