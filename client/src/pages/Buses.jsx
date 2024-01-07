
import { Link } from 'react-router-dom';
import { MdOutlineDelete } from 'react-icons/md';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';
import TitleCard from '../components/TitleCard';
import PopupModal from '../components/PopupModal';
import { BsInfoCircle } from 'react-icons/bs';
import { AiOutlineEdit } from 'react-icons/ai';
import { MdOutlineAddBox } from 'react-icons/md';

const Buses = () => {
  const [busesList,setBusesList] = useState([]);
  const [loading,setLoading] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [busID,setBusID] = useState([]);
  
  const getColor = (ratio) => {
    if(ratio==1){
      return 'bg-gray-600';
    }else if (ratio >=0.9) {
      return 'bg-red-700'; 
    } else if(ratio>=0.6 & ratio<=0.9) {
      return 'bg-yellow-600'; 
    }else{
        return 'bg-green-700';
    }
  };
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
        console.log("data",data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

  const handleDeleteClick = (bus) => {
    setShowDeletePopup(true);
    setBusID(bus.id);
    
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const busesListData = await FetchBusesData();
        setBusesList(busesListData.buses);
        setLoading(false);
      }
      catch (error) {
        console.log(error);
        setLoading(false);

        return [];
      }
    };
    fetchData();
  },[FetchBusesData]);

  return (
    <div className='p-4 w-full bg-custom-primary-purple text-white'>
      <div className='flex items-center justify-beteween my-4 mr-4 '>
        <TitleCard />
        <Link to='/addBus' className='ml-auto' >
            <MdOutlineAddBox className='text-custom-gold text-5xl' />
        </Link>
      </div>
    { loading ? (
      <Spinner />
    ) : (
      <table className='w-full border-separate border-spacing-2'>
        <thead>
          <tr>
            <th className='border border-slate-600 rounded-md'>No.</th>
            <th className='border border-slate-600 rounded-md'>Number</th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Name
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              From
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              To
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Duration
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Total Seats
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Seats Booked
            </th>
            <th className='border border-slate-600 rounded-md'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {busesList?.map((bus, index) => (
            <tr key={bus._id} className='h-8'>
              <td className='border border-slate-700 rounded-md text-center'>
                {index + 1}
              </td>
              <td className='border border-slate-700 rounded-md text-center bg-custom-gold font-bold'>
                {bus.id}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-custom-purple'>
                {bus.name}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {bus.from}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {bus.to}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {bus.duration}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {bus.total_seats}
              </td>
              <td className={`border border-slate-700 rounded-md text-center max-md:hidden ${getColor(bus.seatsBooked.length/ bus.total_seats)}`}>
                {((bus.seatsBooked.length/ bus.total_seats) * 100).toFixed(0)}%
              </td>
              <td className='border border-slate-700 rounded-md text-center '>
                <div className='flex justify-center gap-x-4'>
                  <Link to={`/getBusDetails/${bus.id}`}>
                    <BsInfoCircle className='text-2xl text-green-700' />
                  </Link>
                  <Link to={`/modifyBus/${bus.id}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-500' />
                  </Link>
                  <button onClick={() => handleDeleteClick(bus)} type="button" className="focus:outline-none">
                    <MdOutlineDelete className='text-2xl text-red-500' />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <div>
      
      {showDeletePopup && (
        <PopupModal
          title="Delete Bus" 
          contentMessage="Are you sure you want to delete this Bus?" 
          buttonMessage="Delete"
          id={busID}
          onClose={() => setShowDeletePopup(false)} />
      )}
      </div>
    </div>
  );
};

export default Buses;
