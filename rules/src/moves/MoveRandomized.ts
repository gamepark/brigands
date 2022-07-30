import Move from './Move'
import ThrowDices, {ThrowDicesRandomized} from './PlayThrowDicesResult'

type MoveRandomized = Exclude<Move, ThrowDices> | ThrowDicesRandomized

export default MoveRandomized