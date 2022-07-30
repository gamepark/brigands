enum MoveType {
  TakeToken = 1,
  DrawDayCard,
  MoveOnNextPhase,
  PlaceMeeple,
  PlaceToken,
  TellYouAreReady,
  TakeBackMeeple,
  GainGold,
  SpendTokens,
  SpendGold,
  ThrowDices,

  RevealPartnersDistricts,
  ResolveStealToken,
  MovePartner,
  MoveOnDistrictResolved,
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