import DrawCard from './DrawCard'
import DrawEvent from './DrawEvent'
import PlacePartner from './PlacePartner'
import PlaceThief from './PlacePartner'
import SpendGold from './SpendGold'
import TellYouAreReady from './TellYouAreReady'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = DrawEvent | PlacePartner | TellYouAreReady

| SpendGold | DrawCard 

// Moves to code !

//  | PlaceToken | PlacePatrol
// | UseStealToken | UseKickToken | UseMoveToken 
// | ResolvePatrols | MoveOnDistrictResolved | ResolveDistrict 

export default Move