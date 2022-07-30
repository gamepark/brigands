import DrawEvent, {DrawEventView} from './DrawEvent'
import MoveRandomized from './MoveRandomized'
import RevealGolds, {RevealGoldsView} from './RevealGolds'
import RevealPartnersDistricts, {RevealPartnersDistrictsView} from './RevealPartnersDistricts'

type MoveView = Exclude<MoveRandomized, RevealPartnersDistricts | DrawEvent | RevealGolds>
  | DrawEventView | RevealPartnersDistrictsView | RevealGoldsView

export default MoveView