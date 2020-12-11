import React from 'react'

function NotFound() {
    return (
        <div>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <h1 className="mr-3 pr-3 align-top border-right inline-block align-content-center" style={{fontSize:'8rem'}}><b>404</b></h1>
                <div className="inline-block align-middle">
                    <h2 className="font-weight-normal lead" id="desc" style={{fontSize:'2rem'}}>The page you requested was not found.</h2>
                </div>
            </div>
        </div>
    )
}

export default NotFound
