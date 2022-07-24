import PlayerRole from '@gamepark/brigands/types/PlayerRole'

export const headerHeight = 7
export const playerPanelWidth = 26.5
export const playerPanelHeight = 26
export const playerPanelXMin = 95
export const playerPanelThiefTop = 48
export const playerPanelPrinceTop = 50

export const playerPanelX = (color: PlayerRole) => color % 3 * (playerPanelWidth + 1) + playerPanelXMin
export const playerPanelY = (color: PlayerRole) => color < 4 ? headerHeight + 2 + playerPanelHeight : headerHeight + 1

export const jailSize = 31.5
export const cityCenterTop = 53.5
export const cityCenterLeft = 47.5

export const meepleSize = 4.5

export function getThiefMeepleDistrictTop(color: PlayerRole, meepleIndex: number, districtIndex: number) {
  const radius = getThiefMeepleDistrictRadius(color, meepleIndex)
  const angle = getThiefMeepleDistrictAngle(color, meepleIndex, districtIndex)
  return cityCenterTop - Math.sin(angle) * radius - meepleSize / 2
}

export function getThiefMeepleDistrictLeft(color: PlayerRole, meepleIndex: number, districtIndex: number) {
  const radius = getThiefMeepleDistrictRadius(color, meepleIndex)
  const angle = getThiefMeepleDistrictAngle(color, meepleIndex, districtIndex)
  return cityCenterLeft - Math.cos(angle) * radius - meepleSize / 2
}

function getThiefMeepleDistrictRadius(color: PlayerRole, meepleIndex: number) {
  return getThiefMeepleDistrictLine(color, meepleIndex) * 3.7 + jailSize / 2 + 6.5
}

function getThiefMeepleDistrictLine(color: PlayerRole, meepleIndex: number) {
  switch (color) {
    case PlayerRole.GreenThief:
    case PlayerRole.BlueThief:
      return meepleIndex > 0 ? 0 : 1
    case PlayerRole.RedThief:
    case PlayerRole.PurpleThief:
      return meepleIndex === 2 ? 2 : meepleIndex === 1 ? 3 : 4
    default:
      return 3
  }
}

const meepleDeltaAngle: Record<PlayerRole, number[]> = {
  [PlayerRole.Prince]: [-7, 0, 7],
  [PlayerRole.GreenThief]: [10, 6, 15],
  [PlayerRole.BlueThief]: [-10, -15, -6],
  [PlayerRole.RedThief]: [18, 14, 17],
  [PlayerRole.PurpleThief]: [-18, -14, -17],
  [PlayerRole.YellowThief]: [-6, 0, 6]
}

function getThiefMeepleDistrictAngle(thiefIndex: number, pawnIndex: number, districtIndex: number) {
  return ((districtIndex - 1) * 45 + meepleDeltaAngle[thiefIndex][pawnIndex]) * Math.PI / 180
}

export function getPrinceMeepleDistrictTop(meepleIndex: number, districtIndex: number) {
  const radius = 2 * 3.7 + jailSize / 2 + 6.5
  const angle = ((districtIndex - 1) * 45 + meepleDeltaAngle[PlayerRole.Prince][meepleIndex]) * Math.PI / 180
  return cityCenterTop - Math.sin(angle) * radius - meepleSize / 2
}

export function getPrinceMeepleDistrictLeft(meepleIndex: number, districtIndex: number) {
  const radius = 2 * 3.7 + jailSize / 2 + 6.5
  const angle = ((districtIndex - 1) * 45 + meepleDeltaAngle[PlayerRole.Prince][meepleIndex]) * Math.PI / 180
  return cityCenterLeft - Math.cos(angle) * radius - meepleSize / 2
}

export const weekCardHeight = 18.6
export const weekCardRatio = 180 / 270
export const weekCardWidth = weekCardHeight * weekCardRatio