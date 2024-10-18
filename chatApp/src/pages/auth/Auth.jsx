import React from 'react'
import { useState } from 'react'
import Background from "../../assets/login2.png"
import Luffy from "../../assets/Luffy.jpg"
import { Button } from '@/components/ui/button'
import Victory from "../../assets/victory.svg"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'
import { apiClient } from "@/lib/api-client.js"
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store'

const Auth = () => {
  const {setUserInfo} = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const validateLogin = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    else {
      return true;
    }
  }

  const handleLogin = async () => {
    if (validateLogin()) {
      const response = await apiClient.post(LOGIN_ROUTE, { email, password }, { withCredentials: true });
      // console.log({ response });
      if(response.data.user.id){
        setUserInfo(response.data.user); 
        if(response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    }
  }

  const validateSignup = () => {
    if (!email.length) {
      toast.error("Email is required");
      return false;
    }
    if (!password.length) {
      toast.error("Password is required");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Confirm Password should match with Password");
      return false;
    }
    else {
      return true;
    }
  }

  const handleSignUp = async () => {
    if (validateSignup()) {
      const response = await apiClient.post(SIGNUP_ROUTE, { email, password }, { withCredentials: true });
      // console.log({ response });
      if (response.status === 201) {
        setUserInfo(response.data.user); 
        navigate("/profile");
      }
    }
  }

  return (
    <>
      <div className='flex items-center justify-center h-screen w-screen'>
        <div className="h-[80vh] w-[80vw] border-2 text-opacity-90 border-white shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2">
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center justify-center">
                <h1 className='text-3xl font-bold md:text-4xl'>Welcome</h1>
                <img src={Victory} alt="Victory Emoji" className='h-[100px] ' />
              </div>
              <p className='font-medium text-sm text-center'>Fill in the details to get started with the Chat Application !</p>
            </div>
            <div className="flex items-center justify-center w-full">
              <Tabs className='w-3/4' defaultValue='login'>
                <TabsList className="bg-transparent w-full rounded-none">
                  <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300 rounded-none" value="login">Login</TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 transition-all duration-300 rounded-none" value="signup">SignUp</TabsTrigger>
                </TabsList>

                <TabsContent className="flex flex-col gap-5 mt-5" value="login">
                  <Input placeholder="Email" type="email" value={email} className="rounded-full" onChange={(e) => setEmail(e.target.value)} />
                  <Input placeholder="Password" type="password" value={password} className="rounded-full" onChange={(e) => setPassword(e.target.value)} />
                  <Button className="rounded-full" onClick={handleLogin}>Login</Button>
                </TabsContent>
                <TabsContent className="flex flex-col gap-5" value="signup">
                  <Input placeholder="Email" type="email" value={email} className="rounded-full " onChange={(e) => setEmail(e.target.value)} />
                  <Input placeholder="Password" type="password" value={password} className="rounded-full" onChange={(e) => setPassword(e.target.value)} />
                  <Input placeholder="Confirm Password" type="password" value={confirmPassword} className="rounded-full" onChange={(e) => setConfirmPassword(e.target.value)} />
                  <Button className="rounded-full" onClick={handleSignUp}>Sign Up</Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="hidden xl:flex justify-center items-center">
            <img src={Luffy} alt="" className='h-[60vh] rounded-lg' />
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth