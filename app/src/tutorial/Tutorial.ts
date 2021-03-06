import {setupPlayers} from '@gamepark/brigands/Brigands'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import GameState from '@gamepark/brigands/GameState'
import Move from '@gamepark/brigands/moves/Move'
import Phase from '@gamepark/brigands/phases/Phase'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {TutorialDescription} from '@gamepark/react-client'

const tabCity: District[] = [
  {name: DistrictName.Market},
  {name: DistrictName.CityHall},
  {name: DistrictName.Harbor},
  {name: DistrictName.Convoy},
  {name: DistrictName.Palace},
  {name: DistrictName.Tavern},
  {name: DistrictName.Treasure, gold: 0},
  {name: DistrictName.Jail}
]
const tabPlayers = setupPlayers([{id: PlayerRole.YellowThief}, {id: PlayerRole.GreenThief}, {id: PlayerRole.Prince}])
const deck: number[] = [DistrictName.Market, DistrictName.Tavern, DistrictName.Harbor, DistrictName.Palace, DistrictName.CityHall, DistrictName.Convoy]

const BrigandsTutorial: TutorialDescription<GameState, Move, PlayerRole> = {

  setupTutorial: () => [{
    city: tabCity,
    players: tabPlayers,
    phase: Phase.NewDay,
    deck,
    dayCards: [],
    nextMoves: [],
    currentDistrict: undefined,
    tutorial: true
  }, [PlayerRole.YellowThief, PlayerRole.GreenThief, PlayerRole.Prince]],

  expectedMoves: () => [

    // Turn 1

    /*[{type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 0, district: DistrictName.Market},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 1, district: DistrictName.Market},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 2, district: DistrictName.Market}],
    [{type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 0, district: DistrictName.CityHall},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 1, district: DistrictName.CityHall},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 2, district: DistrictName.CityHall}],
    [{type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 0, district: DistrictName.Harbor},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 1, district: DistrictName.Harbor},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 2, district: DistrictName.Harbor}],
    {type: MoveType.TellYouAreReady, playerId: PlayerRole.YellowThief},

    {type: MoveType.PlaceMeeple, playerId: PlayerRole.GreenThief, partnerNumber: 0, district: DistrictName.CityHall},
    {type: MoveType.PlaceMeeple, playerId: PlayerRole.GreenThief, partnerNumber: 1, district: DistrictName.Treasure},
    {type: MoveType.PlaceMeeple, playerId: PlayerRole.GreenThief, partnerNumber: 2, district: DistrictName.Treasure},
    {type: MoveType.TellYouAreReady, playerId: PlayerRole.GreenThief},

    {type: MoveType.PlacePatrol, patrolNumber: 0, district: DistrictName.Palace},
    {type: MoveType.PlacePatrol, patrolNumber: 1, district: DistrictName.Treasure},
    {type: MoveType.TellYouAreReady, playerId: PlayerRole.Prince},

    {type: MoveType.MoveOnDistrictResolved, districtResolved: 0},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 1},

    {type: MoveType.TakeToken, role: PlayerRole.YellowThief, token: TokenAction.Stealing},
    {type: MoveType.TakeToken, role: PlayerRole.YellowThief, token: TokenAction.Kicking},
    {type: MoveType.TakeToken, role: PlayerRole.YellowThief, token: TokenAction.Fleeing},

    {type: MoveType.MoveOnDistrictResolved, districtResolved: 2},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 3},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 4},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 5},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 6},

    {type: MoveType.TakeToken, role: PlayerRole.GreenThief, token: TokenAction.Stealing},

    {type: MoveType.MoveOnDistrictResolved, districtResolved: 7},


    // Turn 2

    [{type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 0, district: DistrictName.Convoy},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 1, district: DistrictName.Convoy},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 2, district: DistrictName.Convoy}],
    [{type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 0, tokenAction: TokenAction.Stealing},
      {type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 1, tokenAction: TokenAction.Stealing},
      {type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 2, tokenAction: TokenAction.Stealing}],
    [{type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 0, district: DistrictName.Palace},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 1, district: DistrictName.Palace},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 2, district: DistrictName.Palace}],
    [{type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 0, tokenAction: TokenAction.Fleeing},
      {type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 1, tokenAction: TokenAction.Fleeing},
      {type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 2, tokenAction: TokenAction.Fleeing}],
    [{type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 0, district: DistrictName.Tavern},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 1, district: DistrictName.Tavern},
      {type: MoveType.PlaceMeeple, playerId: PlayerRole.YellowThief, partnerNumber: 2, district: DistrictName.Tavern}],
    [{type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 0, tokenAction: TokenAction.Kicking},
      {type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 1, tokenAction: TokenAction.Kicking},
      {type: MoveType.PlaceToken, role: PlayerRole.YellowThief, partnerNumber: 2, tokenAction: TokenAction.Kicking}],
    {type: MoveType.TellYouAreReady, playerId: PlayerRole.YellowThief},

    {type: MoveType.PlaceMeeple, playerId: PlayerRole.GreenThief, partnerNumber: 0, district: DistrictName.Tavern},
    {type: MoveType.PlaceMeeple, playerId: PlayerRole.GreenThief, partnerNumber: 1, district: DistrictName.Convoy},
    {type: MoveType.TellYouAreReady, playerId: PlayerRole.GreenThief},

    {type: MoveType.PlacePatrol, patrolNumber: 0, district: DistrictName.Jail},
    {type: MoveType.PlacePatrol, patrolNumber: 1, district: DistrictName.Treasure},
    {type: MoveType.PlacePatrol, patrolNumber: 2, district: DistrictName.Harbor},
    {type: MoveType.TellYouAreReady, playerId: PlayerRole.Prince},

    {type: MoveType.MoveOnDistrictResolved, districtResolved: 0},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 1},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 2},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 3},
    {type: MoveType.MovePartner, role: false, runner: PlayerRole.YellowThief},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 4},
    {type: MoveType.KickOrNot, kickerRole: PlayerRole.YellowThief, playerToKick: PlayerRole.GreenThief},
    {type: MoveType.BetGold, role: PlayerRole.YellowThief, gold: 3},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 5},
    {type: MoveType.MoveOnDistrictResolved, districtResolved: 6}*/

  ]

}

export default BrigandsTutorial