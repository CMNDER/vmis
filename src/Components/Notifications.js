import React from 'react'

function Notifications() {
    const notficationArray = [
        {
            "notificationTitle": "Vaccine request",
            "notificationText": "Masaka Hospital requested vaccines!"
        },
        {
            "notificationTitle": "Need more item for DMR",
            "notificationText": "You are running out of stock for DMR."
        },
        {
            "notificationTitle": "Confirm reception",
            "notificationText": "You should confirm reception of vaccine!"
        },
        {
            "notificationTitle": "Vaccine request",
            "notificationText": "Vaccine request from Kibagabaga Hospital!"
        },
        {
            "notificationTitle": "Vaccine request",
            "notificationText": "Vaccine request from Masaka Hospital!"
        }
    ]
    return (
        <div>
            <div >
                {notficationArray.map(post => {
                    return (
                        <div>
                        <hr />
                            <div className='card alert alert-primary'>
                                <div className='card-title btn-primary'>
                                    <h5 className='font-weight-bold text-center'>{post.notificationTitle}</h5>
                                </div>
                                <div className='card-text text-center card-img-top'>
                                    <b>{post.notificationText}</b>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Notifications
