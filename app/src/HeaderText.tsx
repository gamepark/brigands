/** @jsxImportSource @emotion/react */
import { isThisPartnerHasAnyToken, isThisPartnerHasKickToken, isThisPartnerHasMoveToken, isThisPartnerHasStealToken } from '@gamepark/brigands/Brigands'
import { getPlayerName } from '@gamepark/brigands/BrigandsOptions'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import GameView, { getPrince, getThieves } from '@gamepark/brigands/GameView'
import { EventArray } from '@gamepark/brigands/material/Events'
import Phase from '@gamepark/brigands/phases/Phase'
import { isThiefState, ThiefState } from '@gamepark/brigands/PlayerState'
import { isPartner } from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import { ThiefView } from '@gamepark/brigands/types/Thief'
import { Player as PlayerInfo, usePlayerId, usePlayers } from '@gamepark/react-client'
import { TFunction } from 'i18next'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameView
}

export default function HeaderText({loading, game}: Props) {
  const {t} = useTranslation()
  if (loading || !game) return <>{t('Game loading...')}</>

  if (!game.phase){
    return <HeaderGameOverText game={game} />
  } else {
    return <HeaderOnGoingGameText game={game} />
  }
}

function getMaxScoreThief(thieves:(ThiefState | ThiefView)[]):number{
  let max:number = 0
  thieves.forEach(p => {
    if (isThiefState(p)){
      const numberOfToken:number = p.tokens.steal.length + p.tokens.kick.length + p.tokens.move.length
      if (p.gold + numberOfToken > max){
        max = p.gold + numberOfToken
      }
    }
  })
  return max
}

function getPseudo(player: PlayerRole, players: PlayerInfo<PlayerRole>[], t: TFunction): string {
  if (players.find(p => p.id === player, t)!.name === undefined) {
      return getPlayerName(player, t)
  } else {
      return players.find(p => p.id === player, t)!.name!
  }
}

function HeaderGameOverText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerRole>()
  const players = usePlayers<PlayerRole>()
  const prince = getPrince(game)
  const thieves = getThieves(game)
  const maxScoreThief = getMaxScoreThief(thieves)
  

  if (getPrince(game).victoryPoints >= game.players.length * 10){
    if (playerId === PlayerRole.Prince){
      return <> {t("game.over.you.win.prince", {score:getPrince(game).victoryPoints})} </>
    } else {
      return <> {t("game.over.player.win.prince", {player: getPseudo(prince.role,players, t) , score:getPrince(game).victoryPoints})} </>
    }
  } else {
    const winnerThieves = thieves.filter(p => isThiefState(p) && p.gold === maxScoreThief)
    if (winnerThieves.length === 1){
      if (playerId === winnerThieves[0].role){
        return <> {t("game.over.you.win.thief", {score:maxScoreThief})} </>
      } else {
        return <> {t("game.over.player.win.thief", {player:getPseudo(winnerThieves[0].role, players, t) , score:maxScoreThief})} </>
      }
    } else if (winnerThieves.length === 2){
      return <> {t("game.over.2.thieves.tie", {
        player1: getPseudo(winnerThieves[0].role, players, t),
        player2 : getPseudo(winnerThieves[1].role, players, t),
        score: maxScoreThief
      })} </>
    } else if (winnerThieves.length === 3){
      return <> {t("game.over.3.thieves.tie", {
        player1: getPseudo(winnerThieves[0].role, players, t),
        player2 : getPseudo(winnerThieves[1].role, players, t),
        player3 : getPseudo(winnerThieves[2].role, players, t),
        score: maxScoreThief
      })} </>
    } else if (winnerThieves.length === 4){
      return <> {t("game.over.4.thieves.tie", {
        player1: getPseudo(winnerThieves[0].role, players, t),
        player2 : getPseudo(winnerThieves[1].role, players, t),
        player3 : getPseudo(winnerThieves[2].role, players, t),
        player4 : getPseudo(winnerThieves[3].role, players, t),
        score: maxScoreThief
      })} </>
    } else {
      return <> {t("game.over.perfect.tie", {score:maxScoreThief})} </>
    }
  }
}

