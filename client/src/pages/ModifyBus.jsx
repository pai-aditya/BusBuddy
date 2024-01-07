import { useState,useEffect,useCallback } from 'react';
import BackButton from '../components/BackButton';
import Spinner from '../components/Spinner';
import {useNavigate, useParams } from 'react-router-dom';
import { SERVER_URL } from '../components/Constants';
import TitleCard from '../components/TitleCard';


const ModifyBus = (userDetails) => {
  const check = true;
  const {id} = useParams();
  const [name,setName] = useState('');
  const [total_seats,setTotal_seats] = useState('');
  const [from,setFrom] = useState('');
  const [to,setTo] = useState('');
  const [time_from,setTime_from] = useState('');
  const [time_to,setTime_to] = useState('');
  const [fare,setFare] = useState();
  const [distance,setDistance] = useState('');
  const [days,setDays] = useState('');
  const [duration,setDuration] = useState('');
  const [seatsBooked,setSeatsBooked]=useState([]);
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();


  const handleModifyBus = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
        const response = await fetch(`${SERVER_URL}/addBus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name,id,time_from,time_to,to,from,distance,duration,total_seats,days,fare,seatsBooked,check }),
          credentials: 'include',
        });
  
        const data = await response.json();
  
        console.log('response:', data);
        if (data.success) {
          setLoading(false);
          navigateTo("/buses");
          
        } else {
          setLoading(false);
          console.error('  failed:', data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error('  failed:', error.message);
      }
  };


  const FetchBusData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/getBus/${id}`, options);
        const data = await response.json();
        console.log("singlebusssssssssdata"+JSON.stringify(data.bus));
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
        const busData = await FetchBusData();
        setName(busData.bus.name);
        setTotal_seats(busData.bus.total_seats);
        setFrom(busData.bus.from);
        setTo(busData.bus.to);
        setTime_from(busData.bus.time_from);
        setTime_to(busData.bus.time_to);
        setFare(busData.bus.fare)
        setDays(busData.bus.days);
        setDistance(busData.bus.distance);
        setDuration(busData.bus.duration);
        setSeatsBooked(busData.bus.seatsBooked);
        setLoading(false);
      }
      catch (error) {
        console.log(error);
        setLoading(false);

        return [];
      }
    };
    fetchData();
  },[FetchBusData]);



  return (
    <div className='p-4  w-full bg-custom-primary-purple text-white'>
      <BackButton />
      {loading ? (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Spinner />
        </div>
       ) : (
        <div className='my-4 flex flex-col border-2 border-sky-400 rounded-xl w-1/2 bg-gray-800 p-4 mx-auto'>
        <div className='flex items-center justify-center my-4 mr-4 '>
          <TitleCard />
        </div>
        <h1 className='text-3xl my-4 text-center font-bold text-gray-200'>Modify this Bus!</h1>
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-400'>Bus was created by</label>
          <p>{userDetails.user.user.displayName}</p>
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Bus Number</label>
          <p>{id}</p>
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Bus Name</label>
          <textarea
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>From</label>
          <textarea
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>To</label>
          <textarea
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Total Seats</label>
          <textarea
            value={total_seats}
            onChange={(e) => setTotal_seats(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Duration</label>
          <textarea
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Distance</label>
          <textarea
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Departure Time</label>
          <textarea
            value={time_from}
            onChange={(e) => setTime_from(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Arrival Time</label>
          <textarea
            value={time_to}
            onChange={(e) => setTime_to(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Fare</label>
          <textarea
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <div className='my-2'>
          <label className='text-xl mr-4 text-gray-400 w-full'>Days</label>
          <textarea
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className='border-2 border-gray-400 px-4 py-2 w-full bg-gray-700'
            rows={1}
          />
        </div>
        <button className='p-2 font-bold bg-blue-500 hover:bg-blue-900 m-8 disabled:bg-gray-500 disabled:text-gray-300 ' 
          onClick={handleModifyBus} 
          disabled={!id || !name}>
          Modify Bus
        </button>
      </div>
    
      )}
      </div>
      
  );
};

export default ModifyBus;
