import { Button } from '@chakra-ui/react'
import React from 'react'
import { MdCall } from "react-icons/md"
import "../chatcomp/init";
interface Props {
  onClick: () => void

}

export function CallButton(props: Props){
  return(
    <Button
      rightIcon={<MdCall/>}
      colorScheme="purple"
      variant="outline"
      cursor="pointer"
      onClick={props.onClick}>
    </Button>
  )
}