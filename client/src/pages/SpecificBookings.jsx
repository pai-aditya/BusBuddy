
import { Link, useParams } from 'react-router-dom';
import { MdOutlineDelete } from 'react-icons/md';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import Spinner from '../components/Spinner';
import PopupModal from '../components/PopupModal';
const SpecificBookings = () => {
    const {id} = useParams();
    const [bookingList,setBookingList] = useState([]);
    const [loading,setLoading] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedBookingID, setSelectedBookingID] = useState(null);

    const [selectedBookingSeats, setSelectedBookingSeats] = useState([]);
    const [busID,setBusID] = useState([]);
  
  const FetchBookingsData = useCallback(async () => {
    try{
      const options = {
        method: 'GET',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        }
      };
        const response = await fetch(`${SERVER_URL}/bookings/getBookings/${id}`, options);
        const data = await response.json();
        console.log("data",data);
        return data;
    } catch(error){
        console.log(error);
        return [];
    }
  },[]);

  const handleDeleteClick = (booking) => {
    setShowDeletePopup(true);
    setSelectedBookingID(booking._id);
    setSelectedBookingSeats(booking.bookedSeats);
    setBusID(booking.busID);
    
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const bookingListData = await FetchBookingsData();
        setBookingList(bookingListData.bookings);
        setLoading(false);
      }
      catch (error) {
        console.log(error);
        setLoading(false);

        return [];
      }
    };
    fetchData();
  },[FetchBookingsData]);

  return (
    <div className='p-4 w-full bg-custom-primary-purple text-white'>
      <div className='flex items-center justify-beteween my-4 mr-4 text-4xl font-bold'>
        Bookings
      </div>
    { loading ? (
      <Spinner />
    ) : (
      <table className='w-full border-separate border-spacing-2'>
        <thead>
          <tr>
            <th className='border border-slate-600 rounded-md'>No.</th>
            <th className='border border-slate-600 rounded-md'>Bus Number</th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Bus Name
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              No. of seats booked
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Seats numbers
            </th>
            <th className='border border-slate-600 rounded-md max-md:hidden'>
              Cost
            </th>
            <th className='border border-slate-600 rounded-md'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookingList?.map((booking, index) => (
            <tr key={booking._id} className='h-8'>
              <td className='border border-slate-700 rounded-md text-center'>
                {index + 1}
              </td>
              <td className='border border-slate-700 rounded-md text-center bg-custom-gold font-bold'>
                {booking.busID}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-custom-purple'>
                {booking.busName}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {booking.bookedSeats.length}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {booking.bookedSeats.sort((a, b) => a - b).join(",")}
              </td>
              <td className='border border-slate-700 rounded-md text-center max-md:hidden bg-blue-900'>
                {booking.cost}$
              </td>
              <td className='border border-slate-700 rounded-md text-center '>
                <div className='flex justify-center gap-x-4'>
                  {/* <Link to={`/explore/${review.movieID}`}>
                    <BsInfoCircle className='text-2xl text-green-500' />
                  </Link> */}
                  {/* <Link to={`/reviewMovie/${review.movieID}`}>
                    <AiOutlineEdit className='text-2xl text-yellow-500' />
                  </Link> */}
                  <button onClick={() => handleDeleteClick(booking)} type="button" className="focus:outline-none">
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
          title="Delete Booking" 
          contentMessage="Are you sure you want to delete this booking?" 
          buttonMessage="Delete"
          id={selectedBookingID}
          seatsToRemove={selectedBookingSeats}
          busID={busID}
          onClose={() => setShowDeletePopup(false)} />
      )}
      </div>
    </div>
  );
};

export default SpecificBookings;
