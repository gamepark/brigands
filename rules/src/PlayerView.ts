import PlayerState, { PrinceState, ThiefState } from "./PlayerState";
import PlayerRole from "./types/PlayerRole";
import Thief, {ThiefView} from './types/Thief'

type PlayerView = PrinceState | ThiefView | ThiefState

export default PlayerView