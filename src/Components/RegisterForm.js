import React, { useState } from 'react';
import axios from 'axios';
import OrgData from './PopModalOrgUnits';
import { Spinner, Button, InputGroup, FormControl } from 'react-bootstrap';
const RegistrationForm = (props) => {
    // get the parent aorg unit
    const [selectedOrgUnit, setselectedOrgUnit] = useState("")
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [spin, setSpin] = useState('')
    const [disabled, setDisabled] = useState(false)
    const [createdUser, setCreatedUser] = useState(false)
    const formData = { username: "", name: "", surname: "", email: "", phone: "", orgunit: "",orgunitname: '', orgunitlevel: '', password: "", parentorgunit: "",parentorgunitname:""  }
    function handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (form[8].value !== form[9].value) {
            setError('password mismatch');
            form[8].value = ""
            form[9].value = ""
        }
        else {
            setError('')
            setSpin('border');
            formData.username = form[0].value; formData.name = form[1].value; formData.surname = form[2].value; formData.phone = form[3].value;
            formData.email = form[4].value; formData.password = form[8].value; formData.orgunit = selectedOrgUnit.orgUnitId; formData.orgunitlevel = selectedOrgUnit.level; formData.orgunitname = selectedOrgUnit.orgUnitName;formData.parentorgunit=selectedOrgUnit.parentOrgunit;formData.parentorgunitname=selectedOrgUnit.parentOrgunitName
            let data = null
            setDisabled(true);
            if (formData.orgunitlevel !== 1 && formData.orgunitlevel !== 4 && formData.orgunitlevel !== 6) {
                setError('Select a Sub district or hospital')
                setDisabled(false)
                setSpin('')
            }
            else {
                data = JSON.stringify(formData)
                if (data != null) {
                    axios.post("http://localhost:8765/api/users", data, {
                        headers: {
                            "auth": localStorage.getItem("vmisJwt"),
                            "Content-Type": "Application/Json"
                        }
                    }).then(results => {
                        setCreatedUser(true)
                        props.onChange(createdUser)
                        setSpin('')
                        setDisabled(false);
                        form[0].value = ''; form[1].value = ''; form[2].value = ''; form[3].value = ''; form[4].value = ''; form[5].value = ''; form[6].value = ''; form[7].value = ''; form[8].value = ''; form[9].value = '';
                        setselectedOrgUnit("")
                        setMessage('User created successfuly')
                        setInterval(() => {
                            setMessage('')
                        }, 5000);
                    }).catch(e => {
                        if (e.response.status === 409) {
                            setError("username is taken please try another one")
                        }
                        setSpin('')
                        setDisabled(false);
                    })
                }
            }
        }
    }
    return (
        <div>
            <div >
                <div className=''>
                    <div style={{ padding: "5px" }}>
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <div className="row">
                                <div className="col">
                                    <input disabled={disabled} type="text" className="aformControl m-3 p-2" name="username" required placeholder="Username" />
                                </div>
                                <div className="col">
                                    <input disabled={disabled} type="text" className="aformControl m-3 p-2" name="name" required placeholder="Name" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input disabled={disabled} type="text" className="aformControl m-3 p-2" name="surname" required placeholder="Surname" />
                                </div>
                                <div className="col">
                                    <input disabled={disabled} type="number" className="aformControl m-3 p-2" name="phone" required placeholder="Phone Number" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input disabled={disabled} type="email" className="aformControl m-3 p-2" name="email" required placeholder="email" />
                                </div>
                                <div className="col">
                                    <InputGroup>
                                        <InputGroup.Prepend><OrgData onChange={value => setselectedOrgUnit(value)} btnName="Select site" btnColor="warning" delete={true}/></InputGroup.Prepend>
                                        <FormControl type="text" readOnly value={selectedOrgUnit.orgUnitName} className="col-9" />
                                    </InputGroup>
                                    <input type="hidden" className="formControl" id="myOrgInput" value={selectedOrgUnit} name="orgUnit" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <input disabled={disabled} type="password" className="aformControl m-3 p-2" name="password" required placeholder="Password" />
                                </div>
                                <div className="col">
                                    <input disabled={disabled} type="password" className="aformControl m-3 p-2" required placeholder="Comfirm Password" />
                                </div>
                            </div>
                            {error?<p className="text-center m-2 alert alert-danger">{error}</p>:""}
                            {message?<p className="ttext-center m-2 alert alert-success">{message}</p>:""}
                            <Button variant="primary" id="mySubmitBtn" type="submit" disabled={disabled}>
                                <Spinner as="span" animation={spin} size="sm" role="status" aria-hidden="true" /> Create user</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistrationForm;