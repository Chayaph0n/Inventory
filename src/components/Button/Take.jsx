import './Take.css';
import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import address from '../Address';

const TakeButton = ({ good_remain, top_remain, front_remain, back_remain, bottom_remain, multi_remain, liv_remain, 
                    good, top, front, back, bottom, multi, liv, invCOSARefID, fetchData, clearInput, condition, desc, comment  }) => {

    const userId = localStorage.getItem('userId');

    const handleSubmit = async () => {

        if (
            good < 0 ||
            top < 0 ||
            front < 0 ||
            back < 0 ||
            bottom < 0 ||
            multi < 0 ||
            liv < 0
        ) {
            // Show error alert for negative quantities
            await Swal.fire({
                title: 'Invalid Quantity',
                text: 'Please enter a quantity greater than or equal to 0',
                icon: 'error',
                confirmButtonColor: '#fe3445',
            });
            return;
        }

        // Check if any condition is true
        const shouldTake = 
            good_remain - good >= 0 &&
            top_remain - top >= 0 &&
            front_remain - front >= 0 &&
            back_remain - back >= 0 &&
            bottom_remain - bottom >= 0 &&
            multi_remain - multi >= 0 &&
            liv_remain - liv >= 0;

        if (!shouldTake) {
            // Alert user that they can't take due to insufficient remaining quantities
            await Swal.fire({
                title: 'Unable to Take',
                text: 'Insufficient remaining quantities to take.',
                icon: 'error',
                confirmButtonColor: '#fe3445',
            });
            return;
        }

        // Show confirmation alert
        const confirmation = await Swal.fire({
            title: 'Confirm Action',
            text: 'Are you sure you want to take?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'rgb(0, 152, 38)',
            cancelButtonColor: '#fe3445',
            confirmButtonText: 'Take',
            cancelButtonText: 'Cancel',
        });

        if (confirmation.isConfirmed) {
            try {
                const baseApiUrl = `${address}/api/take/${invCOSARefID}`;
                const queryParams = [];

                if (good !== 0) queryParams.push(`good=${good}`);
                if (top !== 0) queryParams.push(`top=${top}`);
                if (front !== 0) queryParams.push(`front=${front}`);
                if (back !== 0) queryParams.push(`back=${back}`);
                if (bottom !== 0) queryParams.push(`bottom=${bottom}`);
                if (multi !== 0) queryParams.push(`multi=${multi}`);
                if (liv !== 0) queryParams.push(`liv=${liv}`);
                if (condition === 'Normal') {
                    if (desc) {
                        if (desc === 'PRO') queryParams.push(`description=${desc}`);
                        if (desc === 'Eval') queryParams.push(`description=${desc}`);
                        if (desc === 'Setup and Alignment') queryParams.push(`description=${desc}`);
                        if (desc === 'Shipping') queryParams.push(`description=${desc}`);
                        if (desc === 'Other') queryParams.push(`description=${desc}`);
                    }
                    queryParams.push(`condition=${condition}`);
                    queryParams.push(`comment=${comment}`);
                    queryParams.push(`userId=${userId}`);
                    const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
                    const fullUrl = `${baseApiUrl}${queryString}`;
                    console.log(fullUrl);

                    // Make the API request using Axios
                    const response = await axios.post(fullUrl);

                    fetchData();
                    clearInput();

                    // Handle the response if needed
                    console.log('API Response:', response.data);
                } else {
                    await Swal.fire({
                        title: 'Unable to Take',
                        text: 'Unable to take a piece of work with conditions.',
                        icon: 'error',
                        confirmButtonColor: '#fe3445',
                    });
                    return;
                }

                // window.location = `/takereturn/${invCOSARefID}`
            } catch (error) {
                // Handle errors
                console.error('API Error:', error);
            }
        }
    };

    return (
        <a href="#" onClick={handleSubmit}>
            <div className="takecosa-btn">
                <p>Take</p>
            </div>
        </a>
    );
};

export default TakeButton;
