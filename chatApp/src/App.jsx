import { useEffect, useState } from 'react'
import { Button } from './components/ui/button'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Auth from './pages/auth/Auth'
import Profile from './pages/profile/Profile'
import Chat from './pages/chat/Chat'
import { useAppStore } from "./store"
import { apiClient } from "./lib/api-client"
import { GET_USER_INFO } from '@/utils/constant'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children;
}

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getUserData = async () => {
      try {
        if(userInfo === undefined){
          return ;
        }
        else{
          const response = await apiClient.get(GET_USER_INFO, { withCredentials: true, signal });
          if (response.status === 200 && response.data.id) {
            setUserInfo(response.data);
          } else {
            setUserInfo(undefined);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setUserInfo(undefined);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }

    return () => {
      controller.abort();
    };
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>} />
        <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path='*' element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
