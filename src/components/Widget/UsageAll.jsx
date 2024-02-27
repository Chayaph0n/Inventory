import './Widget.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios';

function UsageAll( {usageAll} ) {
    
    const formatNumberWithCommas = (number) => {
        if (number === null) return ''; // Return an empty string if the number is null
        return number.toLocaleString();
    };

    return (
        <div className="usage">
            <div className="flex mt-widget">
                <span className="material-symbols-outlined">swipe_right</span>
                <div className="ml">
                    <h3>USAGE ALL</h3>
                </div>
            </div>
            <div className="middle">
                <h1>{formatNumberWithCommas(usageAll)}</h1>
            </div>
        </div>
    );
}

export default UsageAll;
