/** @jsxImportSource @emotion/react */
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import GameView, { getPrince, getThieves } from '@gamepark/brigands/GameView'
import Phase from '@gamepark/brigands/phases/Phase'
import { isPrinceState } from '@gamepark/brigands/PlayerState'
import { isPartner } from '@gamepark/brigands/types/Partner'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import { usePlayerId, usePlayers } from '@gamepark/react-client'
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

function HeaderOnGoingGameText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerRole>()
  const players = usePlayers<PlayerRole>()

  return <>{t("Game ongoing...")} </>
}

function HeaderGameOverText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerRole>()

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
          return <> {t("planning.you.are.ready")} </>
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
        return <> {t("patrolling.you.wait")} </>
      }
    }
    case Phase.Solving:{
      const district=game.city[game.districtResolved!]
      switch(district.name){
        case DistrictName.Jail:{
          if (getThieves(game).every(p => p.partners.every(part => !isPartner(part) || part.district !== district.name || part.solvingDone !== true))){
            if (district.dice === undefined){
              return <> {t("solving.jail.dice")} </>      // Add which partner rolls the dice
            } else if (district.dice[0] === 4){
              return <> {t("solving.jail.free.partner")} </>    // Add which partner rolls the dice
            } else {
              return <> {t("solving.jail.stay.in.jail")} </>
            }
          } else {
            if (playerId === undefined || playerId === PlayerRole.Prince || getThieves(game).find(p => p.role === playerId)!.partners.every(part => !isPartner(part) || part.district !== district.name || part.tokensTaken === 1)){
              return <> {t("solving.jail.wait")} </>
            } else {
              return <> {t("solving.jail.you.take.token")} </>
            }
          }
        }
        case DistrictName.CityHall:{

          

          break
        }
        case DistrictName.Convoy:{
          break
        }
        case DistrictName.Harbor:{
          break
        }
        case DistrictName.Market:{
          break
        }
        case DistrictName.Palace:{
          break
        }
        case DistrictName.Tavern:{
          break
        }
        case DistrictName.Treasure:{
          break
        }

      }
      break
    }
  }

  return <>{t("Game over...")} </>
}