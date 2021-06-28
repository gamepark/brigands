/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerRole from "@gamepark/brigands/types/PlayerRole";
import { Avatar, Player } from "@gamepark/react-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Images from "../utils/Images";

type Props = {
    playerInfo : Player<PlayerRole> | undefined
    role:PlayerRole
}

const AvatarPanel : FC<Props> = ({playerInfo, role}) => {

    const {t} = useTranslation()

    return(

        <div css={avatarStyle}>
            {playerInfo?.avatar 
                ? <Avatar css={avatarStyle} avatarStyle="Circle" {...playerInfo.avatar}/> 
                : <img alt={t('Player avatar')} src={getAlternativeAvatar(role)} css={alternativeAvatarStyle} draggable={false}/>
            }
        </div>

    )

}

const avatarStyle = css`
border-radius:100%;
float:left;
margin:1em 1em;
height:6em;
width:6em;
`

const alternativeAvatarStyle = css`
width:100%;
height:100%;
border-radius:100%;
`

function getAlternativeAvatar(role:PlayerRole):string{
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
        default :
            return Images.mercenary
    }
}

export default AvatarPanel