import axios from 'axios';
import React from 'react';
import Swal from 'sweetalert2';
import './Return.css'
import address from '../Address';

const ReturnButton = ({ good_taken, top_taken, front_taken, back_taken, bottom_taken, multi_taken, liv_taken, 
                        good, top, front, back, bottom, multi, liv, invCOSARefID, fetchData, clearInput, condition, desc, comment }) => {

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
        const shouldReturn =  good_taken - good >= 0 &&
                            top_taken - top >= 0 &&
                            front_taken - front >= 0 &&
                            back_taken - back >= 0 &&
                            bottom_taken - bottom >= 0 &&
                            multi_taken - multi >= 0 &&
                            liv_taken - liv >= 0;

        if (!shouldReturn) {
        // Alert user that they can't return due to insufficient taking quantities
            await Swal.fire({
                title: 'Unable to Return',
                text: 'Insufficient taking quantities to return.',
                icon: 'error',
                confirmButtonColor: '#fe3445',
            });
            return;
        }

        // Show confirmation alert
        const confirmation = await Swal.fire({
            title: 'Confirm Action',
            text: 'Are you sure you want to return?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4b5bec',
            cancelButtonColor: '#fe3445',
            confirmButtonText: 'Return',
            cancelButtonText: 'Cancel',
        });

        if (confirmation.isConfirmed) {
            try {
                const baseApiUrl = `${address}/api/return/${invCOSARefID}`;
                const queryParams = [];

                if (good !== 0) queryParams.push(`good=${good}`);
                if (top !== 0) queryParams.push(`top=${top}`);
                if (front !== 0) queryParams.push(`front=${front}`);
                if (back !== 0) queryParams.push(`back=${back}`);
                if (bottom !== 0) queryParams.push(`bottom=${bottom}`);
                if (multi !== 0) queryParams.push(`multi=${multi}`);
                if (liv !== 0) queryParams.push(`liv=${liv}`);
                if (condition) {
                    if (condition === 'Normal') queryParams.push(`condition=${condition}`);
                    if (condition === 'Scraped') queryParams.push(`condition=${condition}`);
                    if (condition === 'Remelting') queryParams.push(`condition=${condition}`);
                    if (condition === 'Low ISA Shear') queryParams.push(`condition=${condition}`);
                    if (condition === 'Low COSA Shear') queryParams.push(`condition=${condition}`);
                    if (condition === 'Metal Burr') queryParams.push(`condition=${condition}`);
                    if (condition === 'Au Delamination') queryParams.push(`condition=${condition}`);
                    if (condition === 'Normal-NVI') queryParams.push(`condition=${condition}`);
                }
                if (desc) {
                    if (desc === 'PRO') queryParams.push(`description=${desc}`);
                    if (desc === 'Eval') queryParams.push(`description=${desc}`);
                    if (desc === 'Setup and Alignment') queryParams.push(`description=${desc}`);
                    if (desc === 'Shipping') queryParams.push(`description=${desc}`);
                    if (desc === 'Other') queryParams.push(`description=${desc}`);
                }

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
            } catch (error) {
                // Handle errors
                console.error('API Error:', error);
            }
        }
    };

    return (
        <a href="#" onClick={handleSubmit}>
            <div className="returncosa-btn">
                <p>Return</p>
            </div>
        </a>
    );
};

export default ReturnButton;