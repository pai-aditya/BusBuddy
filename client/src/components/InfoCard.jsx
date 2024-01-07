
const InfoCard = ({label,value}) => {
    return (
        <div className="flex flex-col text-white ">
            {value && 
                <div>
                    <p className="text-xl font-bold mb-1">{label}</p>
                    <p className="text-lg">{value}</p>
                </div>
            }
        </div>
    );
}

export default InfoCard