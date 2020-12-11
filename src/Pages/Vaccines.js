import React, { useContext, useState } from 'react'
import { useInput } from '../Data/useInput';
import { Tabs, Tab, Row, Col, Spinner } from 'react-bootstrap'
import axios from 'axios';
import { userIntelContext } from '../App';
import VaccinesList from '../Components/VaccinesSelectDropDown';
import { Form } from 'react-bootstrap'
import VaccineForm from './VaccineForm';
var myDisplayList = [];
function Vaccines() {
    const userInfo = useContext(userIntelContext)
    const [vaccineAddition, setVaccineAddition] = useState(false)
    const [message, setMessage] = useState('')
    const [selectedVaccine, setSelectedVaccine] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { value: expirationDateValue, bind: bindExpirationDateValue, reset: resetExpirationDateValue } = useInput('');
    const { value: batchNumberValue, bind: bindBatchNumberValue, reset: resetBatchNumberValue } = useInput('');
    const { value: quantityValue, bind: bindQuantityValue, reset: resetQuantityValue } = useInput('');
    const { value: numberOfDoseValue, bind: bindNumberOfDoseValue, reset: resetNumberOfDoseValue } = useInput('');
    const { value: pcvValue, bind: bindPcvValue, reset: resetPcvValue } = useInput('');

    const [deleted, setDeleted] = useState(0)
    const [spin, setSpin] = useState('')
    const handleDelete = (e) => {
        myDisplayList.splice(e, 1)
        setInterval(() => {
            setDeleted(deleted + 1)
        }, 50);
        setDeleted(false)
    }
    const addItemOnList = (evt) => {
        evt.preventDefault();
        myDisplayList.push({
            "orgunit": userInfo.userToken.orgunit,
            "orgunitname": userInfo.userToken.orgunitname,
            "vaccineid": selectedVaccine.vaccineId,
            "vaccineName": selectedVaccine.vaccineName,
            "expirationDate": expirationDateValue,
            "vaccineQuantity": quantityValue,
            "batchNumber": batchNumberValue,
            "dose_per_vial": numberOfDoseValue,
            "vvm_status": pcvValue
        });
        document.getElementById("vaccineSelectionDropdown").value = ''
        resetBatchNumberValue();
        resetExpirationDateValue();
        resetNumberOfDoseValue();
        resetPcvValue();
        resetQuantityValue();
    }
    const handleApiSubmision = () => {
        setDisabled(true)
        setSpin('border')
        const data = JSON.stringify(myDisplayList)
        axios.post('http://localhost:8765/api/vaccines', data, {
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
                "Content-Type": "Application/Json"
            }
        }).then(res => {
            setMessage({ message: 'vacccine stock added success fully', type: 'text-center alert alert-success m-2' })
            setInterval(() => {
                setMessage('');
            }, 3000);
            myDisplayList.splice(0, myDisplayList.length);
            setDisabled(false)
            setSpin('')
        }).catch(er => {
            setMessage({ message: 'vacccine stock update failed', type: 'text-center alert alert-danger m-2' })
            setInterval(() => {
                setMessage('');
            }, 5000);
            setDisabled(false)
            setSpin('')
        })
    }
    return (
        <div>
            <h4 className='card-header text-center'>Vaccine / Users Management</h4>
            <p className={message.type}>{message.message}</p>
            <div className='container-fluid my-2'>
                <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">
                    <Tab eventKey="home" title="Vaccines">
                        <div>
                            <div className='row'>
                                <div className="col-md-4 offset-md-1">
                                    <form onSubmit={addItemOnList} autoComplete="off">

                                        <VaccinesList onChange={value => setSelectedVaccine(value)} dependency={[message,vaccineAddition]} disabled={disabled} />
                                        <div className='form-group'>
                                            <label htmlFor='expirationDate'>Expiration Date:</label>
                                            <input type='Date' name='expirationDate' className='form-control' required disabled={disabled} {...bindExpirationDateValue} />
                                        </div>
                                        <div className='fom-group'>
                                            <label htmlFor='batchNumber'>Batch number:</label>
                                            <input type='number' name='batchNumber' className='form-control' disabled={disabled} required {...bindBatchNumberValue} />
                                        </div>
                                        <div className='form-group'>
                                            <label htmlFor='quantity'>Quantity:</label>
                                            <input type='number' name='quantity' className='form-control' required disabled={disabled} {...bindQuantityValue} />
                                        </div>
                                        <Form.Group controlId="numOfDose" required>
                                            <Form.Label>Number of dose per vial::</Form.Label>
                                            <Form.Control as="select" custom disabled={disabled} required {...bindNumberOfDoseValue}>
                                                <option value="">Select one</option>
                                                <option value="2">2</option>
                                                <option value="4">4</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </Form.Control>
                                        </Form.Group>
`                                        <Form.Group controlId="numOfDose" required>
                                            <Form.Label>VVM (PCV) Status:</Form.Label>
                                            <Form.Control as="select" custom disabled={disabled} required {...bindPcvValue}>
                                                <option value="">Select one</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </Form.Control>
                                        </Form.Group>`
                                        <div className='form-group'></div>
                                        <div className='form-group'>
                                            <button className='btn btn-success form-control' type="submit" disabled={disabled} >Add vaccine stock</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-5 text-center">
                                    {myDisplayList.length > 0 ?
                                        <div>
                                            <br />
                                            <h3><u><b>List of new on vaccines</b></u></h3>
                                            <br />
                                            <br />
                                            <div>
                                                <div>
                                                    <div className='card'>
                                                        <table className="table table-striped table-bordered">
                                                            <thead>
                                                                <tr>
                                                                    <th scope="col">Vaccine name</th>
                                                                    <th scope="col">Quantity value</th>
                                                                    <th scope="col">Expiration date</th>
                                                                    <th scope="col">Batch number</th>
                                                                    <th scope="col">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {myDisplayList.map((post, index) => {
                                                                    return (
                                                                        <tr key={post}>
                                                                            <th scope="row">{post.vaccineName}</th>
                                                                            <td>{post.vaccineQuantity}</td>
                                                                            <td>{post.expirationDate}</td>
                                                                            <td>{post.batchNumber}</td>
                                                                            <button className="btn btn-danger sm" onClick={() => handleDelete(index)} disabled={disabled}>Delette</button>
                                                                        </tr>)
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <br />
                                                <button className='btn btn-success' type="submit" onClick={handleApiSubmision} disabled={disabled}><Spinner animation={spin} size="sm" />  Add vaccine Stock</button>
                                            </div>
                                        </div> : ""}
                                </div>
                            </div>
                        </div>
                    </Tab>
                    {userInfo.userToken.orgunitlevel === '1' ?
                        <Tab eventKey="profile" title="Add new vaccines">
                            <Row className="my-2">
                                <Col>
                                    <VaccineForm onSubmit={() => setVaccineAddition(true)} />
                                </Col>
                            </Row>
                        </Tab> : ""}
                </Tabs>
            </div >
        </div>
    )
}
export default Vaccines