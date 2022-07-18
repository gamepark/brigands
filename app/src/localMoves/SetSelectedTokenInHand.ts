import GameView from '@gamepark/brigands/GameView'
import ThiefTokenInHand from '@gamepark/brigands/types/ThiefTokenInHand'
import TokenAction from '@gamepark/brigands/types/TokenAction'

export default interface SetSelectedTokenInHand {
  type: 'SetSelectedTokenInHand'
  selectedToken: ThiefTokenInHand,
}

export interface ResetSelectedTokenInHand {
  type: 'ResetSelectedTokenInHand'
}

export const setSelectedTokenInHandMove = (action: TokenAction, index: number): SetSelectedTokenInHand => ({
  type: 'SetSelectedTokenInHand', selectedToken: {tokenAction: action, index}
})

export const resetSelectedTokenInHandMove = (): ResetSelectedTokenInHand => ({
  type: 'ResetSelectedTokenInHand'
})

export function setSelectedTokenInHand(state: GameView, move: SetSelectedTokenInHand) {
  if (state.selectedTokenInHand?.tokenAction === move.selectedToken.tokenAction && state.selectedTokenInHand.index === move.selectedToken.index) {
    resetSelectedTokenInHand(state)
  } else {
    state.selectedTokenInHand = move.selectedToken
  }
}

export function resetSelectedTokenInHand(state: GameView) {
  delete state.selectedTokenInHand
}