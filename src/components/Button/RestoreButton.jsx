import './RestoreButton.css';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import ReactDOMServer from 'react-dom/server';
import RestorePopup from '../popup/RestorePopup';
import address from '../Address';

const RestoreButton = ({ rowData, fetchData }) => {

    const userId = localStorage.getItem('userId');

    const handleRestore = async (IDMLotID) => {

        const response = await axios.get(`${address}/api/popup-delete/${IDMLotID}`)
        const cosa_code = response.data.cosa_code
        const output_ring = response.data.output_ring
        const supplier_lot = response.data.supplier_lot
        const good_inspection = response.data.good_inspection
        const reject_top = response.data.reject_top
        const reject_front = response.data.reject_front
        const reject_back = response.data.reject_back
        const reject_bottom = response.data.reject_bottom
        const reject_multi = response.data.reject_multi
        const reject_liv = response.data.reject_liv

        // console.log(IDMLotID,userId)

        const deletePopupHtml = ReactDOMServer.renderToString(
            <RestorePopup
                IDMLotName={cosa_code}
                Output_Ring={output_ring}
                Supplier_Lot={supplier_lot}
                GoodInsp={good_inspection}
                Reject_Top={reject_top}
                Reject_Front={reject_front}
                Reject_Back={reject_back}
                Reject_Bottom={reject_bottom}
                Reject_Multi={reject_multi}
                Reject_LIV={reject_liv}
            />
        );

        Swal.fire({
            title: 'Are you sure?',
            html: deletePopupHtml,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4b5bec',
            cancelButtonColor: '#7d8da1',
            confirmButtonText: 'Yes',
            customClass: 'custom-swal-width',
        }).then((result) => {
            if (result.isConfirmed) {
                // If user confirms, proceed with deletion
                axios.post(`${address}/api/status-restore/${IDMLotID}?userId=${userId}`)
                    .then(res => {
                        fetchData();
                    })
                    .catch(err => console.log(err));
            }
        });
    };
    
    return (
        <a href="#" className='bg-btn-restore'>
            <div className="take-btn-restore" onClick={() => handleRestore(rowData.IDMLotID)}>
                <span className="material-symbols-outlined">settings_backup_restore</span>
            </div>
        </a>
    );
};

export default RestoreButton;