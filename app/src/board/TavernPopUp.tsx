/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import BetGold from "@gamepark/brigands/moves/BetGold";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import { ThiefState } from "@gamepark/brigands/PlayerState";
import { usePlay } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import Images from '../utils/Images'

type Props = {
    position:number
    player:ThiefState
} & HTMLAttributes<HTMLDivElement>

const TavernPopUp : FC<Props> = ({position, player, ...props}) => {

    const play = usePlay<Move>()
    const onClick = (move:BetGold) => {play(move)}

    return(
        <div {...props} css={[tavernPopUpSize, tavernPopUpPosition(position), tavernPopUpStyle]}>

            <div css={[xStyle, betSize(0)]} onClick={() => onClick({type:MoveType.BetGold, gold:0, role:player.role})} > <span>X</span> </div>
            {[...Array(player.gold < 5 ? player.gold : 5)].map((_, i) => 
                <div key={i} css={[betStyle(i+1), betSize(i+1, player.gold)]} onClick={() => onClick({type:MoveType.BetGold, gold:i+1, role:player.role})} >  </div>
            )}

        </div>
    )

}

const betSize = (position:number, goldMax?:number) => css`
width:16%;
height:100%;
transition:background-color 0.5s, border-radius 0.5s;
${position === 0 && `border-radius:30% 0% 0% 30%;`}
${(position === goldMax || position === 5) && `border-radius:0% 30% 30% 0%;`}
:hover{
    background-color:black;
    cursor:pointer;
    ${position === 0 && `border-radius:30% 0% 0% 30%;`}
    ${(position === goldMax || position === 5) && `border-radius:0% 30% 30% 0%;`}
    transition:background-color 0.5s, border-radius 0.5s;
}
`

const xStyle = css`
text-align:center;
span{
    font-size:10em;
}
`

const betStyle = (gold:number) => css`
${gold === 1 && `
background: 50% 50% / 60% no-repeat url(${Images.coin1})`}
${gold === 2 && `
background: 50% 70% / 60% no-repeat url(${Images.coin1}), 50% 30% / 60% no-repeat url(${Images.coin1})`}
${gold === 3 && `
background: 50% 80% / 60% no-repeat url(${Images.coin1}), 50% 20% / 80% no-repeat url(${Images.coin2})`}
${gold === 4 && `
background: 50% 80% / 80% no-repeat url(${Images.coin2}), 50% 20% / 80% no-repeat url(${Images.coin2})`}
${gold === 5 && `
background: 50% 50% / 95% no-repeat url(${Images.coin5})`}
`

const tavernPopUpSize = css`
width:30%;
height:12%;
`

const tavernPopUpPosition = (position:number) => css`
position:absolute;
top:28%;
left:32.5%;
z-index:99;
`

const tavernPopUpStyle = css`
border:0.5em white solid;
border-radius:10%/60%;
background-color:rgba(0,0,0,0.7);

display:flex;
flex-direction:row;
justify-content:center;
`

export default TavernPopUp