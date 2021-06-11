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

            <div css={[xStyle, betSize]}> <span>X</span> </div>
            {[...Array(player.gold < 5 ? player.gold : 5)].map((_, i) => 
                <div key={i} css={[betStyle(i+1), betSize]} onClick={() => onClick({type:MoveType.BetGold, gold:i+1, role:player.role})} >  </div>
            )}

        </div>
    )

}

const betSize = css`
width:16%;
height:100%;
:hover{
    background-color:black;
    cursor:pointer;
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
left:${2+position*12.6}%;
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