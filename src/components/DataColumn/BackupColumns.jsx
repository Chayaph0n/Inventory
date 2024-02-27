import DeleteButton from '../Button/DeleteBotton';
import RestoreButton from '../Button/RestoreButton';

const BackupColumns = (fetchDataProps) => {
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
            width: '275px',
            center: true
        },
        {
            name: <div>Output Ring</div>,
            selector: row => row.Output_Ring,
            width: '225px',
            center: true
        },
        {
            name: <div>Supplier Lot</div>,
            selector: row => row.Supplier_Lot,
            width: '225px',
            center: true
        },
        {
            name: <div>Deleted Date</div>,
            selector: row => row.UplodeDate,
            // sortable: true,
            width: '225px',
            center: true
        },
        {
            name: <div>Deleted ByID</div>,
            selector: row => row.CreatedByID,
            width: '225px',
            center: true
        },
        {
            name: 'Restore',
            center: true,
            width: '150px',
            cell: row => <RestoreButton rowData={row} fetchData={fetchDataProps.fetchData}/>
        },
        {
            name: 'Delete',
            center: true,
            width: '150px',
            cell: row => <DeleteButton rowData={row} fetchData={fetchDataProps.fetchData}/>
        }
    ]
}

export default BackupColumns;