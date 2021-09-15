/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Avatar, Player} from '@gamepark/react-client'
import {SpeechBubbleDirection} from '@gamepark/react-client/dist/Avatar'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../utils/Images'

type Props = {
  playerInfo: Player<PlayerRole> | undefined
  role: PlayerRole
}

const AvatarPanel: FC<Props> = ({playerInfo, role}) => {
  const {t} = useTranslation()
  if (playerInfo?.avatar || true) {
    return <Avatar css={avatarStyle} playerId={role} speechBubbleProps={{direction: SpeechBubbleDirection.BOTTOM_RIGHT, children: 'blablabla'}}/>
  } else {
    return <img alt={t('Player avatar')} src={getAlternativeAvatar(role)} css={avatarStyle} draggable={false}/>
  }
}

const avatarStyle = css`
  position: relative;
  float: left;
  border-radius: 100%;
  margin: 1em 1em;
  height: 6em;
  width: 6em;
  color: black;
`

function getAlternativeAvatar(role: PlayerRole): string {
  switch (role) {
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