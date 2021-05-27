/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    action:TokenAction
    role:PlayerRole
} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>

const ThiefToken : FC<Props> = ({action, role, ...props}) => {
    return(
        <div {...props} css={thiefTokenStyle(getTokenBackground(action, role))}>

        </div>
    )
}

const thiefTokenStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
width:100%;
height:100%;
`

function getTokenBackground(action:TokenAction, role:PlayerRole):string{
    switch(action){
        case TokenAction.Stealing : {
            switch(role){
                case PlayerRole.BlueThief :
                    return Images.tokenStealBlue
                case PlayerRole.GreenThief :
                    return Images.tokenStealGreen
                case PlayerRole.PurpleThief :
                    return Images.tokenStealPurple
                case PlayerRole.RedThief :
                    return Images.tokenStealRed
                case PlayerRole.YellowThief :
                    return Images.tokenStealYellow
                case PlayerRole.Prince :
                    return 'error:princeState detected'
            }
        }
        case TokenAction.Kicking :{
            switch(role){
                case PlayerRole.BlueThief :
                    return Images.tokenKickBlue
                case PlayerRole.GreenThief :
                    return Images.tokenKickGreen
                case PlayerRole.PurpleThief :
                    return Images.tokenKickPurple
                case PlayerRole.RedThief :
                    return Images.tokenKickRed
                case PlayerRole.YellowThief :
                    return Images.tokenKickYellow
                case PlayerRole.Prince :
                    return 'error:princeState detected'
            }
        }
        case TokenAction.Fleeing :{
            switch(role){
                case PlayerRole.BlueThief :
                    return Images.tokenMoveBlue
                case PlayerRole.GreenThief :
                    return Images.tokenMoveGreen
                case PlayerRole.PurpleThief :
                    return Images.tokenMovePurple
                case PlayerRole.RedThief :
                    return Images.tokenMoveRed
                case PlayerRole.YellowThief :
                    return Images.tokenMoveYellow
                case PlayerRole.Prince :
                    return 'error:princeState detected'
            }
        }

    }
}

export default ThiefToken