import React, { useState } from 'react';
import axios from 'axios';
function Login(props) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isNotLoading, setIsNotLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorText, setErrorText] = useState("");
    var data = JSON.stringify({ "username": userName, "password": password });
    var config = {
        method: 'post',
        url: 'http://localhost:8765/api/auth',
        headers: {
            "auth":localStorage.getItem("vmisJwt"),
            'Content-Type': 'application/json'
        },
        data: data
    };
    function postLogin(e) {
        e.preventDefault();
        if ((userName !== null && userName !== '') && (password !== null && password !== '')) {
            setIsNotLoading(false);
            axios(config)
                .then(function (response) {
                    if (response.status === 200) {
                        localStorage.removeItem('vmisJwt');
                        localStorage.setItem('vmisJwt', response.data.token);
                        setLoggedIn(true)
                        // setIsNotLoading(true);
                    }
                    else {
                        setIsNotLoading(true);
                        setErrorText("The username or password provided are incorect!");
                        setIsError(true);
                    }
                })
                .catch(function (error) {
                    setIsNotLoading(true);
                    setErrorText("The username or password provided are incorect!");
                    setIsError(true);
                });
        }
        else {
            setErrorText("The username and password must be provided!");
            setIsError(true);
        }
    }
    if (isLoggedIn) {
        window.location.reload();
    }
    return (
        // changed the width of the container from 100vw to 102%
        <div className="container-fluid row align-items-center" style={{ backgroundColor: "#2C6693", width: "102%", height: "100vh" }}>
            <div className="offset-md-3 col-md-6" style={{ backgroundColor: "white", Padding: "10px", borderRadius: "10px" }}>
                {isNotLoading ?
                    <div>
                        <h1 className='text-center'><b><u>VMIS Login</u></b></h1>
                        <div className="form-group offset-md-3 col-md-6">
                            <div className='form-group'>
                                <label htmlFor='username' className='text-left'><b>Username:</b></label>
                                <input type='text' name='username' placeholder='Username' className='form-control' required value={userName} onChange={e => { setUserName(e.target.value); }} />
                            </div>
                            <div className='form-group'>
                                <label htmlFor='password' className='text-left'><b>Password:</b></label>
                                <input type='password' name='password' placeholder='Password' className='form-control' required value={password} onChange={e => { setPassword(e.target.value); }} />
                            </div>
                            {isError && <div className='text-danger'>{errorText}</div>}
                            <button className='btn btn-success form-control' onClick={postLogin}>Login</button>
                        </div>
                    </div>
                    : <div className="text-center">
                        <div className="spinner-border text-center" role="status" style={{ margin: "40px", borderRadius: "40px" }}>
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>}
            </div>
        </div>
    )
}
export default Login