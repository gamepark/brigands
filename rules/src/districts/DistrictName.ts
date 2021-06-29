enum DistrictName {
  Jail = 1, Tavern, Market, Harbor, CityHall, Treasure, Palace, Convoy
}

export default DistrictName

export const districtNames = Object.values(DistrictName).filter(isDistrictName)

function isDistrictName(arg: string | DistrictName): arg is DistrictName {
  return typeof arg === 'number'
}