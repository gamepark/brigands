import DrawCard from './DrawCard'
import DrawEvent from './DrawEvent'
import PlaceThief from './PlaceThief'
import SpendGold from './SpendGold'

/**
 * A "Move" is the combination of all the types of moves that exists in you game
 */
type Move = DrawEvent | PlaceThief

| SpendGold | DrawCard 

// Moves to code !

//  | PlaceToken | PlacePatrol
// | UseStealToken | UseKickToken | UseMoveToken 
// | ResolvePatrols | MoveOnDistrictResolved | ResolveDistrict 

export default Move