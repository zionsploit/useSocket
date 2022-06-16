//Basic Socket Hooks Connection

import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const useSocket = (socketConnection: string, socketEventName: string, roomId?: string | number | undefined) => {
    const SC = socketConnection
    const SEN = socketEventName
    const RID = roomId ?? 0
    const socket = useRef<Socket>()
    const [getMessage, getSetMessage] = useState<Array<any>>([])


    useEffect(() => {
        if (typeof socket !== 'undefined') {
            socket.current = io(SC, {
                query: { RID }
            })

            socket.current.on(SEN, (message: { senderId: string | number }) => {
                const incomingMessage = {
                    ...message,
                    isFromUser: message.senderId === socket.current?.id
                }

                getSetMessage((message) => [...message, incomingMessage])
            })
        }

        return () => {
            socket.current?.disconnect()
        }
    }, [RID, SC, SEN])

    const sendMessage = (messageBody: string | Object) => {
        socket.current?.emit(SEN, {
            body: messageBody,
            senderId: socket.current.id
        })
    }

    return { getMessage, sendMessage }
}

export default useSocket