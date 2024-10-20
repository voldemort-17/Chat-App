import { useAppStore } from '@/store'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { colors, getColor } from '@/lib/utils';
import { Button } from "@/components/ui/button"
import { HOST, IMAGE_ROUTE, REMOVE_IMAGE_ROUTE, UPDATE_PROFILE } from '@/utils/constant';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';


const Profile = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName),
        setLastName(userInfo.lastName),
        setSelectedColor(userInfo.color)
    }
    // if(user.image){
    //   setImage(`${HOST}/${userInfo.image}`)
    // }
  }, [userInfo])

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required");
      return false;
    }
    else {
      return true;
    }
  }

  // console.log(selectedColor)

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const response = await apiClient.post(UPDATE_PROFILE, { firstName, lastName, color: selectedColor }, { withCredentials: true });
        // console.log({ response });
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    }
    else {
      toast.error("Please setup profile first.")
    }
  }

  const handleFileInputClick = () => {
    // fileInputRef.current.click();
  }

  const handleDeleteImage = async () => {
    // try {
    //   const response = await apiClient.delete(REMOVE_IMAGE_ROUTE, {withCredentials: true})
    //   if(response.status === 200){
    //     setUserInfo({...userInfo, image: null});
    //     toast.success("Image Removed Successfully.")
    //     setImage(null);
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  }

  const handleImageChange = async (event) => {
    // const file = event.target.files[0];
    // // console.log({file});
    // const formData = new FormData();
    // formData.append("profile-image", file);
    // const response = await apiClient.post(IMAGE_ROUTE, formData, {withCredentials: true});
    // if(response.status === 200 && response.data.image){
    //   setUserInfo({...userInfo, image: response.data.image})
    //   toast.success("Image Updated Successfully.")
    // }
    // const reader = new FileReader();
    // reader.onload = () => {
    //   setImage(reader.result);
    // }
    // reader.readAsDataURL(file);
  }

  return (
    <>
      <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
        <div className="flex flex-col gap-10 w-[80vw] md:w-max">
          <div className="" onClick={handleNavigate}>
            <IoArrowBack className='text-3xl lg:text-4xl text-white/90 cursor-pointer' />
          </div>
          <div className="grid grid-cols-2 ">
            <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className='h-32 w-32 md:w-48 md:h-48 overflow-hidden rounded-full'>
                {
                  image ? <AvatarImage src={image} alt="profile" className="object-cover w-full h-full bg-black" /> :
                    <div className={`uppercase h-32 w-32 md:w-48 md:h-48 text-4xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedColor)}`}>
                      {
                        firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
                      }
                    </div>
                }
                {hovered && (<div className='rounded-full inset-0 flex items-center justify-center absolute bg-black/50 cursor-pointer'>{image ? <FaTrash className='text-white text-3xl cursor-pointer' /> : <FaPlus className='text-white text-3xl cursor-pointer' onClick={image ? handleDeleteImage : handleFileInputClick} />}
                </div>)}
                <input type="file" ref={fileInputRef} className='hidden' onChange={handleImageChange} name='profile-image' accept='.png, .jpg, .jpeg, .svg, .webp'/>
              </Avatar>
            </div>
            <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
              <div className="w-full">
                <input type="email" placeholder='Email' value={userInfo.email} disabled className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
              </div>
              <div className="w-full">
                <input type="text" placeholder='First Name'
                  onChange={(e) => setFirstName(e.target.value)} value={firstName} className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
              </div>
              <div className="w-full">
                <input type="text" placeholder='Last Name'
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName} className='rounded-lg p-6 bg-[#2c2e3b] border-none' />
              </div>
              <div className="w-full flex gap-5">
                {
                  colors.map((color, i) =>
                    <div className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${selectedColor === i ? "outline outline-white/50 outline-2" : ""}`} key={i} onClick={() => setSelectedColor(i)}>

                    </div>
                  )
                }
              </div>
            </div>
          </div>
          <div className="w-full">
            <Button className='h-16 transition-all   w-full duration-300 bg-purple-600 hover:bg-purple-900'
              onClick={saveChanges}>Save Changes</Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile
