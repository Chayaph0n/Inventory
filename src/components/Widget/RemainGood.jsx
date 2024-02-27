import './Widget.css'

function RemainGood( {remainGood} ) {
    
    const formatNumberWithCommas = (number) => {
        if (number === null) return ''; // Return an empty string if the number is null
        return number.toLocaleString();
    };

    return (
        <div className="good">
            <div className="flex mt-widget">
                <span className="material-symbols-outlined">check</span>
                <div className="ml">
                    <h3>REMAIN GOOD</h3>
                </div>
            </div>
            <div className="middle">
                <h1>{formatNumberWithCommas(remainGood)}</h1>
            </div>
        </div>
    );
}

export default RemainGood;
