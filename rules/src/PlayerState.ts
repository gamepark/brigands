import PlayerColor from './PlayerColor'
import Prince from './types/Prince';
import Thief from './types/Thief';

export default interface PlayerState {
  role: Prince | Thief
  color:PlayerColor
}