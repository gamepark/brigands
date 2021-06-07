import GameView from '@gamepark/brigands/GameView'
import { drawEventInView } from '@gamepark/brigands/moves/DrawEvent'
import { moveOnNextPhase } from '@gamepark/brigands/moves/MoveOnNextPhase'
import MoveType from '@gamepark/brigands/moves/MoveType'
import MoveView from '@gamepark/brigands/moves/MoveView'
import { placePartnerInView } from '@gamepark/brigands/moves/PlacePartner'
import { placePatrol } from '@gamepark/brigands/moves/PlacePatrol'
import { resolveDistrict } from '@gamepark/brigands/moves/ResolveDistrict'
import { revealPartnersDistrictsInView } from '@gamepark/brigands/moves/RevealPartnersDistricts'
import { tellYouAreReady } from '@gamepark/brigands/moves/TellYouAreReady'
import {Game} from '@gamepark/rules-api'

export default class BrigandsView implements Game<GameView, MoveView> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  /**
   * In this method, inside the view, we must return any move that the frontend can fully anticipate.
   * The reason why it should be anticipated instead of waiting for the backend to provide with all the automatic consequences is latency.
   * If the backend takes time to reply, maybe we will have the reply while we are animating the first consequences. The player won't notice the latency!
   *
   * @return A MoveView which can be completely anticipated by the player or the spectator
   */
  getAutomaticMove(): void | MoveView {
    return
  }

  /**
   * This is where a move is reproduced on the browser of a player. Most move will be treated the exact same way on both server and client side,
   * however some moves, that involved hiding information or discovering hidden information, will receive a different treatment than in the main rules class.
   *
   * @param move The move that must be applied in the browser of the player or the spectator
   */
  play(move: MoveView): void {
    switch (move.type) {
      case MoveType.DrawEvent:
        return drawEventInView(this.state, move)
      case MoveType.PlacePartner:
        return placePartnerInView(this.state,move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state,move)
      case MoveType.MoveOnNextPhase:
        return moveOnNextPhase(this.state)
      case MoveType.PlacePatrol:
        return placePatrol(this.state, move)
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistrictsInView(this.state, move)
      case MoveType.ResolveDistrict:
        return resolveDistrict(this.state,move)
    }
  }

}