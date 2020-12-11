import React, { useEffect, useState } from 'react';
import axios from 'axios'
import { Row, Col, Table, Spinner } from 'react-bootstrap';
const DataTables = (props) => {
    const url = "http://localhost:8765/api/users"
    const token = localStorage.getItem("vmisJwt")
    const [data, setData] = useState({ data: null, loading: false, error: false })
    const [q, setQ] = useState("")
    useEffect(() => {
        axios.get(url, {
            headers: {
                "auth": token
            }
        }).then(res => {
            if (res.data !== null) {
                setData({
                    data: res.data,
                    loading: false,
                    error: false
                })
            }
        }).catch(() => {
            setData({
                data: null,
                loading: false,
                error: true
            })
        })
    },[props.dependency,token])

    let searchQ = null
    const searchQuery = (rows) => (rows !== null ? rows.filter((row) => (row.username.toLowerCase().indexOf(q) > -1) || (row.email.toLowerCase().indexOf(q) > -1)|| (row.orgunitname.toLowerCase().indexOf(q) > -1)) : "No User Found");
    if (data.data) {
        searchQ = searchQuery(data.data)
    }
    if (data.loading) {
        return (
            <div className="offset-5">
                <Spinner as="span" animation={'border'} size="md" role="status" aria-hidden="true" />
            </div>
        )
    }
    if (data.error) {
        return (
            <div className="offset-5">
                <div className="alert alert-danger">Something went wrong</div>
            </div>
        )
    }
    return (
        <div>
            <Row>
                <Col>
                    <div className="form-group">
                        <input type="text" placeholder="Search" className="form-control" onChange={(e) => setQ(e.target.value)} />
                    </div>
                    <Table striped bordered hover size="md" responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Organisation Unit</th>
                                <th>Parent Organisation Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchQ ?
                                Object.keys(searchQ).map((key, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td key={index}>{searchQ[key].username}</td><td>{searchQ[key].email}</td><td>{searchQ[key].orgunitname}</td>
                                        <td>{searchQ[key].parentorgunitname}</td>
                                        </tr>
                                ))
                                : ""}</tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
}

export default DataTables;