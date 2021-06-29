import DistrictName from '../districts/DistrictName'

type Event = {
  district: DistrictName
  goldForTreasure: number
  goldForPrince: number
  positionOfCaptain: number
  numberOfDice?: number
}

export default Event