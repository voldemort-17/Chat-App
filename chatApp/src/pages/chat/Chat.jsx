import { useAppStore } from '@/store'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ContactsContainer from './contacts-container';
import EmptyChatContainer from './empty-chat-container';
import ChatContainer from './chat-container';

const Chat = () => {
  const { userInfo, fileDownloadProgress, isUploading, isDownloading, fileUploadProgress, selectedChatType } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo.profileSetup) {
      toast.warning("Please create profile to continue.")
      navigate("/profile")
    }
  }, [navigate, userInfo])

  return (
    <>
      <div className="flex h-[100vh] text-white overflow-hidden">
        {
          isUploading && <div className='h-[100vh] left-0 top-0 w-[100vw] flex items-center justify-center fixed z-10 bg-black/80 flex-col gap-5 backdrop-blur-lg'>
            <h5 className='text-5xl animate-pulse'>Uploading file</h5>
            {fileUploadProgress}%
          </div>
        }
        {
          isDownloading && <div className='h-[100vh] left-0 top-0 w-[100vw] flex items-center justify-center fixed z-10 bg-black/80 flex-col gap-5 backdrop-blur-lg'>
            <h5 className='text-5xl animate-pulse'>Downloading file</h5>
            {fileDownloadProgress}%
          </div>
        }
        <ContactsContainer />
        {
          selectedChatType === undefined ? <EmptyChatContainer/> : <ChatContainer/>
        }
      </div>
    </>
  )
}

export default Chat