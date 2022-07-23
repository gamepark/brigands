import CityHall from '../districts/CityHall'
import Convoy from '../districts/Convoy'
import District from '../districts/District'
import DistrictName from '../districts/DistrictName'
import Harbor from '../districts/Harbor'
import Jail from '../districts/Jail'
import Market from '../districts/Market'
import Palace from '../districts/Palace'
import Tavern from '../districts/Tavern'
import Treasure from '../districts/Treasure'
import {getPrince} from '../GameView'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import {PhaseRules} from './PhaseRules'

export default class Solving extends PhaseRules {
  isThiefActive(thief: ThiefState): boolean {
    if (this.state.currentDistrict === undefined) return false
    const district = this.state.city[this.state.currentDistrict]
    //const kickerPartners: Partner[] = thief.partners.filter((p, index) => p.district === district.name && thief.tokens.kick.some(t => t === index))
    //const runnerPartners: Partner[] = thief.partners.filter((p, index) => p.district === district.name && thief.tokens.move.some(t => t === index))
    /*if (kickerPartners.length > 0) {
      return kickerPartners.some(part => part.kickOrNot === undefined)
    }*/
    /*if (this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && p.tokens.kick.some(ts => ts === index)))) {
      return false
    }*/
    /*if (runnerPartners.length > 0) {
      return thief.partners.some((part, index) => part.district === district.name && isThisPartnerHasMoveToken(thief, index))
    }*/
    return this.getDistrictRules(district).isThiefActive(thief)
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    if (this.state.currentDistrict === undefined) return []
    const district = this.state.city[this.state.currentDistrict]

    /*const kickerPartners: Partner[] = thief.partners.filter((p, index) => p.district === district.name && isThisPartnerHasKickToken(thief, index))
    if (kickerPartners.length > 0) {
      if (kickerPartners.every(part => part.kickOrNot !== undefined)) {
        return []
      } else {
        const kickOrNotResult: KickOrNot[] = []
        kickOrNotResult.push({type: MoveType.KickOrNot, kickerRole: thief.role, playerToKick: false})
        const playersWhoCouldBeKicked: PlayerRole[] = []
        for (const opponent of this.getThieves().filter(p => p.role !== thief.role)) {
          if (opponent.partners.some(part => part.district === district.name)) {
            playersWhoCouldBeKicked.push(opponent.role)
          }
        }
        playersWhoCouldBeKicked.forEach(p => kickOrNotResult.push({type: MoveType.KickOrNot, kickerRole: thief.role, playerToKick: p}))
        return kickOrNotResult
      }
    }*/

    /*const runnerPartners: Partner[] = thief.partners.filter((p, index) => p.district === district.name && thief.tokens.move.some(tm => tm === index))
    if (this.state.players.filter(isThiefState).some(p => p.partners.some((part, index) => part.district === district.name && isThisPartnerHasKickToken(p, index)))) {
      return []
    } else {
      if (runnerPartners.length > 0) {
        const moveArray: MovePartner[] = []
        moveArray.push({type: MoveType.MovePartner, role: false, runner: thief.role})
        moveArray.push({type: MoveType.MovePartner, role: thief.role, runner: thief.role})
        return moveArray
      }
    }*/


    return this.getDistrictRules(district).getThiefLegalMoves(thief)
  }

  getAutomaticMove(): Move | void {
    if (this.state.currentDistrict === undefined) return

    const prince = getPrince(this.state)
    const district: District = this.state.city[this.state.currentDistrict]
    const districtHasPatrol = prince.patrols.some(patrol => patrol === district.name)

    if (districtHasPatrol && prince.abilities[1] === district.name) {
      return {type: MoveType.ArrestPartners}
    }

    /*if (this.hasStealToken(district)) {
      return {type: MoveType.ResolveStealToken, steals: createSteals(this.state)}
    }*/
    /*if (this.hasKickToken(district)) {
      return this.getKickTokenAutomaticMove(district)
    }*/
    /*if (this.hasMoveToken(district)) {
      // TODO: simultaneous secrete decision whether to move or not
      return
    }*/

    if (district.name !== DistrictName.Jail && districtHasPatrol) {
      return {type: MoveType.ArrestPartners}
    }

    return this.getDistrictRules(district).getAutomaticMove()
  }

  /*hasStealToken(district: District) {
    return this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && p.tokens.steal.some(ts => ts === index)))
  }

  hasKickToken(district: District) {
    return this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && p.tokens.kick.some(tk => tk === index)))
  }

  hasMoveToken(district: District) {
    return this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && isThisPartnerHasMoveToken(p, index)))
  }*/

  getDistrictRules(district: District) {
    switch (district.name) {
      case DistrictName.Jail:
        return new Jail(this.state, district)
      case DistrictName.Tavern:
        return new Tavern(this.state, district)
      case DistrictName.Convoy:
        return new Convoy(this.state, district)
      case DistrictName.Market:
        return new Market(this.state, district)
      case DistrictName.Palace:
        return new Palace(this.state, district)
      case DistrictName.CityHall:
        return new CityHall(this.state, district)
      case DistrictName.Harbor:
        return new Harbor(this.state, district)
      case DistrictName.Treasure:
        return new Treasure(this.state, district)
    }
  }
}
