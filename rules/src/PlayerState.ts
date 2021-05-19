import PlayerRole from './types/PlayerRole';
import Prince from './types/Prince';
import Thief from './types/Thief';

export default interface PlayerState {
  role: PlayerRole
  gold:number
  isReady:boolean
}

export type PrinceState = PlayerState & Prince

export type ThiefState = PlayerState & Thief

export function isPrinceState(state:PlayerState):state is PlayerState{
  return state.role === PlayerRole.Prince
}

export function isThiefState(state:PlayerState):state is PlayerState{
  return state.role === (PlayerRole.GreenThief || PlayerRole.BlueThief || PlayerRole.PurpleThief || PlayerRole.RedThief || PlayerRole.YellowThief)
}