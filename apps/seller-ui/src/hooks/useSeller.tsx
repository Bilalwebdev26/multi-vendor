import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { axiosInstance } from '../utils/axiosInstance'

//fetch user data 
const fetchSeller = async()=>{
    const response = await axiosInstance.get("/auth/api/v1/get-seller-profile")
    console.log("Res : ",response)
    return response.data.seller
}

//create hook

export const useSeller = ()=>{
    const {data:seller,isLoading,isError,refetch} = useQuery({
        queryKey:["seller"],
        queryFn:fetchSeller,
        staleTime:5*60*1000, // => 5min cache
        retry:1
    })
    return {seller,isLoading,isError,refetch}
}