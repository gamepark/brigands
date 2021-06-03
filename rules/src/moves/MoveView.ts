import DrawEvent, { DrawEventView } from './DrawEvent'
import Move from './Move'
import {PlacePartnerView} from './PlacePartner'
import RevealPartnersDistricts, { RevealPartnersDistrictsView } from './RevealPartnersDistricts'

type MoveView = Exclude<Move, RevealPartnersDistricts | DrawEvent> | DrawEventView | PlacePartnerView | RevealPartnersDistrictsView

export default MoveView