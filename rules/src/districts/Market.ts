import {rollDice} from '../material/Dice'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import {ThiefState} from '../PlayerState'
import DistrictName from './DistrictName'
import {DistrictRules} from './DistrictRules'

export default class Market extends DistrictRules {
  getAutomaticMove(): Move | void {
    const thiefOnMarket: ThiefState | undefined = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Market))
    if (thiefOnMarket === undefined) {    // Plus de comparses sur le marché
      return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved!}
    } else if (this.district.dice === undefined) {    // Aucun dé lancé
      return {type: MoveType.ThrowDice, dice: this.isDistrictEvent() ? rollDice(2) : rollDice(1), district: DistrictName.Market}
    } else if (!thiefOnMarket.partners.find(part => part.district === DistrictName.Market)!.solvingDone) {     // Le comparse n'a pas encore pris son argent
      return {type: MoveType.GainGold, gold: this.district.dice!.reduce((acc, vc) => acc + vc), player: thiefOnMarket, district: DistrictName.Market}
    } else {    // Le comparse doit rentrer à la maison
      return {type: MoveType.TakeBackPartner, thief: thiefOnMarket, district: DistrictName.Market}
    }
  }
}