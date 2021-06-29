import {SecretInformation, SimultaneousGame} from '@gamepark/rules-api'
import {shuffle} from 'lodash'
import {BrigandsOptions, BrigandsPlayerOptions, isGameOptions} from './BrigandsOptions'
import GameState from './GameState'
import GameView from './GameView'
import {rollDice} from './material/Dice'
import {EventArray} from './material/Events'
import {arrestPartners} from './moves/ArrestPartners'
import BetGold, {betGold} from './moves/BetGold'
import {drawEvent} from './moves/DrawEvent'
import {gainGold} from './moves/GainGold'
import JudgePrisoners, {judgePrisoners} from './moves/JudgePrisoners'
import KickOrNot, {kickOrNot} from './moves/KickOrNot'
import Move from './moves/Move'
import {moveOnDistrictResolved} from './moves/MoveOnDistrictResolved'
import {moveOnNextPhase} from './moves/MoveOnNextPhase'
import MovePartner, {movePartner} from './moves/MovePartner'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlacePartner, {placePartner} from './moves/PlacePartner'
import PlacePatrol, {placePatrol} from './moves/PlacePatrol'
import PlaceToken, {placeToken} from './moves/PlaceToken'
import PlayHeadStart, {playHeadStart} from './moves/PlayHeadStart'
import {removeToken} from './moves/RemoveToken'
import {createSteals, resolveStealToken} from './moves/ResolveStealToken'
import {revealGolds} from './moves/RevealGolds'
import {revealKickOrNot} from './moves/RevealKickOrNot'
import {revealPartnersDistricts} from './moves/RevealPartnersDistricts'
import {solvePartner} from './moves/SolvePartner'
import {spareGoldOnTreasure} from './moves/SpareGoldOnTreasure'
import {takeBackPartner} from './moves/TakeBackPartner'
import TakeToken, {takeToken} from './moves/TakeToken'
import TellYouAreReady, {tellYouAreReady} from './moves/TellYouAreReady'
import {throwDice} from './moves/ThrowDice'
import PlayerState, {isPrinceState, isThief, isThiefState, PrinceState, ThiefState} from './PlayerState'
import District from './types/District'
import DistrictName, {districtNames} from './types/DistrictName'
import Event from './types/Event'
import Partner, {getPartnersView} from './types/Partner'
import Phase from './types/Phase'
import PlayerRole from './types/PlayerRole'
import {ThiefView} from './types/Thief'
import TokenAction from './types/TokenAction'

export default class Brigands extends SimultaneousGame<GameState, Move, PlayerRole>
  implements SecretInformation<GameState, GameView, Move, MoveView, PlayerRole> {

  constructor(state: GameState)
  constructor(options: BrigandsOptions)
  constructor(arg: GameState | BrigandsOptions) {
    if (isGameOptions(arg)) {

      const game: GameState = {
        players: setupPlayers(arg.players),
        city: setupCity(),
        phase: Phase.NewDay,
        eventDeck: setupEventDeck(),
        event: -1,
        districtResolved: undefined
      }
      game.city.find(d => d.name === DistrictName.Treasure)!.gold = 0

      super(game)
    } else {
      super(arg)
    }
  }

  isOver(): boolean {
    return this.state.phase === undefined
  }

  isActive(playerId: PlayerRole): boolean {
    const player = this.state.players.find(p => p.role === playerId)
    if (!player) return false
    switch (this.state.phase) {
      case Phase.Planning:
        return isThief(player) && !player.isReady
      case Phase.Patrolling:
        return isPrinceState(player) && !player.isReady
      case Phase.Solving:
        if (!isThief(player)) {
          return false
        } else {
          const kickerPartners: Partner[] = player.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && player.tokens.kick.some(t => t === index))
          const runnerPartners: Partner[] = player.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && player.tokens.move.some(t => t === index))
          if (kickerPartners.length > 0) {
            return this.state.readyToKickPartners !== true && kickerPartners.some(part => part.kickOrNot === undefined)
          } else if (runnerPartners.length > 0) {
            return player.partners.some((part, index) => part.district === this.state.city[this.state.districtResolved!].name && isThisPartnerHasMoveToken(player, index))
          } else {
            if (this.getThieves().some(p => p.partners.some((part, index) => part.district === this.state.city[this.state.districtResolved!].name && p.tokens.kick.some(ts => ts === index)))) {
              return false
            } else if (this.state.city[this.state.districtResolved!].name !== DistrictName.Harbor && this.state.city[this.state.districtResolved!].name !== DistrictName.Tavern && this.state.city[this.state.districtResolved!].name !== DistrictName.Jail) {
              return false
            } else {
              if (this.state.city[this.state.districtResolved!].name === DistrictName.Harbor) {
                return player.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2))) !== undefined
              } else if (this.state.city[this.state.districtResolved!].name === DistrictName.Tavern) {
                return player.partners.find(p => p.district === DistrictName.Tavern && p.goldForTavern === undefined) !== undefined
              } else {
                return player.partners.find(p => p.district === DistrictName.Jail && p.tokensTaken === undefined) !== undefined
              }
            }
          }
        }
      default :
        return false
    }
  }

  getLegalMoves(role: PlayerRole): Move[] {
    const player = this.state.players.find(p => p.role === role)
    if (player === undefined) {
      return []
    } else if (isPrinceState(player)) {
      if (this.state.phase === Phase.Patrolling) {

        const patrollingMoves: (PlacePatrol | JudgePrisoners | PlayHeadStart | TellYouAreReady)[] = []
        for (let i = 1; i < 9; i++) {
          if (player.gold > 1) {
            player.patrols.includes(i) && patrollingMoves.push({type: MoveType.PlayHeadStart, district: i})
          }
          if (player.gold > 4 && !player.abilities[2] && i !== player.patrols[2] && i !== 1) {
            !player.patrols.includes(i) && patrollingMoves.push({type: MoveType.PlacePatrol, district: i, patrolNumber: 2})
          }
          if (player.patrols.every(pat => pat !== -1)) {
            patrollingMoves.push({type: MoveType.TellYouAreReady, playerId: player.role})
          }
          if (player.patrols.some(pat => pat === -1)) {
            if (i === 1) {
              player.patrols.forEach((pat) => pat === -1 && !player.abilities[0] && patrollingMoves.push({type: MoveType.JudgePrisoners}))
            } else {
              player.patrols.forEach((pat, index) => pat === -1 && !player.patrols.includes(i) && patrollingMoves.push({
                type: MoveType.PlacePatrol, district: i, patrolNumber: index
              }))
            }
          }
        }
        return patrollingMoves
      } else {
        return []
      }
    } else {    //isThief
      if (this.state.phase === Phase.Planning) {
        if (player.isReady) {
          return []
        }
        const planningMoves: (PlacePartner | PlaceToken | TellYouAreReady)[] = []
        if (player.partners.every(part => part.district !== undefined)) {
          planningMoves.push({type: MoveType.TellYouAreReady, playerId: player.role})
        }
        player.partners.forEach((part, index) => {
          if (part.district === undefined) {
            for (let i = 2; i < 9; i++) {
              planningMoves.push({type: MoveType.PlacePartner, playerId: player.role, district: i, partnerNumber: index})
            }
          } else if (!isThisPartnerHasAnyToken(player, index) && part.district !== DistrictName.Jail) {
            const playableTokens: TokenAction[] = getTokensInHand(player)
            for (let j = 0; j < playableTokens.length; j++) {
              planningMoves.push({type: MoveType.PlaceToken, partnerNumber: index, role: player.role, tokenAction: playableTokens[j]})
            }
          }
        })
        return planningMoves

      } else if (this.state.phase === Phase.Solving && this.state.districtResolved !== undefined) {
        const kickerPartners: Partner[] = player.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && isThisPartnerHasKickToken(player, index))
        if (kickerPartners.length > 0) {
          if (kickerPartners.every(part => part.kickOrNot !== undefined)) {
            return []
          } else {
            const kickOrNotResult: KickOrNot[] = []
            kickOrNotResult.push({type: MoveType.KickOrNot, kickerRole: role, playerToKick: false})
            const playersWhoCouldBeKicked: PlayerRole[] = []
            for (const opponent of this.getThieves().filter(p => p.role !== role)) {
              if (opponent.partners.some(part => part.district === this.state.city[this.state.districtResolved!].name)) {
                playersWhoCouldBeKicked.push(opponent.role)
              }
            }
            playersWhoCouldBeKicked.forEach(p => kickOrNotResult.push({type: MoveType.KickOrNot, kickerRole: role, playerToKick: p}))
            return kickOrNotResult
          }
        }

        const runnerPartners: Partner[] = player.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && player.tokens.move.some(tm => tm === index))
        if (runnerPartners.length > 0) {
          const moveArray: MovePartner[] = []
          moveArray.push({type: MoveType.MovePartner, role: false, runner: role})
          moveArray.push({type: MoveType.MovePartner, role: role, runner: role})
          return moveArray
        }

        if (this.state.city[this.state.districtResolved].name !== DistrictName.Tavern && this.state.city[this.state.districtResolved].name !== DistrictName.Harbor && this.state.city[this.state.districtResolved].name !== DistrictName.Jail) {
          return []
        } else {
          if (this.state.city[this.state.districtResolved].name === DistrictName.Tavern) {
            const tavernMoves: BetGold[] = []
            if (player.partners.find(p => p.district === DistrictName.Tavern)) {
              if (player.partners.filter(p => p.district === DistrictName.Tavern).find(p => p.goldForTavern === undefined)) {
                for (let i = 0; i < (this.state.players.find(p => p.role === role)!.gold + 1); i++) {
                  tavernMoves.push({type: MoveType.BetGold, role, gold: i})
                }
              }
            }
            return tavernMoves
          } else if (this.state.city[this.state.districtResolved].name === DistrictName.Harbor) {
            const harborMoves: TakeToken[] = []
            if (player.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))) {
              const takeableTokens: TokenAction[] = getTokensInBank(player)
              for (let i = 0; i < takeableTokens.length; i++) {
                harborMoves.push({type: MoveType.TakeToken, role, token: takeableTokens[i]})
              }
            }
            return harborMoves
          } else {
            const jailMoves: TakeToken[] = []
            if (player.partners.find(p => p.district === DistrictName.Jail && (p.tokensTaken === undefined))) {
              const takeableTokens: TokenAction[] = getTokensInBank(player)
              for (let i = 0; i < takeableTokens.length; i++) {
                jailMoves.push({type: MoveType.TakeToken, role, token: takeableTokens[i]})
              }
            }
            return jailMoves
          }
        }
      } else {
        return []
      }
    }
  }

  play(move: Move): void {
    switch (move.type) {
      case MoveType.DrawEvent:
        return drawEvent(this.state)
      case MoveType.PlacePartner:
        return placePartner(this.state, move)
      case MoveType.PlaceToken:
        return placeToken(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.MoveOnNextPhase:
        return moveOnNextPhase(this.state)
      case MoveType.PlacePatrol:
        return placePatrol(this.state, move)
      case MoveType.RevealPartnersDistricts:
        return revealPartnersDistricts(this.state)
      case MoveType.ThrowDice:
        return throwDice(this.state, move)
      case MoveType.TakeToken:
        return takeToken(this.state, move)
      case MoveType.TakeBackPartner:
        return takeBackPartner(this.state, move)
      case MoveType.SpareGoldOnTreasure:
        return spareGoldOnTreasure(this.state, move)
      case MoveType.SolvePartner:
        return solvePartner(this.state, move)
      case MoveType.GainGold:
        return gainGold(this.state, move)
      case MoveType.BetGold:
        return betGold(this.state, move)
      case MoveType.MoveOnDistrictResolved:
        return moveOnDistrictResolved(this.state, move)
      case MoveType.ArrestPartners:
        return arrestPartners(this.state)
      case MoveType.ResolveStealToken:
        return resolveStealToken(this.state, move)
      case MoveType.KickOrNot :
        return kickOrNot(this.state, move)
      case MoveType.RevealKickOrNot :
        return revealKickOrNot(this.state)
      case MoveType.MovePartner :
        return movePartner(this.state, move)
      case MoveType.RemoveToken :
        return removeToken(this.state, move)
      case MoveType.JudgePrisoners :
        return judgePrisoners(this.state)
      case MoveType.PlayHeadStart :
        return playHeadStart(this.state, move)
      case MoveType.RevealGolds :
        return revealGolds(this.state)
    }
  }


  // VERY IMPORTANT: you should never change the game state in here.
  // Indeed, getAutomaticMove will never be called in replays, for example.

  getAutomaticMove(): void | Move {

    if ((princeWin(this.state) || lastTurnIsOver(this.state)) && this.state.phase !== undefined) {
      return {type: MoveType.RevealGolds}
    }

    if (this.state.phase === Phase.NewDay) {
      return {type: MoveType.DrawEvent}
    }
    if (this.state.phase === Phase.Planning && this.getThieves().every(p => p.isReady)) {
      return {type: MoveType.MoveOnNextPhase}
    }
    if (this.state.phase === Phase.Patrolling && this.state.players.find(isPrinceState)!.isReady) {
      return {type: MoveType.RevealPartnersDistricts}
    }
    if (this.state.districtResolved !== undefined) {
      const districtEvent: Event = EventArray[this.state.event]
      const actualDistrict: District = this.state.city[this.state.districtResolved]

      if (this.state.players.find(isPrinceState)!.abilities[1] === actualDistrict.name) {
        return {type: MoveType.ArrestPartners}
      }

      if (this.getThieves().some(p => p.partners.some((part, index) => part.district === actualDistrict.name && p.tokens.steal.some(ts => ts === index)))) {
        return {type: MoveType.ResolveStealToken, steals: createSteals(this.state)}
      }

      if (this.state.districtResolved + 1 !== this.state.city.length && this.getThieves().some(p => p.partners.some((part, index) => part.district === actualDistrict.name && p.tokens.kick.some(tk => tk === index)))) {
        if (this.state.readyToKickPartners === true) {
          const kicker: ThiefState = this.getThieves().find(p => p.partners.some((part, index) => part.district === actualDistrict.name && p.tokens.kick.some(tk => tk === index)))!
          if (kicker.partners.find((part, index) => part.district === actualDistrict.name && kicker.tokens.kick.some(tk => tk === index))!.kickOrNot !== undefined) {
            return {
              type: MoveType.MovePartner,
              role: kicker.partners.find((part, index) => part.district === actualDistrict.name && kicker.tokens.kick.some(tk => tk === index))!.kickOrNot!,
              kicker: kicker.role
            }
          } else {
            return {
              type: MoveType.RemoveToken, role: kicker.role, tokenAction: TokenAction.Kicking,
              indexPartner: kicker.partners.findIndex((part, index) => part.district === actualDistrict.name && kicker.tokens.kick.some(tk => tk === index))!
            }
          }
        } else if (this.getThieves().filter(p => p.partners.some((part, index) => part.district === actualDistrict.name && isThisPartnerHasKickToken(p, index))).every(p => p.partners.filter((part, index) => part.district === actualDistrict.name && isThisPartnerHasKickToken(p, index)).every(part => part.kickOrNot !== undefined))) {
          return {type: MoveType.RevealKickOrNot}
        } else {
          return
        }
      }

      if (this.state.districtResolved + 1 !== this.state.city.length && this.getThieves().some(p => p.partners.some((part, index) => part.district === actualDistrict.name && isThisPartnerHasMoveToken(p, index)))) {
        console.log('waiting for move token')
        return
      }


      if (actualDistrict.name !== DistrictName.Jail && this.state.players.find(isPrinceState)!.patrols.find(p => p === actualDistrict.name) !== undefined) {
        return {type: MoveType.ArrestPartners}
      }

      switch (actualDistrict.name) {

        case DistrictName.Market :
          console.log('----------On Market----------')
          const thiefOnMarket: ThiefState | undefined = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Market))
          if (thiefOnMarket === undefined) {    // Plus de comparses sur le marché
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else if (actualDistrict.dice === undefined) {    // Aucun dé lancé
            return {type: MoveType.ThrowDice, dice: districtEvent.district === DistrictName.Market ? rollDice(2) : rollDice(1), district: actualDistrict.name}
          } else if (!thiefOnMarket.partners.find(part => part.district === DistrictName.Market)!.solvingDone) {     // Le comparse n'a pas encore pris son argent
            return {type: MoveType.GainGold, gold: actualDistrict.dice!.reduce((acc, vc) => acc + vc), player: thiefOnMarket, district: DistrictName.Market}
          } else {    // Le comparse doit rentrer à la maison
            return {type: MoveType.TakeBackPartner, thief: thiefOnMarket, district: actualDistrict.name}
          }

        case DistrictName.Palace :
          console.log('----------On Palace----------')
          let partnersOnPalace: number = 0;
          this.getThieves().forEach(p => partnersOnPalace += p.partners.filter(part => part.district === DistrictName.Palace).length)
          if (partnersOnPalace > (districtEvent.district === DistrictName.Palace ? 3 : (this.state.players.length < 4 ? 1 : 2))) {
            return {type: MoveType.ArrestPartners}
          } else if (partnersOnPalace === 0) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else {
            const thiefOnPalace: ThiefState = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Palace)!)!
            if (!thiefOnPalace.partners.find(part => part.district === DistrictName.Palace)!.solvingDone) {
              return {type: MoveType.GainGold, gold: 5, player: thiefOnPalace, district: DistrictName.Palace}
            } else {
              return {type: MoveType.TakeBackPartner, thief: thiefOnPalace, district: actualDistrict.name}
            }
          }
        case DistrictName.CityHall :
          console.log('----------On CityHall----------')
          const partnersOnCityHall: Partner[] = [];
          this.getThieves().forEach(p => p.partners.forEach(part => part.district === actualDistrict.name && partnersOnCityHall.push(part)))
          let countPartnersOnCityHall: number = partnersOnCityHall.length
          if (countPartnersOnCityHall === 0) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else if (actualDistrict.dice === undefined) {
            if (partnersOnCityHall.every(p => p.solvingDone === true)) {
              return {
                type: MoveType.TakeBackPartner,
                thief: this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name))!,
                district: actualDistrict.name
              }
            } else {
              return {
                type: MoveType.ThrowDice, dice: rollDice(districtEvent.numberOfDice === undefined ? 2 : districtEvent.numberOfDice + 2),
                district: actualDistrict.name
              }
            }
          } else if (partnersOnCityHall.every(p => p.solvingDone === true)) {
            return {
              type: MoveType.SpareGoldOnTreasure, gold: actualDistrict.dice.reduce((acc, cv) => acc + cv) % countPartnersOnCityHall,
              district: actualDistrict.name
            }
          } else {
            return {
              type: MoveType.GainGold, gold: Math.floor(actualDistrict.dice.reduce((acc, cv) => acc + cv) / countPartnersOnCityHall),
              player: this.getThieves().find(p => p.partners.filter(part => part.district === actualDistrict.name).some(part => part.solvingDone !== true))!,
              district: DistrictName.CityHall
            }
          }

        case DistrictName.Convoy :
          console.log('----------On Convoy----------')
          const partnersOnConvoy: Partner[] = [];
          this.getThieves().forEach(p => p.partners.forEach(part => part.district === actualDistrict.name && partnersOnConvoy.push(part)))
          let countPartnersOnConvoy: number = partnersOnConvoy.length
          if (countPartnersOnConvoy === 0) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else if (actualDistrict.dice === undefined) {
            if (partnersOnConvoy.every(p => p.solvingDone === true)) {
              return {
                type: MoveType.TakeBackPartner,
                thief: this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name))!,
                district: actualDistrict.name
              }
            } else {
              if (partnersOnConvoy.length < (this.state.players.length < 5 ? 2 : 3)) {
                return {type: MoveType.ArrestPartners}
              } else {
                console.log('districtEvent : ', districtEvent)
                return {type: MoveType.ThrowDice, dice: rollDice(districtEvent.district === DistrictName.Convoy ? 6 : 4), district: actualDistrict.name}
              }
            }
          } else if (partnersOnConvoy.every(p => p.solvingDone === true)) {
            return {
              type: MoveType.SpareGoldOnTreasure, gold: actualDistrict.dice.reduce((acc, cv) => acc + cv) % countPartnersOnConvoy, district: actualDistrict.name
            }
          } else {
            return {
              type: MoveType.GainGold, gold: Math.floor(actualDistrict.dice.reduce((acc, cv) => acc + cv) / countPartnersOnConvoy),
              player: this.getThieves().find(p => p.partners.filter(part => part.district === actualDistrict.name).some(part => part.solvingDone !== true))!,
              district: DistrictName.Convoy
            }
          }


        case DistrictName.Treasure :
          console.log('----------On Treasure----------')
          const partnersOnTreasure: Partner[] = [];
          this.getThieves().forEach(p => p.partners.forEach(part => part.district === actualDistrict.name && partnersOnTreasure.push(part)))
          let countPartnersOnTreasure: number = partnersOnTreasure.length
          if (countPartnersOnTreasure === 0) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else if (partnersOnTreasure.every(p => p.solvingDone === true)) {
            return {
              type: MoveType.TakeBackPartner,
              thief: this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name))!,
              district: actualDistrict.name
            }
          } else {
            if (actualDistrict.dice === undefined) {
              return {
                type: MoveType.GainGold, gold: Math.floor(actualDistrict.gold! / countPartnersOnTreasure),
                player: this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name))!,
                district: actualDistrict.name
              }
            } else {
              return {
                type: MoveType.GainGold, gold: actualDistrict.dice[0],
                player: this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name && part.solvingDone !== true))!,
                district: actualDistrict.name
              }
            }
          }

        case DistrictName.Jail :
          console.log('----------On Jail----------')
          const partnersOnJail: Partner[] = [];
          this.getThieves().forEach(p => p.partners.forEach(part => part.district === actualDistrict.name && partnersOnJail.push(part)))
          if (partnersOnJail.every(p => p.tokensTaken === 1)) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else if (partnersOnJail.every(p => p.solvingDone === true)) {
            return  // Partner made a 2 or 3 and must take a token
          } else if (this.state.city.find(d => d.name === actualDistrict.name)!.dice === undefined) {
            return {type: MoveType.ThrowDice, dice: rollDice(1), district: actualDistrict.name}
          } else if (this.state.city.find(d => d.name === actualDistrict.name)!.dice![0] === 4) {
            return {
              type: MoveType.TakeBackPartner,
              thief: this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name && part.solvingDone !== true))!,
              district: actualDistrict.name
            }
          } else {
            let thief = this.getThieves().find(p => p.partners.some(part => part.district === actualDistrict.name && part.solvingDone !== true))!
            return {
              type: MoveType.SolvePartner,
              thief,
              partnerNumber: thief.partners.findIndex(part => part.district === DistrictName.Jail && part.solvingDone !== true)!
            }    // Jailed Partners have to take a token
          }

        case DistrictName.Tavern :    // Actually simultaneous Phase, but can be better if sequatialized for animations ?
          console.log('----------On Tavern----------')
          if (this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Tavern)) === undefined) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else {
            const anyThiefWhoBet = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined))
            if (anyThiefWhoBet === undefined) {
              return
            } else if (actualDistrict.dice === undefined) {
              return {type: MoveType.ThrowDice, dice: rollDice(1), district: actualDistrict.name}
            } else if (anyThiefWhoBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.solvingDone) {
              return {type: MoveType.TakeBackPartner, thief: anyThiefWhoBet, district: actualDistrict.name}
            } else {
              return {
                type: MoveType.GainGold,
                gold: betResult(anyThiefWhoBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.goldForTavern!, actualDistrict.dice[0], EventArray[this.state.event].district === DistrictName.Tavern),
                player: anyThiefWhoBet, district: actualDistrict.name
              }
            }
          }

        case DistrictName.Harbor :
          console.log('----------On Harbor----------')
          if (this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Harbor)) === undefined) {
            return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
          } else {
            const anyThiefWhoTookTokens = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Harbor && part.tokensTaken === (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))
            const anyThiefWhoCantTakeAnymore = this.getThieves().find(p => getTokensInBank(p).length === 0 && p.partners.find(part => part.district === DistrictName.Harbor))
            if (anyThiefWhoTookTokens) {
              return {type: MoveType.TakeBackPartner, thief: anyThiefWhoTookTokens, district: actualDistrict.name}
            }
            if (anyThiefWhoCantTakeAnymore) {
              return {type: MoveType.TakeBackPartner, thief: anyThiefWhoCantTakeAnymore, district: actualDistrict.name}
            }
          }
      }
    }

  }

  getView(playerId?: PlayerRole): GameView {
    return {
      ...this.state,
      eventDeck: this.state.eventDeck.length,
      players: this.state.players.map(player => {
        if (this.state.phase === undefined || isPrinceState(player) || player.role === playerId) {
          return player
        } else {
          const {gold, partners, ...thiefView} = player
          return {
            ...thiefView,
            partners: this.state.phase === Phase.Solving ? partners : getPartnersView(partners)
          }
        }
      })
    }
  }


  getPlayerView(playerId: PlayerRole): GameView {
    console.log(playerId)
    return this.getView(playerId)
  }

  getMoveView(move: Move, playerId?: PlayerRole): MoveView {
    switch (move.type) {
      case MoveType.DrawEvent:
        return {...move, event: this.state.event}
      case MoveType.PlacePartner :
        if (playerId === move.playerId) {
          return move
        } else {
          return {
            type: MoveType.PlacePartner, playerId: move.playerId,
            partner: getPartnersView(this.getThieves().find(p => p.role === move.playerId)!.partners)
          }
        }
      case MoveType.RevealPartnersDistricts: {
        const partnersArray: Partner[][] = []
        this.getThieves().forEach(player => {
          partnersArray.push(player.partners)
        })
        return {type: MoveType.RevealPartnersDistricts, partnersArray}
      }

      case MoveType.KickOrNot:
        if (playerId === move.kickerRole) {
          return move
        } else {
          return {type: MoveType.KickOrNot, kickerRole: move.kickerRole}
        }

      case MoveType.RevealKickOrNot: {
        const partnersArray: Partner[][] = []
        this.getThieves().forEach(player => {
          partnersArray.push(player.partners)
        })
        return {type: MoveType.RevealKickOrNot, partnersArray}
      }

      case MoveType.RevealGolds:
        const goldArray: number[] = []
        this.state.players.forEach(p => {
          if (isThief(p)) {
            goldArray.push(p.gold)
          }
        })
        return {type: MoveType.RevealGolds, goldArray}

      default:
        return move
    }
  }

  getPlayerMoveView(move: Move, playerId: PlayerRole): MoveView {
    return this.getMoveView(move, playerId)
  }

  getThieves() {
    return this.state.players.filter(isThiefState)
  }
}

