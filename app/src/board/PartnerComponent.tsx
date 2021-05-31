/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Phase from "@gamepark/brigands/types/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import Token from "@gamepark/brigands/types/Token";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";
import ThiefToken from "./ThiefToken";

type Props = {
    role:PlayerRole
    tokens:Token
    partnerNumber:number
    phase:Phase | undefined
} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>

const PartnerComponent : FC<Props> = ({role, tokens, partnerNumber, phase, ...props}) => {
    console.log(partnerNumber)
    console.log(tokens.steal.find(token => token === partnerNumber))
    return (
        <div {...props} css={partnerStyle(getPartnerImage(role))}>

            {tokens.steal.find(token => token === partnerNumber) !== undefined 
                && <ThiefToken css={[tokenSize, phase !== Phase.Solving ? tokenPositionForPlanning : tokenPositionForSolving]} 
                               action={TokenAction.Stealing} 
                               role={role} />}
            {tokens.kick.find(token => token === partnerNumber) !== undefined 
                && <ThiefToken css={[tokenSize, phase !== Phase.Solving ? tokenPositionForPlanning : tokenPositionForSolving]} 
                               action={TokenAction.Kicking} 
                               role={role} />}
            {tokens.move.find(token => token === partnerNumber) !== undefined 
                && <ThiefToken css={[tokenSize, phase !== Phase.Solving ? tokenPositionForPlanning : tokenPositionForSolving]} 
                               action={TokenAction.Fleeing} 
                               role={role} />}

        </div>
    )
}

const tokenSize = css`
width:100%;
height:100%;
`

const tokenPositionForPlanning = css`
position:absolute;
top:0%;
left:100%;
`

const tokenPositionForSolving = css`
position:absolute;
top:200%;
left:0%;
`

const partnerStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;

width:100%;
height:100%;
`

function getPartnerImage(role:PlayerRole):string{
    switch (role){
        case PlayerRole.BlueThief :
            return Images.partnerBlue
        case PlayerRole.GreenThief :
            return Images.partnerGreen
        case PlayerRole.PurpleThief :
            return Images.partnerPurple
        case PlayerRole.RedThief :
            return Images.partnerRed
        case PlayerRole.YellowThief :
            return Images.partnerYellow
        default:
            return 'error : prince detected'
    }
}

export default PartnerComponent