import DrawEvent from './DrawEvent'
import MoveOnNextPhase from './MoveOnNextPhase'
import PlacePartner from './PlacePartner'
import PlacePatrol from './PlacePatrol'
import RevealPartnersDistricts from './RevealPartnersDistricts'
import ThrowDice from './ThrowDice'
import TellYouAreReady from './TellYouAreReady'
import GainGold from './GainGold'
import TakeBackPartner from './TakeBackPartner'
import SpareGoldOnTreasure from './SpareGoldOnTreasure'
import MoveOnDistrictResolved from './MoveOnDistrictResolved'
import SolvePartner from './SolvePartner'
import BetGold from './BetGold'
import TakeToken from './TakeToken'

type Move = DrawEvent | PlacePartner | TellYouAreReady | MoveOnNextPhase | PlacePatrol | RevealPartnersDistricts 
| ThrowDice | GainGold | TakeBackPartner | SpareGoldOnTreasure | MoveOnDistrictResolved | SolvePartner | BetGold | TakeToken

// Moves to code !

//  | PlaceToken 
// | UseStealToken | UseKickToken | UseMoveToken 
// | ResolvePatrols

export default Move