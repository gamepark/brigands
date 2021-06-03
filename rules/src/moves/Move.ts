import DrawEvent from './DrawEvent'
import MoveOnNextPhase from './MoveOnNextPhase'
import PlacePartner from './PlacePartner'
import PlacePatrol from './PlacePatrol'
import RevealPartnersDistricts from './RevealPartnersDistricts'
import TellYouAreReady from './TellYouAreReady'

type Move = DrawEvent | PlacePartner | TellYouAreReady | MoveOnNextPhase | PlacePatrol | RevealPartnersDistricts

// Moves to code !

//  | PlaceToken 
// | UseStealToken | UseKickToken | UseMoveToken 
// | ResolvePatrols | MoveOnDistrictResolved | ResolveDistrict 

export default Move