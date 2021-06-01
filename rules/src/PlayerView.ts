import PlayerState, { PrinceState, ThiefState } from "./PlayerState";
import PlayerRole from "./types/PlayerRole";
import Thief, {ThiefView} from './types/Thief'

type PlayerView = ThiefView | PlayerState

export default PlayerView