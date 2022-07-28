import ArrestPartners from './ArrestPartners'
import BetGold from './BetGold'
import DrawEvent from './DrawEvent'
import GainGold from './GainGold'
import JudgePrisoners from './JudgePrisoners'
import MoveOnDistrictResolved from './MoveOnDistrictResolved'
import MoveOnNextPhase from './MoveOnNextPhase'
import MovePartner from './MovePartner'
import PlaceMeeple from './PlaceMeeple'
import PlaceToken from './PlaceToken'
import PlayHeadStart from './PlayHeadStart'
import ResolveStealToken from './ResolveStealToken'
import RevealGolds from './RevealGolds'
import RevealPartnersDistricts from './RevealPartnersDistricts'
import SolvePartner from './SolvePartner'
import SpareGoldOnTreasure from './SpareGoldOnTreasure'
import SpendTokens from './SpendTokens'
import TakeBackMeeple from './TakeBackMeeple'
import TakeBackPartner from './TakeBackPartner'
import TakeToken from './TakeToken'
import TellYouAreReady from './TellYouAreReady'
import ThrowDice from './ThrowDice'

type Move = TakeToken | DrawEvent | MoveOnNextPhase | PlaceMeeple | PlaceToken | TellYouAreReady
  | TakeBackMeeple | GainGold | SpendTokens

  | RevealPartnersDistricts
  | ThrowDice | TakeBackPartner | SpareGoldOnTreasure | MoveOnDistrictResolved | SolvePartner | BetGold | ArrestPartners
  | ResolveStealToken | MovePartner
  | JudgePrisoners | PlayHeadStart
  | RevealGolds

export default Move