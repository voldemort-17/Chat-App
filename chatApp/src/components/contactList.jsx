import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { getColor } from '@/lib/utils';

const ContactList = ({ contacts, isChannel = false }) => {

    const { selectedChatData, setSelectedChatData, selectedChatType, setSelectedChatType, setSelectedChatMessages } = useAppStore();

    // console.log(contacts);


    const handleClick = (contact) => {
        if (isChannel) {
            setSelectedChatType("channel")
        }
        else setSelectedChatType("contact");
        setSelectedChatData(contact)
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }
    }
 
    return (
        <div className='mt-5'>{contacts.map((curr) => {
            return <div key={curr._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === curr._id ? "bg-[#ffffff22] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111]"}`} onClick={() => handleClick(curr)}>
                <div className="flex gap-5 items-center justify-start text-neutral-300">
                    {
                        !isChannel && (
                            <Avatar className='h-10 w-10  overflow-hidden rounded-full'>
                                {

                                    <div className={`uppercase h-10 w-10 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(3)}`}>
                                        {
                                            curr.firstName ? curr.firstName.split("").shift() : curr.email.split("").shift()
                                        }
                                    </div>
                                }
                            </Avatar>
                        )
                    }
                    {
                        isChannel && <div className='bg-[#ffffff22] h-10 w-10 items-center justify-center rounded-full flex '>#</div>
                    }
                    {
                        isChannel ? <span>{curr.name}</span> : 
                        <span>{ curr.firstName ? `${curr.firstName} ${curr.lastName}` : curr.email}</span>
                    }
                </div>
            </div>
        })}</div>
    )
}

export default ContactList