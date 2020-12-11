import React, { useState } from 'react';
import {Tabs,Tab,Row,Col} from 'react-bootstrap'
import DataTables from '../Components/DataTables';
import RegistrationForm from '../Components/RegisterForm';
const Users = () => {
    const [change, setChange] = useState('')
    return (
        <div>
        <h4 className='card-header text-center'>Users Management</h4>
        <div className='container-fluid my-2'>
            <Tabs defaultActiveKey="home" transition={false} id="noanim-tab-example">
                <Tab eventKey="home" title="Users">
                <Row className="my-2">
                <Col><DataTables dependency={change}/></Col>
                </Row>
                </Tab>
                <Tab eventKey="profile" title="Add User">
                    <Row className="my-2">
                        <Col md={7}><RegistrationForm onChange={value=>setChange(value)}/></Col>
                        </Row>
                    </Tab>
            </Tabs>

        </div >
    </div>
    );
}
 
export default Users;