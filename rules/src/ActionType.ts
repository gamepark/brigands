import {isEnumValue} from '@gamepark/rules-api'

enum ActionType {
  Spy, GoHome, Steal, Move, Push
}

export default ActionType

export const actionTypes = Object.values(ActionType).filter(isEnumValue)