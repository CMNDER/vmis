import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { DateParser } from '../Data/Date';
const CardComponent = (props) => {
    const [data, setData] = useState(null);
     
    useEffect(() => {
        axios(props.config).then(res =>{
            setData(res.data)
        }
        ).catch(()=>{
            console.log("something is wrong")
        })
    }, [props.dependency,props.config])
    return (
        <div className="my-2">
            {data && data.length>0 ?
                Object.keys(data).map((key, index) => {
                    return (
                        <Card style={{ width: '18rem' }} className="m-2" key={index}>
                            <Card.Header className="bg-info text-center font-weight-bold text-light">On {DateParser(data[key][0].date)}</Card.Header>
                            <Card.Body className="p-0">
                                <Table responsive size="md" key={index} striped bordered hover style={{ margin: "0px" }}>
                                    <thead>
                                        <tr>
                                            <th>Vaccine</th>
                                            <th>Batch Number</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data[key].map((key1, index1) => {
                                            return (<tr key={index1}><td>{key1.shortname}</td><td>{key1.batch_number}</td><td>{key1.quantity}</td></tr>)
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    )
                })
                : <div className="alert alert-info text-center">Nothing to show</div>}
        </div>
    );
}

export default CardComponent;