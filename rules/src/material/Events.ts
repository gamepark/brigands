import DistrictName from "../types/DistrictName";
import Event from "../types/Event";

const Event1: Event = {
    district:DistrictName.Market,
    goldForPrince:2,
    goldForTreasure:5
}
const Event2: Event = {
    district:DistrictName.CityHall,
    goldForPrince:3,
    goldForTreasure:4,
    numberOfDice:2
}
const Event3: Event = {
    district:DistrictName.Tavern,
    goldForPrince:3,
    goldForTreasure:5
}
const Event4: Event = {
    district:DistrictName.Palace,
    goldForPrince:4,
    goldForTreasure:4
}
const Event5: Event = {
    district:DistrictName.Harbor,
    goldForPrince:2,
    goldForTreasure:5
}
const Event6: Event = {
    district:DistrictName.Palace,
    goldForPrince:3,
    goldForTreasure:3
}
const Event7: Event = {
    district:DistrictName.Market,
    goldForPrince:3,
    goldForTreasure:5
}
const Event8: Event = {
    district:DistrictName.Harbor,
    goldForPrince:4,
    goldForTreasure:4
}
const Event9: Event = {
    district:DistrictName.CityHall,
    goldForPrince:4,
    goldForTreasure:3,
    numberOfDice:1
}
const Event10: Event = {
    district:DistrictName.Tavern,
    goldForPrince:2,
    goldForTreasure:4
}

export const EventArray : Event[] = [Event1, Event2, Event3, Event4, Event5, Event6, Event7, Event8, Event9, Event10]