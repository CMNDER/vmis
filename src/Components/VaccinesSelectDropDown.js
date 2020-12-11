import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Form } from 'react-bootstrap'
const VaccinesList = (props) => {
    const [vaccines, setVaccines] = useState(null)

    var config = {
        method: 'get',
        url: 'http://localhost:8765/api/vaccines/',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };
    useEffect(() => {
        axios(config)
            .then(function (response) {
                setVaccines(response.data)
            })
            .catch(function (error) {
                console.log(error);
            });
        return vaccines
    }, props.dependency)
    const getSelectedText = (elementId) => {
        let elt = document.getElementById(elementId);
        if (elt.selectedIndex === -1) return null;
        return elt.options[elt.selectedIndex].text;
    };
    const handleVaccineSelect = (e) => {
        props.onChange({ vaccineId: e.target.value, vaccineName: getSelectedText("vaccineSelectionDropdown") })
    }
    return (<div className='form-group'>
        <Form.Group controlId="vaccineSelectionDropdown" required>
            <Form.Label>Select Vaccine:</Form.Label>
            <Form.Control as="select" custom required disabled={props.disabled} onChange={handleVaccineSelect}>
                <option value="">NONE</option>
                {vaccines ? vaccines.map((x, index) => <option value={vaccines[index].vaccine_uuid} key={index}>{vaccines[index].shortname}</option>) : ""}
            </Form.Control>
        </Form.Group>
    </div>);
}

export default VaccinesList;