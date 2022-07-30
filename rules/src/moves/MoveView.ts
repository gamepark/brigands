import DrawDayCard, {DrawDayCardView} from './DrawDayCard'
import MoveRandomized from './MoveRandomized'
import RevealGolds, {RevealGoldsView} from './RevealGolds'
import RevealPartnersDistricts, {RevealPartnersDistrictsView} from './RevealPartnersDistricts'

type MoveView = Exclude<MoveRandomized, RevealPartnersDistricts | DrawDayCard | RevealGolds>
  | DrawDayCardView | RevealPartnersDistrictsView | RevealGoldsView

export default MoveView