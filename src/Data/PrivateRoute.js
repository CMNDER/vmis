import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';
function PrivateRoute({ component: Component, ...rest }) {
    const [isTokenValid, setIsTokenValid] = useState(true);
    var config = {
        method: 'get',
        url: 'http://localhost:8765/api/auth',
        headers: {
            'auth': localStorage.getItem('vmisJwt')
        }
    };
    axios(config)
        .then(function (response) {
            if(response.data.message==='Unautorized'){
                setIsTokenValid(false);
            }
        })
        .catch(function (error) {
            console.log(error);
            setIsTokenValid(false);
        });
    return (
        <div>
            {isTokenValid ?
                <Route
                    {...rest}
                    render={props =>
                        true ? (
                            <Component {...props} />) : (
                                <Redirect to="/login" />)} /> : (window.location.reload() || localStorage.removeItem('vmisJwt'))}
        </div>
    )
}
export default PrivateRoute