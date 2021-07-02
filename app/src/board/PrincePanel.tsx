/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { getPlayerName } from "@gamepark/brigands/BrigandsOptions";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import { PrinceState } from "@gamepark/brigands/PlayerState";
import District from "@gamepark/brigands/districts/District";
import Phase from "@gamepark/brigands/phases/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { usePlay, usePlayer, usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Button from "../utils/Button";
import Images from "../utils/Images";
import AvatarPanel from "./AvatarPanel";
import HeadStart from "./HeadStart";
import PatrolToken from "./PatrolToken";

type Props = {
    player:PrinceState
    city:District[]
    phase:Phase|undefined
}  & HTMLAttributes<HTMLDivElement>

const PrincePanel : FC<Props> = ({player, city, phase, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()
    const playerInfo = usePlayer(player.role)
    const {t} = useTranslation()
    const play = usePlay<Move>()

    function isPatrolDraggable(phase:Phase | undefined, role:PlayerRole, statePatrol:number, patrolIndex:number):boolean{
        if (patrolIndex !== 2){
            return phase === Phase.Patrolling && role === playerId && statePatrol !== -2
        } else {
            return player.gold > 4 && player.abilities[2] === false && phase === Phase.Patrolling && role === playerId && statePatrol !== -2   
        }
        
    }

    function isHeadStartTokenDraggable(phase:Phase | undefined, role:PlayerRole):boolean{
        return phase === Phase.Patrolling && player.role === playerId && player.gold>1 && player.abilities[1] === false
    }
 
    return(

        <>

        <div {...props} css={princePanelStyle}>

            <div css={playerInfosPosition}>

                <AvatarPanel playerInfo={playerInfo} role={player.role} />
                <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(player.role, t) : playerInfo?.name}</h1>
                <div css={tempoTimer}> 00:00 </div>            {/*<PlayerTimer playerId={player.role} css={[timerStyle]}/>*/}

            </div>

            <div css={[victoryPointStyle, victoryPointPosition(player.victoryPoints)]}></div>
            {[...Array(Math.floor(player.victoryPoints/10))].map((_, i) => <img key={i} alt={t('victory Token')} src={Images.victoryToken} css={victoryTokenPosition(i)} draggable={false} />)}
            
            {decomposeGold(player.gold).map((coin, index) =>
                [...Array(coin)].map((_, i) => <img key={i+"_"+index} alt={t('Coin')} src={getCoin(index)} css={coinPosition(index, i)} draggable={false} />)
            )}

        </div>


        {player.patrols.map((patrol,index) => 
            <PatrolToken key={index}
                         css={[patrolTokenSize, isPatrolDraggable(phase, player.role, patrol, index) && glowingPrince,
                               patrol === -1 ? patrolInHand(index, (playerId === PlayerRole.Prince || playerId === undefined) ? 1 : 0) : patrol === -2 ? patrolCanceled(playerId === PlayerRole.Prince ? 1 : 0) : patrolInDistrict(city.findIndex(d => d.name === patrol))
                               
                        ]}
                         isMercenary={index===2}
                         draggable={isPatrolDraggable(phase, player.role, patrol, index)}
                         type={'PatrolInHand'}
                         draggableItem={{patrolNumber:index}}
                         />
        )}

        {player.role === playerId && phase === Phase.Patrolling && player.patrols.every(pat => pat !== -1) 
        && <Button css={validationButtonPosition} onClick={() => play({type:MoveType.TellYouAreReady, playerId:player.role})}>{t('Validate')}</Button>
        }   

        
        <HeadStart css={[headStartSize, isHeadStartTokenDraggable(phase, player.role) && glowingPrince, player.abilities[1] === false ? headStartOnHand((playerId === PlayerRole.Prince || playerId === undefined) ? 1 : 0) : headStartOnDistrict(city.findIndex(d => d.name === player.abilities[1]))]}
                   draggable={isHeadStartTokenDraggable(phase, player.role)}
                   type={'HeadStartToken'}
                   draggableItem={{}}
        />
        


        </>

    )

}

const glowingWhiteKeyframes = keyframes`
    0% {
        filter:drop-shadow(0 0 1.1em white);
    }
    80%, 100% {
        filter:drop-shadow(0 0 0.2em white);
    }
`

const glowingPrince = css`
    animation: ${glowingWhiteKeyframes} 1s infinite alternate;
`

const headStartOnHand = (isPrince:number) => css`
top:${31+isPrince*60}%;
left:60.1%;
`

const headStartOnDistrict = (district:number) => css`
top:52%;
left:${8+(district*11.25)}%;
`

const headStartSize = css`
position:absolute;
height:6%;
width:3%;
z-index:1;
filter:drop-shadow(0 0 0.5em black);
`

const validationButtonPosition = css`
position:absolute;
z-index: 1;
width:12%;
height:6%;
top:90.4%;
right:21.5%;
font-size:3.5em;
`

const coinPosition = (firstI:number, secondI:number) => css`
position:absolute;
top:${50+16*firstI}%;
left:${10+4*secondI}%;
width:${11-firstI*2.75}%;
height:${20-firstI*5}%;

border-radius: 100%;
box-shadow: 0 0 1em 0.2em black;
`

const victoryTokenPosition = (points:number) => css`
position:absolute;
bottom:${10+7.5*(Math.floor(points/2)+points%2)}%;
right:${10+5*(points%2)}%;
width:8.25%;
height:15%;
border-radius:100%;
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

transition:left 1s ease-in-out;
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
height:28%;
border: 0.5em solid white;
border-radius:10% / 35%;
`

const patrolCanceled = (isPrince:number) => css`
    top:${24+isPrince*55}%;
    left:41.8%;
`

const patrolInHand = (index:number, isPrince:number) => css`
    top:${8+isPrince*58}%;
    left:${index !== 2 ? 36.6+index*24 : 48.5}%;
`

const patrolInDistrict = (district:number) => css`
    top:51.8%;
    left:${4+(district*11.6)}%;
`

const patrolTokenSize = css`
    position:absolute;
    z-index:1;
    height:7%;
    width:3%;
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
        let gold2 = rest
        quotient = Math.floor(gold2/2)   
        rest = gold2%2  
                        
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