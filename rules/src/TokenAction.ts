import ActionType from './ActionType'
import PlayerRole from './types/PlayerRole'

type TokenAction = {
  type: ActionType
  target?: PlayerRole
}

export default TokenAction