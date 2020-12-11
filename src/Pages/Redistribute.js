import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { useInput } from '../Data/useInput';
import { Tabs, Tab, Button, Spinner } from 'react-bootstrap/'
import VaccineList from '../Components/VaccinesSelectDropDown'
import { constraintCheck } from '../Data/ConstraintCheck';
import CardComponent from '../Components/CardComponent';
let redistributionList = []
const Redistributions = (props) => {
    const config = {
        method: 'get',
        url: 'http://localhost:8765/api/redistribution',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: batchNumber, bind: bindBatchNumber, reset: resetBatchNumber } = useInput('');
    const [disabled, setDisabled] = useState(false)
    const [spin, setSpin] = useState('')
    const [message, setMessage] = useState('')
    const [Deleted, setDeleted] = useState(false)
    const [redistributionMade, setRedistributionMade] = useState(0)
    const [selectedVaccine, setSelectedVaccine] = useState('')
    const [myStock, setMyStock] = useState(null)
    const [inputError, setInputError] = useState(null)
    useEffect(() => {
        axios.get('http://localhost:8765/api/dispense', { headers: config.headers }).then(res => {
            setMyStock(res.data)
        }).catch(() => {
        })
    }, [message])
    const handleSubmit = (e) => {
        e.preventDefault()
        let quantityCheck = null
        for (const key in myStock) {
            if (myStock.hasOwnProperty(key)) {
                const element = myStock[key];
                if (element.batch_number === batchNumber) {
                    if (parseInt(element.quantity) < parseInt(quantity)) {
                        quantityCheck = 1;
                    }
                }

            }
        }
        if (!quantityCheck) {
            setInputError("")
            if (constraintCheck(redistributionList, selectedVaccine.vaccineId, quantity)) {
                redistributionList = constraintCheck(redistributionList, selectedVaccine.vaccineId, quantity)
            } else {
                redistributionList.push({
                    "vaccineName": selectedVaccine.vaccineName,
                    "vaccineid": selectedVaccine.vaccineId,
                    "batchNumber": batchNumber,
                    "vaccineQuantity": quantity
                })
            }
            document.getElementById("vaccineSelectionDropdown").value = "";
            resetQuantity()
            resetBatchNumber()
        }
        else {
            setInputError("Quantity is greater than your stock")
        }
    }
    const deleteRedistributionItem = (e) => {
        redistributionList.splice(e, 1)
        setInterval(() => {
            setDeleted(true)
        }, 50);
        setDeleted(false)
    }
    const handleApiSubmission = () => {
        setSpin('border');
        setDisabled(true);
        const data = {
            redistributionItems: JSON.stringify(redistributionList)
        }
        axios.post("http://localhost:8765/api/redistribution", data, {
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        }).then(res => {
            setDisabled(false)
            setMessage('')
            redistributionList.splice(0, redistributionList.length);
            setSpin('');
            setMessage({ message: 'Redistribution was successfully', type: 'text-center alert alert-success m-2' });
            setRedistributionMade(redistributionMade + 1)
            setTimeout(() => {
                setMessage('')
            }, 3000);

        }).catch(e => {
            if (e.response.status === 401) {
                setMessage({ message: `You are not logged in `, type: 'text-center alert alert-danger m-2' });
                setTimeout(() => {
                    window.location.reload();
                }, 4000);
            }
            else if (e.response.status === 404) {
                setMessage({ message: `Redistribution failed   vaccine with the batch number provided does not exist`, type: 'text-center alert alert-danger m-2' });
            }
            else {
                setMessage({ message: `Redistribution failed `, type: 'text-center alert alert-danger m-2' });
            }
            setSpin('');
            setDisabled(false);
            setTimeout(() => {
                setMessage('')
            }, 5000);

        })
    }
    return (
        <div>
            <h4 className='card-header text-center'>Redistribution </h4>
            <p className={message.type}>{message.message}</p>
            <div className="container-fluid my-3">
                <Tabs defaultActiveKey="redistributions" transition={false} id="noanim-tab-example">
                    <Tab eventKey="redistributions" title="Redistributions">
                        <CardComponent config={config} dependency={redistributionMade} />
                    </Tab>
                    <Tab eventKey="redistributionForm" title="Redistribution Form">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-6">
                                    <h3>Redistribution Form</h3>
                                    <form onSubmit={handleSubmit}>
                                        <VaccineList onChange={value => setSelectedVaccine(value)} disabled={disabled} dependency={redistributionMade} />
                                        <div className="form-group">
                                            <label>Batch Number:</label>
                                            <input type="text" className="form-control" placeholder="Batch number" {...bindBatchNumber} required disabled={disabled} />

                                        </div>
                                        <div className="form-group">
                                            <label>Quantity:</label>
                                            <input type="number" className="form-control" placeholder="Quantity to be returned" {...bindQuantity} required disabled={disabled} />
                                        </div>
                                        {inputError ? <p className="alert alert-danger">{inputError}</p> : ""}
                                        <button className="btn btn-primary" disabled={disabled}>Add to list</button>
                                    </form>
                                </div>{redistributionList.length > 0 ?
                                    <div className="col-6">
                                        <h3 className="my-3">Redistribution Summary</h3>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Vaccine Name</th>
                                                    <th scope="col">Vaccine  Quantity </th>
                                                    <th scope="col">Vaccine Batch Number </th>
                                                    <th scope="col">Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {redistributionList.map((key, index) => (

                                                    <tr key={index}><td>{key.vaccineName}</td><td>{key.vaccineQuantity}</td><td>{key.batchNumber}</td><td><button onClick={() => deleteRedistributionItem(index)} className="btn btn-danger" disabled={disabled}>Delete</button></td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <Button variant="primary" disabled={disabled} onClick={handleApiSubmission}>
                                            <Spinner as="span" animation={spin} size="sm" role="status" aria-hidden="true" /> Submit</Button>

                                    </div> : ""}
                            </div>
                        </div>
                    </Tab>
                </Tabs>

            </div>
        </div>
    );
}

export default Redistributions;