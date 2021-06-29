import {getPrince} from '../GameView'
import JudgePrisoners from '../moves/JudgePrisoners'
import Move from '../moves/Move'
import MoveType from '../moves/MoveType'
import PlacePatrol from '../moves/PlacePatrol'
import PlayHeadStart from '../moves/PlayHeadStart'
import TellYouAreReady from '../moves/TellYouAreReady'
import {PrinceState} from '../PlayerState'
import {PhaseRules} from './PhaseRules'

export default class Patrolling extends PhaseRules {
  isPrinceActive(prince: PrinceState): boolean {
    return !prince.isReady
  }

  getPrinceLegalMoves(prince: PrinceState): Move[] {
    const patrollingMoves: (PlacePatrol | JudgePrisoners | PlayHeadStart | TellYouAreReady)[] = []
    for (let i = 1; i < 9; i++) {
      if (prince.gold > 1) {
        prince.patrols.includes(i) && patrollingMoves.push({type: MoveType.PlayHeadStart, district: i})
      }
      if (prince.gold > 4 && !prince.abilities[2] && i !== prince.patrols[2] && i !== 1) {
        !prince.patrols.includes(i) && patrollingMoves.push({type: MoveType.PlacePatrol, district: i, patrolNumber: 2})
      }
      if (prince.patrols.every(pat => pat !== -1)) {
        patrollingMoves.push({type: MoveType.TellYouAreReady, playerId: prince.role})
      }
      if (prince.patrols.some(pat => pat === -1)) {
        if (i === 1) {
          prince.patrols.forEach((pat) => pat === -1 && !prince.abilities[0] && patrollingMoves.push({type: MoveType.JudgePrisoners}))
        } else {
          prince.patrols.forEach((pat, index) => pat === -1 && !prince.patrols.includes(i) && patrollingMoves.push({
            type: MoveType.PlacePatrol, district: i, patrolNumber: index
          }))
        }
      }
    }
    return patrollingMoves
  }

  getAutomaticMove(): Move | void {
    if (getPrince(this.state).isReady) {
      return {type: MoveType.RevealPartnersDistricts}
    }
  }
}