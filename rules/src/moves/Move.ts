import DrawEvent from './DrawEvent'
import MoveOnNextPhase from './MoveOnNextPhase'
import PlacePartner from './PlacePartner'
import PlacePatrol from './PlacePatrol'
import ResolveDistrict from './ResolveDistrict'
import RevealPartnersDistricts from './RevealPartnersDistricts'
import ThrowDice from './ThrowDice'
import TellYouAreReady from './TellYouAreReady'
import GainGold from './GainGold'
import TakeBackPartner from './TakeBackPartner'
import SpareGoldOnTreasure from './SpareGoldOnTreasure'

type Move = DrawEvent | PlacePartner | TellYouAreReady | MoveOnNextPhase | PlacePatrol | RevealPartnersDistricts | ResolveDistrict
| ThrowDice | GainGold | TakeBackPartner | SpareGoldOnTreasure

// Moves to code !

//  | PlaceToken 
// | UseStealToken | UseKickToken | UseMoveToken 
// | ResolvePatrols | MoveOnDistrictResolved | ResolveDistrict 

export default Move