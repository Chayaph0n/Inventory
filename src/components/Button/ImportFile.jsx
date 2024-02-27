import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import './ImportFile.css';
import ReactDOMServer from 'react-dom/server';
import UpdatePopup from '../popup/UpdatePopup';
import UploadPopup from '../popup/UploadPopup';
import RestorePopup from '../popup/RestorePopup';
import address from '../Address';

const ImportFile = ({ fetchData }) => {
    const [selectedFileName, setSelectedFileName] = useState('No file chosen');
    const [uploading, setUploading] = useState(false);

    const userId = localStorage.getItem('userId');

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFileName(file ? file.name : 'No file chosen');

        // Show loading animation during file upload
        const loadingSwal = Swal.fire({
            title: '<div class="loading-spinner"></div>',
            html: 'Uploading...',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            // Read and parse the Excel file
            const reader = new FileReader();
            reader.onload = async (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });

                // Assuming you want to read the first sheet (index 0)
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];

                const sheet_record = workbook.SheetNames[1];
                const worksheet_record = workbook.Sheets[sheet_record];

                // Extract cell values from the worksheet
                const IDMLotName = worksheet['C3']?.v; // Assuming 'C3' is the cell containing IDMLotName
                const Output_Ring = worksheet['B3']?.v; // Assuming 'B3' is the cell containing Output_Ring
                const Supplier_Lot = worksheet['D3']?.v; // Assuming 'D3' is the cell containing Supplier_Lot
                const GoodInsp = worksheet['AU3']?.v;
                const Reject_Top = worksheet['AV3']?.v;
                const Reject_Front = worksheet['AW3']?.v;
                const Reject_Back = worksheet['AX3']?.v;
                const Reject_Bottom = worksheet['AY3']?.v;
                const Reject_Multi = worksheet['AZ3']?.v;
                const Reject_LIV = worksheet['BA3']?.v;
                const header = worksheet_record['AI2']?.v;
                const check_header = header.substring(0,6);


                // Display data in the SweetAlert confirmation dialog
                const updatePopupHtml = ReactDOMServer.renderToString(
                    <UpdatePopup 
                        IDMLotName={IDMLotName}
                        Output_Ring={Output_Ring}
                        Supplier_Lot={Supplier_Lot}
                        GoodInsp={GoodInsp}
                        Reject_Top={Reject_Top}
                        Reject_Front={Reject_Front}
                        Reject_Back={Reject_Back}
                        Reject_Bottom={Reject_Bottom}
                        Reject_Multi={Reject_Multi}
                        Reject_LIV={Reject_LIV}
                    />
                );

                const uploadPopupHtml = ReactDOMServer.renderToString(
                    <UploadPopup
                        IDMLotName={IDMLotName}
                        Output_Ring={Output_Ring}
                        Supplier_Lot={Supplier_Lot}
                        GoodInsp={GoodInsp}
                        Reject_Top={Reject_Top}
                        Reject_Front={Reject_Front}
                        Reject_Back={Reject_Back}
                        Reject_Bottom={Reject_Bottom}
                        Reject_Multi={Reject_Multi}
                        Reject_LIV={Reject_LIV}
                    />
                );

                // Check if the data matches the condition
                const checkDataResponse = await axios.get(`${address}/api/datafile`);
                const dataFromFile = checkDataResponse.data.data;
                const matchedData = dataFromFile.find(item => {
                    return (
                        item.IDMLotName === IDMLotName && 
                        item.Output_Ring === Output_Ring && 
                        item.Supplier_Lot === Supplier_Lot
                    );
                });

                if (check_header === 'Passed') {
                    if (matchedData) {
                        if (matchedData.StatusID === 3) {
                            // Show confirmation alert
                            const confirmResult = await Swal.fire({
                                title: 'Exist File!',
                                html: updatePopupHtml,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'Cancel',
                                customClass: 'custom-swal-width',
                            })
    
                            if (confirmResult.isConfirmed) {
                                // Show loading animation during update
                                const updatingSwal = Swal.fire({
                                    title: '<div class="loading-spinner"></div>',
                                    html: 'Updating...',
                                    allowOutsideClick: false,
                                    showConfirmButton: false,
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                });
    
                                // User confirmed, proceed with the update
                                const baseApiUrl = `${address}/update`;
    
                                const queryParams = [];
                                queryParams.push(`userId=${userId}`);
    
                                const IDMLotID = matchedData.IDMLotID;
                                queryParams.push(`IDMLotID=${IDMLotID}`);
    
                                const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
                                const fullUrl = `${baseApiUrl}${queryString}`;
    
                                await axios.post(fullUrl, formData);
    
                                setUploading(false);
                                updatingSwal.close(); // Close updating animation
    
                                Swal.fire({
                                    title: 'Update Success',
                                    text: 'The file has been successfully updated.',
                                    icon: 'success',
                                });
    
                                fetchData();
                            } else {
                                // User cancelled, show message
                                setUploading(false);
                                setSelectedFileName('No file chosen');
                                loadingSwal.close(); // Close loading animation
                            }
                        } else if (matchedData.StatusID === 1) {
                            const response = await axios.get(`${address}/api/popup-delete/${matchedData.IDMLotID}`)
                            const RestorePopupHtml = ReactDOMServer.renderToString(
                                <RestorePopup
                                    IDMLotName={response.data.cosa_code}
                                    Output_Ring={response.data.output_ring}
                                    Supplier_Lot={response.data.supplier_lot}
                                    GoodInsp={response.data.good_inspection}
                                    Reject_Top={response.data.reject_top}
                                    Reject_Front={response.data.reject_front}
                                    Reject_Back={response.data.reject_back}
                                    Reject_Bottom={response.data.reject_bottom}
                                    Reject_Multi={response.data.reject_multi}
                                    Reject_LIV={response.data.reject_liv}
                                />
                            );
    
                            const restoreConfirmResult = await Swal.fire({
                                title: 'This File Already Deleted.',
                                html: RestorePopupHtml ,
                                icon: 'question',
                                showCancelButton: true,
                                confirmButtonText: 'Yes',
                                cancelButtonText: 'Cancel',
                                customClass: 'custom-swal-width',
                            });
                
                            if (restoreConfirmResult.isConfirmed) {
                                // Restore status API call
                                const restoreStatusUrl = `${address}/api/status-restore/${matchedData.IDMLotID}?userId=${userId}`;
    
                                await axios.post(restoreStatusUrl);
                
                                // Show success message
                                Swal.fire({
                                    title: 'Status Restored',
                                    text: 'The status has been successfully restored.',
                                    icon: 'success',
                                });
                
                                fetchData();
                            } else {
                                setUploading(false);
                                setSelectedFileName('No file chosen');
                            }
                        }
                    } else {
                        // User confirmed, proceed with the import
                        const baseApiUrl = `${address}/import`;
                        const queryParams = [];
                        queryParams.push(`userId=${userId}`);
                        const queryString = queryParams.length > 0 ? '?' + queryParams.join('&') : '';
                        const fullUrl = `${baseApiUrl}${queryString}`;
    
                        const confirmResult = await Swal.fire({
                            title: 'Confirm Upload',
                            html: uploadPopupHtml,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonText: 'Yes',
                            cancelButtonText: 'Cancel',
                            customClass: 'custom-swal-width',
                        })
    
                        if (confirmResult.isConfirmed) {
                            // Show loading animation during update
                            const uploadSwal = Swal.fire({
                                title: '<div class="loading-spinner"></div>',
                                html: 'Uploading...',
                                allowOutsideClick: false,
                                showConfirmButton: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                },
                            });
    
                            await axios.post(fullUrl, formData);
    
                            setUploading(false);
                            uploadSwal.close(); // Close loading animation
    
                            Swal.fire({
                                title: 'Upload Success',
                                text: 'The file has been successfully uploaded.',
                                icon: 'success',
                            });
        
                            fetchData();
                        } else {
                            // User cancelled, show message
                            setUploading(false);
                            setSelectedFileName('No file chosen');
                            loadingSwal.close(); // Close loading animation
                        }
                    }
                } else {
                    Swal.fire({
                        title: 'Upload Fail',
                        text: 'Incorrect file format.',
                        icon: 'error',
                    });
                }
            };
            reader.readAsArrayBuffer(file);
        } catch (error) {
            setUploading(false);
            console.error('Error uploading file:', error);
            loadingSwal.close(); // Close loading animation
            Swal.fire({
                title: 'Upload Error',
                text: 'An error occurred while uploading the file.',
                icon: 'error',
            });
        }
    };

    return (
        <div className='container-file mt-file'>
            <label className="add-file">
                <input type="file" onChange={handleFileChange} />
                <span className="material-symbols-sharp">add</span>
                <h3>Add File</h3>
            </label>
            {uploading ? (
                <span className="file-label">Uploading...</span>
            ) : (
                <span className="file-label">{selectedFileName}</span>
            )}
        </div>
    );
};

export default ImportFile;
