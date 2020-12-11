import React from 'react'

function PendingRequest() {
    const pendingRequest = [
        {
            "requestTitle": "Vaccine request",
            "requestOrigin": " From Masaka Hospital",
            "request": {
                "BSG": "30",
                "DMR": "490",
                "IPV": "70",
                "VAT": "900",
                "DBCG": "805"
            }
        },
        {
            "requestTitle": "Item request",
            "requestOrigin": "From Kibagabaga Hospital",
            "request": {
                "BSG": "100",
                "DMR": "40",
                "IPV": "810",
                "VAT": "600",
                "DBCG": "50"
            }
        },
        {
            "requestTitle": "Item Request",
            "requestOrigin": "From Masaka Hospital",
            "request": {
                "BSG": "50",
                "DMR": "190",
                "IPV": "74",
                "VAT": "50",
                "DBCG": "800"
            }
        },
        {
            "requestTitle": "Vaccine Request",
            "requestOrigin": "From CHU/K",
            "request": {
                "BSG": "300",
                "DMR": "250",
                "IPV": "70",
                "VAT": "90",
                "DBCG": "500"
            }
        },
        {
            "requestTitle": "Vaccine Request",
            "requestOrigin": "From Gahini Hospital",
            "request": {
                "BSG": "125",
                "DMR": "10",
                "IPV": "80",
                "VAT": "150",
                "DBCG": "1000"
            }
        },
    ]
    return (
        <div>
            <div>
                <div >

                    {pendingRequest.map((post, key) => {

                        return (

                            <div>
                                <hr />
                                <div class="card w-100">
                                    <div class="card-body">
                                        <h5 class="card-title"><b>{post.requestOrigin}</b></h5>

                                        <button class="btn btn-info ">Check this request</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default PendingRequest
