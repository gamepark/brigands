import ArrestPartners from './ArrestPartners'
import BetGold from './BetGold'
import DrawDayCard from './DrawDayCard'
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
import SpendGold from './SpendGold'
import SpendTokens from './SpendTokens'
import TakeBackMeeple from './TakeBackMeeple'
import TakeBackPartner from './TakeBackPartner'
import TakeToken from './TakeToken'
import TellYouAreReady from './TellYouAreReady'
import ThrowDices from './PlayThrowDicesResult'

type Move = TakeToken | DrawDayCard | MoveOnNextPhase | PlaceMeeple | PlaceToken | TellYouAreReady
  | TakeBackMeeple | GainGold | SpendTokens | SpendGold | ThrowDices

  | RevealPartnersDistricts
  | TakeBackPartner | SpareGoldOnTreasure | MoveOnDistrictResolved | SolvePartner | BetGold | ArrestPartners
  | ResolveStealToken | MovePartner
  | JudgePrisoners | PlayHeadStart
  | RevealGolds

export default Move