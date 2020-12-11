import React, { useState } from 'react';
import ChartComponent from '../Components/Chart';
import Filter from './ChartFilter';
function Stock(props) {
    const [filterDate, setFilterDate] = useState(null)
    const [reset, setReset] = useState(false)
    const handleReset = (e) => {
        setFilterDate(null)
        setReset(true)
        setInterval(() => {
            setReset(false)
        }, 500);
    }
    return (
        <div>
            <div className="container-fluid">
                <div className='my-3'>
                    <div className='row'>

                        {/* <div className='col-lg-9 text-center border card-header'> */}
                            <div className='col-lg-12 text-center border card-header'>
                            <h4 className='card-header'><b>{props.stockId.orgUnitName} Current Stock Status</b></h4>
                            <ChartComponent requestOrgunitId={props.stockId.orgUnitId} date={filterDate} reset={reset} />
                        </div>
                        {/* <div className='col-3 text-center border card-header'>
                            <h4 className='card-header'><b>{props.stockId.orgUnitName} Filter</b></h4>
                            <Filter onChange={date => setFilterDate(date)} reset={reset} />
                            <button className="btn btn-primary" onClick={handleReset}>Reset Filter</button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Stock
