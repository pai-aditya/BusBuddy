import Spinner from '../components/Spinner';
import Title from '../components/Title';
import InfoCard from '../components/InfoCard';
import { useState,useEffect,useCallback } from 'react';
import { SERVER_URL } from '../components/Constants';
import { useParams,useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import PopupModal from '../components/PopupModal';
const BusView = ({user}) => {
    const {id} = useParams();
    const [loading,setLoading]=useState(false);
    const [bus,setBus] = useState([]);
    const[busName,setBusName] = useState('');
    const [seatsBooked,setSeatsBooked]=useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const navigateTo = useNavigate();
    const [showErrorPopup,setShowErrorPopup]=useState(false);
    const [ratio,setRatio]=useState();
    const isSeatBooked = (bookedSeatsArray, index) => {
        console.log("entering",bookedSeatsArray);
        console.log("return valuse for index="+index+" is "+ bookedSeatsArray.includes(index));
        return bookedSeatsArray.includes(index);
    };
    const determineColor = () => {
        // Your condition to determine the color based on the index or any other criteria
        if (ratio >=0.9) {
          return 'bg-red-700'; // Replace this with your condition for the color
        } else if(ratio>=0.6 & ratio<=0.9) {
          return 'bg-yellow-600'; // Replace this with an alternate color or condition
        }else{
            return 'bg-green-500';
        }
      };


    const handleSeatSelection = (index) => {
        
        console.log("index reacjed",index);
        setSelectedSeats(prevSeats => {
            const updatedSeats = [...prevSeats];
            const seatIndex = updatedSeats.indexOf(index);
            if (seatIndex !== -1) {
                updatedSeats.splice(seatIndex, 1);
            } else {
                updatedSeats.push(index);
            }
            console.log("updated seats:", updatedSeats); // Log the updated seats
            return updatedSeats;
        });
      };
    const isSeatSelected = (index) => selectedSeats.includes(index);


    const handleSubmit = async (e) => {
        setLoading(true);
        if(!user){
          navigateTo("/login")
          return;
        }
        e.preventDefault();
        const cost = selectedSeats.length * bus.fare;
        try {
            const response1 = await fetch(`${SERVER_URL}/booking/book`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, busName,selectedSeats,cost }),
              credentials: 'include',
            });
      
            const data1 = await response1.json();
      
            console.log('response:', data1);

            const response2 = await fetch(`${SERVER_URL}/bus/addOccupancy`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id,selectedSeats }),
                credentials: 'include',
            });
      
            const data2 = await response2.json();
      
            console.log('response:', data2);
            if (data1.success && data2.success) {
                
                setLoading(false);
                navigateTo("/mybookings");
              
            } else {
                setLoading(false);
                setShowErrorPopup(true);
                console.error('post failed:', data1.message);
            }
          } catch (error) {
            setLoading(false);
            setShowErrorPopup(true);
            console.error('post failed:', error.message);
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
            setBus(busData.bus);
            setBusName(busData.bus.name);
            setSeatsBooked(busData.bus.seatsBooked)
            setRatio(busData.bus.seatsBooked.length/busData.bus.total_seats);
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
        <div className="flex justify-between p-4 w-full bg-custom-primary-purple text-white">
          {/* Left Side - Bus Details */}
          <div className="w-1/2 p-4">
          <BackButton />
    <h2 className="text-3xl font-bold mb-6 text-center text-white">Bus Details</h2>
    {loading ? (
        <Spinner />
    ) : (
        <div className=" p-6 rounded-lg border-4 shadow-lg">
            <Title title={`${bus.name}`} />
            <div className="mt-12 ">
                <div className="grid grid-cols-2 gap-4">
                    <InfoCard label="Bus Number" value={bus.id} />
                    <InfoCard label="Fare" value={`$${bus.fare} `} />
                    <InfoCard label="From" value={bus.from} />
                    <InfoCard label="To" value={bus.to} />
                    <InfoCard label="Departure Time" value={bus.time_from} />
                    <InfoCard label="Arrival Time" value={bus.time_to} />
                    <InfoCard label="Distance" value={bus.distance} />
                    <InfoCard label="Duration" value={bus.duration} />
                    <InfoCard label="Days" value={bus.days} />
                </div>
            </div>
        </div>
    )}
</div>


    
          {/* Right Side - Matrix View */}
            <div className="w-1/3 p-12 ml-12 mr-12">
                <h2 className="text-xl font-bold mb-4">Seats View</h2>
                <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: bus.total_seats+1 }, (_, index) => (
                        index!=0 &&
                        <button
                        key={index}
                        className={`${isSeatSelected(index) ? 'bg-blue-400 ' :  determineColor()} p-2 m-1 rounded text-center cursor-pointer border border-slate-600 rounded-md text-white text-center flex items-center justify-center disabled:bg-gray-500 disabled:text-gray-300`}
                        disabled={isSeatBooked(seatsBooked,index)}
                        
                        onClick={() => handleSeatSelection(index)}
                        >
                        {index}
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleSubmit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block w-full disabled:bg-gray-500 disabled:text-gray-300"
                    disabled={selectedSeats.length==0}>
                    Book Seats
                </button>

            </div>
            {showErrorPopup && (
                <PopupModal
                title="ERROR!" 
                contentMessage="Something went wrong!" 
                buttonMessage="OK"
                onClose={() => setShowErrorPopup(false)} />
            )}
        </div>
      );
}

export default BusView;