function princeWin(state: GameState): boolean {
  const prince: PrinceState = state.players.find(isPrinceState)!
  const numberOfPlayers: number = state.players.length
  return prince.victoryPoints >= numberOfPlayers * 10
}

function lastTurnIsOver(state: GameState): boolean {
  return state.phase === Phase.NewDay && state.eventDeck.length === 0

}

function setupPlayers(players: BrigandsPlayerOptions[]): PlayerState[] {

  if (players.every(p => p.id !== PlayerRole.Prince)) {
    throw 'ERROR : No Prince in the composition !'       // Renvoyer une erreur
  } else {
    return players.map((options) => (

      options.id === PlayerRole.Prince
        ? {
          role: options.id,
          gold: 0,
          isReady: false,
          victoryPoints: 0,
          patrols: [-1, -1, -1],
          abilities: [false, false, false]
        }
        : {
          role: options.id,
          gold: 3,
          isReady: false,
          partners: [{}, {}, {}],
          tokens: {steal: [], kick: [], move: []}
        }

    ))
  }

}

function betResult(goldBet: number, dice: number, isEvent: boolean): number {
  if (isEvent) {
    return dice[0] === 2 ? 0 : goldBet * 3
  } else {
    switch (dice[0]) {
      case 2 :
        return 0
      case 3:
        return goldBet * 2
      case 4:
        return goldBet * 4
      default:
        return 0
    }
  }
}

