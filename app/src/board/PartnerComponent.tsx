/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    role:PlayerRole
} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>

const PartnerComponent : FC<Props> = ({role, ...props}) => {
    return (
        <div {...props} css={partnerStyle(getPartnerImage(role))}>


        </div>
    )
}

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