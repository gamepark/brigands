/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Move from "@gamepark/brigands/moves/Move";
import MoveType from "@gamepark/brigands/moves/MoveType";
import PlacePartner from "@gamepark/brigands/moves/PlacePartner";
import PlaceToken from "@gamepark/brigands/moves/PlaceToken";
import Phase from "@gamepark/brigands/types/Phase";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import Token from "@gamepark/brigands/types/Token";
import TokenAction from "@gamepark/brigands/types/TokenAction";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import { Draggable } from "@gamepark/react-components";
import { FC, HTMLAttributes } from "react";
import { useDrop } from "react-dnd";
import PartnerInHand from "src/utils/PartnerInHand";
import ThiefTokenInHand from "src/utils/ThiefTokenInHand";
import Images from "../utils/Images";
import ThiefToken from "./ThiefToken";

type Props = {
    role:PlayerRole
    tokens:Token
    partnerNumber:number
    phase:Phase | undefined

    draggable?:boolean
    type?:'PartnerInHand'
    draggableItem?:PartnerInHand

} & Omit<HTMLAttributes<HTMLDivElement>, 'role'>

const PartnerComponent : FC<Props> = ({role, tokens, partnerNumber, phase, draggable = false, type='', draggableItem, ...props}) => {

    const play = usePlay<Move>()
    const item = {...draggableItem}
    const onDrop = (move:PlacePartner | PlaceToken) => {
        play(move)
    }

    const playerId = usePlayerId<PlayerRole>()

    const [{canDrop, isOver}, dropRef] = useDrop({
        accept: ["ThiefTokenInHand"],
        canDrop: (item: ThiefTokenInHand) => {
            return playerId === role
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        }),
        drop: (item: ThiefTokenInHand) => {
            return {type:MoveType.PlaceToken,role:playerId, tokenAction:item.tokenAction, partnerNumber:partnerNumber}
        }
      })

    return (
        <Draggable canDrag={draggable}
                   type={type} 
                   item={item} 
                   drop={onDrop}
                   {...props} 

                   // TODO : Add the property ref={dropRef} here, on the Draggable element

                   css={[partnerStyle(getPartnerImage(role)),canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>
                       <div ref={dropRef} css={[fullSize, canDrop && canDropStyle, canDrop && isOver && isOverStyle]}>

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

        </Draggable>
    )
}

const fullSize = css`
width:100%;
height:100%;
`

const canDropStyle = css`
background-color:red;
opacity:0.4;
transition : opacity 0.5s linear;
`

const isOverStyle = css`
background-color:red;
opacity:0.8;
transition : opacity 0.5s linear;
`

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