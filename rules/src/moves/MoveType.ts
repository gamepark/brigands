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
  UseStealToken,
  UseKickToken,
  UseMoveToken,
  ResolvePatrols,
  MoveOnDistrictResolved,
  ResolveDistrict,

  ThrowDice,
  GainGold,
  TakeBackPartner,
  SpareGoldOnTreasure,
}

export default MoveType