import DrawEvent, {DrawEventView} from './DrawEvent'
import {KickOrNotView} from './KickOrNot'
import Move from './Move'
import {PlacePartnerView} from './PlacePartner'
import RevealGolds, {RevealGoldsView} from './RevealGolds'
import RevealKickOrNot, {RevealKickOrNotView} from './RevealKickOrNot'
import RevealPartnersDistricts, {RevealPartnersDistrictsView} from './RevealPartnersDistricts'

type MoveView = Exclude<Move, RevealPartnersDistricts | DrawEvent | RevealKickOrNot | RevealGolds>
  | DrawEventView | PlacePartnerView | RevealPartnersDistrictsView | KickOrNotView | RevealKickOrNotView | RevealGoldsView

export default MoveView