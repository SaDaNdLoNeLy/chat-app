import { Flex, Text } from '@chakra-ui/react'
import React from 'react'
import { HiStatusOnline } from 'react-icons/hi'
import "../chatcomp/init";
export function OnlineBadger(){
  return(
    <Flex align="center" justify="center">
    <HiStatusOnline color="green"/>
      <Text color="green.400" ml="2">
        You are online!
      </Text>
    </Flex>
  )
}