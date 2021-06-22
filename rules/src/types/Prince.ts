import DistrictName from "./DistrictName"

type Prince = {
    victoryPoints : number 
    patrols : DistrictName[]
    abilities : [boolean,false | DistrictName,boolean]
}

export default Prince