/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {MAX_ACTIONS} from '@gamepark/brigands/Brigands'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Picture} from '@gamepark/react-components'
import {PictureAttributes} from '@gamepark/react-components/dist/Picture/Picture'
import Images from '../utils/Images'
import {cityCenterLeft, cityCenterTop} from '../utils/styles'

type Props = {
  player: PlayerRole
} & PictureAttributes

export default function ActionToken({player, ...props}: Props) {
  return <Picture src={actionTokenImage[player]} css={actionTokenCss} {...props}/>
}

const actionTokenImage: Record<PlayerRole, string> = {
  [PlayerRole.Prince]: Images.actionTokenWhite,
  [PlayerRole.GreenThief]: Images.actionTokenGreen,
  [PlayerRole.BlueThief]: Images.actionTokenBlue,
  [PlayerRole.RedThief]: Images.actionTokenRed,
  [PlayerRole.PurpleThief]: Images.actionTokenPurple,
  [PlayerRole.YellowThief]: Images.actionTokenYellow
}

export const actionTokenSize = 5

export const actionTokenCss = css`
  border-radius: 50%;
  box-shadow: 0 0 0.5em black;
  width: ${actionTokenSize}em;
  height: ${actionTokenSize}em;
`

export function actionTokenPosition(position: DistrictName | null | undefined, color: PlayerRole, index: number) {
  if (position === undefined) {
    return actionTokenStockPosition(color, index)
  } else if (position === null) {
    return actionTokenPlayerPosition(color, index)
  } else {
    return actionTokenDistrictPosition(color)
  }
}

const actionTokenStockPosition = (color: PlayerRole, index: number) => css`
  position: absolute;
  transform: translate(${actionTokenStockX(color, index)}em, ${actionTokenStockY(color, index)}em);
`

const actionTokenRadius = 45

function actionTokenStockX(color: PlayerRole, index: number) {
  const angle = actionTokenAngle(color)
  return cityCenterLeft - Math.cos(angle) * actionTokenRadius - actionTokenSize / 2 + (MAX_ACTIONS - index - 1) * 0.2
}

function actionTokenStockY(color: PlayerRole, index: number) {
  const angle = actionTokenAngle(color)
  return cityCenterTop - Math.sin(angle) * actionTokenRadius - actionTokenSize / 2 + (MAX_ACTIONS - index - 1) * 0.2
}

function actionTokenAngle(color: PlayerRole) {
  return 45 * (color - 1.5) * Math.PI / 180
}

const actionTokenPlayerPosition = (_color: PlayerRole, _index: number) => css`
  position: absolute;
  top: ${0}em;
  left: ${0}em;
`

const actionTokenDistrictPosition = (_color: PlayerRole) => css`
  position: absolute;
  top: ${0}em;
  left: ${0}em;
`