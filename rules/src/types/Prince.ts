import DistrictName from '../districts/DistrictName'

type Prince = {
  victoryPoints: number
  patrols: (DistrictName | -1 | -2)[]
  abilities: [boolean, false | DistrictName, boolean]
}

export default Prince