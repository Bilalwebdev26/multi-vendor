import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { axiosInstance } from '../utils/axiosInstance'

//fetch user data 
const fetchUser = async()=>{
    const response = await axiosInstance.get("/auth/api/v1/user-profile")
    return response.data.user
}

//create hook

export const useUser = ()=>{
    const {data:user,isLoading,isError,refetch} = useQuery({
        queryKey:["user"],
        queryFn:fetchUser,
        staleTime:5*60*1000, // => 5min cache
        retry:1
    })
    return {user,isLoading,isError,refetch}
}