import District from "../types/District";
import DistrictName from "../types/DistrictName";

const Jail:District = {
    name:DistrictName.Jail
}

const Market:District = {
    name:DistrictName.Market
}

const Tavern:District = {
    name:DistrictName.Tavern
}

const Treasure:District = {
    name:DistrictName.Treasure
}

const CityHall:District = {
    name:DistrictName.CityHall
}

const Harbor:District = {
    name:DistrictName.Harbor
}

const Palace:District = {
    name:DistrictName.Palace
}

export const DistrictArray = [Jail, Market, Tavern, Treasure, CityHall, Harbor, Palace]
export const DistrictArrayJailLess = [Market, Tavern, Treasure, CityHall, Harbor, Palace]