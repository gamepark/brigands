/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getPlayerName } from "@gamepark/brigands/BrigandsOptions";
import PlayerState, { PrinceState } from "@gamepark/brigands/PlayerState";
import { usePlayer } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Images from "../utils/Images";
import AvatarPanel from "./AvatarPanel";
import PatrolToken from "./PatrolToken";

type Props = {
    player:PrinceState
}  & HTMLAttributes<HTMLDivElement>

const PrincePanel : FC<Props> = ({player, ...props}) => {

    const playerInfo = usePlayer(player.role)
    const {t} = useTranslation()

    return(

        <div {...props} css={princePanelStyle}>

            <div css={playerInfosPosition}>

                <AvatarPanel playerInfo={playerInfo} role={player.role} />
                <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
                <div css={tempoTimer}> 00:00 </div>            {/*<PlayerTimer playerId={player.role} css={[timerStyle]}/>*/}

            </div>

            <div css={patrolsPosition}>

                {player.patrols.map((patrol,index) => 
                    <PatrolToken key={index}
                                 css={patrolTokenSize}
                                 isMercenary={index===2}/>
                )}

            </div>
            

        </div>

    )

}

const nameStyle = css`
    font-size:2.5em;
    font-family:'Mulish', sans-serif;
    margin : 0.2em 1em;
`

const timerStyle = css`
    display: block;
    font-size: 2.5em;
    padding-top: 0.2em;
`

const tempoTimer = css`
    display: block;
    font-size: 2.4em;
    padding-top: 0.2em;
`

const playerInfosPosition = css`
position:absolute;
top:0%;
left:-60%;
width:58%;
height:25%;
border: 0.5em solid white;
border-radius:10% / 35%;
`

const patrolsPosition = css`
    position:absolute;
    top:2%;
    left:5%;
    width:90%;
    height:15%;

    display:flex;
    flex-direction:row;
    justify-content:space-around;
`
const patrolTokenSize = css`
    height:100%;
    width:10%;
`

const princePanelStyle = css`
background-image: url(${Images.princePanel});
background-size: contain;
background-repeat: no-repeat;
background-position: bottom;

border:1px solid white;
`

export default PrincePanel