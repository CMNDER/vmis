import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'
import { useInput } from '../Data/useInput';
import Image from '../MediaFiles/pevSmall.png'
import { userIntelContext } from '../App';
import { Tabs, Tab, Card, Table } from 'react-bootstrap/'
import { DateParser } from '../Data/Date';
import VaccinesList from '../Components/VaccinesSelectDropDown';
import { Form } from 'react-bootstrap'
import { constraintCheck } from '../Data/ConstraintCheck';
let vaccineRequest = [];
function Request() {
    const userInfo = useContext(userIntelContext)
    const [disabled, setDisabled] = useState(false)
    const [changeView, setChangeView] = useState(false);
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: child, bind: bindChild, reset: resetChild } = useInput('');
    const [selectedVaccine, setSelectedVaccine] = useState('')
    const [requestMade, setRequestMade] = useState(0)
    const [message, setMessage] = useState('')
    const [myRequests, setMyRequests] = useState('')
    const [dateOfRequest, setDateOfRequest] = useState(null)
    let config = null;
    function changeViewPort() {
        return setChangeView(true);
    }
    const handleSubmit = (evt) => {
        evt.preventDefault();
        if (constraintCheck(vaccineRequest, selectedVaccine.vaccineId, quantity)) {
            vaccineRequest = constraintCheck(vaccineRequest, selectedVaccine.vaccineId, quantity)
        }
        else {
        vaccineRequest.push({
            "vaccineName": selectedVaccine.vaccineName,
            "vaccineid": selectedVaccine.vaccineId,
            "vaccineQuantity": quantity,
            "childVaccinated": child,
            "currentStock": (quantity * 100) % 7
        });
    }
        document.getElementById("vaccineSelectionDropdown").value = ""
        resetQuantity();
        resetChild();
    }
    if (dateOfRequest) {
        config = {
            method: 'post',
            url: 'http://localhost:8765/api/request/filter',
            data: { requestDate: dateOfRequest },
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
            },
        };
    } else {
        config = {
            method: 'get',
            url: 'http://localhost:8765/api/request',
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
            },
        };
    }
    const handleApiSubmition = () => {
        setDisabled(false)
        const vaccineRequestedApi = {
            requestFromOrgUnitId: userInfo.userToken.orgunit,
            requestFromOrgUnitName: userInfo.userToken.orgunitname,
            requestToOrgUnitId: userInfo.userToken.parentorgunit,
            requestToOrgUnitName: userInfo.userToken.parentorgunitname,
            date: DateParser(),
            requestedItems: vaccineRequest
        }
        if (vaccineRequestedApi) {
            const data = JSON.stringify(vaccineRequestedApi)
            axios.post('http://localhost:8765/api/request', data, {
                headers: {
                    "auth": localStorage.getItem("vmisJwt"),
                    "Content-Type": "Application/Json"
                }
            }).then(() => {
                vaccineRequest.splice(0, vaccineRequest.length);
                setMessage({ message: 'Request sent successfully', code: 'text-center text-success' })
                setDisabled(true)
                setRequestMade(requestMade + 1)
                setInterval(() => {
                    setMessage('');

                }, 3000);
            }).catch(() => {
                setMessage({ message: 'Request could not be sent please try again later', code: 'text-center text-danger' })
                setInterval(() => {
                    setMessage('');
                }, 5000);
            })
        }
    }
    useEffect(() => {
        axios(config).then(res => {
            setMyRequests(res.data)
        }).catch(error => {
            console.log(error)
        })
    }, [requestMade, dateOfRequest])
    return (
        <div>
            <h4 className='card-header text-center'>Request Vaccine</h4>
            <div className="m-3">
                <Tabs defaultActiveKey="request" transition={false} id="noanim-tab-example">
                    <Tab eventKey="request" title="Requests">
                        <div className="my-3">
                            <Form.Group controlId="dor" className="col-4">

                                <Form.Label>Select Date</Form.Label>

                                <Form.Control type="date" name="dob" placeholder="Date of Birth" onChange={(e) => setDateOfRequest(e.target.value)} />

                            </Form.Group>
                            {myRequests && Object.keys(myRequests).length > 0 ? Object.keys(myRequests).map((key, index) => {
                                return (
                                    <Card style={{ width: '18rem' }} className="m-1" key={index}>
                                        <Card.Header className={myRequests[key][0].status === "APPROVED" ? "bg-success text-center text-light font-weight-bolder" : "bg-warning text-center text-light font-weight-bold"}>{myRequests[key][0].status}</Card.Header>
                                        <Card.Body>
                                            <Card.Title className="text-center h6">Made on: {DateParser(myRequests[key][0].date)}</Card.Title>
                                            <Table responsive size="sm" key={index}>
                                                <thead>
                                                    <tr>
                                                        <th>Vaccine</th>
                                                        <th>Quantity</th>
                                                        <th>Quantity Requested</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {myRequests[key].map((key1, index1) => {
                                                        return (<tr key={index1}><td>{key1.vaccinename}</td><td>{key1.quantityrequested}</td><td>{key1.quantity_supplied}</td></tr>)
                                                    })}
                                                </tbody>
                                            </Table>
                                        </Card.Body>
                                    </Card>
                                )
                            }) : <div className="alert alert-info">No request made yet</div>}

                        </div>
                    </Tab>
                    <Tab eventKey="requestmake" title="Make a request">

                        <div className='container-fluid'>
                            {changeView ?
                                <div className="card-body">
                                    <div className='text-center'>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <h2>Republic of Rwanda</h2>
                                                <h2>Ministry of Health</h2>
                                            </div>
                                            <div className='col-md-4'>
                                                <img src={Image} alt='myIg' /><br />
                                                <b>PEV/EPI</b>
                                            </div>
                                            <div className='col-md-4'>
                                                <b><h3>Date: {DateParser()}</h3></b>
                                            </div>
                                        </div>
                                        <div className='alert alert-primary'>
                                            <h3><b><u>VACCINE ORDER FORM</u></b></h3>
                                        </div>
                                        <div>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th scope="col">Children vaccinated last month</th>
                                                        <th scope="col">No. of doses in stock</th>
                                                        <th scope="col">Quantity ordered in doses</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {vaccineRequest.map((post, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <th scope="row">{post.vaccineName}</th>
                                                                <td>{post.childVaccinated}</td>
                                                                <td>{post.currentStock}</td>
                                                                <td>{post.vaccineQuantity}</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            <p className={message.code}>{message.message}</p>
                                            <button className='btn btn-success' onClick={() => handleApiSubmition()} disabled={disabled}>Submit</button>
                                        </div>
                                    </div>
                                </div> :
                                <div>
                                    <div className='card-body row offset-md-1'>
                                        <form className='col-md-5' onSubmit={handleSubmit} autoComplete="off">
                                            <div className="">
                                                <VaccinesList onChange={value => setSelectedVaccine(value)} disabled={disabled} dependency={requestMade}/>
                                                <div className='form-group'>
                                                    <label>Children vaccinated last month:</label>
                                                    <input type='number' name='child' min='0' className='form-control' placeholder='Number of children vaccinated last month' {...bindChild}  required/>
                                                </div>
                                                <div className='form-group'>
                                                    <label>Quantity:</label>
                                                    <input type='number' min='1' name='quantity' className='form-control' placeholder='Quantity of needed item' {...bindQuantity} required/>
                                                </div>
                                                <div className='form-group'>
                                                    <input type="submit" value="Add on a list" className='btn btn-success form-control' />
                                                </div>
                                            </div>
                                        </form>
                                        <div className='col-md-6 offset-md-1 text-center'>
                                            {vaccineRequest.length > 0 ?
                                                <div>
                                                    <br />
                                                    <h3><u><b>List of items on request</b></u></h3>
                                                    <br />
                                                    <br />
                                                    <div>
                                                        <div>
                                                            <div className='card'>
                                                                <table className="table table-striped table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col">Vaccine name</th>
                                                                            {/* <th scope="col">Current Stock</th> */}
                                                                            <th scope="col">Requested</th>
                                                                            <th scope="col">Last month usage</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {vaccineRequest.map(post => {
                                                                            return (
                                                                                <tr>
                                                                                    <th scope="row">{post.vaccineName}</th>
                                                                                    {/* <td>{post.currentStock}</td> */}
                                                                                    <td>{post.vaccineQuantity}</td>
                                                                                    <td>{post.childVaccinated}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <br />
                                                        <button className='btn btn-success form-control' onClick={changeViewPort}>Submit request  </button>
                                                    </div>
                                                </div> : ""}
                                        </div>
                                    </div>
                                </div>}
                        </div>
                    </Tab>
                </Tabs>
            </div>
        </div >
    )
}

export default Request
