import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { Flex, Text, Heading, Button, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { io, Socket } from 'socket.io-client'
import { useStore } from '../../hooks/use-store'
// import { InputTextControlled } from '../input-text-controlled'
import { OnlineList } from './online-list'
import { OnlineBadger } from './online-badger'
import {SignalData} from 'simple-peer';
import Peer from 'simple-peer';
import { LoadingOverlay } from './loading-overlay'
// import { observer } from 'mobx-react-lite'
import { ReceivingCallOverlay } from './receiving-call-modal';
import { v4 } from 'uuid';
import { Page } from './page';
import "../chatcomp/init";

interface CallerData {
  signalData?: SignalData
  from?: string
  name?: string
}

export default function Home(callID: string): JSX.Element {

  // const Home = observer((callID: string) => {
  const navigate  = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [name, setName] = useState('')
  const { setUserId, userId, username, setUsername, currentCall } = useStore()
  
  // setUsername("BCE");

  const socketRef = useRef<Socket>()
  const [isRinging, setIsRinging] = useState<boolean>(false)
  const [isReceivingCall, setIsReceivingCall] = useState<boolean>(false)
  const [callerData, setCallerData] = useState<CallerData>()

  const callUser = (id: string) => {
    setIsRinging(true)
    const peer = new Peer({ initiator: true, trickle: false, stream: currentCall.myStream })

    peer.on('signal', (data: SignalData) => {
      socketRef.current?.emit('call-user', { from: userId, signalData: data, to: id,name: username})
    })

    peer.on("stream", stream => {
      currentCall.setStream(stream)
      peer.on('close', () => navigate('/dashboard'))
      currentCall.createConnection('', id)

      const roomId = v4();
      socketRef.current?.emit("join-room", { roomId: roomId, to: id })
      navigate(`/meet?id=${roomId}`)
    });

    socketRef.current?.on('call-answer', (data) => {
      setIsRinging(false)
      peer.signal(data.signalData)

      toast(`Call accepted from ${data.name}`, {type: 'success'})
    })

    socketRef.current?.on("call-refused", (data) => {
      setIsRinging(false)
      toast(`Call refused from ${data.name}`, {type: 'warning'})
    })
  }

  const answerCall = () => {
    if(!callerData?.signalData || !callerData?.from) return 
    const peer = new Peer({ initiator: false, trickle: false, stream: currentCall.myStream })

    peer.on("signal", data => {
      socketRef.current?.emit("answer-call", { signalData: data, to: callerData.from, from: userId,name: username })
    })

    peer.on("stream", stream => {
      currentCall.setStream(stream)
    });

    peer.signal(callerData?.signalData);

    setIsReceivingCall(false)

    socketRef.current?.on("join-room", (data) => {
      peer.on('close', () => navigate('/dashboard'))
      currentCall.createConnection('', callerData.from ?? '')
      navigate(`/meet?id=${data.roomId}`)
    })
  }

  const refuseCall = () => {
    socketRef.current?.emit("refuse-call", { to: callerData?.from, from: userId,name: username })
    setCallerData({})
    setIsReceivingCall(false)
  }

  const handleChangeName = (event: FormEvent) => {
    event.preventDefault()
    setUsername(name)
  }

  useEffect(() => {
    if (!username) return

    socketRef.current = io("http://localhost:7000");

    socketRef.current?.on('me', (id) => {
      setUserId(id);
    });

    socketRef?.current?.on('allUsers', (userList) => {
      setOnlineUsers(userList)
    })

    socketRef.current?.on("call", (data) => {
      setIsReceivingCall(true)
      setCallerData(data)
    })
    return () => { socketRef?.current?.disconnect() }
  }, [username])

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((currentStream) => {
      currentCall.setMyStream(currentStream);
      // console.log(MyStream);
    });
  }, [])

  return (
    <Page>
      <LoadingOverlay loading={isRinging}/>
      <ReceivingCallOverlay calling={isReceivingCall} refuse={refuseCall} answer={answerCall} caller={username}/>
      <VStack spacing={8} width="100%">
        <OnlineList user={callID} callback={callUser}/>
      </VStack>
      </Page>
  );
}



