import { Link } from 'react-router-dom';
import './TakeCOSA.css'
import axios from 'axios';
import address from '../Address';
import { useNavigate } from 'react-router-dom';

const ActionButton = ({ rowData }) => {

    const navigate = useNavigate();

    const handleTakeReturn = (InvCOSARefID) => {
        // You should use the actual endpoint for the API call, not just the URL
        axios.get(`${address}/api/history/${InvCOSARefID}`);
        navigate(`/takereturn/${rowData.InvCOSARefID}`); // Corrected URL
    };
    
    const handleClick = () => {
        if (rowData && rowData.InvCOSARefID) {
            handleTakeReturn(rowData.InvCOSARefID); // Corrected function name
        } else {
            console.error('Invalid rowData or InvCOSARefID');
        }
    };
    
    return (
        <div className="take-btn" onClick={handleClick}>
            <Link>Take<br/>Return</Link> 
        </div>
    );
};

export default ActionButton;
