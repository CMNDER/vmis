import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios'
import { useInput } from '../Data/useInput';
import { Spinner, Button } from 'react-bootstrap'
import { userIntelContext } from '../App';
import VaccinesList from '../Components/VaccinesSelectDropDown';
import { constraintCheck } from '../Data/ConstraintCheck';
let distributeVaccine = []
let distribution = null
function Distribute() {
    const currentOrgUnit = useContext(userIntelContext);
    const [distributionId, setDistributionId] = useState('')
    const [vaccine, setVaccine] = useState('');
    const [quantityRequested, setQuantityRequested] = useState('')
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const [inputError, setInputError] = useState('')
    const [Deleted, setDeleted] = useState(false)
    const [distributed, setDistributed] = useState(0)
    const [disabled, setDisabled] = useState(false)
    const [message, setMessage] = useState('')
    const [spin, setSpin] = useState('')
    const [requestData, setRequestData] = useState('')
    const [requestSource, setRequestSource] = useState('')
    const [requestId, setRequestId] = useState(null)
    const config = {
        method: 'get',
        url: 'http://localhost:8765/api/distribution',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };
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
        if (vaccine && quantityRequested && quantity) {
            distributeVaccine.push({
                "vaccineName": vaccine.vaccineName,
                "vaccineId": vaccine.vaccineId,
                "itemRequestedQuantity": quantityRequested,
                "itemQuatity": quantity,
            });
            setVaccine('');
            document.getElementById("vaccineSelectionDropdown").value = "";
            resetQuantity();
            setInputError('')
        }
        else {
            setInputError('No vaccine to Distribute')
        }
    }
    const deleteDistribution = (e) => {
        distributeVaccine.splice(e, 1)
        setInterval(() => {
            setDeleted(true)
        }, 50);
        setDeleted(false)
    }
    const handleApiSubmission = () => {
        setSpin('border');
        setDisabled(true);
        distribution = {
            requestReferenceId: requestId,
            distributionOriginId: currentOrgUnit.userToken.orgunit,
            distributionOriginName: currentOrgUnit.userToken.orgunitname,
            requestOriginid: requestSource.orgunitid,
            requestOriginName: requestSource.orgunitname,
            response: distributeVaccine
        }
        distributeVaccine.push()
        axios.post("http://localhost:8765/api/distribution", distribution, {
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        }).then(res => {
            // emptying the array    
            distributeVaccine.splice(0, distributeVaccine.length);
            distribution = {};
            setDisabled(false)
            setSpin('')
            setMessage({ type: 'text-center alert alert-success ', message: 'Distribution was successful' })
            setDistributionId('')
            setDistributed(Distribute + 1)
            setTimeout(() => {
                setMessage('')
            }, 5000);
        }).catch(reqError => {
            setMessage({ type: 'text-center alert alert-danger', message: 'Distribution failed Please try again later' })
            console.log(`Failed with error ${reqError}`)
            setSpin('')
            setDisabled(false)
        })
    }

    useEffect(() => {
        axios(config).then(res => {
            setRequestData(res.data)
        }).catch(() => {
        })
        return () => {

        }
    }, [message])
    return (
        <div>
            <h4 className='card-header text-center'>Distribute Vaccine</h4>
            <div className='container-fluid'>
                {<p className={message.type}>{message.message}</p>}
                {Object.keys(requestData).length>0 ?
                    < div >
                        <div className='card-body row'>
                            <div className='col-md-3 text-center'>
                                <h5 className='card-header'><b>Pending request </b></h5>
                                <div>
                                    <div>
                                        <div>
                                            {Object.keys(requestData).map((post, index) => {
                                                return (
                                                    <div key={index}>
                                                        <hr />
                                                        <div className="card" key={index}>
                                                            <div className="card-body" key={index}>
                                                                <h6 className="card-title" key={index}><b key={index}>{requestData[post][0].from_source_orgunit_name}</b></h6>
                                                                <button className="btn btn-info" onClick={() => { setDistributionId(post); distributeVaccine.splice(0, distributeVaccine.length); setMessage(''); setRequestSource({ orgunitname: requestData[post][0].from_source_orgunit_name, orgunitid: requestData[post][0].from_source_orgunit_id }); }} disabled={disabled}>Check this request</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {requestData && distributionId ? <div className="col-md-9">
                                <div className="card-body">
                                    <h3 className='card-header'><b>{requestData[distributionId][0].from_source_orgunit_name} </b></h3>
                                    <div className="row">
                                        <div className="col">
                                            <table className="table table-striped table-bordered">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Vaccine Name</th>
                                                        <th scope="col">Quantity ordered</th>
                                                        <th scope="col">Average monthly consumption</th>
                                                        <th scope="col">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {distributionId ? requestData[distributionId].map((e, i) => (
                                                        <tr key={i}><td>{e.vaccinename}</td><td> {e.quantityrequested}</td><td></td><td><button onClick={() => { vaccineHandover({ vacname: e.vaccinename, vacId: e.vaccine_uuid }); setQuantityRequested(e.quantityrequested); setRequestId(e.request_uuid) }} className="btn btn-info" disabled={disabled}>Distribute</button></td></tr>)) : ""}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="col my-2">
                                            <form onSubmit={handleAddToList} autoComplete="off">
                                                <div className='form-group'>
                                                    <h5><b>Respond Request</b></h5>
                                                    <VaccinesList onChange={value => setVaccine(value)} disabled={true} />
                                                </div>
                                                <div className='form-group'>
                                                    <label htmlFor='quantity'>Quantity:</label>
                                                    <input type='number' min='0' name='quantity' className='form-control' {...bindQuantity} required disabled={disabled} />
                                                </div>
                                                <p className="text-danger">{inputError}</p>

                                                <div className='form-group'>
                                                    <button className='btn btn-success form-control' disabled={disabled}>Add on a list  </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col">
                                    </div>
                                    {distributeVaccine.length ? <div><table className="table table-striped table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Vaccine Name</th>
                                                <th scope="col">Quantity Requested</th>
                                                <th scope="col">Quantity Distributed</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {distributeVaccine.length ? distributeVaccine.map((key, index) => (
                                                <tr key={index}><td>{key.vaccineName}</td><td>{key.itemRequestedQuantity}</td><td>{key.itemQuatity}</td><td><button onClick={() => deleteDistribution(index)} className="btn btn-danger" disabled={disabled}>Delete</button></td></tr>
                                            )) : ""}
                                        </tbody>
                                    </table>

                                        <Button variant="primary" onClick={handleApiSubmission} disabled={disabled}>
                                            <Spinner as="span" animation={spin} size="sm" role="status" aria-hidden="true" /> Submit</Button>

                                    </div> : ""}
                                </div>
                            </div> : ""}
                        </div>
                    </div> : <div className="alert alert-info">No Requests</div>}
            </div>
        </div >
    )
}

export default Distribute
