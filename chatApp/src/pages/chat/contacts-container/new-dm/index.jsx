import React, { useState } from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Lottie from 'react-lottie'
import { animationDefaultOptions, getColor } from "@/lib/utils"
import { apiClient } from '@/lib/api-client'
import { SEARCH_CONTACTS_ROUTE } from '@/utils/constant'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/store'



const NewDm = () => {

    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false)
    const [searchedContacts, setSearchedContacts] = useState([]);

    const searchContacts = async (search) => {
        try {
            if (search.length > 0) {
                const response = await apiClient.post(SEARCH_CONTACTS_ROUTE, { search }, { withCredentials: true })

                if (response.status === 200 && response.data.contacts) {
                    setSearchedContacts(response.data.contacts)
                }
                else {
                    setSearchedContacts([]);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const selectNewContact = (contact) => {
        setOpenNewContactModal(false);
        setSelectedChatType("contact"),
            setSearchedContacts([]);
        setSelectedChatData(contact)
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all duration-300' onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                        Select New Contact
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className='flex flex-col h-[400px] w-[400px] border-none bg-[#181920] text-white'>
                    <DialogHeader>
                        <DialogTitle>Please select a Contact.</DialogTitle>
                        <DialogDescription>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder="Search Contacts" className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => searchContacts(e.target.value)}
                        />
                    </div>
                    {
                        searchedContacts.length > 0 && (
                            <ScrollArea className='h-[250px]'>
                                <div className="flex flex-col gap-5">
                                    {
                                        searchedContacts.map((contact) => (
                                            <div key={contact._id} className='flex gap-3 items-center cursor-pointer' onClick={() => selectNewContact(contact)}>
                                                <div className="w-12 h-12 relative">
                                                    <Avatar className='h-12 w-12  overflow-hidden rounded-full'>
                                                        {
                                                            contact.image ? <AvatarImage src={contact.image} alt="profile" className="object-cover w-full h-full bg-black" /> :
                                                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                                    {
                                                                        contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                                                                    }
                                                                </div>
                                                        }
                                                    </Avatar>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className='text-sm'>
                                                        {
                                                            contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                        }
                                                    </span>
                                                    <span className='text-xs'>{contact.email}</span>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        )
                    }
                    {
                        searchedContacts.length <= 0 && (
                            <div className='flex-1 md:flex flex-col justify-center items-center duration-1000 transition-all'>
                                <Lottie
                                    isClickToPauseDisabled={true}
                                    height={100}
                                    width={100}
                                    options={animationDefaultOptions}
                                />
                                <div className="text-opacity-80 text-white flex  flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                    <h3 className='poppins-medium'>
                                        Hi <span className='text-purple-500'>!</span> Search new
                                        <span className='text-purple-500'> Contact.</span>
                                    </h3>
                                </div>
                            </div>
                        )
                    }
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDm