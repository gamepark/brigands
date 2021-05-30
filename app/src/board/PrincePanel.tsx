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
                    patrol !==-1 &&  <PatrolToken key={index}
                                                  css={patrolTokenSize}
                                                  isMercenary={index===2}/>
                )}

            </div>

            <div css={[victoryPointStyle, victoryPointPosition(player.victoryPoints)]}></div>
            {[...Array(Math.floor(player.victoryPoints/10))].map((vp, i) => <img key={i} alt={t('victory Token')} src={Images.victoryToken} css={victoryTokenPosition(i)} draggable={false} />)}
            
            {decomposeGold(player.gold).map((coin, index) =>
                [...Array(coin)].map((c, i) => <img key={i+"_"+index} alt={t('Coin')} src={getCoin(index)} css={coinPosition(index, i)} draggable={false} />)
            )}

        </div>

    )

}

const coinPosition = (firstI:number, secondI:number) => css`
position:absolute;
top:${50+16*firstI}%;
left:${10+4*secondI}%;
width:${11-firstI*2.75}%;
height:${20-firstI*5}%;
`

const victoryTokenPosition = (points:number) => css`
position:absolute;
bottom:${10+7.5*(Math.floor(points/2)+points%2)}%;
right:${10+5*(points%2)}%;
width:8.25%;
height:15%;
`

const victoryPointStyle = css`
border-radius:100%;
border : gold 0.4em ridge;
`

const victoryPointPosition = (points:number) => css`
position:absolute;
top:32%;
${ points%10 !== 9 && `left:${15+6.5*(points%10)}%;`};
${ points%10 === 9 && `left:75%;`};
width:5.5%;
height:10%;
`

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
`

export function decomposeGold(gold:number):number[]{
    let quotient:number = 0;
    let rest:number = 0;
    const result = []
    quotient = Math.floor(gold/5)
    rest = gold%5
    result.push(quotient)
    if (rest === 0){
        result.push(0)
        result.push(0)
        return result
    } else {
        quotient = Math.floor(rest/2)
        rest = quotient%2
        result.push(quotient)
        if (rest === 0){
            result.push(0)
            return result
        } else {
            result.push(1)
            return result
        }
    }

}

export function getCoin(type:number):string{
    switch(type){
        case 0:
            return Images.coin5
        case 1:
            return Images.coin2
        case 2:
            return Images.coin1
        default:
            return 'error : no coin detected'
    }
}

export default PrincePanel