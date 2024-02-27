import './Widget.css'

function RemainReject( {remainReject} ) {
    
    const formatNumberWithCommas = (number) => {
        if (number === null) return ''; // Return an empty string if the number is null
        return number.toLocaleString();
    };

    return (
        <div className="reject">
            <div className="flex mt-widget">
                <span className="material-symbols-outlined">close</span>
                <div className="ml">
                    <h3>REMAIN REJECT</h3>
                </div>
            </div>
            <div className="middle">
                <h1>{formatNumberWithCommas(remainReject)}</h1>
            </div>
        </div>
    );
}

export default RemainReject;
