enum MoveType {
  TakeToken = 1,
  DrawEvent,
  MoveOnNextPhase,
  PlaceMeeple,
  PlaceToken,
  TellYouAreReady,
  TakeBackMeeple,
  GainGold,
  SpendTokens,

  RevealPartnersDistricts,
  ResolveStealToken,
  MovePartner,
  MoveOnDistrictResolved,
  ThrowDice,
  TakeBackPartner,
  SpareGoldOnTreasure,
  SolvePartner,
  BetGold,
  ArrestPartners,
  JudgePrisoners,
  PlayHeadStart,
  RevealGolds
}

export default MoveType