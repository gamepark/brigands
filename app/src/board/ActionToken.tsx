/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {MAX_ACTIONS} from '@gamepark/brigands/Brigands'
import District from '@gamepark/brigands/districts/District'
import DistrictName from '@gamepark/brigands/districts/DistrictName'
import PlayerRole from '@gamepark/brigands/types/PlayerRole'
import {Picture} from '@gamepark/react-components'
import {PictureAttributes} from '@gamepark/react-components/dist/Picture/Picture'
import Images from '../images/Images'
import {cityCenterLeft, cityCenterTop, playerPanelX, playerPanelY} from '../utils/styles'

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

export function actionTokenPosition(position: DistrictName | null | undefined, color: PlayerRole, index: number, city: District[]) {
  if (position === undefined) {
    return actionTokenStockPosition(color, index)
  } else if (position === null) {
    return actionTokenPlayerPosition(color, index)
  } else {
    return actionTokenDistrictPosition(color, city.findIndex(d => d.name === position))
  }
}

const actionTokenStockPosition = (color: PlayerRole, index: number) => css`
  position: absolute;
  left: ${actionTokenStockX(color, index)}em;
  top: ${actionTokenStockY(color, index)}em;
`

const actionTokenStockRadius = 45

function actionTokenStockX(color: PlayerRole, index: number) {
  const angle = actionTokenStockAngle(color)
  return cityCenterLeft - Math.cos(angle) * actionTokenStockRadius - actionTokenSize / 2 + (MAX_ACTIONS - index - 1) * 0.2
}

function actionTokenStockY(color: PlayerRole, index: number) {
  const angle = actionTokenStockAngle(color)
  return cityCenterTop - Math.sin(angle) * actionTokenStockRadius - actionTokenSize / 2 + (MAX_ACTIONS - index - 1) * 0.2
}

function actionTokenStockAngle(color: PlayerRole) {
  return 45 * (color - 1.5) * Math.PI / 180
}

const actionTokenPlayerPosition = (color: PlayerRole, index: number) => css`
  position: absolute;
  top: ${playerPanelY(color) + 14}em;
  left: ${playerPanelX(color) + index * 3.9 + 1}em;
`

const actionTokenDistrictPosition = (color: PlayerRole, districtIndex: number) => css`
  position: absolute;
  left: ${actionTokenDistrictX(color, districtIndex)}em;
  top: ${actionTokenDistrictY(color, districtIndex)}em;
`

function actionTokenDistrictX(color: PlayerRole, districtIndex: number) {
  const angle = getActionTokenDistrictAngle(color, districtIndex)
  return cityCenterLeft - Math.cos(angle) * actionTokenDistrictRadius[color] - actionTokenSize / 2
}

function actionTokenDistrictY(color: PlayerRole, districtIndex: number) {
  const angle = getActionTokenDistrictAngle(color, districtIndex)
  return cityCenterTop - Math.sin(angle) * actionTokenDistrictRadius[color] - actionTokenSize / 2
}

function getActionTokenDistrictAngle(color: PlayerRole, districtIndex: number) {
  return ((districtIndex - 1) * 45 + actionTokenDeltaAngle[color]) * Math.PI / 180
}

const actionTokenDeltaAngle: Record<PlayerRole, number> = {
  [PlayerRole.Prince]: 0,
  [PlayerRole.GreenThief]: 16,
  [PlayerRole.BlueThief]: -16,
  [PlayerRole.RedThief]: 18,
  [PlayerRole.PurpleThief]: -18,
  [PlayerRole.YellowThief]: 0
}

const actionTokenDistrictRadius: Record<PlayerRole, number> = {
  [PlayerRole.Prince]: 27,
  [PlayerRole.GreenThief]: 25,
  [PlayerRole.BlueThief]: 25,
  [PlayerRole.RedThief]: 33.5,
  [PlayerRole.PurpleThief]: 33.5,
  [PlayerRole.YellowThief]: 36
}