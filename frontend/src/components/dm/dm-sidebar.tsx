import { Flex, Text, useColorModeValue } from '@chakra-ui/react'
import { NextRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { Socket } from 'socket.io-client'
import { useUser } from 'src/lib/use-user'
import { DMObject } from 'src/types/chat'
import DMCreationForm from './dm-creation-form'

const PREFIX_URL = '/dm'

type Props = {
  socket: Socket
  router: NextRouter
}

const DMSideBar = ({ socket, router }: Props) => {
  const [DMRooms, setDMRooms] = useState<DMObject[]>([])
  const [newDMRoom, setnewDMRoom] = useState<DMObject>()
  const didLogRef = useRef(false)
  const { user } = useUser()

  useEffect(() => {
    if (didLogRef.current === false) {
      didLogRef.current = true
      socket.on('getRooms', (rooms: DMObject[]) => {
        console.log('getRooms received: ', rooms)
        setDMRooms(rooms)
      })
      socket.on('updateRoom', (newDMRoom: DMObject) => {
        console.log('updateRoom called: ', newDMRoom)
        router.push(PREFIX_URL + '/' + newDMRoom.id)
      })
      socket.on('addRoom', (newDMRoom: DMObject) => {
        console.log('addRoom called: ', newDMRoom)
        setnewDMRoom(newDMRoom)
      })
      socket.emit('getRooms')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (newDMRoom) {
      setDMRooms([newDMRoom, ...DMRooms])
      console.log(DMRooms)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newDMRoom])

  return (
    <Flex
      width='100%'
      direction='column'
      bg={useColorModeValue('gray.200', 'gray.700')}
      overflowX='scroll'
      p={1}
    >
      <Flex width='100%' p={2}>
        <Flex
          as='button'
          p={2}
          rounded={'md'}
          _hover={{ bg: useColorModeValue('gray.100', 'gray.800') }}
          w='100%'
          onClick={() => {
            router.push(PREFIX_URL)
          }}
        >
          <Text mr='auto' as='b'>
            Friends
          </Text>
        </Flex>
      </Flex>
      <Flex width='100%' p={2}>
        <DMCreationForm socket={socket} />
      </Flex>
      <Flex width='100%' p={2} direction='column'>
        {DMRooms.length
          ? DMRooms.map((DMRoom: DMObject) => (
              <Flex
                as='button'
                p={3}
                w='100%'
                rounded={'md'}
                _hover={{ bg: 'gray.100' }}
                onClick={() => {
                  router.push(PREFIX_URL + '/' + DMRoom.id)
                }}
                key={DMRoom.id}
              >
                {DMRoom.user1 == user.username ? DMRoom.user2 : DMRoom.user1}
              </Flex>
            ))
          : null}
      </Flex>
    </Flex>
  )
}

export default DMSideBar
