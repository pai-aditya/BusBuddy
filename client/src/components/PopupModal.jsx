import { useState,useEffect } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { SERVER_URL } from './Constants';
import { useNavigate } from 'react-router-dom';
const PopupModal = ({ title, contentMessage, buttonMessage, id, onClose,seatsToRemove,busID }) => {

    const navigateTo = useNavigate();
    const [loading,setLoading] = useState(false);

    const handleDeleteBooking = async () => {
        setLoading(true);

        try {
            const response1 = await fetch(`${SERVER_URL}/booking/delete/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
        });
        const response2 = await fetch(`${SERVER_URL}/bus/removeOccupancy/${busID}`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ seatsToRemove }),
            credentials: 'include',
    });

        const data1 = await response1.json();
        const data2 = await response2.json();

        console.log('Deletion response:', data2);
        if (data1.success && data2.success) {
            setLoading(false);
            onClose();
            navigateTo(0);
            
        } else {
            setLoading(false);
            console.error(' failed:', data1.message);
        }
        } catch (error) {
        setLoading(false);
        console.error(' failed:', error.message);
        }
    };

    
    const handleDeleteBus = async () => {
        setLoading(true);

        try {
            const response1 = await fetch(`${SERVER_URL}/deleteBus/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
        });
            const response2 = await fetch(`${SERVER_URL}/deleteBookings/${id}`, {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json',
                },
                credentials: 'include',
        });
        

        const data1 = await response1.json();
        const data2 = await response2.json();

        console.log('Deletion response:', data1);
        if (data1.success && data2.success) {
            setLoading(false);
            onClose();
            navigateTo(0);
            
        } else {
            setLoading(false);
            console.error(' failed:', data1.message);
        }
        } catch (error) {
        setLoading(false);
        console.error(' failed:', error.message);
        }
    };

  

    const handleButton = async (e) => {
        e.preventDefault();
        if(title=="Delete Booking"){
            await handleDeleteBooking();
        }else if(title=="Delete Bus"){
            await handleDeleteBus();
        }else if(title=="ERROR!"){
            console.log("entering erorr stage");
            onClose();
        }
    }
  
    return (
        <div className='fixed bg-black bg-opacity-50 inset-0 z-50 flex items-center justify-center'>
        <div onClick={onClose} className='absolute inset-0 bg-black opacity-25'></div>
        <div className='relative bg-gray-900 rounded-lg shadow-lg max-w-lg w-full p-6 text-center'>
            <button onClick={onClose} className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 focus:outline-none'>
            <AiOutlineClose className='text-xl' />
            </button>
            <h2 className='text-2xl font-semibold mb-4 text-white'>{title}</h2>
            <p className='text-gray-400 mb-6'>{contentMessage}</p>
            <div className='flex justify-center'>
            <button
                onClick={handleButton}
                className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded focus:outline-none focus:shadow-outline'
            >
                {buttonMessage}
            </button>
            </div>
        </div>
        </div>
    );
};

export default PopupModal;
