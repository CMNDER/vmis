import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap'
import { useInput } from '../Data/useInput'
import axios from 'axios';

const VaccineForm = (props) => {
    const [message, setMessage] = useState('')
    const [disabled, setDisabled] = useState(false)
    const { value: vaccineInputShortName, bind: bindVaccineInputShortName, reset: resetVaccineInputShortName } = useInput('');
    const { value: vaccineInputName, bind: bindvVaccineInputName, reset: resetvaccineInputName } = useInput('');
    const { value: vaccineDescription, bind: bindVaccineDescription, reset: resetVaccineDescription } = useInput('');
    const [spin, setSpin] = useState('')
    const handleVaccineInputSubmit = (e) => {
        e.preventDefault();
        setSpin('border')
        setDisabled(true)
        const data = {
            "vaccineInputShortName": vaccineInputShortName.toUpperCase(),
            "vaccineInputName": vaccineInputName,
            "vaccineInputDescription": vaccineDescription,
        }
        axios.post('http://localhost:8765/api/vaccines/add', data, {
            headers: {
                "auth": localStorage.getItem("vmisJwt"),
                "Content-Type": "Application/Json"
            }
        }).then(() => {
            resetVaccineInputShortName();
            resetvaccineInputName();
            resetVaccineDescription()
            setMessage({ message: 'vacccine added success fully', type: 'alert alert-success m-2 text-center' })
            props.onSubmit(true)
            setInterval(() => {
                setMessage('');
            }, 2000);
            setSpin('')
            setDisabled(false)
        }).catch(() => {
            setMessage({ message: 'Something went wrong', type: 'alert alert-danger m-2 text-center' })
            props.onSubmit(true)
            setInterval(() => {
                setMessage('');

            }, 5000);
            setSpin('')
            setDisabled(false)
        })
    }
    return (
        <div>
            <p className={message.type}>{message.message}</p>
            <form className="col-4" onSubmit={handleVaccineInputSubmit}>
                <div className="form-group">
                    <label htmlFor="vaccineName">Vaccine short name</label>
                    <input type="text" id="vaccineName" name="vaccineShortName" required disabled={disabled} {...bindVaccineInputShortName} className="form-control" placeholder="Short Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="vaccineName"> Name in full*</label>
                    <input type="text" id="vaccineName" name="vaccineName" required disabled={disabled} {...bindvVaccineInputName} className="form-control" placeholder="Name" />
                </div>
                <div className="form-group">
                    <label htmlFor="vaccineName">Description</label>
                    <textarea id="vaccineDescription" name="vaccineDescription" required disabled={disabled} {...bindVaccineDescription} className="form-control" placeholder="Description" >
                    </textarea>
                </div>

                <button className="btn btn-primary" disabled={disabled}><Spinner animation={spin} size="sm" /> Add Vaccine</button>
            </form>
        </div>
    );
}

export default VaccineForm;