/** @jsxImportSource @emotion/react */
import {getPlayerName} from '@gamepark/brigands/BrigandsOptions'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import GameView, {getPrince, getThieves} from '@gamepark/brigands/GameView'
import {tellYouAreReadyMove} from '@gamepark/brigands/moves/TellYouAreReady'
import Phase from '@gamepark/brigands/phases/Phase'
import {isThiefState, ThiefState} from '@gamepark/brigands/PlayerState'
import {isPartner} from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {ThiefView} from '@gamepark/brigands/types/Thief'
import {Player as PlayerInfo, usePlay, usePlayerId, usePlayers} from '@gamepark/react-client'
import {TFunction} from 'i18next'
import {Trans, useTranslation} from 'react-i18next'
import HeaderButton from './HeaderButton'
import {shineEffect} from './utils/styles'

type Props = {
  loading: boolean
  game?: GameView
}

export default function HeaderText({loading, game}: Props) {
  const {t} = useTranslation()
  if (loading || !game) return <>{t('Game loading...')}</>

  if (!game.phase) {
    return <HeaderGameOverText game={game}/>
  } else {
    return <HeaderOnGoingGameText game={game}/>
  }
}

function getMaxScoreThief(thieves: (ThiefState | ThiefView)[]): number {
  let max: number = 0
  thieves.forEach(p => {
    if (isThiefState(p)) {
      const numberOfToken: number = p.tokens.length
      if (p.gold + numberOfToken > max) {
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

function betResultText(dice: number[]): number {
  const arrayOfTwos = dice.filter(face => face === 2)
  const arrayOfThrees = dice.filter(face => face === 3)
  const arrayOfFours = dice.filter(face => face === 4)
  if (arrayOfFours.length === 4 || arrayOfThrees.length === 4 || arrayOfTwos.length === 4) {
    return 4
  } else if (arrayOfFours.length === 3 || arrayOfThrees.length === 3 || arrayOfTwos.length === 3) {
    return 3
  } else if (arrayOfFours.length === 2 || arrayOfThrees.length === 2 || arrayOfTwos.length === 2) {
    return 2
  } else return 0

}

function HeaderGameOverText({game}: { game: GameView }) {
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerRole>()
  const players = usePlayers<PlayerRole>()
  const prince = getPrince(game)
  const thieves = getThieves(game)
  const maxScoreThief = getMaxScoreThief(thieves)


  if (getPrince(game).victoryPoints >= game.players.length * 10) {
    if (playerId === PlayerRole.Prince) {
      return <> {t('game.over.you.win.prince', {score: getPrince(game).victoryPoints})} </>
    } else {
      return <> {t('game.over.player.win.prince', {player: getPseudo(prince.role, players, t), score: getPrince(game).victoryPoints})} </>
    }
  } else {
    const winnerThieves = thieves.filter(p => isThiefState(p) && p.gold + p.tokens.length === maxScoreThief)
    if (winnerThieves.length === 1) {
      if (playerId === winnerThieves[0].role) {
        return <> {t('game.over.you.win.thief', {score: maxScoreThief})} </>
      } else {
        return <> {t('game.over.player.win.thief', {player: getPseudo(winnerThieves[0].role, players, t), score: maxScoreThief})} </>
      }
    } else if (winnerThieves.length === 2) {
      return <> {t('game.over.2.thieves.tie', {
        player1: getPseudo(winnerThieves[0].role, players, t),
        player2: getPseudo(winnerThieves[1].role, players, t),
        score: maxScoreThief
      })} </>
    } else if (winnerThieves.length === 3) {
      return <> {t('game.over.3.thieves.tie', {
        player1: getPseudo(winnerThieves[0].role, players, t),
        player2: getPseudo(winnerThieves[1].role, players, t),
        player3: getPseudo(winnerThieves[2].role, players, t),
        score: maxScoreThief
      })} </>
    } else if (winnerThieves.length === 4) {
      return <> {t('game.over.4.thieves.tie', {
        player1: getPseudo(winnerThieves[0].role, players, t),
        player2: getPseudo(winnerThieves[1].role, players, t),
        player3: getPseudo(winnerThieves[2].role, players, t),
        player4: getPseudo(winnerThieves[3].role, players, t),
        score: maxScoreThief
      })} </>
    } else {
      return <> {t('game.over.perfect.tie', {score: maxScoreThief})} </>
    }
  }
}

function HeaderOnGoingGameText({game}: { game: GameView }) {
  const {t} = useTranslation()
  const play = usePlay()
  const playerId = usePlayerId<PlayerRole>()
  const player = game.players.find(p => p.role === playerId)
  const players = usePlayers<PlayerRole>()

  switch (game.phase) {
    case Phase.NewDay: {
      return <> {t('new.day')} </>
    }

    case Phase.Planning: {
      if (player && !player.isReady) {
        if (player.meeples.includes(null)) {
          return <>{t('planning.place.meeples')}</>
        } else {
          return <Trans defaults="planning.validate" components={[
            <HeaderButton css={shineEffect} onClick={() => play(tellYouAreReadyMove(player.role))} color={player.role}/>
          ]}/>
        }
      } else {
        const awaitedPlayers = game.players.filter(p => !p.isReady)
        if (awaitedPlayers.length > 1) {
          return <>{t('planning.wait')}</>
        } else if (awaitedPlayers.length === 1) {
          return <>{t('planning.wait.one', {player: getPseudo(awaitedPlayers[0].role, players, t)})}</>
        } else {
          return <>{t('planning.reveal')}</>
        }
      }
    }

    case Phase.Solving: {
      const district = game.city[game.currentDistrict!]
      const thief = getThieves(game).find(p => p.role === playerId)

      if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length === 0) {
        return <> {t('solving.end.of.district')} </>
      } else if (getPrince(game).patrols.some(pat => pat === district.name && getPrince(game).abilities[1] === district.name)) {
        return <> {t('solving.fast.arrest')} </>
      } else if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length > 0) {

        if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length > 0) {
          return <> {t('solving.steal.token')} </>
        } else if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length > 0) {
          if (thief !== undefined && thief.partners.find(part => isPartner(part) && part.district === district.name)) {
            if (thief.partners.find(part => isPartner(part) && part.district === district.name && part.kickOrNot === undefined)) {
              return <> {t('solving.kick.token.choose', {howManyTimesLeft: thief.partners.filter(part => isPartner(part) && part.district === district.name && part.kickOrNot === undefined).length})} </>
            } else {
              return <> {t('solving.kick.token.wait')} </>
            }
          } else {
            return <> {t('solving.kick.token.wait')} </>
          }
        } else {
          if (thief !== undefined && thief.partners.find(part => isPartner(part) && part.district === district.name)) {
            <> {t('solving.move.token.choose')} </>
          }
          return <> {t('solving.move.token.wait')} </>
        }

      } else if (getPrince(game).patrols.some(pat => pat === district.name) && district.name !== DistrictName.Jail) {
        return <> {t('solving.arrest')} </>
      } else {
        const partnersOnDistrict = getThieves(game).flatMap(thief => thief.partners.filter(part => isPartner(part) && part.district === district.name))
        const isEvent: boolean = game.dayCards.includes(district.name)
        switch (district.name) {
          case DistrictName.Jail: {

            if (getPrince(game).patrols.some(pat => pat === DistrictName.Jail)) {
              return <> {t('patrolling.judging.prisoners', {score: getThieves(game).flatMap(thief => thief.partners.filter(part => isPartner(part) && part.district === DistrictName.Jail)).length * 2})}  </>
            }

            if (partnersOnDistrict.some(part => part.solvingDone !== true)) {
              if (district.dice !== undefined && district.dice[0] === 4) {
                return <> {t('solving.jail.free.partner', {thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t)})} </>
              } else {
                return <> {t('solving.jail.dice', {thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t)})} </>
              }
            } else {
              if (playerId === undefined || playerId === PlayerRole.Prince || getThieves(game).find(p => p.role === playerId)!.partners.every(part => !isPartner(part) || part.district !== district.name || part.tokensTaken === 1)) {
                if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.tokensTaken === 0)).length === 1) {
                  return <> {t('solving.jail.wait.one.player', {thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.tokensTaken === 0))!.role, players, t)})} </>
                } else {
                  return <> {t('solving.jail.wait.players')} </>
                }
              } else {
                return <> {t('solving.jail.you.take.token')} </>
              }
            }
          }
          case DistrictName.CityHall: {
            if (partnersOnDistrict.every(part => part.solvingDone === true)) {
              return <> {t('solving.cityhall.take.back.partners')} </>
            }
            if (district.dice === undefined) {
              return <> {t('solving.cityhall.dice')} </>
            } else if (partnersOnDistrict.every(part => part.solvingDone === true)) {
              return <> {t('solving.cityhall.place.gold.on.treasure', {gold: ((getThieves(game).length < 4 ? 7 : 10) + (district.dice.length !== 0 ? district.dice.reduce((acc, cv) => acc + cv) : 0)) % partnersOnDistrict.length})} </>
            } else {
              return <> {t('solving.cityhall.gain.gold', {
                thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t),
                gold: Math.floor(((getThieves(game).length < 4 ? 7 : 10) + (district.dice.length !== 0 ? district.dice.reduce((acc, cv) => acc + cv) : 0)) / partnersOnDistrict.length)
              })} </>
            }
          }
          case DistrictName.Convoy: {

            if ((partnersOnDistrict.length < (getThieves(game).length < 4 ? 2 : 3)) && district.dice === undefined && partnersOnDistrict.every(part => part.solvingDone !== true)) {
              return <> {t('solving.convoy.fast.arrest')} </>
            } else if (district.dice === undefined) {
              if (partnersOnDistrict.every(part => part.solvingDone === true)) {
                return <> {t('solving.convoy.take.back.partners')} </>
              } else {
                return <> {t('solving.convoy.dice')} </>
              }
            } else if (partnersOnDistrict.every(part => part.solvingDone === true)) {
              return <> {t('solving.convoy.place.gold.on.treasure', {gold: district.dice.reduce((acc, cv) => acc + cv) % partnersOnDistrict.length})} </>
            } else {
              return <> {t('solving.convoy.gain.gold', {
                thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t),
                gold: Math.floor(district.dice.reduce((acc, cv) => acc + cv) / partnersOnDistrict.length)
              })} </>
            }
          }
          case DistrictName.Harbor: {
            if (playerId === PlayerRole.Prince) {
              return <> {t('solving.harbor.prince.wait')} </>
            }
            if (thief !== undefined && thief.partners.some(part => isPartner(part) && part.district === district.name && (!part.tokensTaken || part.tokensTaken < (isEvent ? 3 : 2)))) {
              return <> {t('solving.harbor.you.take.token')} </>
            } else if (partnersOnDistrict.some(part => isPartner(part) && (!part.tokensTaken || part.tokensTaken < (isEvent ? 3 : 2)))) {
              if (getThieves(game).filter(p => p.partners.some(part => isPartner(part) && part.district === district.name)).length === 1) {
                return <> {t('solving.harbor.one.player.take.token', {thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name))!.role, players, t)})} </>
              } else {
                return <> {t('solving.harbor.other.take.token')} </>
              }
            } else {
              return <> {t('solving.harbor.take.back.last.partners')} </>
            }
          }
          case DistrictName.Market: {
            if (getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone === true))) {
              return <> {t('solving.market.take.back.partner')} </>
            } else {
              const thief = getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!
              const partnersOfThiefOnMarket = thief.partners.filter(part => isPartner(part) && part.district === DistrictName.Market)
              return <> {t('solving.market.take.gold', {
                thief: getPseudo(thief.role, players, t),
                gold: partnersOfThiefOnMarket.length * (partnersOfThiefOnMarket.length + 1) + (isEvent ? 5 : 0)
              })} </>
            }
          }
          case DistrictName.Palace: {
            if (partnersOnDistrict.length > (isEvent ? 3 : getThieves(game).length >= 3 ? 2 : 1)) {
              return <> {t('solving.palace.fast.arrest')} </>
            } else {
              if (partnersOnDistrict.length === 0) {         // Maybe redundant
                return <> {t('solving.end.of.district')} </>
              }
              const actualThief = getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name))!
              const actualPartner = actualThief.partners.find(part => isPartner(part) && part.district === district.name)!
              if (actualPartner.solvingDone !== true) {
                return <> {t('solving.palace.gain.gold', {thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone !== true))!.role, players, t)})} </>
              } else {
                return <> {t('solving.palace.take.back.partner', {thief: getPseudo(getThieves(game).find(p => p.partners.some(part => isPartner(part) && part.district === district.name && part.solvingDone === true))!.role, players, t)})} </>
              }
            }
          }
          case DistrictName.Tavern: {
            if (thief !== undefined && thief.partners.find(part => isPartner(part) && part.district === district.name) !== undefined) {

              const partnerOnTavern = thief.partners.find(part => isPartner(part) && part.district === district.name)!

              if (partnerOnTavern.goldForTavern === undefined) {
                return <> {t('solving.tavern.you.bet')} </>
              } else if (district.dice === undefined) {
                return <> {t('solving.tavern.you.roll.dice')} </>
              } else {
                if (betResultText(district.dice) === 0) {
                  return <> {t('solving.tavern.you.lost', {gold: partnerOnTavern.goldForTavern})} </>
                } else if (betResultText(district.dice) === 2) {
                  return <> {t('solving.tavern.you.double', {gold: partnerOnTavern.goldForTavern * 2})} </>
                } else if (betResultText(district.dice) === 3) {
                  return <> {t('solving.tavern.you.triple', {gold: partnerOnTavern.goldForTavern * 3})} </>
                } else {
                  return <> {t('solving.tavern.you.quadruple', {gold: partnerOnTavern.goldForTavern * 4})} </>
                }
              }
            } else {
              if (partnersOnDistrict.every(part => part.goldForTavern === undefined)) {
                return <> {t('solving.tavern.thieves.must.bet')} </>
              } else {
                const thiefWhoBet = getThieves(game).find(p => p.partners.find(part => isPartner(part) && part.district === district.name && part.goldForTavern !== undefined)!)!
                const partnerWhoBet = thiefWhoBet.partners.find(part => isPartner(part) && part.district === district.name && part.goldForTavern !== undefined)!
                if (district.dice === undefined) {
                  return <> {t('solving.tavern.thief.roll.dice', {thief: getPseudo(thiefWhoBet.role, players, t)})} </>
                } else {
                  if (betResultText(district.dice) === 0) {
                    return <> {t('solving.tavern.thief.lost', {thief: getPseudo(thiefWhoBet.role, players, t), gold: partnerWhoBet.goldForTavern!})} </>
                  } else if (betResultText(district.dice) === 2) {
                    return <> {t('solving.tavern.thief.double', {thief: getPseudo(thiefWhoBet.role, players, t), gold: partnerWhoBet.goldForTavern! * 2})} </>
                  } else if (betResultText(district.dice) === 3) {
                    return <> {t('solving.tavern.thief.triple', {thief: getPseudo(thiefWhoBet.role, players, t), gold: partnerWhoBet.goldForTavern! * 3})} </>
                  } else {
                    return <> {t('solving.tavern.thief.quadruple', {
                      thief: getPseudo(thiefWhoBet.role, players, t), gold: partnerWhoBet.goldForTavern! * 4
                    })} </>
                  }
                }
              }
            }

          }
          case DistrictName.Treasure: {
            if (partnersOnDistrict.every(part => part.solvingDone === true)) {
              return <> {t('solving.treasure.take.back.partners')} </>
            } else if (district.dice === undefined) {
              return <> {t('solving.treasure.gain.gold', {gold: Math.floor(district.gold! / partnersOnDistrict.length)})} </>
            } else {
              return <> {t('solving.treasure.gain.gold', {gold: district.dice[0]})} </>
            }
          }
        }
      }
    }
  }

  return <>{t('Preparing some sucker punches...')} </>
}