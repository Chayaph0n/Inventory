import React from 'react';
import './Widget.css'

function Inspection( {finishInspection} ) {
    
    const formatNumberWithCommas = (number) => {
        if (number === null) return ''; // Return an empty string if the number is null
        return number.toLocaleString();
    };

    return (
        <div className="finish">
            <div className="flex mt-widget">
                <span className="material-symbols-outlined">analytics</span>
                <div className="ml">
                    <h3>FINISH INSPECTION</h3>
                </div>
            </div>
            <div className="middle">
                <h1>{formatNumberWithCommas(finishInspection)}</h1>
            </div>
        </div>
    );
}

export default Inspection;
