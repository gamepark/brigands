import GameView from '@gamepark/brigands/GameView'
import PartnerInHand from '@gamepark/brigands/types/PartnerInHand'

export default interface SetSelectedPartner {
  type: 'SetSelectedPartner'
  selectedPartner: PartnerInHand | undefined
}

export interface ResetSelectedPartner {
  type: 'ResetSelectedPartner'
}

export const setSelectedPartnerMove = (partnerNumber: number): SetSelectedPartner => ({
  type: 'SetSelectedPartner', selectedPartner: {partnerNumber}
})

export const resetSelectedPartnerMove = (): ResetSelectedPartner => ({
  type: 'ResetSelectedPartner'
})

export function setSelectedPartner(state: GameView, move: SetSelectedPartner) {
  if (state.selectedPartner?.partnerNumber === move.selectedPartner?.partnerNumber) {
    resetSelectedPartner(state)
  } else {
    state.selectedPartner = move.selectedPartner
  }
}

export function resetSelectedPartner(state: GameView) {
  delete state.selectedPartner
}