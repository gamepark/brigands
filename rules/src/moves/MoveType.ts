/**
 * Enumeration of all the types of Move in you game.
 * Even though it is not strictly required to use a type like that, it helps a lot in practice!
 */
enum MoveType {
  DrawEvent,
  PlaceThief,
  PlaceToken,
  PlacePatrol,
  UseStealToken,
  UseKickToken,
  UseMoveToken,
  ResolvePatrols,
  MoveOnDistrictResolved,
  ResolveDistrict,
  SpendGold,
  DrawCard
}

export default MoveType