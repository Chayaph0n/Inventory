import './Dashboard.css'
import './DataTable.css'
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component';
import UploadColumns from './DataColumn/UploadColumns';
import ImportFile from './Button/ImportFile';
import address from './Address';

function Upload() {

    const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState('');
    const [sortColumnDirection, setSortColumnDirection] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState('');
    const [searchRing, setSearchRing] = useState('');
    const [searchSupLot, setSearchSupLot] = useState('');
    const [isDateEmpty, setIsDateEmpty] = useState(true);

    //RefInput
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);
    const inputRef5 = useRef(null);

	const fetchData = async () => {
		setLoading(true);

        var url = `${address}/api/upload?page=${page}&per_page=${perPage}`;
        if (!isDateEmpty) {
            url += `&start_date=${startDate}`;
        }
        if (endDate) {
            url += `&end_date=${endDate}`;
        }
        if (search) {
            url += `&search=${search}`
        }
        if (searchRing) {
            const encodedSearchRing = encodeURIComponent(searchRing);
            url += `&search_ring=${encodedSearchRing}`;
        }
        if (searchSupLot) {
            const encodedSearchSuplot = encodeURIComponent(searchSupLot);
            url += `&search_suplot=${encodedSearchSuplot}`;
        }
        // if (sortColumn) {
        //     url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDirection}`;
        // }
		const response = await axios.get(url);

		setData(response.data.data);
		setTotalRows(response.data.total);
		setLoading(false);
	};

	const handlePageChange = (page) => {
		setPage(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setPerPage(newPerPage);
	};

    const handleSort = (column, sortDirection) => {
        setSortColumn(column.InvCOSARefID);
        setSortColumnDirection(sortDirection)
	};


    const handleDateChange = (event, isStartDate) => {
        const selectedDate = event.target.value;
        if (isStartDate) {
            setStartDate(selectedDate);
        } else {
            setEndDate(selectedDate);
        }
        setIsDateEmpty(selectedDate === '');
    }

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    }

    const handleSearchRingChange = (event) => {
        setSearchRing(event.target.value);
    }

    const handleSearchSubLotChange = (event) => {
        setSearchSupLot(event.target.value);
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        fetchData();
    }

    const clearInput = () => {
        if (inputRef1.current) inputRef1.current.value = '';
        if (inputRef2.current) inputRef2.current.value = '';
        if (inputRef3.current) inputRef3.current.value = '';
        if (inputRef4.current) inputRef4.current.value = '';
        if (inputRef5.current) inputRef5.current.value = '';
    };

    const handleClearFilter = () => {
        setStartDate('');
        setEndDate('');
        setSearch('');
        setSearchRing('');
        setSearchSupLot('');
        clearInput()
    }

    const fetchDataProps = {
        fetchData: fetchData
    };

    useEffect(() => {
        fetchData();
    }, [page, perPage, sortColumn, sortColumnDirection, search, searchRing, searchSupLot, startDate, endDate, isDateEmpty]);


    return(
        <main>
            <div class="row">
                <div>
                    <div class="box-input">
                        <label>Start Date : </label>
                        <input className='input-date' ref={inputRef1} type="date" onChange={(event) => handleDateChange(event, true)}/>
                    </div>
                    <div class="box-input ml-2">
                        <label>End Date : </label>
                        <input className='input-date' ref={inputRef5} type="date" onChange={(event) => handleDateChange(event, false)}/>
                    </div>
                    <form class="box-input ml-2" onSubmit={handleSearchSubmit}>
                        <input type="text" placeholder='Search here' onChange={handleSearchChange}/>
                        <label>COSA Code</label>
                    </form>
                    <div class="box-input ml-2">
                        <div className="box-input-flex">
                            <input className='input-ring' ref={inputRef3} type="text" placeholder='Search here' onChange={handleSearchRingChange}/>
                            <label>OUTPUT RING</label>
                        </div>
                    </div>
                    <div class="box-input ml-2">
                        <div className="box-input-flex">
                            <input className='input-ring' ref={inputRef4} type="text" placeholder='Search here' onChange={handleSearchSubLotChange}/>
                            <label>SUPPLIER LOT</label>
                        </div>
                    </div>
                    <button class="box-input ml-2 pointer" onClick={handleClearFilter}>
                        <div className="box-input-flex">
                            <label className='pointer'>CLEAR FILTER</label>
                        </div>
                    </button>
                </div>
            </div>
            <div class="row-add">
                <ImportFile fetchData={fetchData}/>
                {/* <ImportFolder /> */}
            </div>
            <div class="recent-orders">
                <h2>Combind Log File</h2>
                <DataTable
                    className='custom-datatable'
                    columns={UploadColumns(fetchDataProps)}
                    data={data}
                    progressPending={loading}
                    pagination
                    paginationServer
                    paginationTotalRows={totalRows}
                    onChangeRowsPerPage={handlePerRowsChange}
                    onChangePage={handlePageChange}
                    onSort={handleSort}
                />
            </div>
        </main>
    )
}

export default Upload;