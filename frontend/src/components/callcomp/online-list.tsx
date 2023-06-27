import { Flex, Heading } from "@chakra-ui/react"
import { useStore } from "../../hooks/use-store"
import { CallButton } from "./call-button"
import React from "react"
import "../chatcomp/init";
interface Props {
  user: string
  callback(user: string): void
}

export function OnlineList(props: Props){
  const { userId } = useStore()
  return (
    <Flex justify="center" align="center" w="full" direction="column">
      {props.user !== userId && (
        <CallButton onClick={() => props.callback(props.user)} />
      )}
    </Flex>
  )
}