import { useAppStore } from "@/store";
import { HOST } from "@/utils/constant";
import { createContext, useRef, useContext, useEffect, Children } from "react";
import { io } from "socket.io-client";

const socketContext = createContext(null);

export const useSocket = () => {
    return useContext(socketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore();

    useEffect(() => {
        if (userInfo) {
            socket.current = io(HOST, {
                withCredentials: true,
                query: {
                    userId: userInfo.id
                }
            });

            socket.current.on("connect", () => {
                // console.log("Connected to Socket Server");
            })

            const handleRecieveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage, addContactsInDMContactList} = useAppStore.getState();

                if((selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id) && (selectedChatType !== undefined)){
                    // console.log(message);   
                    addMessage(message);
                }
                addContactsInDMContactList(message);
            }

            socket.current.on("recieveMessage", handleRecieveMessage);

            return () => {
                socket.current.disconnect();
            }
        }
    }, [userInfo]);

    return (
        <socketContext.Provider value={socket.current}>
            {children}
        </socketContext.Provider>
    )
}