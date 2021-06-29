import {getTokensInBank, isThisPartnerHasKickToken, isThisPartnerHasMoveToken} from '../Brigands'
import {getPrince} from '../GameView'
import {rollDice} from '../material/Dice'
import {EventArray} from '../material/Events'
import BetGold from '../moves/BetGold'
import KickOrNot from '../moves/KickOrNot'
import Move from '../moves/Move'
import MovePartner from '../moves/MovePartner'
import MoveType from '../moves/MoveType'
import {createSteals} from '../moves/ResolveStealToken'
import TakeToken from '../moves/TakeToken'
import {ThiefState} from '../PlayerState'
import District from '../districts/District'
import DistrictName from '../districts/DistrictName'
import Event from '../types/Event'
import Partner from '../types/Partner'
import PlayerRole from '../types/PlayerRole'
import TokenAction from '../types/TokenAction'
import {PhaseRules} from './PhaseRules'

export default class Solving extends PhaseRules {
  isThiefActive(thief: ThiefState): boolean {
    const kickerPartners: Partner[] = thief.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && thief.tokens.kick.some(t => t === index))
    const runnerPartners: Partner[] = thief.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && thief.tokens.move.some(t => t === index))
    if (kickerPartners.length > 0) {
      return this.state.readyToKickPartners !== true && kickerPartners.some(part => part.kickOrNot === undefined)
    } else if (runnerPartners.length > 0) {
      return thief.partners.some((part, index) => part.district === this.state.city[this.state.districtResolved!].name && isThisPartnerHasMoveToken(thief, index))
    } else {
      if (this.getThieves().some(p => p.partners.some((part, index) => part.district === this.state.city[this.state.districtResolved!].name && p.tokens.kick.some(ts => ts === index)))) {
        return false
      } else if (this.state.city[this.state.districtResolved!].name !== DistrictName.Harbor && this.state.city[this.state.districtResolved!].name !== DistrictName.Tavern && this.state.city[this.state.districtResolved!].name !== DistrictName.Jail) {
        return false
      } else {
        if (this.state.city[this.state.districtResolved!].name === DistrictName.Harbor) {
          return thief.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2))) !== undefined
        } else if (this.state.city[this.state.districtResolved!].name === DistrictName.Tavern) {
          return thief.partners.find(p => p.district === DistrictName.Tavern && p.goldForTavern === undefined) !== undefined
        } else {
          return thief.partners.find(p => p.district === DistrictName.Jail && p.tokensTaken === 0) !== undefined
        }
      }
    }
  }

  getThiefLegalMoves(thief: ThiefState): Move[] {
    if (this.state.districtResolved !== undefined) {
      const kickerPartners: Partner[] = thief.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && isThisPartnerHasKickToken(thief, index))
      if (kickerPartners.length > 0) {
        if (kickerPartners.every(part => part.kickOrNot !== undefined)) {
          return []
        } else {
          const kickOrNotResult: KickOrNot[] = []
          kickOrNotResult.push({type: MoveType.KickOrNot, kickerRole: thief.role, playerToKick: false})
          const playersWhoCouldBeKicked: PlayerRole[] = []
          for (const opponent of this.getThieves().filter(p => p.role !== thief.role)) {
            if (opponent.partners.some(part => part.district === this.state.city[this.state.districtResolved!].name)) {
              playersWhoCouldBeKicked.push(opponent.role)
            }
          }
          playersWhoCouldBeKicked.forEach(p => kickOrNotResult.push({type: MoveType.KickOrNot, kickerRole: thief.role, playerToKick: p}))
          return kickOrNotResult
        }
      }

      const runnerPartners: Partner[] = thief.partners.filter((p, index) => p.district === this.state.city[this.state.districtResolved!].name && thief.tokens.move.some(tm => tm === index))
      if (runnerPartners.length > 0) {
        const moveArray: MovePartner[] = []
        moveArray.push({type: MoveType.MovePartner, role: false, runner: thief.role})
        moveArray.push({type: MoveType.MovePartner, role: thief.role, runner: thief.role})
        return moveArray
      }

      if (this.state.city[this.state.districtResolved].name !== DistrictName.Tavern && this.state.city[this.state.districtResolved].name !== DistrictName.Harbor && this.state.city[this.state.districtResolved].name !== DistrictName.Jail) {
        return []
      } else {
        if (this.state.city[this.state.districtResolved].name === DistrictName.Tavern) {
          const tavernMoves: BetGold[] = []
          if (thief.partners.find(p => p.district === DistrictName.Tavern)) {
            if (thief.partners.filter(p => p.district === DistrictName.Tavern).find(p => p.goldForTavern === undefined)) {
              for (let i = 0; i < (this.state.players.find(p => p.role === thief.role)!.gold + 1); i++) {
                tavernMoves.push({type: MoveType.BetGold, role: thief.role, gold: i})
              }
            }
          }
          return tavernMoves
        } else if (this.state.city[this.state.districtResolved].name === DistrictName.Harbor) {
          const harborMoves: TakeToken[] = []
          if (thief.partners.find(p => p.district === DistrictName.Harbor && (p.tokensTaken === undefined || p.tokensTaken < (EventArray[this.state.event].district === DistrictName.Harbor ? 3 : 2)))) {
            const takeableTokens: TokenAction[] = getTokensInBank(thief)
            for (let i = 0; i < takeableTokens.length; i++) {
              harborMoves.push({type: MoveType.TakeToken, role: thief.role, token: takeableTokens[i]})
            }
          }
          return harborMoves
        } else {
          const jailMoves: TakeToken[] = []
          if (thief.partners.find(p => p.district === DistrictName.Jail && (p.tokensTaken === 0))) {
            const takeableTokens: TokenAction[] = getTokensInBank(thief)
            for (let i = 0; i < takeableTokens.length; i++) {
              jailMoves.push({type: MoveType.TakeToken, role: thief.role, token: takeableTokens[i]})
            }
          }
          return jailMoves
        }
      }
    } else {
      return []
    }
  }

  getAutomaticMove(): Move | void {
    if (this.state.districtResolved === undefined) return

    const prince = getPrince(this.state)
    const district: District = this.state.city[this.state.districtResolved]
    const districtHasPatrol = prince.patrols.some(patrol => patrol === district.name)

    if (districtHasPatrol && prince.abilities[1] === district.name) {
      return {type: MoveType.ArrestPartners}
    }

    if (this.hasStealToken(district)) {
      return {type: MoveType.ResolveStealToken, steals: createSteals(this.state)}
    }
    if (this.hasKickToken(district)) {
      return this.getKickTokenAutomaticMove(district)
    }
    if (this.hasMoveToken(district)) {
      // TODO: simultaneous secrete decision whether to move or not
      return
    }

    if (district.name !== DistrictName.Jail && districtHasPatrol) {
      return {type: MoveType.ArrestPartners}
    }

    const event: Event = EventArray[this.state.event]
    switch (district.name) {
      case DistrictName.Market :
        console.log('----------On Market----------')
        const thiefOnMarket: ThiefState | undefined = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Market))
        if (thiefOnMarket === undefined) {    // Plus de comparses sur le marché
          return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
        } else if (district.dice === undefined) {    // Aucun dé lancé
          return {type: MoveType.ThrowDice, dice: event.district === DistrictName.Market ? rollDice(2) : rollDice(1), district: district.name}
        } else if (!thiefOnMarket.partners.find(part => part.district === DistrictName.Market)!.solvingDone) {     // Le comparse n'a pas encore pris son argent
          return {type: MoveType.GainGold, gold: district.dice!.reduce((acc, vc) => acc + vc), player: thiefOnMarket, district: DistrictName.Market}
        } else {    // Le comparse doit rentrer à la maison
          return {type: MoveType.TakeBackPartner, thief: thiefOnMarket, district: district.name}
        }

      case DistrictName.Palace :
        console.log('----------On Palace----------')
        let partnersOnPalace: number = 0
        this.getThieves().forEach(p => partnersOnPalace += p.partners.filter(part => part.district === DistrictName.Palace).length)
        if (partnersOnPalace > (event.district === DistrictName.Palace ? 3 : (this.state.players.length < 4 ? 1 : 2))) {
          return {type: MoveType.ArrestPartners}
        } else if (partnersOnPalace === 0) {
          return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
        } else {
          const thiefOnPalace: ThiefState = this.getThieves().find(p => p.partners.find(part => part.district === DistrictName.Palace)!)!
          if (!thiefOnPalace.partners.find(part => part.district === DistrictName.Palace)!.solvingDone) {
            return {type: MoveType.GainGold, gold: 5, player: thiefOnPalace, district: DistrictName.Palace}
          } else {
            return {type: MoveType.TakeBackPartner, thief: thiefOnPalace, district: district.name}
          }
        }
      case DistrictName.CityHall :
        console.log('----------On CityHall----------')
        const partnersOnCityHall: Partner[] = []
        this.getThieves().forEach(p => p.partners.forEach(part => part.district === district.name && partnersOnCityHall.push(part)))
        let countPartnersOnCityHall: number = partnersOnCityHall.length
        if (countPartnersOnCityHall === 0) {
          return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
        } else if (district.dice === undefined) {
          if (partnersOnCityHall.every(p => p.solvingDone === true)) {
            return {
              type: MoveType.TakeBackPartner,
              thief: this.getThieves().find(p => p.partners.some(part => part.district === district.name))!,
              district: district.name
            }
          } else {
            return {
              type: MoveType.ThrowDice, dice: rollDice(event.numberOfDice === undefined ? 2 : event.numberOfDice + 2),
              district: district.name
            }
          }
        } else if (partnersOnCityHall.every(p => p.solvingDone === true)) {
          return {
            type: MoveType.SpareGoldOnTreasure, gold: district.dice.reduce((acc, cv) => acc + cv) % countPartnersOnCityHall,
            district: district.name
          }
        } else {
          return {
            type: MoveType.GainGold, gold: Math.floor(district.dice.reduce((acc, cv) => acc + cv) / countPartnersOnCityHall),
            player: this.getThieves().find(p => p.partners.filter(part => part.district === district.name).some(part => part.solvingDone !== true))!,
            district: DistrictName.CityHall
          }
        }

      case DistrictName.Convoy :
        console.log('----------On Convoy----------')
        const partnersOnConvoy: Partner[] = []
        this.getThieves().forEach(p => p.partners.forEach(part => part.district === district.name && partnersOnConvoy.push(part)))
        let countPartnersOnConvoy: number = partnersOnConvoy.length
        if (countPartnersOnConvoy === 0) {
          return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
        } else if (district.dice === undefined) {
          if (partnersOnConvoy.every(p => p.solvingDone === true)) {
            return {
              type: MoveType.TakeBackPartner,
              thief: this.getThieves().find(p => p.partners.some(part => part.district === district.name))!,
              district: district.name
            }
          } else {
            if (partnersOnConvoy.length < (this.state.players.length < 5 ? 2 : 3)) {
              return {type: MoveType.ArrestPartners}
            } else {
              console.log('districtEvent : ', event)
              return {type: MoveType.ThrowDice, dice: rollDice(event.district === DistrictName.Convoy ? 6 : 4), district: district.name}
            }
          }
        } else if (partnersOnConvoy.every(p => p.solvingDone === true)) {
          return {
            type: MoveType.SpareGoldOnTreasure, gold: district.dice.reduce((acc, cv) => acc + cv) % countPartnersOnConvoy, district: district.name
          }
        } else {
          return {
            type: MoveType.GainGold, gold: Math.floor(district.dice.reduce((acc, cv) => acc + cv) / countPartnersOnConvoy),
            player: this.getThieves().find(p => p.partners.filter(part => part.district === district.name).some(part => part.solvingDone !== true))!,
            district: DistrictName.Convoy
          }
        }


      case DistrictName.Treasure :
        console.log('----------On Treasure----------')
        const partnersOnTreasure: Partner[] = []
        this.getThieves().forEach(p => p.partners.forEach(part => part.district === district.name && partnersOnTreasure.push(part)))
        let countPartnersOnTreasure: number = partnersOnTreasure.length
        if (countPartnersOnTreasure === 0) {
          return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
        } else if (partnersOnTreasure.every(p => p.solvingDone === true)) {
          return {
            type: MoveType.TakeBackPartner,
            thief: this.getThieves().find(p => p.partners.some(part => part.district === district.name))!,
            district: district.name
          }
        } else {
          if (district.dice === undefined) {
            return {
              type: MoveType.GainGold, gold: Math.floor(district.gold! / countPartnersOnTreasure),
              player: this.getThieves().find(p => p.partners.some(part => part.district === district.name))!,
              district: district.name
            }
          } else {
            return {
              type: MoveType.GainGold, gold: district.dice[0],
              player: this.getThieves().find(p => p.partners.some(part => part.district === district.name && part.solvingDone !== true))!,
              district: district.name
            }
          }
        }

      case DistrictName.Jail :
        console.log('----------On Jail----------')
        const partnersOnJail: Partner[] = []
        this.getThieves().forEach(p => p.partners.forEach(part => part.district === district.name && partnersOnJail.push(part)))
        if (partnersOnJail.every(p => p.tokensTaken === 1)) {
          console.log("end Jail")
          return {type: MoveType.MoveOnDistrictResolved, districtResolved: this.state.districtResolved}
        } else if (partnersOnJail.every(p => p.solvingDone === true)) {
          return  // Partner made a 2 or 3 and must take a token
        } else if (this.state.city.find(d => d.name === district.name)!.dice === undefined) {
          return {type: MoveType.ThrowDice, dice: rollDice(1), district: district.name}
        } else if (this.state.city.find(d => d.name === district.name)!.dice![0] === 4) {
          return {
            type: MoveType.TakeBackPartner,
            thief: this.getThieves().find(p => p.partners.some(part => part.district === district.name && part.solvingDone !== true))!,
            district: district.name
          }
        } else {
          let thief = this.getThieves().find(p => p.partners.some(part => part.district === district.name && part.solvingDone !== true))!
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
          } else if (district.dice === undefined) {
            return {type: MoveType.ThrowDice, dice: rollDice(1), district: district.name}
          } else if (anyThiefWhoBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.solvingDone) {
            return {type: MoveType.TakeBackPartner, thief: anyThiefWhoBet, district: district.name}
          } else {
            return {
              type: MoveType.GainGold,
              gold: betResult(anyThiefWhoBet.partners.find(part => part.district === DistrictName.Tavern && part.goldForTavern !== undefined)!.goldForTavern!, district.dice[0], EventArray[this.state.event].district === DistrictName.Tavern),
              player: anyThiefWhoBet, district: district.name
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
            return {type: MoveType.TakeBackPartner, thief: anyThiefWhoTookTokens, district: district.name}
          }
          if (anyThiefWhoCantTakeAnymore) {
            return {type: MoveType.TakeBackPartner, thief: anyThiefWhoCantTakeAnymore, district: district.name}
          }
        }
    }
  }

  hasStealToken(district: District) {
    return this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && p.tokens.steal.some(ts => ts === index)))
  }

  hasKickToken(district: District) {
    return this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && p.tokens.kick.some(tk => tk === index)))
  }

  getKickTokenAutomaticMove(district: District): Move | void {
    if (this.state.readyToKickPartners) {
      const kicker = this.getThieves().find(p => p.partners.some((part, index) => part.district === district.name && p.tokens.kick.some(tk => tk === index)))!
      if (kicker.partners.find((part, index) => part.district === district.name && kicker.tokens.kick.some(tk => tk === index))!.kickOrNot !== undefined) {
        return {
          type: MoveType.MovePartner,
          role: kicker.partners.find((part, index) => part.district === district.name && kicker.tokens.kick.some(tk => tk === index))!.kickOrNot!,
          kicker: kicker.role
        }
      } else {
        return {
          type: MoveType.RemoveToken, role: kicker.role, tokenAction: TokenAction.Kicking,
          indexPartner: kicker.partners.findIndex((part, index) => part.district === district.name && kicker.tokens.kick.some(tk => tk === index))!
        }
      }
    } else if (this.getThieves().filter(p => p.partners.some((part, index) => part.district === district.name && isThisPartnerHasKickToken(p, index))).every(p => p.partners.filter((part, index) => part.district === district.name && isThisPartnerHasKickToken(p, index)).every(part => part.kickOrNot !== undefined))) {
      return {type: MoveType.RevealKickOrNot}
    } else {
      return
    }
  }

  hasMoveToken(district: District) {
    return this.getThieves().some(p => p.partners.some((part, index) => part.district === district.name && isThisPartnerHasMoveToken(p, index)))
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