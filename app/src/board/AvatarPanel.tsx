/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Avatar, Player} from '@gamepark/react-client'
import {SpeechBubbleDirection} from '@gamepark/react-client/dist/Avatar'
import {Picture} from '@gamepark/react-components'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import Images from '../images/Images'

type Props = {
  playerInfo: Player<PlayerRole> | undefined
  role: PlayerRole
}

const AvatarPanel: FC<Props> = ({playerInfo, role}) => {
  const {t} = useTranslation()
  if (playerInfo?.avatar) {
    return <Avatar css={avatarStyle} playerId={role} speechBubbleProps={{direction: SpeechBubbleDirection.BOTTOM_RIGHT}}/>
  } else {
    return <Picture alt={t('Player avatar')} src={getAlternativeAvatar(role)} css={avatarStyle}/>
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
      return Images.actionTokenBlue
    case PlayerRole.GreenThief :
      return Images.actionTokenGreen
    case PlayerRole.PurpleThief :
      return Images.actionTokenPurple
    case PlayerRole.RedThief :
      return Images.actionTokenRed
    case PlayerRole.YellowThief :
      return Images.actionTokenYellow
    default :
      return Images.patrol
  }
}

export default AvatarPanel