function HeaderOnGoingGameText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerRole>()
  const players = usePlayers<PlayerRole>()

  switch(game.phase){
    case Phase.NewDay:{
      return <> {t("new.day")} </>
    }

    case Phase.Planning:{
      if(playerId === undefined || playerId === PlayerRole.Prince){
        return <> {t("planning.you.wait")} </>
      } else {
        const thief = getThieves(game).find(p => p.role === playerId)!
        if (thief.isReady === true){
          if (getThieves(game).filter(p => p.isReady !== true).length === 1){
            return <> {t("planning.you.are.ready.wait.one.thief", {player:getPseudo(getThieves(game).find(p => p.isReady !== true)!.role, players, t)})} </>
          } else {
            return <> {t("planning.you.are.ready")} </>
          }
        } else if (thief.partners.every(part => isPartner(part) && part.district !== undefined)){
          return <> {t("planning.you.clic.ready")} </>
        } else {
          return <> {t("planning.you.place.partners")} </>
        }
      }
    }

    case Phase.Patrolling:{
      const prince = getPrince(game)
      if (prince.isReady === true){
        return <> {t("patrolling.reveal")} </>
      } else if (playerId === undefined){
        return <> {t("patrolling.spec")} </>
      } else if (playerId === PlayerRole.Prince){
        if (prince.patrols.every(pat => pat !== -1)){
          return <> {t("patrolling.you.clic.ready")} </>
        } else {
          return <> {t("patrolling.you.place.patrols")} </>
        }
      } else {
        return <> {t("patrolling.you.wait", {prince:getPseudo(getPrince(game).role, players, t)})} </>
      }
    }

    case Phase.Solving:{
      const district=game.city[game.districtResolved!]
      const thief = getThieves(game).find(p => p.role === playerId)!

      if(getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length === 0){
        return <> {t("solving.end.of.district")} </>
      } else if (getPrince(game).patrols.some(pat => pat === district.name && getPrince(game).abilities[1] === district.name)){
        return <> {t("solving.fast.arrest")} </>
      } else if (getThieves(game).filter(p => p.partners.some((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasAnyToken(p, index))).length > 0) {

        if (getThieves(game).filter(p => p.partners.some((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasStealToken(p, index))).length > 0){
          return <> {t("solving.steal.token")} </>
        } else if (getThieves(game).filter(p => p.partners.some((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasKickToken(p, index)))){
          if (thief.partners.find((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasKickToken(thief, index))){
            if (thief.partners.find((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasKickToken(thief, index) && part.kickOrNot === undefined)){
              return <> {t("solving.kick.token.choose", {howManyTimesLeft: thief.partners.filter((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasKickToken(thief, index) && part.kickOrNot === undefined).length})} </>
            } else {
              return <> {t("solving.kick.token.wait")} </>
            }
          } else {
            return <> {t("solving.kick.token.wait")} </>
          }
        } else {
          if (thief.partners.find((part, index) => isPartner(part) && part.district === district.name && isThisPartnerHasMoveToken(thief, index))){
            <> {t("solving.move.token.choose")} </>
          }
          return <> {t("solving.move.token.wait")} </>
        }

      } else if (getPrince(game).patrols.some(pat => pat === district.name)){
        return <> {t("solving.arrest")} </>
      } else {
        const thief = getThieves(game).find(p => p.role === playerId)!
        const partnersOnDistrict = getThieves(game).flatMap(thief => thief.partners.filter(part => isPartner(part) &&  part.district === district.name))
        const isEvent : boolean = EventArray[game.event].district === district.name
        switch(district.name){
          case DistrictName.Jail:{
            if (getThieves(game).every(p => p.partners.every(part => !isPartner(part) || part.district !== district.name || part.solvingDone !== true))){
              if (district.dice === undefined){
                return <> {t("solving.jail.dice", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role,players, t)})} </> 
              } else if (district.dice[0] === 4){
                return <> {t("solving.jail.free.partner", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role,players, t)})} </>
              } else {
                return <> {t("solving.jail.stay.in.jail", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role,players, t)})} </>
              }
            } else {
              if (playerId === undefined || playerId === PlayerRole.Prince || getThieves(game).find(p => p.role === playerId)!.partners.every(part => !isPartner(part) || part.district !== district.name || part.tokensTaken === 1)){
                if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.tokensTaken === 0)).length === 1){
                  return <> {t("solving.jail.wait.one.player", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.tokensTaken === 0))!.role, players, t)})} </>
                } else {
                  return <> {t("solving.jail.wait.players")} </>
                }
              } else {
                return <> {t("solving.jail.you.take.token")} </>
              }
            }
          }
          case DistrictName.CityHall:{
            if (district.dice === undefined){
              return <> {t("solving.cityhall.dice")} </>
            } else if (partnersOnDistrict.every(part => part.solvingDone === true)){
              return <> {t("solving.cityhall.place.gold.on.treasure")} </>
            } else {
              return <> {t("solving.cityhall.gain.gold", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t)})} </>
            }
          }
          case DistrictName.Convoy:{

            if ((partnersOnDistrict.length < (getThieves(game).length < 4 ? 2 : 3)) && district.dice === undefined && partnersOnDistrict.every(part => part.solvingDone !== true)){
              return <> {t("solving.convoy.fast.arrest")} </>
            } else if (district.dice === undefined){
              if (partnersOnDistrict.every(part => part.solvingDone === true)){
                return <> {t("solving.convoy.take.back.partners")} </>
              } else {
                return <> {t("solving.convoy.dice")} </>
              }
            } else if (partnersOnDistrict.every(part => part.solvingDone === true)){
              return <> {t("solving.convoy.place.gold.on.treasure", {gold:district.dice.reduce((acc, cv) => acc + cv) % partnersOnDistrict.length})} </>
            } else {
              return <> {t("solving.convoy.gain.gold", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t), gold : Math.floor(district.dice.reduce((acc, cv) => acc + cv) / partnersOnDistrict.length)})} </> 
            }
          }
          case DistrictName.Harbor:{
            if (thief.partners.some(part => isPartner(part) && part.district === district.name && (!part.tokensTaken || part.tokensTaken < (isEvent ? 3 : 2)))){
              return <> {t("solving.harbor.you.take.token")} </>
            } else if (partnersOnDistrict.some(part => isPartner(part) && (!part.tokensTaken || part.tokensTaken < (isEvent ? 3 : 2)))){
              if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length === 1){
                return <> {t("solving.harbor.one.player.take.token", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name))!.role,players, t)})} </>
              } else {
                return <> {t("solving.harbor.other.take.token")} </>
              }
            } else {
              return <> {t("solving.harbor.take.back.last.partners")} </>
            }
          }
          case DistrictName.Market:{
            if (getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone === true))){
              return <> {t("solving.market.take.back.partner")} </>
            } else if (district.dice === undefined){
              return <> {t("solving.market.roll.dice", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true ))!.role, players, t)})} </>  
            } else {
              return <> {t("solving.market.gain.gold", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true ))!.role, players, t), gold:district.dice.reduce((acc, vc) => acc + vc)})} </>
            }
          }
          case DistrictName.Palace:{
            if (partnersOnDistrict.length > (isEvent ? 3 : getThieves(game).length >=3 ? 2 : 1)){
              return <> {t("solving.palace.fast.arrest")} </>
            } else {
              const actualThief = getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name))!
              const actualPartner = actualThief.partners.find(part => isPartner(part) && part.district === district.name)!
              if (actualPartner.solvingDone !== true){
                return <> {t("solving.palace.gain.gold", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true ))!.role, players, t)})} </> 
              } else {
                return <> {t("solving.palace.take.back.partner", {thief:getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone === true ))!.role, players, t)})} </> 
              }
            }
          }
          case DistrictName.Tavern:{
            const partnerOnTavern = thief.partners.find(part => isPartner(part) && part.district === district.name)
            if(partnerOnTavern !== undefined){
              if (partnerOnTavern.goldForTavern === undefined){
                return <> {t("solving.tavern.you.bet")} </>
              } else if (district.dice === undefined){
                return <> {t("solving.tavern.you.roll.dice")} </>
              } else {
                if (district.dice[0] === 2){
                  return <> {t("solving.tavern.you.lost")} </>
                } else if (district.dice[0] === 3){
                  return <> {t("solving.tavern.you.double")} </>
                } else {
                  return <> {t("solving.tavern.you.triple")} </>
                }
              }
            } else {
              if (partnersOnDistrict.every(part => !part.goldForTavern)){
                return <> {t("solving.tavern.thieves.must.bet")} </>
              } else {
                const thiefWhoBet = getThieves(game).find(p => p.partners.find(part => isPartner(part) && part.district === district.name && part.goldForTavern !== undefined)!)!
                if (district.dice === undefined){
                  return <> {t("solving.tavern.thief.roll.dice", {thief:getPseudo(thiefWhoBet.role, players, t)})} </>
                } else {
                  if (district.dice[0] === 2){
                    return <> {t("solving.tavern.thief.lost", {thief:getPseudo(thiefWhoBet.role, players, t)})} </>
                  } else if (district.dice[0] === 3 && isEvent === false){
                    return <> {t("solving.tavern.thief.double", {thief:getPseudo(thiefWhoBet.role, players, t)})} </>
                  } else {
                    return <> {t("solving.tavern.thief.triple", {thief:getPseudo(thiefWhoBet.role, players, t)})} </>
                  }
                }
              }
            }
          }
          case DistrictName.Treasure:{
            if (partnersOnDistrict.every(part => part.solvingDone === true)){
              return <> {t("solving.treasure.take.back.partners")} </>
            } else if (district.dice === undefined){
              return <> {t("solving.treasure.gain.gold", {gold:Math.floor(district.gold! / partnersOnDistrict.length)})} </> 
            } else {
              return <> {t("solving.treasure.gain.gold", {gold:district.dice[0]})} </> 
            }
          }
        }
      }
    }
  }

  return <>{t("Preparing some sucker punches...")} </>
}