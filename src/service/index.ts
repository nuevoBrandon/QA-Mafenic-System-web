import axios from "axios"
import { environment } from "../environment"
import { IResponse, ISignIn, ITicket, ITicketRequest, IUser, IUserRequest } from "../interfaces"


export const signIn = async (param:ISignIn) =>{
    const url = `${environment.base}${environment.auth.base}${environment.auth.signIn}`
    const response = await axios.post(url,param,{
        withCredentials: true,
    })
    return response.data
}

export const createUser = async (param:IUserRequest) =>{
    const url = `${environment.base}${environment.auth.base}${environment.auth.create}`
    const response = await axios.post(url,param,{
        withCredentials: true,
    })
    return response.data
}


export const fetchUser = async () =>{
    const url = `${environment.base}${environment.auth.base}${environment.auth.users}`
    const response = await axios.get<IResponse<IUser[]>>(url,{
        withCredentials: true,
    })
    return response.data
}


export const fetchTicket = async () =>{
    const url = `${environment.base}${environment.ticket.base}`
    const response = await axios.get<IResponse<ITicket[]>>(url,{
        withCredentials: true,
    })
    return response.data
}

export const createTicket = async (param:ITicketRequest) =>{
    const url = `${environment.base}${environment.ticket.base}${environment.ticket.create}`
    const response = await axios.post<IResponse<any>>(url,param,{
        withCredentials: true,
    })
    return response.data
}