import './ReturnCondition.css'
import React from 'react';

const ReturnCondition = ({ selectedCondition, onConditionChange }) => {
    const conditions = [
        'Normal', 'Normal-NVI', 'Remelting', 'Scraped', 'Low ISA Shear', 'Low COSA Shear', 'Metal Burr', 'Au Delamination'
    ];

    const handleConditionChange = (event) => {
        onConditionChange(event.target.value);
        console.log(event.target.value)
    };

    return (
        <div className='container-con'>
            <div className='header-con'>
                <p>Condition</p>
            </div>
            <select className='ml-con' value={selectedCondition} onChange={handleConditionChange}>
                {conditions.map((condition, index) => (
                    <option key={index} value={condition}>{condition}</option>
                ))}
            </select>
        </div>
    );
};

export default ReturnCondition;
