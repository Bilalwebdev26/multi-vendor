"use client";

import { useEffect, useState } from "react";

const LOCATION_STORAGE_KEY = "user_location";
const LOCATION_EXPIRY_DAYS = 20;
export const getStoredLocation = () => {
  const storedData = localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!storedData) return null;
  const parsesData = JSON.parse(storedData);
  const expiryTime = LOCATION_EXPIRY_DAYS * 24 * 60 * 60 * 1000; // 20 days
  const isExpired = Date.now() - parsesData.timestamp > expiryTime;
  return isExpired ? null : parsesData;
};
export const useLocationTrack = () => {
  const [location, setLocation] = useState<{
    country: string;
    city: string;
  } | null>(getStoredLocation());
  useEffect(() => {
    fetch("http://ip-api.com/json")
      .then((res) => {
        res.json;
      })
      .then((data: any) => {
        const newLoaction = {
          country: data?.country,
          city: data?.city,
          timestamp: Date.now(),
        };
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(newLoaction));
        setLocation(newLoaction)
      }).catch((error)=>{
        console.log("Failed to get a location",error)
      });
  }, []);
  return location
};
