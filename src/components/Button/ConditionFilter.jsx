import './ConditionFilter.css'
import React from 'react';

const ConditionFilter = ({ selectedCondition, onConditionChange }) => {
    const conditions = [
        'None','Normal', 'Normal-NVI', 'Remelting', 'Scraped', 'Low ISA Shear', 'Low COSA Shear', 'Metal Burr', 'Au Delamination'
    ];

    const handleConditionChange = (event) => {
        onConditionChange(event.target.value);
        console.log(event.target.value)
    };

    return (
        <div className='container-con-filter'>
            <div className='header-con-filter'>
                <p>Condition</p>
            </div>
            <select className='ml-con-filter' value={selectedCondition} onChange={handleConditionChange}>
                {conditions.map((condition, index) => (
                    <option key={index} value={condition}>{condition}</option>
                ))}
            </select>
        </div>
    );
};

export default ConditionFilter;
