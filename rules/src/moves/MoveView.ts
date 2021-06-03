import DrawEvent, { DrawEventView } from './DrawEvent'
import Move from './Move'
import {PlacePartnerView} from './PlacePartner'

type MoveView = Exclude<Move, DrawEvent> | DrawEventView | PlacePartnerView

export default MoveView