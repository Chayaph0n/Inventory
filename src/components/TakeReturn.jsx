import './TakeReturn.css'
import ReturnButton from './Button/Return';
import TakeButton from './Button/Take';
import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import DataTable from 'react-data-table-component';
import HistoryColumns from './DataColumn/HistoryColumns';
import { useParams } from 'react-router-dom';
import ReturnCondition from './Button/ReturnCondition';
import BackHomeButton from './Button/BackHome';
import DescButton from './Button/DescButton';
import address from './Address';


const TakeReturnDashboard = () => {

    const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalRows, setTotalRows] = useState(0);
	const [perPage, setPerPage] = useState(10);
    const [page, setPage] = useState(1);
    const [sortColumn, setSortColumn] = useState('');
    const [sortColumnDirection, setSortColumnDirection] = useState('');
    //data
    const [cosaCode, setCosaCode] = useState('');
    const [outputRing, setOutputRing] = useState('');
    const [supplierLot, setSupplierLot] = useState('');
    const [goodInspection, setGoodInspection] = useState(0);
    const [rejectInspection, setRejectInspection] = useState(0);
    const [rejectTop, setRejectTop] = useState(0);
    const [rejectFront, setRejectFront] = useState(0);
    const [rejectBack, setRejectBack] = useState(0);
    const [rejectBottom, setRejectBottom] = useState(0);
    const [rejectMulti, setRejectMulti] = useState(0);
    const [rejectLIV, setRejectLIV] = useState(0);
    //taken
    const [goodTaken, setGoodTaken] = useState(0);
    const [rejectTopTaken, setRejectTopTaken] = useState(0);
    const [rejectFrontTaken, setRejectFrontTaken] = useState(0);
    const [rejectBackTaken, setRejectBackTaken] = useState(0);
    const [rejectBottomTaken, setRejectBottomTaken] = useState(0);
    const [rejectMultiTaken, setRejectMultiTaken] = useState(0);
    const [rejectLIVTaken, setRejectLIVTaken] = useState(0);
    //remain
    const [goodRemain, setGoodRemain] = useState(0);
    const [rejectTopRemain, setRejectTopRemain] = useState(0);
    const [rejectFrontRemain, setRejectFrontRemain] = useState(0);
    const [rejectBackRemain, setRejectBackRemain] = useState(0);
    const [rejectBottomRemain, setRejectBottomRemain] = useState(0);
    const [rejectMultiRemain, setRejectMultiRemain] = useState(0);
    const [rejectLIVRemain, setRejectLIVRemain] = useState(0);
    //input value
    const [inputGoodValue, setInputGoodValue] = useState(0);
    const [inputTopValue, setInputTopValue] = useState(0);
    const [inputFrontValue, setInputFrontValue] = useState(0);
    const [inputBackValue, setInputBackValue] = useState(0);
    const [inputBottomValue, setInputBottomValue] = useState(0);
    const [inputMultiValue, setInputMultiValue] = useState(0);
    const [inputLIVValue, setInputLIVValue] = useState(0);
    //condition
    const [selectedCondition, setSelectedCondition] = useState('Normal');
    //description
    const [selectedDesc, setSelectedDesc] = useState('PRO')
    //commment
    const [inputComment, setInputComment] = useState('')

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 100) {
            setInputComment(inputValue);
        }
    };

    const handleConditionChange = (newCondition) => {
        setSelectedCondition(newCondition);
    };

    const handleDescChange = (newDesc) => {
        setSelectedDesc(newDesc);
    };

    //RefInput
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);
    const inputRef5 = useRef(null);
    const inputRef6 = useRef(null);
    const inputRef7 = useRef(null);

    const { InvCOSARefID } = useParams();
    
    const fetchData = async () => {
		setLoading(true);

        var url = `${address}/api/history/${InvCOSARefID}?page=${page}&per_page=${perPage}`;
        // if (sortColumn) {
        //     url += `&sort_column=${sortColumn}&sort_direction=${sortColumnDirection}`;
        // }
		const response = await axios.get(url);

		setData(response.data.data);
		setTotalRows(response.data.total);
        setCosaCode(response.data.cosa_code);
        //data
        setOutputRing(response.data.output_ring);
        setSupplierLot(response.data.supplier_lot);
        setGoodInspection(response.data.good_inspection);
        setRejectInspection(response.data.reject_inspection);
        setRejectTop(response.data.reject_top);
        setRejectFront(response.data.reject_front);
        setRejectBack(response.data.reject_back);
        setRejectBottom(response.data.reject_bottom);
        setRejectMulti(response.data.reject_multi);
        setRejectLIV(response.data.reject_liv);
        //taken
        setGoodTaken(response.data.good_remain);
        setRejectTopTaken(response.data.top_remain);
        setRejectFrontTaken(response.data.front_remain);
        setRejectBackTaken(response.data.back_remain);
        setRejectBottomTaken(response.data.bottom_remain);
        setRejectMultiTaken(response.data.multi_remain);
        setRejectLIVTaken(response.data.liv_remain);

        // Calculate remaining values based on fetched data
        const remainingGood = response.data.good_inspection - response.data.good_remain;
        const remainingRejectTop = response.data.reject_top - response.data.top_remain;
        const remainingRejectFront = response.data.reject_front - response.data.front_remain;
        const remainingRejectBack = response.data.reject_back - response.data.back_remain;
        const remainingRejectBottom = response.data.reject_bottom - response.data.bottom_remain;
        const remainingRejectMulti = response.data.reject_multi - response.data.multi_remain;
        const remainingRejectLIV = response.data.reject_liv - response.data.liv_remain;

        // Update remaining state values
        setGoodRemain(remainingGood);
        setRejectTopRemain(remainingRejectTop);
        setRejectFrontRemain(remainingRejectFront);
        setRejectBackRemain(remainingRejectBack);
        setRejectBottomRemain(remainingRejectBottom);
        setRejectMultiRemain(remainingRejectMulti);
        setRejectLIVRemain(remainingRejectLIV);

        setInputGoodValue(0);
        setInputTopValue(0);
        setInputFrontValue(0);
        setInputBackValue(0);
        setInputBottomValue(0);
        setInputMultiValue(0);
        setInputLIVValue(0);

		setLoading(false);
	};

	const handlePageChange = (page) => {
		setPage(page);
	};

	const handlePerRowsChange = async (newPerPage, page) => {
		setPerPage(newPerPage);
        setPage(page);
	};

    const clearInput = () => {
        if (inputRef1.current) inputRef1.current.value = '';
        if (inputRef2.current) inputRef2.current.value = '';
        if (inputRef3.current) inputRef3.current.value = '';
        if (inputRef4.current) inputRef4.current.value = '';
        if (inputRef5.current) inputRef5.current.value = '';
        if (inputRef6.current) inputRef6.current.value = '';
        if (inputRef7.current) inputRef7.current.value = '';
    };

    const handleSort = (column, sortDirection) => {
        setSortColumn(column.InvCOSARefID);
        setSortColumnDirection(sortDirection)
	};

    useEffect(() => {
        if (InvCOSARefID) {
            fetchData();
        }
    }, [page, perPage, sortColumn, sortColumnDirection, InvCOSARefID]);

    return (
        <div className='bg'>
            <div className='bg-container'>
                <div className='flex-top'>
                    <h2 className='font-black'>COSA Inspection Result</h2>
                    <div className='position-back-btn'>
                        <BackHomeButton 
                            cosa_code = {cosaCode}
                            output_ring = {outputRing}
                            supplier_lot = {supplierLot}/>
                    </div>
                </div>
                
                <div className='flex'>
                    <div className='box-container'>
                        <div className="header-box">
                            <h3>COSA CODE</h3>
                        </div>
                        <p>{ cosaCode }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box">
                            <h3>OUTPUT RING</h3>
                        </div>
                        <p>{ outputRing }</p>
                    </div>
                    <div className='box-container-short-sup'>
                        <div className="header-box">
                            <h3>SUPPLIER LOT</h3>
                        </div>
                        <p>{ supplierLot }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box">
                            <h3>REJECT INSP</h3>
                        </div>
                        <p>{ rejectInspection }</p>
                    </div>
                </div>

                <div className='flex'>
                    <div className='box-container-short'>
                        <div className="header-box-good-income">
                            <h3>Good INSP</h3>
                        </div>
                        <p>{ goodInspection }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject-income">
                            <h3>Reject Top</h3>
                        </div>
                        <p>{ rejectTop }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject-income">
                            <h3>Reject Front</h3>
                        </div>
                        <p>{ rejectFront }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject-income">
                            <h3>Reject Back</h3>
                        </div>
                        <p>{ rejectBack }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject-income">
                            <h3>Reject Bottom</h3>
                        </div>
                        <p>{ rejectBottom }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject-income">
                            <h3>Reject Multi</h3>
                        </div>
                        <p>{ rejectMulti }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject-income">
                            <h3>Reject LIV</h3>
                        </div>
                        <p>{ rejectLIV }</p>
                    </div>
                </div>

                <h2 className='font-black mt'>REMAIN</h2>

                <div className='flex'>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ goodRemain }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ rejectTopRemain }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ rejectFrontRemain }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ rejectBackRemain }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ rejectBottomRemain }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ rejectMultiRemain }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain">
                            <h3>Remain</h3>
                        </div>
                        <p>{ rejectLIVRemain }</p>
                    </div>
                </div>

                <div className='flex'>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ goodTaken }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ rejectTopTaken }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ rejectFrontTaken }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ rejectBackTaken }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ rejectBottomTaken }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ rejectMultiTaken }</p>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-remain-taken">
                            <h3>Used</h3>
                        </div>
                        <p>{ rejectLIVTaken }</p>
                    </div>
                </div>

                <div className='flex'>
                    <div className='box-container-short'>
                        <div className="header-box-good">
                            <h3>Good INSP</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef1}
                        onChange={(e) => setInputGoodValue(e.target.value)}/>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject">
                            <h3>Reject Top</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef2}
                        onChange={(e) => setInputTopValue(e.target.value)}/>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject">
                            <h3>Reject Front</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef3}
                        onChange={(e) => setInputFrontValue(e.target.value)}/>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject">
                            <h3>Reject Back</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef4}
                        onChange={(e) => setInputBackValue(e.target.value)}/>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject">
                            <h3>Reject Bottom</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef5}
                        onChange={(e) => setInputBottomValue(e.target.value)}/>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject">
                            <h3>Reject Multi</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef6}
                        onChange={(e) => setInputMultiValue(e.target.value)}/>
                    </div>
                    <div className='box-container-short'>
                        <div className="header-box-reject">
                            <h3>Reject LIV</h3>
                        </div>
                        <input 
                        type='text' 
                        placeholder='0'
                        ref={inputRef7}
                        onChange={(e) => setInputLIVValue(e.target.value)}/>
                    </div>
                </div>

                <div className='flex mt-button'>
                    <TakeButton 
                        good_remain = {goodRemain}
                        top_remain = {rejectTopRemain}
                        front_remain = {rejectFrontRemain}
                        back_remain = {rejectBackRemain}
                        bottom_remain = {rejectBottomRemain}
                        multi_remain = {rejectMultiRemain}
                        liv_remain = {rejectLIVRemain}
                        good = {inputGoodValue}
                        top = {inputTopValue}
                        front = {inputFrontValue}
                        back = {inputBackValue}
                        bottom = {inputBottomValue}
                        multi = {inputMultiValue}
                        liv = {inputLIVValue}
                        invCOSARefID={InvCOSARefID}
                        fetchData={fetchData}
                        clearInput={clearInput}
                        condition={selectedCondition}
                        desc={selectedDesc}
                        comment={inputComment}/>
                    <ReturnButton 
                        good_taken = {goodTaken}
                        top_taken = {rejectTopTaken}
                        front_taken = {rejectFrontTaken}
                        back_taken = {rejectBackTaken}
                        bottom_taken = {rejectBottomTaken}
                        multi_taken = {rejectMultiTaken}
                        liv_taken = {rejectLIVTaken}
                        good = {inputGoodValue}
                        top = {inputTopValue}
                        front = {inputFrontValue}
                        back = {inputBackValue}
                        bottom = {inputBottomValue}
                        multi = {inputMultiValue}
                        liv = {inputLIVValue}
                        invCOSARefID={InvCOSARefID}
                        fetchData={fetchData}
                        clearInput={clearInput}
                        condition={selectedCondition}
                        desc={selectedDesc}
                        comment={inputComment}/>
                    <ReturnCondition 
                        selectedCondition={selectedCondition}
                        onConditionChange={handleConditionChange}/>
                    <DescButton 
                        selectedDesc={selectedDesc}
                        onDescChange={handleDescChange}/>
                    <textarea 
                        className='area-box' 
                        rows="1" 
                        cols="67" 
                        placeholder="Type your comment here"
                        value={inputComment}
                        onChange={handleInputChange}></textarea>
                </div>
            </div>
            <h2 className='font-white ml mt'>HISTORY</h2>
            <DataTable
                    className='custom-datatable mt-s'
                        columns={HistoryColumns}
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
    )
}

export default TakeReturnDashboard;