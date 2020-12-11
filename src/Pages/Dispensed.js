import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Spinner, Button } from 'react-bootstrap'
import { useInput } from '../Data/useInput'
import { userIntelContext } from '../App'
const dispensedItems = []
function Dispensed() {
    const user = useContext(userIntelContext)
    const getStockConfig = {
        method: 'get',
        url: 'http://localhost:8765/api/dispense',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };
    var UpdateStockConfig = {
        method: 'put',
        url: getStockConfig.url,
        data: {
            orgunitId: user.userToken.orgunit,
            orgunitName: user.userToken.orgunitname,
            vaccineItems: dispensedItems
        },
        headers: getStockConfig.headers
    };
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState(null)
    const { value: child, bind: bindChild, reset: resetChild } = useInput('');
    const { value: quantity, bind: bindQuantity, reset: resetQuantity } = useInput('');
    const { value: vaccine, bind: bindVaccine, reset: resetVaccine } = useInput('');
    const [inputError, setInputError] = useState('')
    const [deleted, setDeleted] = useState(0)
    const [spin, setSpin] = useState('')
    const [currentStock, setCurrentStock] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [batchNumber, setBatchNumber] = useState('')
    const getSelectedText = (elementId) => {
        let elt = document.getElementById(elementId);
        if (elt.selectedIndex === -1) return null;
        return elt.options[elt.selectedIndex].text;
    };
    useEffect(() => {
        setDisabled(true)
        axios(getStockConfig).then(res => {
            setCurrentStock(res.data)
            setDisabled(false)
        }).catch((e) => console.log("no stock "))
    }, [message])
    const handleSubmit = (e) => {
        let error = null
        e.preventDefault()
        for (let i in currentStock) {
            if (currentStock[i].vaccineid === vaccine) {
                if (quantity > currentStock[i].quantity) {
                    error = 1
                }
                setBatchNumber(currentStock[i].batch_number)
            }
        }
        if (!error) {
            dispensedItems.push({ "vaccineName": getSelectedText("vaccineSelectionDropdown"), "vaccineid": vaccine, "childVaccined": child, "stockQuantityDispensed": quantity, "batchNumber": batchNumber });
            setShow(true)
            resetChild()
            resetQuantity()
            setInputError('')
            resetVaccine('')
        }
        else {
            setInputError("The Quantity specified can not be bigger than stock")
            setInterval(() => {
                error = null
            }, 1000);
        }
    }

    const handleDelete = (e) => {
        dispensedItems.splice(e, 1)
        setInterval(() => {
            setDeleted(deleted + 1)
        }, 50);
        setDeleted(false)
    }
    const handleApiSubmission = () => (
        [setDisabled(true), setSpin('border'),

        axios(UpdateStockConfig).then(res => {
            setDisabled(false)
            setShow(false);
            setSpin('');
            setMessage({ message: "Dispensed Successfully", type: "alert alert-success m-2 text-center"})
            dispensedItems.splice(0, dispensedItems.length);
            setTimeout(() => {
                setMessage(null)
            }, 2000);
        }).catch(error => {
            setSpin('');
            setDisabled('')
            setMessage({ message: "Dispense failed try again later", type: "alert alert-danger m-2 text-center" })
        }),
        Dispensed.current = true
        ])
    return (
        <div>
            <h4 className="card-header text-center">Dispensed Vaccines</h4>
            <div className="container-fluid">
                {message?<p className={message.type}>{message.message}</p>:""}
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-5">
                            <h3 className="text-title">Current Stock</h3>
                            <table className="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">Vaccine Name</th>
                                        <th scope="col">Vaccine Stock Quantity </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.keys(currentStock).map(key => (
                                        <tr key={key}><td key={key[0]}>{currentStock[key].shortname}</td><td>{currentStock[key].quantity}</td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="col">
                            <form onSubmit={handleSubmit} autoComplete="off">
                                <div className='form-group'>
                                    <label htmlFor='vaccineSelection'>Select Vaccine:</label>
                                    <select name="vaccineSelection" className='form-control' id="vaccineSelectionDropdown" required disabled={disabled} {...bindVaccine} >
                                        <option value="">None</option>
                                        {currentStock ? currentStock.map((x, index) => <option value={currentStock[index].vaccine_uuid} key={index}>{currentStock[index].shortname}</option>) : ""}
                                    </select>
                                </div>
                                <div className='form-group'>
                                    <label>Children vaccinated last month:</label>
                                    <input type='number' name='child' className='form-control p-4' min='0' required disabled={disabled} placeholder='Number of children vaccinated last month' {...bindChild} />
                                </div>
                                <div className='form-group'>
                                    <label>Quantity of Vaccine to be dispensed:</label>
                                    <input type='number' name='quantity' className='form-control p-4' min='1' required disabled={disabled} {...bindQuantity} placeholder='Quantity of needed Vaccine' />
                                </div>
                                <p className="text-danger">{inputError}</p>
                                <button className="btn btn-success">Add to list</button>
                            </form>
                        </div>
                    </div>
                    {show && dispensedItems.length > 0 ? <div className="row">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Vaccine Name</th>
                                    <th scope="col">Children Vaccinated </th>
                                    <th scope="col">Vaccine Stock Quantity </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dispensedItems.map((key, index) => (
                                    <tr key={key}><td key={key}>{key.vaccineName}</td><td>{key.childVaccined}</td><td>{key.stockQuantityDispensed}</td><td><Button variant="danger" onClick={() => handleDelete(index)} disabled={disabled}>Delete</Button></td></tr>
                                ))}
                            </tbody>
                        </table>
                        <Button variant="primary" id="mySubmitBtn" onClick={handleApiSubmission} disabled={disabled}>
                            <Spinner as="span" animation={spin} size="sm" role="status" aria-hidden="true" /> Submit</Button>

                    </div> : ""}
                </div>
            </div>
        </div>
    )
}

export default Dispensed
