/** @jsxImportSource @emotion/react */

import GameView from "@gamepark/brigands/GameView"
import PlayerRole from "@gamepark/brigands/types/PlayerRole"
import { Player, usePlayer, usePlayerId } from "@gamepark/react-client"
import { FC } from "react"
import { useTranslation } from "react-i18next"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import { getPlayerName } from "@gamepark/brigands/BrigandsOptions"
import Button from "../utils/Button"
import { css } from "@emotion/react"
import { PrinceState, ThiefState } from "@gamepark/brigands/PlayerState"
import { TFunction } from "i18next"

const WelcomePopUp : FC<{player:ThiefState | PrinceState | undefined, game:GameView, close: () => void}> = ({player, game, close}) => {

    const {t} = useTranslation()
    const playerInfo = usePlayer(player !== undefined ? player.role : undefined) 
    const playerId = usePlayerId<PlayerRole>()
    const isSpec = playerId === undefined

    return(

        <div css={[popupOverlayStyle, showPopupOverlayStyle, style]} onClick={close}>

            <div css={[popupStyle, popupPosition]} onClick={event => event.stopPropagation()}>

                <div css = {closePopupStyle} onClick={close}> <FontAwesomeIcon icon={faTimes} /> </div>
                <h2>{t("Welcome, {playerName}",{playerName: !isSpec 
                  ? playerInfo?.name !== undefined 
                    ? playerInfo?.name 
                    : getPlayerName(player!.role,t)
                  : t("Dear spectator")})}
                </h2>

                {playerId === PlayerRole.Prince && <p> {t("welcome.prince")} </p>}
                {playerId !== undefined && playerId !== PlayerRole.Prince && <p> {t("welcome.thief",{color:getColorText(playerId, t)})} </p>}

                {playerId === PlayerRole.Prince && <p> {t("wincon.prince", {points:game.players.length*10})} </p>}
                {playerId !== undefined && playerId !== PlayerRole.Prince && <p> {t("wincon.thief", {points:game.players.length*10})} </p>}

                <p> {t("good.luck")} </p>




                <Button pRole={PlayerRole.YellowThief} css={buttonPosition} onClick={close}>{t('OK')}</Button>

            </div>

        </div>

    )

}

const buttonPosition = css`
position:relative;
`

const popupOverlayStyle = css`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  transform: translateZ(30em);
  z-index: 99;
  transition: all .5s ease;
`
const showPopupOverlayStyle = css`
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const popupStyle = css`
  position: absolute;
  text-align: center;
  height: auto;
  width:60%;
  z-index : 102;
  border-radius: 1em;
  box-sizing: border-box;
  align-self: center;
  padding: 2%;
  margin: 0 2%;
  outline: none;
  box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
  border:1em black solid;
  background-color: rgba(254,165,0,0.8);
  border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
  color:black;

  &:before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%; 
    border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  &:hover{
      box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,.5);
    }
  & > h2 {
    position:relative;
    font-size: 5em;
    margin:0 auto;
    text-align: center;
    width:60%;
  }
  & > p {
    position:relative;
    text-align: center;
    font-size: 3em;
    margin:0.5em auto;
    width:80%;

  }
  & > button {
    font-size: 3.5em;
  }
`

const popupPosition = css`
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) translateZ(30em);
`

const style = css`
  background-color: transparent;
`

const closePopupStyle = css`
  position: relative;
  float: right;
  text-align: center;
  margin-top: -2%;
  margin-right: -0%;
  font-size: 4em;
  &:hover{
    cursor: pointer;
    color: white;
  }
`

function getColorText(playerId:PlayerRole,  t: TFunction):string{
    switch(playerId){
        case PlayerRole.BlueThief:
            return t("blue")
        case PlayerRole.GreenThief:
            return t("green")
        case PlayerRole.PurpleThief:
            return t("purple")
        case PlayerRole.RedThief:
            return t("red")
        case PlayerRole.YellowThief:
            return t("yellow")
        case PlayerRole.Prince:
            return t("white")
    }
}

export default WelcomePopUp