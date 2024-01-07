import TitleCard from "../components/TitleCard";

const Profile = ( userDetails) => {
  const { displayName, bookings } = userDetails.user.user;

  return (
    <div className="w-full bg-custom-primary-purple text-white p-8">
    <div className='flex items-center justify-beteween my-4 mr-4 '>
        <TitleCard />
      </div>
      <h1 className="text-4xl font-bold mb-8 mt-8 text-center">Welcome, {displayName}!</h1>
      <div className="mb-6 text-center">
        <p className="text-lg my-2">
          You have made <span className="text-yellow-300">{bookings.length}</span> booking(s)
        </p>
      </div>
    </div>
  );
};

export default Profile;
