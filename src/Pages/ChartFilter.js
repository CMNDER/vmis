import React from 'react';
const Filter = (props) => {
    if (props.reset === true) {
        document.getElementsByClassName("reset")[0].value = "";
        document.getElementsByClassName("reset")[1].checked = false;
        document.getElementsByClassName("reset")[2].checked = false;
    }

    return (
        <div>
            <div>
                <div className="form-group">
                    <label htmlFor="specificDate">Pick a date</label>
                    <input type="date" className="form-control m-1 reset" id="specificDate" name="date" onChange={(e) => [props.onChange(e.target.value), document.getElementsByClassName("reset")[1].checked = false, document.getElementsByClassName("reset")[2].checked = false]} />
                </div>
                <label htmlFor="period">Choose period</label>
                <div className="form-group ">
                    <input type="Radio" name="period" value="6" id="period" className=" reset" onChange={(e) => props.onChange(e.target.value)} />
                    <label htmlFor="period" className="mx-2">6 months</label>
                    <input type="Radio" name="period" value="12" id="period" className=" reset" onChange={(e) => props.onChange(e.target.value)} />
                    <label htmlFor="period" className="mx-2">12 months</label>
                </div>
            </div>
        </div>
    );
}

export default Filter;