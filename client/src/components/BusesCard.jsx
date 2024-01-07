import BusSingleCard from './BusSingleCard';

const BusesCard = ({ buses }) => {
  return (
    <div className='grid xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4'>
      {buses.map((item) => (
        <BusSingleCard key={item.id} bus={item} />
      ))}
    </div>
  );
};

export default BusesCard;

