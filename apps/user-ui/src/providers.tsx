'use client'
import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  //useQuery,
} from "@tanstack/react-query";
const Providers = ({ children }: { children: React.ReactNode }) => {
    //const queryClient = new QueryClient()
    const[queryClient]=useState(()=> new QueryClient())
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};

export default Providers;
