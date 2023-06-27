import { Flex } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";
import "../chatcomp/init";
interface Props {
  children: ReactNode
}

export function Page(props: Props){
  return(
    <Flex >
      {props.children}
    </Flex>
  )
}