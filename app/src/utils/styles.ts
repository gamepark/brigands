export const headerHeight = 7
export const playerPanelWidth = 26.5
export const playerPanelHeight = 25
export const playerPanelMinLeft = 95
export const playerPanelThiefTop = 48
export const playerPanelPrinceTop = 50

export function thiefPanelTopPosition(index: number, isThief: boolean) {
  if (isThief) {
    return index < 2 ? playerPanelThiefTop : playerPanelThiefTop + playerPanelHeight + 1
  } else {
    return index < 2 ? headerHeight + 1 : headerHeight + 2 + playerPanelHeight
  }
}

export function thiefPanelLeftPosition(index: number) {
  switch (index) {
    case 0:
    case 2:
      return playerPanelMinLeft + playerPanelWidth * 2 + 2
    case 3:
      return playerPanelMinLeft + playerPanelWidth + 1
    default:
      return playerPanelMinLeft
  }
}
