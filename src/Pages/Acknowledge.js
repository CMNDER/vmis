import axios from 'axios';
import React, { useContext, useState } from 'react';
import { Col, Row, Spinner, Button } from 'react-bootstrap';
import DataTables from '../Components/AcknowledgeDataTable';
import VaccinesList from '../Components/VaccinesSelectDropDown';
import { useInput } from '../Data/useInput';
import { userIntelContext } from '../App';
import { DateParser } from '../Data/Date';
import { constraintCheck } from '../Data/ConstraintCheck';
import { Form } from 'react-bootstrap'
import Distributions from './AcknowledgeDistribution';
let acknowledgementList = []
let acknowledgementData = null
let wastageList = []
let wastageData = null
const Acknowledge = () => {
    const user = useContext(userIntelContext)
    const [openCLose, setOpenCLose] = useState(null)
    const { value: damageType, bind: bindDamageType, reset: resetDamageType } = useInput('');
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: comment, bind: bindComment, reset: resetComment } = useInput('');
    const { value: batchNumber, bind: bindBatchNumber, reset: resetBatchNumber } = useInput('');
    const [disabled, setDisabled] = useState(false)
    const [selectedVaccine, setSelectedVaccine] = useState('')
    const resetVaccineSelector = document.getElementById("vaccineSelectionDropdown")
    const [damaged, setDamaged] = useState(null)
    const [spin, setSpin] = useState('')
    const [message, setMessage] = useState('')

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

    const handleWatsageSubmit = (e) => {
        e.preventDefault();
        const config = {
            url: 'http://localhost:8765/api/wastage/acknowledge',
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        };
        wastageData = {
            from_orgunitId: user.userToken.orgunit,
            from_orgunitName: user.userToken.orgunitname,
            to_orgunitid: user.userToken.parentorgunit,
            to_orgunitname: user.userToken.parentorgunitname,
            wastageItems: wastageList
        }
        setDisabled(true)
        setSpin('border')
        wastageList.splice(0,wastageList.length)
        
        axios.post(config.url, wastageData, { headers: config.headers }).then(res => {
            setDisabled(false)
            setSpin('')
            wastageData = {}
            wastageList.splice(0,wastageList.length)
            // setMessage({ type: 'text-center alert alert-success m-2', message: 'Wastage acknowledgement successful' })
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }).catch(() => {
            setDisabled(false)
            setSpin('')
            // setMessage({ type: 'text-center alert alert-danger m-2', message: 'Wastage acknowledgement failed' })
            setTimeout(() => {
                setMessage('')
            }, 5000);
        })
    }
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

    const handleChoice = (e) => {
        if (e.target.value === "yes") {
            resetQuantity()
            resetBatchNumber()
            resetComment()
            setSelectedVaccine('')
            if (resetVaccineSelector) {
                resetVaccineSelector.value = ""
            }
            setDamaged(true)
        }
        else if (e.target.value === "no") {
            resetQuantity()
            resetBatchNumber()
            resetComment()
            setSelectedVaccine('')
            if (resetVaccineSelector) {
                resetVaccineSelector.value = ""
            }
            setDamaged(false)
        }
    }
    const handleAcknowledgmentApiRequest = () => {
        const config = {
            url: 'http://localhost:8765/api/acknowledge',
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        };
        acknowledgementData = {
            from_orgunitId: user.userToken.orgunit,
            from_orgunitName: user.userToken.orgunitname,
            to_orgunitid: user.userToken.parentorgunit,
            to_orgunitname: user.userToken.parentorgunitname,
            date: DateParser(),
            acknowledgedItems: acknowledgementList
        }
        setDisabled(true)
        setSpin('border')
        axios.post(config.url, acknowledgementData, { headers: config.headers }).then(res => {
            setDisabled(false)
            setSpin('')
            acknowledgementList.splice(0, acknowledgementList.length)
            acknowledgementData = {}
            setMessage({ type: 'text-center alert alert-success m-2', message: 'Acknowledgement successful' })
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }).catch((e) => {
            if (e.response.status === 500 && e.response.data === 401) {
                setDisabled(false)
                setSpin('')
                setMessage({ type: 'text-center alert alert-danger m-2', message: 'Acknowledgement failed Quantity is inadequate' })
                setTimeout(() => {
                    setMessage('')
                }, 5000);
            }
            else if (e.response.status === 500) {
                setDisabled(false)
                setSpin('')
                setMessage({ type: 'text-center alert alert-danger m-2', message: 'Acknowledgement failed' })
                setTimeout(() => {
                    setMessage('')
                }, 5000);
            }
            else if (e.response.status === 404) {
                setDisabled(false)
                setSpin('')
                setMessage({ type: 'text-center alert alert-danger m-2', message: 'Acknowledgement failed Batch Number not found' })
                setTimeout(() => {
                    setMessage('')
                }, 5000);

            }
        })
    }
    return (
        <div>
            <h4 className='card-header text-center'>Acknowledge</h4>
            <div className='card m-2'>
                <div className='fom-group card-header text-center'>
                    <p>Any damage:</p>
                    <div className="form-check form-check-inline">
                        <input required className="form-check-input form-control" type="radio" name="damage" id="damage1" value="yes" onChange={handleChoice} />
                        <label className="form-check-label" htmlFor="damage1">Yes</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input required className="form-check-input form-control" type="radio" name="damage" id="damage2" value="no" onChange={handleChoice} />
                        <label className="form-check-label" htmlFor="damage2">No</label>
                    </div>
                </div>
                <p className={message.type}>{message.message}</p>
                <div className="card-body">{damaged === true ?
                    <Row>
                        <Col>
                            <form onSubmit={handleAddItem}>
                                <VaccinesList onChange={vaccine => setSelectedVaccine(vaccine)} dependency={message}/>
                                <div className='fom-group'>
                                    <p>Open or closed damage:</p>
                                    <div className="text-center row">
                                        <div className="col-lg-6"><input type="radio" onChange={handleRadio} id="open" name="typeOfDamage" value="yes" /><label htmlFor="open">Open</label></div>
                                        <div className="col-lg-6"><input type="radio" onChange={handleRadio} id="closed" name="typeOfDamage" value="no" /><label htmlFor="closed">Closed</label></div>
                                    </div>
                                    {openCLose === true ? <Form.Group controlId="vaccineSelectionDropdown" required>
                                        <Form.Label>Select Damage Type:</Form.Label>
                                        <Form.Control as="select" custom required {...bindDamageType} required >
                                            <option value="">None</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                        </Form.Control>
                                    </Form.Group> : openCLose === false ? <Form.Group required>
                                        <Form.Label>Select Damage Type:</Form.Label>
                                        <Form.Control as="select" custom required {...bindDamageType} required >
                                            <option value="">None</option>
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="C">C</option>
                                        </Form.Control></Form.Group> : ""}
                                </div>
                                <br /><br />
                                <div className='form-group'>
                                    <label htmlFor='quantity'>Quantity:</label>
                                    <input type='number' name='quantity' className='form-control' {...bindQuantity} required />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='batchNumber'>Batch Number</label>
                                    <input type='text' name='batchNumber' className='form-control' {...bindBatchNumber} required disabled={disabled} />
                                </div>
                                <div className='form-group'>
                                    <label htmlFor='comment'>Comments:</label>
                                    <textarea rows="3" className='form-control' name="comment" {...bindComment} required />
                                </div>
                                <div className='form-group'>
                                    <button className='btn btn-success form-control'>Add to items to report</button>
                                </div>
                            </form>
                        </Col>
                        <Col>
                            {wastageList.length > 0 ? <div><DataTables data={wastageList} type={0} />
                                <Button variant="primary" onClick={handleWatsageSubmit} disabled={disabled}>
                                    <Spinner as="span" animation={spin} size="sm" role="status" aria-hidden="true" /> Submit</Button>
                            </div>
                                : ""}
                        </Col>
                    </Row>
                    : damaged === false ?
                        <Row>
                            <Distributions/>
                        </Row>
                        : ""}
                </div>
            </div>
        </div>
    )
}

export default Acknowledge