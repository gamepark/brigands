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
import ArrestPartners from './ArrestPartners'
import PlaceToken from './PlaceToken'
import ResolveStealToken from './ResolveStealToken'

type Move = DrawEvent | PlacePartner | PlaceToken | TellYouAreReady | MoveOnNextPhase | PlacePatrol | RevealPartnersDistricts 
| ThrowDice | GainGold | TakeBackPartner | SpareGoldOnTreasure | MoveOnDistrictResolved | SolvePartner | BetGold | TakeToken | ArrestPartners
| ResolveStealToken

// Moves to code 

//  UseKickToken | UseMoveToken 

export default Move