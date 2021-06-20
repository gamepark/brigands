/**
 * Enumeration of all the types of Move in you game.
 * Even though it is not strictly required to use a type like that, it helps a lot in practice!
 */
enum MoveType {
  DrawEvent,
  PlacePartner,
  TellYouAreReady,
  MoveOnNextPhase,
  RevealPartnersDistricts,
  PlaceToken,
  PlacePatrol,
  ResolveStealToken,
  KickOrNot,
  RevealKickOrNot,
  MovePartner,
  RemoveToken,
  ResolvePatrols,
  MoveOnDistrictResolved,
  ThrowDice,
  GainGold,
  TakeBackPartner,
  SpareGoldOnTreasure,
  SolvePartner,
  BetGold,
  TakeToken,
  ArrestPartners
}

export default MoveType