import React from 'react'
import { Stack, Skeleton } from '@mui/material'

const ChatLoading = () => {
  return (
    <Stack>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
      <Skeleton height={90}/>
    </Stack>
  )
}

export default ChatLoading