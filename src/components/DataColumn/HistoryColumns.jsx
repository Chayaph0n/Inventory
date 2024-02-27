
const HistoryColumns = [
    {
        name: 'ID',
        selector: row => row.InvCOSARefID,
        sortable: true,
        width: '80px',
        center: true,
    },
    {
        name: 'COSA Code',
        selector: row => row.IDMLotName,
        width: '200px',
        center: true
    },
    {
        name: <div>Output<br/>Ring</div>,
        selector: row => row.Output_Ring,
        width: '100px',
        center: true
    },
    {
        name: <div>Supplier<br/>Lot</div>,
        selector: row => row.Supplier_Lot,
        width: '100px',
        center: true
    },
    {
        name: <div>Good<br/>Inspect</div>,
        selector: row => row.GoodInspection,
        // sortable: true,
        width: '100px',
        center: true
    },
    {
        name: <div>Reject<br/>Top</div>,
        selector: row => row.RejectTop,
        width: '100px',
        center: true
    },
    {
        name: <div>Reject<br/>Front</div>,
        selector: row => row.RejectFront,
        width: '100px',
        center: true
    },
    {
        name: <div>Reject<br/>Back</div>,
        selector: row => row.RejectBack,
        center: true,
        width: '100px',
        center: true
    },
    {
        name: <div>Reject<br/>Bottom</div>,
        selector: row => row.RejectBottom,
        center: true,
        width: '100px',
        center: true
    },
    {
        name: <div>Reject<br/>Multi</div>,
        selector: row => row.RejectMulti,
        center: true,
        width: '100px',
        style: {
            color: 'green'
        }
    },
    {
        name: <div>Reject<br/>LIV</div>,
        selector: row => row.RejectLIV,
        center: true,
        width: '100px',
        style: {
            color: 'green'
        }
    },
    {
        name: <div>Orders<br/>ByID</div>,
        selector: row => row.CreatedByID,
        center: true,
        width: '130px',
    },
    {
        name: <div>Orders<br/>Date</div>,
        sortable: true,
        width: '120px',
        center: true,
        selector: row => row.CreatedDateTime,
    },
    {
        name: 'Action',
        center: true,
        width: '115px',
        selector: row => row.ActionID,
        cell: row => {
            const actionId = row.ActionID;
            let color = '';
            
            if (actionId === 'Return') {
                color = 'blue';
            } else if (actionId === 'Take') {
                color = 'green';
            } else {
                color = 'red'
            }

            return (
                <div style={{ color }}>{actionId}</div>
            );
        } 
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
]

export default HistoryColumns;