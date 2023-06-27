import { useContext } from "react";
import { storeContext } from "../contexts/store-context";
import React from "react";
export function useStore(){
  return useContext(storeContext)
}