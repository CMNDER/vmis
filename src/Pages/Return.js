import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios'
import { useInput } from '../Data/useInput';
import { Tabs, Tab, Button, Spinner } from 'react-bootstrap/'
import VaccineList from '../Components/VaccinesSelectDropDown'
import { constraintCheck } from '../Data/ConstraintCheck';
import { userIntelContext } from '../App';
import CardComponent from '../Components/CardComponent';
let returnList = []
const Return = (props) => {
    var config = {
        method: 'get',
        url: 'http://localhost:8765/api/return',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };

    const user = useContext(userIntelContext)
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: batchNumber, bind: bindBatchNumber, reset: resetBatchNumber } = useInput('');
    const [disabled, setDisabled] = useState(false)
    const [spin, setSpin] = useState('')
    const [message, setMessage] = useState('')
    const [Deleted, setDeleted] = useState(false)
    const [returnMade, setReturnMade] = useState(0)
    const [myStock, setMyStock] = useState(null)
    const [selectedVaccine, setSelectedVaccine] = useState('')
    const [inputError, setInputError] = useState(null)
    useEffect(() => {
        axios.get('http://localhost:8765/api/dispense', { headers: config.headers }).then(res => {
            setMyStock(res.data)
        }).catch(() => {
        })
    }, [returnMade])
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
            if (constraintCheck(returnList, selectedVaccine.vaccineId, quantity)) {
                returnList = constraintCheck(returnList, selectedVaccine.vaccineId, quantity)
            } else {
                returnList.push({
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
    const deleteReturn = (e) => {
        returnList.splice(e, 1)
        setInterval(() => {
            setDeleted(true)
        }, 50);
        setDeleted(false)
    }
    const handleApiSubmission = () => {
        setSpin('border');
        setDisabled(true);
        const data = {
            from_orgunitid: user.userToken.orgunit,
            from_orgunitname: user.userToken.orgunitname,
            to_orgunitid: user.userToken.parentorgunit,
            to_orgunitname: user.userToken.parentorgunitname,
            returnedItems: JSON.stringify(returnList)
        }
        axios.post("http://localhost:8765/api/return", data, {
            headers: {
                'auth': localStorage.getItem('vmisJwt')
            }
        }).then(res => {
            setDisabled(false)
            setMessage('')
            returnList.splice(0, returnList.length);
            setSpin('');
            setMessage({ message: 'Return was successfully', type: 'text-center alert alert-success m-2' });
            setReturnMade(returnMade + 1)
            setTimeout(() => {
                setMessage('')
            }, 3000);

        }).catch(e => {
            if (e.response.status === 400) {
                setMessage({ message: `Return failed vaccine with the batch number provided does not exist `, type: 'text-center alert alert-danger m-2' });

            }
            else {
                setMessage({ message: `Return failed `, type: 'text-center alert alert-danger m-2' });
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
            <h4 className='card-header text-center'>Return </h4>
            <p className={message.type}>{message.message}</p>
            <div className="container-fluid my-3">
                <Tabs defaultActiveKey="returns" transition={false} id="noanim-tab-example">
                    <Tab eventKey="returns" title="Returns">
                        <CardComponent dependency={returnMade} config={config} />
                    </Tab>
                    <Tab eventKey="returnForm" title="Return Form">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-6">
                                    <h3>Return Form</h3>
                                    <form onSubmit={handleSubmit}>
                                        <VaccineList onChange={value => setSelectedVaccine(value)} disabled={disabled} dependency={returnMade}/>
                                        <div className="form-group">
                                            <label>Batch Number:</label>
                                            <input type="text" className="form-control" placeholder="Batch number" {...bindBatchNumber} required disabled={disabled} />

                                        </div>
                                        <div className="form-group">
                                            <label>Quantity:</label>
                                            <input type="number" className="form-control" placeholder="Quantity to be returned" {...bindQuantity} required disabled={disabled} />
                                        </div>
                                        <p className="text-danger">{inputError ? inputError : ""}</p>
                                        <button className="btn btn-primary" disabled={disabled}>Add to list</button>
                                    </form>
                                </div>{returnList.length > 0 ?
                                    <div className="col-6">
                                        <h3 className="my-3">Return Summary</h3>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Vaccine Name</th>
                                                    <th scope="col">Vaccine  Batch Number </th>
                                                    <th scope="col">Vaccine  Quantity </th>
                                                    <th scope="col">Action </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {returnList.map((key, index) => (

                                                    <tr key={index}><td>{key.vaccineName}</td><td>{key.batchNumber}</td><td>{key.vaccineQuantity}</td><td><button onClick={() => deleteReturn(index)} className="btn btn-danger" disabled={disabled}>Delete</button></td></tr>
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

export default Return;