import './Widget.css'

function RemainAll( {remainAll} ) {

    const formatNumberWithCommas = (number) => {
        if (number === null) return ''; // Return an empty string if the number is null
        return number.toLocaleString();
    };

    return (
        <div className="all">
            <div className="flex mt-widget">
                <span className="material-symbols-outlined">directory_sync</span>
                <div className="ml">
                    <h3>REMAIN ALL</h3>
                </div>
            </div>
            <div className="middle">
                <h1>{formatNumberWithCommas(remainAll)}</h1>
            </div>
        </div>
    );
}

export default RemainAll;
