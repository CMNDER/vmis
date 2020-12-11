import React, { useContext, useState } from 'react';
import { userIntelContext } from '../App';
import DataTables from '../Components/AcknowledgeDataTable';
import VaccinesList from '../Components/VaccinesSelectDropDown';
import { DateParser } from '../Data/Date';
import { useInput } from '../Data/useInput'
import axios from 'axios';
import { Button, Spinner } from 'react-bootstrap'
const wastageList = []
let wastageData = null;
function Wastage() {
    const user = useContext(userIntelContext)
    const [openCLose, setOpenCLose] = useState(null)
    const [selectedVaccine, setSelectedVaccine] = useState('')
    const { value: damageType, bind: bindDamageType, reset: resetDamageType } = useInput('');
    const { value: batchNumber, bind: bindBatchNumber, reset: resetBatchNumber } = useInput('');
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: comment, bind: bindComment, reset: resetComment } = useInput('');
    const [message, setMessage] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [spin, setSpin] = useState('')
    const [sent, setSent] = useState(0)
    const handleAddItem = (e) => {
        e.preventDefault()
        wastageList.push({
            "vaccineName": selectedVaccine.vaccineName,
            "vaccineid": selectedVaccine.vaccineId,
            "batchNumber": batchNumber,
            "vaccineDamageType": damageType,
            "vaccineQuantity": quantity,
            "comment": comment
        })
        resetDamageType();
        resetQuantity();
        resetComment();
        resetBatchNumber();
        document.getElementById("vaccineSelectionDropdown").value = ""
    }
    const handleWatsageSubmit = (e) => {
        e.preventDefault();
        const config = {
            url: 'http://localhost:8765/api/wastage',
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        };
        wastageData = {
            from_orgunitId: user.userToken.orgunit,
            from_orgunitName: user.userToken.orgunitname,
            to_orgunitid: user.userToken.parentorgunit,
            to_orgunitname: user.userToken.parentorgunitname,
            date: DateParser(),
            wastageItems: wastageList
        }
        wastageList.splice(0, wastageList.length)
        // setMessage({ type: 'text-center alert alert-success m-2', message: 'Wastage acknowledgement successful' })
        setTimeout(() => {
            setMessage('')
        }, 5000);
        setSent(sent + 1)
        setDisabled(true)
        setSpin('border')
        axios.post(config.url, wastageData, { headers: config.headers }).then(res => {
            setDisabled(false)
            setSpin('')
            wastageList.splice(0, wastageList.length)
            wastageData = {}
            // setMessage({ type: 'text-center alert alert-success m-2', message: 'Wastage acknowledgement successful' })
            setTimeout(() => {
                setMessage(null)
            }, 5000);
        }).catch(() => {
            setDisabled(false)
            setSpin('')
            // setMessage({ type: 'text-center alert alert-danger m-2', message: 'Wastage acknowledgement failed' })
            setTimeout(() => {
                setMessage(null)
            }, 5000);
        })
    }
    const handleRadio = (e) => {
        if (e.target.value === "yes") {
            return setOpenCLose(true)
        }
        else if (e.target.value === "no") {
            return setOpenCLose(false)
        }
        else {
            return setOpenCLose(null)
        }
    }
    return (
        <div>
            <h4 className='card-header text-center'>Report Wastage</h4>
            <div className='container-fluid'>
                {message?<p className={message.type}>{message.message}</p>:""}
                <div className='row'>
                    <div className="col-md-4">
                        <form onSubmit={handleAddItem}>
                            <VaccinesList onChange={vaccine => setSelectedVaccine(vaccine)} dependency={sent} />
                            <div className='fom-group'>
                                <p>Open or closed damage:</p>
                                <div className="text-center row">
                                    <div className="col-lg-6"><input type="radio" onChange={handleRadio} id="open" name="typeOfDamage" value="yes" /><label htmlFor="open">Open</label></div>
                                    <div className="col-lg-6"><input type="radio" onChange={handleRadio} id="closed" name="typeOfDamage" value="no" /><label htmlFor="closed">Closed</label></div>
                                </div>
                                {openCLose === true ? <div className='form-group'>
                                    <label htmlFor='vaccineSelection'>Select Vaccine:</label>
                                    <select name="vaccineSelection" className='form-control' {...bindDamageType} required >
                                        <option value="">None</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div> : openCLose === false ? <div className='form-group'>
                                    <label htmlFor='vaccineSelection'>Select Vaccine:</label>
                                    <select name="vaccineSelection" className='form-control' {...bindDamageType} required >
                                        <option value="">None</option>
                                        <option value="D">D</option>
                                        <option value="E">E</option>
                                        <option value="F">F</option>
                                    </select>
                                </div> : ""}
                            </div>
                            <br /><br />
                            <div className='form-group'>
                                <label htmlFor='quantity'>Quantity:</label>
                                <input type='number' name='quantity' className='form-control' {...bindQuantity} required />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='wastageDate'>Batch Number</label>
                                <input type='text' name='batchNumber' className='form-control' {...bindBatchNumber} required />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='comments'>Comments:</label>
                                <textarea rows="3" className='form-control' name="comment" {...bindComment} required />
                            </div>
                            <div className='form-group'>
                                <button className='btn btn-success form-control'>Add to items to report</button>
                            </div>
                        </form>
                    </div>
                    <div className="col">
                        {wastageList.length > 0 ? <div><DataTables data={wastageList} type={0} />
                            <Button variant="primary" onClick={handleWatsageSubmit} disabled={disabled}>
                                <Spinner as="span" animation={spin} size="sm" role="status" aria-hidden="true" /> Submit</Button>
                        </div>
                            : ""}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Wastage
