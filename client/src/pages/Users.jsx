
import { Link } from 'react-router-dom';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';
import TitleCard from '../components/TitleCard';

const Users = () => {
  const [userList,setUserList] = useState([]);
  const [loading,setLoading] = useState(false);

  const FetchUserData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/getUsers`, options);
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);


useEffect(() => {
  setLoading(true);
  const fetchData = async () => {
    try {
      const userListData = await FetchUserData();
      setUserList(userListData.users);
      setLoading(false);
    }
    catch (error) {
      console.log(error);
      setLoading(false);

      return [];
    }
  };
  fetchData();
},[FetchUserData])


  return (
    <div className='p-4 w-full bg-custom-primary-purple text-white'>
    <div className='flex items-center justify-beteween my-4 mr-4 '>
        <TitleCard />
      </div>
    { loading ? (
      <Spinner />
    ) : (
      <table className='w-full border-separate border-spacing-2'>
        <thead>
          <tr>
            <th className='border border-slate-600 rounded-md'>No</th>
            <th className='border border-slate-600 rounded-md'>Name</th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Username/Email
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Bookings
            </th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user, index) => (
            <tr key={user._id} className='h-8'>
              <td className='border border-slate-700 rounded-md text-center'>
                {index + 1}
              </td>
              <td className='border border-slate-700 rounded-md text-center bg-custom-purple font-bold '>
                {user.displayName}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-custom-gold font-bold'>
                {user.username}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden'>
              <Link to={`/bookings/${user._id}`} 
                  className='my-1 px-4 py-1 font-bold bg-blue-800 hover:bg-blue-900 inline-block rounded-md '>
                  View their Bookings
                </Link>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <div>
      </div>
    </div>
  );
};

export default Users;
