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

export function getThiefMeepleDistrictTop(thiefIndex: number, meepleIndex: number, districtIndex: number) {
  const radius = getThiefMeepleDistrictRadius(thiefIndex, meepleIndex)
  const angle = getThiefMeepleDistrictAngle(thiefIndex, meepleIndex, districtIndex)
  return cityCenterTop - Math.sin(angle) * radius - meepleSize / 2
}

export function getThiefMeepleDistrictLeft(thiefIndex: number, meepleIndex: number, districtIndex: number) {
  const radius = getThiefMeepleDistrictRadius(thiefIndex, meepleIndex)
  const angle = getThiefMeepleDistrictAngle(thiefIndex, meepleIndex, districtIndex)
  return cityCenterLeft - Math.cos(angle) * radius - meepleSize / 2
}

function getThiefMeepleDistrictRadius(thiefIndex: number, meepleIndex: number) {
  return getThiefMeepleDistrictLine(thiefIndex, meepleIndex) * 3.7 + jailSize / 2 + 6.5
}

function getThiefMeepleDistrictLine(thiefIndex: number, meepleIndex: number) {
  switch (thiefIndex) {
    case 0:
    case 1:
      return meepleIndex > 0 ? 0 : 1
    case 2:
    case 3:
      return meepleIndex === 2 ? 2 : meepleIndex === 1 ? 3 : 4
    default:
      return 3
  }
}

const thiefMeepleDeltaAngle = [
  [10, 6, 15],
  [-10, -15, -6],
  [18, 14, 17],
  [-18, -14, -17],
  [-6, 0, 6]
]

function getThiefMeepleDistrictAngle(thiefIndex: number, pawnIndex: number, districtIndex: number) {
  return ((districtIndex - 1) * 45 + thiefMeepleDeltaAngle[thiefIndex][pawnIndex]) * Math.PI / 180
}

export function getPrinceMeepleDistrictTop(meepleIndex: number, districtIndex: number) {
  const radius = 2 * 3.7 + jailSize / 2 + 6.5
  const angle = ((5 - districtIndex) * 45 + (meepleIndex - 1) * 7) * Math.PI / 180
  return cityCenterTop - Math.sin(angle) * radius - meepleSize / 2
}

export function getPrinceMeepleDistrictLeft(meepleIndex: number, districtIndex: number) {
  const radius = 3.7 + jailSize / 2 + 6.5
  const angle = ((5 - districtIndex) * 45 + (meepleIndex - 1) * 7) * Math.PI / 180
  return cityCenterLeft - Math.cos(angle) * radius - meepleSize / 2
}

export const weekCardHeight = 18.6
export const weekCardRatio = 180 / 270
export const weekCardWidth = weekCardHeight * weekCardRatio