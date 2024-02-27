import BackupButton from '../Button/BackupButton';

const UploadColumns = (fetchDataProps) => { 

    return[
            {
                name: 'ID',
                selector: row => row.IDMLotID,
                sortable: true,
                width: '100px',
                center: true,
            },
            {
                name: 'COSA Code',
                selector: row => row.IDMLotName,
                width: '240px',
                center: true
            },
            {
                name: <div>Output Ring</div>,
                selector: row => row.Output_Ring,
                width: '185px',
                center: true
            },
            {
                name: <div>Supplier Lot</div>,
                selector: row => row.Supplier_Lot,
                width: '185px',
                center: true
            },
            {
                name: <div>Uploaded Date</div>,
                selector: row => row.UplodeDate,
                // sortable: true,
                width: '180px',
                center: true
            },
            {
                name: <div>Uploaded ByID</div>,
                selector: row => row.CreatedByID,
                width: '180px',
                center: true
            },
            {
                name: <div>Updated Date</div>,
                selector: row => row.UpdateDate,
                // sortable: true,
                width: '180px',
                center: true
            },
            {
                name: <div>Updated ByID</div>,
                selector: row => row.UpdatedByID,
                width: '180px',
                center: true
            },
            {
                name: 'Action',
                center: true,
                width: '150px',
                cell: row => <BackupButton rowData={row} fetchData={fetchDataProps.fetchData}/>
            },
        ]
}

export default UploadColumns;