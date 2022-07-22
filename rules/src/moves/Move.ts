import ArrestPartners from './ArrestPartners'
import BetGold from './BetGold'
import DrawEvent from './DrawEvent'
import GainGold from './GainGold'
import JudgePrisoners from './JudgePrisoners'
import KickOrNot from './KickOrNot'
import MoveOnDistrictResolved from './MoveOnDistrictResolved'
import MoveOnNextPhase from './MoveOnNextPhase'
import MovePartner from './MovePartner'
import PlaceMeeple from './PlaceMeeple'
import PlaceToken from './PlaceToken'
import PlayHeadStart from './PlayHeadStart'
import ResolveStealToken from './ResolveStealToken'
import RevealGolds from './RevealGolds'
import RevealKickOrNot from './RevealKickOrNot'
import RevealPartnersDistricts from './RevealPartnersDistricts'
import SolvePartner from './SolvePartner'
import SpareGoldOnTreasure from './SpareGoldOnTreasure'
import TakeBackPartner from './TakeBackPartner'
import TakeToken from './TakeToken'
import TellYouAreReady from './TellYouAreReady'
import ThrowDice from './ThrowDice'

type Move = DrawEvent | PlaceMeeple | PlaceToken | TellYouAreReady | MoveOnNextPhase | RevealPartnersDistricts
  | ThrowDice | GainGold | TakeBackPartner | SpareGoldOnTreasure | MoveOnDistrictResolved | SolvePartner | BetGold | TakeToken | ArrestPartners
  | ResolveStealToken | KickOrNot | RevealKickOrNot | MovePartner
  | JudgePrisoners | PlayHeadStart
  | RevealGolds

export default Move