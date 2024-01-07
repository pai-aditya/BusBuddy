import Spinner from '../components/Spinner';
import TitleCard from '../components/TitleCard';
import { useState,useEffect,useCallback } from 'react'
import BusesCard from '../components/BusesCard';
import { SERVER_URL } from '../components/Constants';
import { MdFamilyRestroom } from 'react-icons/md';

const Home = () => {
  const [loading,setLoading]=useState(false);
  const [buses,setBuses] = useState([]);
  const [fromSearch,setFromSearch]=useState('');
  const [toSearch,setToSearch]=useState('');

  const handleSearchFrom = (e) =>{
    console.log("entring with",e.target.value);
    setFromSearch(e.target.value);
  }
  const handleSearchTo = (e) =>{
    console.log("entring to search",e.target.value);
    setToSearch(e.target.value);

  }
  const FetchBusesData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/getBuses`, options);
        const data = await response.json();
        console.log("busssssssssdata"+JSON.stringify(data.buses[0].id));
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

  
  const FetchBusesDataFrom = useCallback(async (searchQuery) => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        console.log("fromSearch",searchQuery);
        const response = await fetch(`${SERVER_URL}/getBusesByLocation?from=${searchQuery}`, options);
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

  
  const FetchBusesDataTo = useCallback(async (searchQuery) => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      console.log("toSearch",searchQuery);
        const response = await fetch(`${SERVER_URL}/getBusesByLocation?to=${searchQuery}`, options);
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

  
  const FetchBusesDataFromTo = useCallback(async (searchQueryFrom,searchQueryTo) => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
      console.log("fromSearch",searchQueryFrom);
      console.log("toSearch",searchQueryTo);
        const response = await fetch(`${SERVER_URL}/getBusesByLocation?from=${searchQueryFrom}&to=${searchQueryTo}`, options);
        const data = await response.json();
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

useEffect(() => {
    setLoading(true);
    if(!fromSearch && !toSearch){
      const fetchData = async () => {
        try {
          const busesData = await FetchBusesData();
          setBuses(busesData.buses);
          console.log("this is the number of buses: "+busesData.buses.length)
          setLoading(false);
        }
        catch (error) {
          console.log(error);
          setLoading(false);

          return [];
        }
      };
      fetchData();
    }else if(fromSearch && !toSearch){
      const fetchDataWithFrom = async () => {
        try {
          const busesData = await FetchBusesDataFrom(fromSearch);
          setBuses(busesData.buses);
          setLoading(false);
        }
        catch (error) {
          console.log(error);
          setLoading(false);

          return [];
        }
      };
      fetchDataWithFrom();
    }else if(!fromSearch && toSearch){
      const fetchDataWithTo = async () => {
        try {
          const busesData = await FetchBusesDataTo(toSearch);
          setBuses(busesData.buses);
          setLoading(false);
        }
        catch (error) {
          console.log(error);
          setLoading(false);

          return [];
        }
      };
      fetchDataWithTo();
    }else {
      console.log("entering this if condition with "+fromSearch+" and "+toSearch);
      const fetchDataWithFromTo = async () => {
        try {
          const busesData = await FetchBusesDataFromTo(fromSearch,toSearch);
          setBuses(busesData.buses);
          setLoading(false);
        }
        catch (error) {
          console.log(error);
          setLoading(false);

          return [];
        }
      };
      fetchDataWithFromTo();
    }
  },[FetchBusesData,FetchBusesDataFrom,FetchBusesDataFromTo,FetchBusesDataTo,fromSearch,toSearch]);



  return (
    <div className='p-4 w-full bg-custom-primary-purple'>
  <div className='flex  pt-4 pb-8'>      
    <TitleCard />
    
      <div className='ml-12'>
                <input
                    type='text'
                    placeholder='From'
                    className='border border-gray-300 px-4 py-2 rounded-lg mr-4 text-white bg-custom-primary-purple'
                    value={fromSearch}
                    onChange={handleSearchFrom}
                />
        </div>
        <div className='ml-6'>
                <input
                    type='text'
                    placeholder='To'
                    className='border border-gray-300 px-4 py-2 rounded-lg mr-4 text-white bg-custom-primary-purple'
                    value={toSearch}
                    onChange={handleSearchTo}
                />
        </div>
  </div>
  {loading ? (
    <Spinner />
  ) : (
    <BusesCard buses={buses} />
  )}

</div>

)
}

export default Home