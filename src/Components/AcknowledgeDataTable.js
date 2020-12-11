import React from 'react';
import { Table } from 'react-bootstrap';

const DataTables = (props) => {
    return (
        <div >
            <h5>Selected Items</h5>
            {props.type === 0 ?
                <Table striped bordered hover size="sm" responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Vaccine</th>
                            <th>Quantity</th>
                            <th>Damage Type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(props.data).map((key, index) => (
                            <tr key={index}><td>{index + 1}</td>
                                <td key={index}>{props.data[key].vaccineName}</td><td>{props.data[key].vaccineQuantity}</td><td>{props.data[key].vaccineDamageType}</td></tr>
                        ))
                        }
                    </tbody>
                </Table>
                : props.type === 1 ?
                    <Table striped bordered hover size="sm" responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Vaccine</th>
                                <th>Quantity</th>
                                <th>Pcv Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(props.data).map((key, index) => (
                                <tr key={index}><td>{index + 1}</td>
                                    <td key={index}>{props.data[key].vaccineName}</td><td>{props.data[key].vaccineQuantity}</td><td>{props.data[key].pcvStatus}</td>
                                </tr>
                            ))
                            }

                        </tbody>
                    </Table>
                    : ""}
        </div>
    );
}

export default DataTables;