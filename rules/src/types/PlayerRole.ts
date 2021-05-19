enum PlayerRole {Prince=1,GreenThief, BlueThief, RedThief, PurpleThief, YellowThief}

export default PlayerRole

export const playerRoles = Object.values(PlayerRole).filter(isPlayerRole)

function isPlayerRole(arg: string | PlayerRole): arg is PlayerRole {
  return typeof arg === 'number'
}