function setupCity(): District[] {
  const districts = shuffle(districtNames.filter(district => district !== DistrictName.Jail))
  districts.push(DistrictName.Jail)
  return districts.map(district => ({name: district, gold: district === DistrictName.Treasure ? 0 : undefined}))

}

function setupEventDeck(): number[] {
  const result = shuffle(Array.from(EventArray.keys()))
  return result.slice(0, 6)
}

function getTokensInHand(thief: ThiefState): TokenAction[] {
  const result: TokenAction[] = []
  for (let i = 0; i < thief.tokens.steal.length; i++) {
    thief.tokens.steal[i] === -1 && result.push(TokenAction.Stealing)
  }
  for (let i = 0; i < thief.tokens.kick.length; i++) {
    thief.tokens.kick[i] === -1 && result.push(TokenAction.Kicking)
  }
  for (let i = 0; i < thief.tokens.move.length; i++) {
    thief.tokens.move[i] === -1 && result.push(TokenAction.Fleeing)
  }
  return result
}

export function getTokensInBank(thief: ThiefState): TokenAction[] {
  const result: TokenAction[] = []
  for (let i = 0; i < 2 - thief.tokens.steal.length; i++) {
    result.push(TokenAction.Stealing)
  }
  for (let i = 0; i < 2 - thief.tokens.kick.length; i++) {
    result.push(TokenAction.Kicking)
  }
  for (let i = 0; i < 2 - thief.tokens.move.length; i++) {
    result.push(TokenAction.Fleeing)
  }

  return result

}

export function isThisPartnerHasAnyToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.steal.some(t => t === partnerNumber) || thief.tokens.kick.some(t => t === partnerNumber) || thief.tokens.move.some(t => t === partnerNumber)
}

export function isThisPartnerHasStealToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.steal.some(t => t === partnerNumber)
}

export function isThisPartnerHasKickToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.kick.some(t => t === partnerNumber)
}

export function isThisPartnerHasMoveToken(thief: ThiefState | ThiefView, partnerNumber: number): boolean {
  return thief.tokens.move.some(t => t === partnerNumber)
}