"use client"
import {useAtom} from "jotai"
import { activeSideBarItem } from "../configs/constants"
const useSideBar = () => {
    const[activeSideBar,setAciveSideBar]=useAtom(activeSideBarItem)
    return{activeSideBar,setAciveSideBar}
}

export default useSideBar