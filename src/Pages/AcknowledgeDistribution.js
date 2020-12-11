import React, { useState } from 'react';
import axios from 'axios';
import { Spinner, Button, Form, Row, Col, Card } from 'react-bootstrap'
import { useInput } from '../Data/useInput';
import VaccinesList from '../Components/VaccinesSelectDropDown'
import { HttpRequests } from '../Data/HttpRequest';
import { DateParser } from '../Data/Date'
let acknowledgementList = []
const Distributions = (props) => {
    const [message, setMessage] = useState('')
    const [distributionId, setDistributionId] = useState(null)
    const [vaccine, setVaccine] = useState('');
    const [disabled, setDisabled] = useState(false)
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: batchNumber, bind: bindBatchNumber, reset: resetBatchNumber } = useInput('');
    const { value: pcvValue, bind: bindPcvValue, reset: resetPcvValue } = useInput('');
    const { value: comments, bind: bindComments, reset: resetComments } = useInput('');
    const [inputError, setInputError] = useState(null)
    const [spin, setSpin] = useState(null)
    const [Deleted, setDeleted] = useState(0)
    const [date, setDate] = useState(null)
    const [quantityLimit, setQuantityLimit] = useState(null)
    const [acknowledged, setAcknowledged] = useState(0)
    const getDistributionConfig = {
        method: 'get',
        url: 'http://localhost:8765/api/distribution/acknowledge',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };
    let distributionData = HttpRequests(getDistributionConfig, acknowledged)
    const vaccineHandover = (vac) => {
        const mySelectElement = document.getElementById("vaccineSelectionDropdown");
        mySelectElement.value = vac.vacId
        mySelectElement.dispatchEvent(
            new MouseEvent('change', {
                bubbles: true,
                cancelable: true,
                view: window,
            }));
    }
    const handleAddToList = (evt) => {
        evt.preventDefault();
        if (vaccine && quantity) {
            if (quantity <= quantityLimit) {
                acknowledgementList.push({
                    "vaccineName": vaccine.vaccineName,
                    "vaccineid": vaccine.vaccineId,
                    "batchNumber": batchNumber,
                    "vaccineQuantity": quantity,
                    "pcvStatus": pcvValue,
                    "comment": comments
                });
                setVaccine('');
                document.getElementById("vaccineSelectionDropdown").value = "";
                resetQuantity();
                resetBatchNumber()
                resetComments()
                resetPcvValue()
                setInputError('')
            } else {
                setInputError('Quantity is not valid')
            }
        }
        else {
            setInputError('No vaccine to Distribute')
        }
    }
    const deleteAcknowledgement = (e) => {
        acknowledgementList.splice(e, 1)
        setTimeout(() => {
            setDeleted(true)
        }, 50);
        setDeleted(false)
    }
    const handleApiSubmission = (e) => {
        setSpin('border')
        setDisabled(true)
        const acknowledgeConfig = {
            method: 'post',
            url: 'http://localhost:8765/api/acknowledge',
            data: { distribution: distributionId, acknowledgedItems: acknowledgementList },
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        }
        axios(acknowledgeConfig).then(() => {
            setSpin('');
            setDisabled(false)
            setMessage({ type: 'text-center alert alert-success', message: 'Acknowledge was successful' })
            setAcknowledged(acknowledged + 1)
            acknowledgementList.splice(0, acknowledgementList.length)
            setDistributionId(null)
            setInterval(() => {
                setMessage('')
            }, 5000);
        }).catch(error => {
            setSpin('');
            setDisabled(false);
            if (error.response.status === 404) {
                setMessage({ type: 'text-center alert alert-danger', message: 'Acknowledge was not successful batch number not found' })
                setTimeout(() => {
                    setMessage('')
                }, 5000);
            } else if (error.response.status === 500) {
                setMessage({ type: 'text-center alert alert-danger', message: 'Acknowledge was not successful' })
                setTimeout(() => {
                    setMessage('')
                }, 5000);
            }


        })
    }
    return (<div>
        {<p className={message.type}>{message.message}</p>}
        <Row>
            {distributionData !== undefined && Object.keys(distributionData.data).length > 0 ? <Col>
                {Object.keys(distributionData.data).map((key, index) => (
                    <Card key={index} className="my-2">
                        <Card.Header>Date {DateParser(distributionData.data[key][0].date)}</Card.Header>
                        <Card.Body>
                            <button className={key === distributionId ? "btn btn-success" : "btn btn-info"} onClick={() => ([setDistributionId(key), setDate(DateParser(distributionData.data[key][0].date))])}>Acknowledge</button>
                        </Card.Body>
                    </Card>
                ))}

            </Col> : distributionData !== undefined && distributionData.loading ? <Col><Spinner animation={"border"} /></Col> : distributionData !== undefined && distributionData.error ? <Col><div className="alert alert-danger">Something went wrong</div></Col> : <Col><div className="alert alert-info">No un Acknowledged Distribution</div></Col>}
            {distributionId ?
                <Col><table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>Vaccine</th>
                            <th>Quantity Requested</th>
                            <th>Quantity Supplied</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {distributionData !== undefined && Object.keys(distributionData.data).length > 0 ? distributionData.data[distributionId].map((key, index) => (
                            < tr key={index} ><td>{key.shortname}</td><td>{key.quantity_requested}</td><td>{key.quantity_supplied}</td><td><Button onClick={() => { vaccineHandover({ vacname: key.shortname, vacId: key.vaccine_uuid }); setQuantityLimit(key.quantity_supplied) }}>Acknowledge</Button></td></tr>
                        )) : ""}</tbody></table>
                    {acknowledgementList.length > 0 ? <div><table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Vaccine</th>
                                <th>Quantity Acknowledged</th>
                                <th>Batch Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {acknowledgementList.map((key, index) => (
                                <tr key={index}><td>{key.vaccineName}</td><td>{key.vaccineQuantity}</td><td>{key.batchNumber}</td><td><Button onClick={deleteAcknowledgement} variant="danger">Delete</Button></td></tr>
                            ))}</tbody></table><Button className="btn-block" onClick={handleApiSubmission} disabled={disabled}><Spinner animation={spin} size="sm" /> Acknowledge Distribution</Button> </div> : ""}
                </Col>
                : ""}
            {distributionId ? <Col md={4}><div>
                <form onSubmit={handleAddToList} autoComplete="off">
                    <div className='form-group'>
                        <h5><b>Acknowledge {date} </b></h5>
                        <VaccinesList onChange={value => setVaccine(value)} disabled={true} dependency={Deleted} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='quantity'>Quantity:</label>
                        <input type='number' min='0' name='quantity' className='form-control' {...bindQuantity} required disabled={disabled} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='quantity'>Batch Number:</label>
                        <input type='number' min='0' name='batchNumber' className='form-control' {...bindBatchNumber} required disabled={disabled} />
                    </div>
                    <Form.Group controlId="numOfDose" required>
                        <Form.Label>VVM (PCV) Status:</Form.Label>
                        <Form.Control as="select" custom disabled={disabled} required {...bindPcvValue}>
                            <option value="">Select one</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                        </Form.Control>
                    </Form.Group>
                    <div className='form-group'>
                        <label htmlFor='quantity'>Comment:</label>
                        <textarea type='number' min='0' name='comment' className='form-control' {...bindComments} required disabled={disabled} ></textarea>
                    </div>
                    <p className="text-danger">{inputError}</p>

                    <div className='form-group'>
                        <button className='btn btn-success form-control' disabled={disabled}>Add on a list  </button>
                    </div>
                </form>
            </div>
            </Col> : ""}
        </Row>
    </div >)
}

export default Distributions;