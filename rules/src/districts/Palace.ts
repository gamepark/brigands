import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Palace extends DistrictRules {
  getAutomaticMove(): Move | void {
    let partnersOnPalace: number = 0
    this.getThieves().forEach(p => partnersOnPalace += p.partners.filter(part => part.district === DistrictName.Palace).length)
    if (partnersOnPalace > (this.isDistrictEvent() ? 3 : (this.state.players.length < 4 ? 1 : 2))) {
      return {type: MoveType.ArrestPartners}
    } else if (partnersOnPalace === 0) {
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else {
      const thiefOnPalace: ThiefState = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Palace)!)!
      if (!thiefOnPalace.partners.find(part => part.district === DistrictName.Palace)!.solvingDone) {
        return {type: MoveType.GainGold, gold: 5, player: thiefOnPalace, district: DistrictName.Palace}
      } else {
        return {type: MoveType.TakeBackPartner, thief: thiefOnPalace, district: DistrictName.Palace}
      }
    }
  }
}