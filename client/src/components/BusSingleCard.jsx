import { Link} from 'react-router-dom';
import InfoCard from './InfoCard';
const BusSingleCard = ({ bus }) => {

  const colors = ['bg-blue-800', 'bg-purple-800', 'bg-gray-800', 'bg-green-500', 'bg-yellow-800', 'bg-pink-800','bg-red-800','bg-indigo-800','bg-orange-800','bg-teal-800','bg-cyan-800','bg-amber-800','bg-cyan-600','bg-lime-500','bg-violet-800','bg-fuchsia-700','bg-rose-700'
  ];
  const id = bus.id;    
  const getColor = () => {
    // return colors[Math.floor(Math.random() * colors.length)];
    const ratio = (bus.seatsBooked.length)/(bus.total_seats);
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



  return (
    <div className={`rounded overflow-hidden shadow-lg relative ${getColor()} transition ease-in-out duration-200 hover:scale-105 hover:brightness-110 ml-4 mt-4 mb-4 relative`}>
      <Link to={`/getBusDetails/${bus.id}`}>
        <div className="flex  flex-col h-full mt-2 mb-8 mr-4 ml-4 w-full">
          <h2 className="text-2xl font-bold mb-2 text-white text-3xl mb-4 text-center">{bus.id}</h2>
          <p className="text-base text-white text-xl text-center font-semibold">{bus.name}</p>

          <div className="mt-4 grid grid-cols-2 gap-8">
            <InfoCard label="From" value={bus.from} />
            <InfoCard label="To" value={bus.to} />
            
          </div>
        </div>
      </Link>
    </div>
  );
  
};

export default BusSingleCard;
