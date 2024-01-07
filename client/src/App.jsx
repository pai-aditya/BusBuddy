import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import BusView from './pages/BusView';
import Register from './pages/Register';
import Login from './pages/Login';
import Bookings from './pages/Bookings';
import Logout from './pages/Logout';
import Buses from './pages/Buses';
import Users from './pages/Users';
import AddBus from './pages/AddBus';
import ModifyBus from './pages/ModifyBus';
import SpecificBookings from './pages/SpecificBookings';
import Profile from './pages/Profile';

import {SERVER_URL} from './components/Constants';
import Sidebar from './components/Sidebar';
import SidebarItem from './components/SidebarItem';
import { useState,useEffect } from 'react';


import {Home as HomeIcon,User,Users as UsersIcon, BookText, BusFront,LogIn,LogOut} from "lucide-react";

const App = () => {

  const [user, setUser] = useState(null);
  const [showLoginButton, setShowLoginButton] = useState(true);
  const [isAdmin,setIsAdmin]=useState(false);
  
const FetchUserData = async () => {
  try{
    const response = await fetch(`${SERVER_URL}/auth/check`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials:"include",
    });
    const data = await response.json();
    if (data.message === "Unauthorized") {
      console.log("User has not logged in");
      return null;
    }

    return data;
} catch(error){
    console.log(error);
    return null;
  }
};

  useEffect(() => {
    if (!user) {
      setShowLoginButton(true);
    }else{
      setShowLoginButton(false);
    }
  }, [user]);
	
  useEffect(() => {
    const fetchData = async () => {
      try{
        const userData = await FetchUserData();
        setUser(userData);
        console.log("usera datat getting",JSON.stringify(userData.user.username));
        if(userData.user.username=="admin"){
          setIsAdmin(true);
        }else{
          setIsAdmin(false);
        }
      }catch(err){
        console.log(err);
      }
    };
    fetchData();
  },[]);



  return (
    <div className='flex'>
      <Sidebar user={user}>
        <SidebarItem icon={<HomeIcon    size={20} />} text="Home" link="/" />
        
        
        {showLoginButton && 
          <div>
            <hr className="my-3" />
            <SidebarItem icon={<LogIn       size={20}   />} text="Login" link="/login"/>
          </div>
        }
        {!showLoginButton && !isAdmin &&
          <div>
            <hr className="my-3" />
            <SidebarItem icon={<User        size={20} />} text="Your Profile"         link="/profile" />
            <SidebarItem icon={<BookText    size={20} />} text="My Bookings"         link="/mybookings" />
            <hr className="my-3" />
            <SidebarItem icon={<LogOut      size={20} />} text="Logout"               link="/logout"/>
          </div>
        }
        {!showLoginButton && isAdmin &&
          <div>
            <hr className="my-3" />
            <SidebarItem icon={<User        size={20} />} text="Your Profile"         link="/profile" />
            <SidebarItem icon={<BookText    size={20} />} text="My Bookings"         link="/mybookings" />
            <hr className="my-3" />
            <h1 className='text-white text-center font-bold'>Admin's Actions</h1>
            <SidebarItem icon={<BusFront        size={20} />} text="Buses"         link="/buses" />
            <SidebarItem icon={<UsersIcon        size={20} />} text="Users"         link="/users" />
            <hr className="my-3" />
            <SidebarItem icon={<LogOut      size={20} />} text="Logout"               link="/logout"/>
          </div>
        }
          
        
      </Sidebar>


      <Routes>
          <Route path="/"                   element={<Home    />} />
          
          <Route path="/getBusDetails/:id"  element={<BusView user={user}    />} />
          <Route path="/mybookings"        element={user ? <Bookings                  />    : <Login />}/>
          <Route path="/bookings/:id"        element={user ? <SpecificBookings                  />    : <Login />}/>
          <Route path="/logout"             element={user ? <Logout       user={user} />    : <Login />}/>
          <Route path="/profile"            element={user ? <Profile      user={user} />    : <Login />}/>
          <Route path="/buses"            element={user && isAdmin ? <Buses      user={user} />    : <Login />}/>
          <Route path="/users"            element={user && isAdmin ? <Users      user={user} />    : <Login />}/>
          <Route path="/addBus"            element={user && isAdmin ? <AddBus      user={user} />    : <Login />}/>
          <Route path="/modifyBus/:id"            element={user && isAdmin ? <ModifyBus      user={user} />    : <Login />}/>
          <Route path="/login"              element={<Login />}               />
          <Route path="/register"           element={<Register />}            />
      </Routes>
    </div>
  )
}

export default App