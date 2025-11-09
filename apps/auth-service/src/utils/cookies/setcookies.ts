import type { Response } from "express"
export const setCookie = async(res:Response,name:string,value:string)=>{
    let time = 0
    if(name === "refresh-token"){
        time = 7 * 24 * 60 * 60 * 1000
    }else{
        time = 15 * 60 * 1000
    }
    res.cookie(name,value,{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: time
    })
}