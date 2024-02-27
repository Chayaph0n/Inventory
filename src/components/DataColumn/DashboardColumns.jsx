import ActionButton from '../Button/TakeCOSA';

const actionIdToCondition = {
    1: '',
    2: '',
    3: 'Scraped',
    4: 'Remelting',
    5: 'Low ISA Shear',
    6: 'Low COSA Shear',
    7: 'Metal Burr',
    8: 'Au Delamination',
    9: 'Normal-NVI'
};

const DashboardColumns = [
    {
        name: 'ID',
        selector: row => row.InvCOSARefID,
        sortable: true,
        width: '100px',
        center: true,
    },
    {
        name: 'COSA Code',
        selector: row => row.IDMLotName,
        width: '165px',
        center: true
    },
    {
        name: <div>Output<br/>Ring</div>,
        selector: row => row.Output_Ring,
        width: '90px',
        center: true
    },
    {
        name: <div>Supplier<br/>Lot</div>,
        selector: row => row.Supplier_Lot,
        width: '90px',
        center: true
    },
    {
        name: <div>Good<br/>Inspect</div>,
        selector: row => row.GoodInspection,
        // sortable: true,
        width: '90px',
        center: true
    },
    {
        name: <div>Reject<br/>Inspect</div>,
        selector: row => row.RejectInspection,
        width: '90px',
        center: true
    },
    {
        name: <div>Good<br/>Usage</div>,
        selector: row => row.GoodUsage,
        width: '90px',
        center: true
    },
    {
        name: <div>Reject<br/>Usage</div>,
        selector: row => row.RejectUsage,
        width: '90px',
        center: true
    },
    {
        name: <div>Good<br/>Remain</div>,
        selector: row => row.GoodRemain,
        center: true,
        width: '90px',
        style: {
            color: 'green'
        }
    },
    {
        name: <div>Reject<br/>Remain</div>,
        selector: row => row.RejectRemain,
        center: true,
        width: '90px',
        style: {
            color: 'green'
        }
    },
    {
        name: 'Condition',
        selector: row => actionIdToCondition[row.ActionID] || '',
        center: true,
        width: '145px',
        style: {
            color: 'red'
        }
    },
    {
        name: <div>Upload</div>,
        selector: row => row.CreatedByID,
        center: true,
        width: '120px',
    },
    {
        name: <div>Update</div>,
        selector: row => row.UpdatedByID,
        center: true,
        width: '120px',
    },
    {
        name: <div>COSA<br/>Lot</div>,
        width: '120px',
        center: true,
        selector: row => row.LotDate,
    },
    {
        name: 'Action',
        center: true,
        width: '100px',
        cell: row => <ActionButton rowData={row} />
    },
    {
        name: <div>Purpose</div>,
        selector: row => row.Purpose,
        center: true,
        width: '175px',
        style: {
            color: '#9302fa'
        }
    },
    {
        name: <div>Comment</div>,
        selector: row => row.Comment,
        center: true,
        width: '400px',
    },
];

export default DashboardColumns;