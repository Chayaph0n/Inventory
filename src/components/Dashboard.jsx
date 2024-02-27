import './Dashboard.css'
import './DataTable.css'
import React, { useEffect, useState, useRef } from 'react'
import { useLocalStorage } from "@uidotdev/usehooks";
import axios from 'axios'
import DataTable from 'react-data-table-component';
import Inspection from './Widget/Inspection';
import UsageAll from './Widget/UsageAll';
import RemainAll from './Widget/RemainAll';
import RemainGood from './Widget/RemainGood';
import RemainReject from './Widget/RemainReject';
import DashboardColumns from './DataColumn/DashboardColumns';
import ConditionFilter from './Button/ConditionFilter';
import ExportCSV from './Button/ExportCSV';
import ChartSummary from './Chart/ChartSummary';
import address from './Address';

const Dashboard = () => {

    const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState('');
    const [sortColumnDirection, setSortColumnDirection] = useState('');

    const [startDate, setStartDate] = useLocalStorage('startDate', '');
    const [endDate, setEndDate] = useLocalStorage('endDate', '');
    //tranform
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');

    const [search, setSearch] = useLocalStorage('search', '');
    const [searchRing, setSearchRing] = useLocalStorage('searchRing', '');
    const [searchSupLot, setSearchSupLot] = useLocalStorage('searchSupLot', '');

    const [isDateEmpty, setIsDateEmpty] = useState(true);
    const [finishInspection, setFinishInspection] = useState(0);
    const [usageAll, setUsageAll] = useState(0);
    const [remainAll, setRemainAll] = useState(0);
    const [remainGood, setRemainGood] = useState(0);
    const [remainReject, setRemainReject] = useState(0);
    //condition
    const [remainAllNormal, setRemainAllNormal] = useState(0);
    const [remainGoodNormal, setRemainGoodNormal] = useState(0);
    const [remainRejectNormal, setRemainRejectNormal] = useState(0);
    const [remainAllScraped, setRemainAllScraped] = useState(0);
    const [remainGoodScraped, setRemainGoodScraped] = useState(0);
    const [remainRejectScraped, setRemainRejectScraped] = useState(0);
    const [remainAllRemelting, setRemainAllRemelting] = useState(0);
    const [remainGoodRemelting, setRemainGoodRemelting] = useState(0);
    const [remainRejectRemelting, setRemainRejectRemelting] = useState(0);
    const [remainAllLowISAShear, setRemainAllLowISAShear] = useState(0);
    const [remainGoodLowISAShear, setRemainGoodLowISAShear] = useState(0);
    const [remainRejectLowISAShear, setRemainRejectLowISAShear] = useState(0);
    const [remainAllLowCOSAShear, setRemainAllLowCOSAShear] = useState(0);
    const [remainGoodLowCOSAShear, setRemainGoodLowCOSAShear] = useState(0);
    const [remainRejectLowCOSAShear, setRemainRejectLowCOSAShear] = useState(0);
    const [remainAllMetalBurr, setRemainAllMetalBurr] = useState(0);
    const [remainGoodMetalBurr, setRemainGoodMetalBurr] = useState(0);
    const [remainRejectMetalBurr, setRemainRejectMetalBurr] = useState(0);
    const [remainAllAuDelamination, setRemainAllAuDelamination] = useState(0);
    const [remainGoodAuDelamination, setRemainGoodAuDelamination] = useState(0);
    const [remainRejectAuDelamination, setRemainRejectAuDelamination] = useState(0);
    const [remainAllNormalNVI, setRemainAllNormalNVI] = useState(0);
    const [remainGoodNormalNVI, setRemainGoodNormalNVI] = useState(0);
    const [remainRejectNormalNVI, setRemainRejectNormalNVI] = useState(0);

    const userId = localStorage.getItem('userId');

    //condition
    const [selectedCondition, setSelectedCondition] = useState('');

    const handleConditionChange = (newCondition) => {
        setSelectedCondition(newCondition);
    };

    //RefInput
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);
    const inputRef5 = useRef(null);
    
	const fetchData = async () => {
		setLoading(true);

        var url = `${address}/api/combinelog?page=${page}&per_page=${perPage}`;
        if (startDate) {
            url += `&start_date=${startDate}`;
        } else {
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
        if (selectedCondition){
            url += `&condition=${selectedCondition}`
        }
        // if (sortColumn) {
        //     url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDirection}`;
        // }

		const response = await axios.get(url);

		setData(response.data.data);
		setTotalRows(response.data.total);
        setFinishInspection(response.data.finishInspection);
        setUsageAll(response.data.usageAll);
        setRemainAll(response.data.remainAll);
        setRemainGood(response.data.remainGood);
        setRemainReject(response.data.remainReject);

        setRemainAllNormal(response.data.remainAllNormal);
        setRemainGoodNormal(response.data.remainGoodNormal);
        setRemainRejectNormal(response.data.remainRejectNormal);

        setRemainAllScraped(response.data.remainAllScraped);
        setRemainGoodScraped(response.data.remainGoodScraped);
        setRemainRejectScraped(response.data.remainRejectScraped);

        setRemainAllRemelting(response.data.remainAllRemelting);
        setRemainGoodRemelting(response.data.remainGoodRemelting);
        setRemainRejectRemelting(response.data.remainRejectRemelting);

        setRemainAllLowISAShear(response.data.remainAllLowISAShear);
        setRemainGoodLowISAShear(response.data.remainGoodLowISAShear);
        setRemainRejectLowISAShear(response.data.remainRejectLowISAShear);

        setRemainAllLowCOSAShear(response.data.remainAllLowCOSAShear);
        setRemainGoodLowCOSAShear(response.data.remainGoodLowCOSAShear);
        setRemainRejectLowCOSAShear(response.data.remainRejectLowCOSAShear);

        setRemainAllMetalBurr(response.data.remainAllMetalBurr);
        setRemainGoodMetalBurr(response.data.remainGoodMetalBurr);
        setRemainRejectMetalBurr(response.data.remainRejectMetalBurr);

        setRemainAllAuDelamination(response.data.remainAllAuDelamination);
        setRemainGoodAuDelamination(response.data.remainGoodAuDelamination);
        setRemainRejectAuDelamination(response.data.remainRejectAuDelamination);

        setRemainAllNormalNVI(response.data.remainAllNormalNVI);
        setRemainGoodNormalNVI(response.data.remainGoodNormalNVI);
        setRemainRejectNormalNVI(response.data.remainRejectNormalNVI);

		setLoading(false);
	};  

    const formatDate = (dateString) => {
        // Create a Date object from the input date string
        const dateObject = new Date(dateString);
        
        // Get the month, day, and year components
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Adding 1 to get 1-based months
        const day = String(dateObject.getDate()).padStart(2, '0');
        const year = dateObject.getFullYear().toString().substring(2);
    
        // Concatenate the formatted parts to get the final date string (e.g., 02/17/23)
        const formattedDate = `${month}/${day}/${year}`;
    
        return formattedDate;
    }  

    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const formatFilterDate = (inputDate) => {
        // Split the input date string into month, day, and year parts
        const [month, day, year] = inputDate.split('/');

        // Create a new Date object by specifying the year, month, and day
        const newDate = new Date(`20${year}`, month - 1, day); // Subtract 1 from the month to adjust for 0-based indexing

        // Use the Date object's methods to get year, month, and day in the desired format
        const formattedYear = newDate.getFullYear();
        const formattedMonth = String(newDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month and pad with '0'
        const formattedDay = String(newDate.getDate()).padStart(2, '0');

        // Construct the formatted date string
        const formattedDate = `${formattedYear}-${formattedMonth}-${formattedDay}`;

        return formattedDate;
    }

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
        const formattedDate = formatDate(selectedDate);
        if (isStartDate) {
            setStartDate(formattedDate);
            setFilterStartDate(formatFilterDate(formattedDate));
        } else {
            setEndDate(formattedDate);
            setFilterEndDate(formatFilterDate(formattedDate));
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

    const clearInput = () => {
        if (inputRef1.current) setFilterStartDate(formatFilterDate(startDate))
        if (inputRef2.current) inputRef2.current.value = '';
        if (inputRef3.current) inputRef3.current.value = '';
        if (inputRef4.current) inputRef4.current.value = '';
        if (inputRef5.current) setFilterEndDate(formatFilterDate(endDate))
    };

    const handleClearFilter = () => {
        setStartDate('')
        setEndDate('')
        setSearch('');
        setSearchRing('');
        setSearchSupLot('');
        clearInput()
        setSelectedCondition('')
    }

    useEffect(() => {
        console.log(startDate);
        console.log(endDate);
        if (startDate === "NaN/NaN/N" && endDate === "" || startDate === "" && endDate === "") {
            setStartDate(formatDate(sixMonthsAgo)); // Set start date to six months ago
            setEndDate(formatDate(currentDate));    // Set end date to current date
        }

        setFilterStartDate(formatFilterDate(startDate))
        setFilterEndDate(formatFilterDate(endDate))

        inputRef1.current.value = filterStartDate;
        inputRef2.current.value = search;
        inputRef3.current.value = searchRing;
        inputRef4.current.value = searchSupLot;
        inputRef5.current.value = filterEndDate;

        fetchData();
    }, [page, perPage, sortColumn, sortColumnDirection, search, 
        searchRing, searchSupLot, startDate, endDate, isDateEmpty, 
        selectedCondition,filterStartDate, filterEndDate]);

    return(
        <main>
            <div className="row">
                <div>
                    <div class="box-input">
                        <label>Start Date : </label>
                        <input className='input-date' ref={inputRef1} type="date" onChange={(event) => handleDateChange(event, true)}/>
                    </div>
                    <div class="box-input ml-2">
                        <label>End Date : </label>
                        <input className='input-date' ref={inputRef5} type="date" onChange={(event) => handleDateChange(event, false)}/>
                    </div>
                    <form class="box-input ml-2" >
                        <div className="box-input-flex">
                            <input ref={inputRef2} type="text" placeholder='Search here' onChange={handleSearchChange}/>
                            <label>COSA Code</label>
                        </div>
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
                    <button class="box-input-export ml-export pointer">
                        <ExportCSV 
                        data = {data}
                        startDate = {startDate}
                        endDate = {endDate}
                        search = {search}
                        searchRing = {searchRing}
                        searchSupLot = {searchSupLot}
                        finishInspection = {finishInspection}
                        usageAll = {usageAll}
                        remainAll = {remainAll}
                        remainGood = {remainGood}
                        remainReject = {remainReject}/>
                    </button>
                </div>
            </div>
            <div className='flex-dash'>
                <div className='chart-container'>
                    <div className='chart'>
                        <ChartSummary 
                                remainAll={remainAll}
                                remainGood={remainGood}
                                remainReject={remainReject}
                                remainGoodNormal={remainGoodNormal}
                                remainRejectNormal={remainRejectNormal}
                                remainAllNormal={remainAllNormal}
                                remainGoodScraped={remainGoodScraped}
                                remainRejectScraped={remainRejectScraped}
                                remainAllScraped={remainAllScraped}
                                remainGoodRemelting={remainGoodRemelting}
                                remainRejectRemelting={remainRejectRemelting}
                                remainAllRemelting={remainAllRemelting}
                                remainGoodLowISAShear={remainGoodLowISAShear}
                                remainRejectLowISAShear={remainRejectLowISAShear}
                                remainAllLowISAShear={remainAllLowISAShear}
                                remainGoodLowCOSAShear={remainGoodLowCOSAShear}
                                remainRejectLowCOSAShear={remainRejectLowCOSAShear}
                                remainAllLowCOSAShear={remainAllLowCOSAShear}
                                remainGoodMetalBurr={remainGoodMetalBurr}
                                remainRejectMetalBurr={remainRejectMetalBurr}
                                remainAllMetalBurr={remainAllMetalBurr}
                                remainGoodAuDelamination={remainGoodAuDelamination}
                                remainRejectAuDelamination={remainRejectAuDelamination}
                                remainAllAuDelamination={remainAllAuDelamination}
                                remainGoodNormalNVI={remainGoodNormalNVI}
                                remainRejectNormalNVI={remainRejectNormalNVI}
                                remainAllNormalNVI={remainAllNormalNVI}/>
                    </div>
                </div>
                <div className='bg-insights'>
                    <div className="insights">
                        <Inspection finishInspection={finishInspection}/>
                        <UsageAll usageAll={usageAll}/>
                        <RemainAll remainAll={remainAll}/>
                    </div>
                    <div className="insights">
                        <RemainGood remainGood={remainGood}/>  
                        <RemainReject remainReject={remainReject}/>
                    </div>
                </div>
            </div>
            <div className="recent-orders">
                <div className='flex mb-1'>
                    <h2>Combine Log</h2>
                    <div className='con-position'>
                        <ConditionFilter 
                        selectedCondition={selectedCondition}
                        onConditionChange={handleConditionChange}/>
                    </div>
                </div>
                <div className='container-table'>
                    <DataTable
                        className='custom-datatable'
                        columns={DashboardColumns}
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
            </div>
        </main>
    )
}

export default Dashboard;