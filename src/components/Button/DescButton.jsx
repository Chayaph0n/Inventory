import './DescButton.css'
import React from 'react';

const DescButton = ({ selectedDesc, onDescChange }) => {
    const descs = [
        'PRO', 'Eval', 'Setup and Alignment', 'Shipping', 'Other'
    ];

    const handleDescChange = (event) => {
        onDescChange(event.target.value);
        console.log(event.target.value)
    };

    return (
        <div className='container-desc'>
            <div className='header-desc'>
                <p>Purpose</p>
            </div>
            <select className='ml-desc' value={selectedDesc} onChange={handleDescChange}>
                {descs.map((desc, index) => (
                    <option key={index} value={desc}>{desc}</option>
                ))}
            </select>
        </div>
    );
};

export default DescButton;