import DrawEvent, {DrawEventView} from './DrawEvent'
import Move from './Move'
import RevealGolds, {RevealGoldsView} from './RevealGolds'
import RevealPartnersDistricts, {RevealPartnersDistrictsView} from './RevealPartnersDistricts'

type MoveView = Exclude<Move, RevealPartnersDistricts | DrawEvent | RevealGolds>
  | DrawEventView | RevealPartnersDistrictsView | RevealGoldsView

export default MoveView