import DistrictName from './districts/DistrictName'
import PlayerView from './PlayerView'
import PlayerRole from './types/PlayerRole'
import Prince from './types/Prince'
import Thief, {ThiefView} from './types/Thief'

type PlayerState = PrinceState | ThiefState

export default PlayerState

type PlayerCommon = {
  role: PlayerRole
  meeples: (DistrictName | null)[]
  gold: number
  isReady: boolean
}

export type PrinceState = PlayerCommon & Prince

export type ThiefState = PlayerCommon & Thief

export function isPrinceState(state: PlayerState | PlayerView): state is PrinceState {
  return state.role === PlayerRole.Prince
}

export function isThief(player: PlayerState | PlayerView): player is (ThiefState | ThiefView) {
  return player.role !== PlayerRole.Prince
}

export function isThiefState(player: PlayerState | PlayerView): player is ThiefState {
  return isThief(player) && (player as ThiefState).gold !== undefined
}