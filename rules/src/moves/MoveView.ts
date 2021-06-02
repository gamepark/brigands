import {DrawCardView} from './DrawCard'
import DrawEvent, { DrawEventView } from './DrawEvent'
import Move from './Move'
import PlacePartner, {PlacePartnerView} from './PlacePartner'

/**
 * A "MoveView" is the combination of all the types of move views that exists in you game.
 * It usually derives from "Move". You can exclude some Move using: = Exclude<Move, MoveToExclude | OtherMoveToExclude> | MoveToInclude...
 */
type MoveView = Exclude<Move, DrawEvent> | DrawEventView | PlacePartnerView

export default MoveView