/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import Move from "@gamepark/brigands/moves/Move";
import TakeToken from "@gamepark/brigands/moves/TakeToken";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import ThiefTokenInBank from "@gamepark/brigands/types/ThiefTokenInBank";
import ThiefTokenInHand from "@gamepark/brigands/types/ThiefTokenInHand";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { usePlay } from "@gamepark/react-client";
import { Draggable } from "@gamepark/react-components";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";

type Props = {
    action:TokenAction
    role:PlayerRole

    draggable?:boolean
    type?:'ThiefTokenInBank' | 'ThiefTokenInHand'
    draggableItem?:ThiefTokenInBank | ThiefTokenInHand
} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>

const ThiefToken : FC<Props> = ({action, role, draggable = false, type = '', draggableItem, ...props}) => {
    
    const play = usePlay<Move>()
    const item = {...draggableItem}
    const onDrop = (move:TakeToken) => {
        play(move)
    }
    
    return(
        <Draggable {...props} 
                   css={thiefTokenStyle(getTokenBackground(action, role))}
                   canDrag={draggable}
                   item={item}
                   type={type}
                   drop={onDrop}
                   >
                   

        </Draggable>
    )
}

const thiefTokenStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
width:100%;
height:100%;
border-radius: 100%;
box-shadow: 0 0 0.5em 0.1em black;
transform-style:preserve-3d;
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