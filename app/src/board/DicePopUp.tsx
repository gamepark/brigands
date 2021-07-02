/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    dice? : number[]
} & HTMLAttributes<HTMLDivElement>

const DicePopUp : FC<Props> = ({dice, ...props}) => {

    const playerId = usePlayerId<PlayerRole>()

    return(

        <div {...props} css={[dicePopUpPosition(playerId === PlayerRole.Prince || playerId === undefined), dicePopUpSize]}>

            {dice !== undefined && dice.map((die, index) => 
                <div key={index} css={[dieStyle(getDiceFace(die))]} > </div>
            )}

        </div>

    )

}

const dicePopUpSize = css`
width:29%;
height:8%;
`

const dicePopUpPosition = (isPrinceView:boolean) => css`
position:absolute;
top:${isPrinceView ? 90 : 30}%;
left:63%;
display:flex;
flex-direction:row;
justify-content:space-evenly;
`

const dieStyle = (face:string) => css`
    background-image: url(${face});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;

    width:16%;
    height:90%;
`

function getDiceFace(face:number):string{
    switch (face){
        case 2:
            return Images.dice2
        case 3:
            return Images.dice3
        case 4:
            return Images.dice4
        default:
            return 'error : not a dice face'
    }
}

export default DicePopUp