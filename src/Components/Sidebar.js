import React, { useState, useContext, useEffect } from 'react';
import Image from '../MediaFiles/pev.png';
import OrgData from './PopModalOrgUnits';
import { NavLink, useLocation } from 'react-router-dom';
import * as AiIcons from 'react-icons/ai';
import axios from 'axios';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';
import { userIntelContext } from '../App';
function Sidebar(props) {
    const userInfo = useContext(userIntelContext)
    const user = {
        username: "digiraneza",
        auth: localStorage.getItem("vmisJwt")
    }
    const userData = JSON.stringify(user)
    const location = useLocation()
    const [selectedOrgUnit, setSelectedOrgUnit] = useState("")
    useEffect(() => {
        props.onChange(selectedOrgUnit)
    }, [selectedOrgUnit])
    const handleLogout = () => {
        if (localStorage.getItem("vmisJwt") !== null) {
            axios.put('https://dev.hisprwanda.org/vmis/api/auth', userData).then(() => {
                localStorage.removeItem("vmisJwt")
                window.location.reload()
            }).catch(error => {
                console.log(error)
            })
            localStorage.removeItem("vmisJwt")
            window.location.reload()
        }
    }
    var SidebarData = [];
    if (userInfo.userToken.orgunitlevel === '1') {
        SidebarData = [
            {
                title: 'Home',
                path: '/',
                icon: <AiIcons.AiFillHome />,
                cName: 'nav-text'
            },
            {
                title: 'Vaccine',
                path: '/Vaccine',
                icon: <AiIcons.AiOutlineFileAdd />,
                cName: 'nav-text'
            },
            {
                title: 'Users',
                path: '/users',
                icon: <AiIcons.AiOutlineUser />,
                cName: 'nav-text'
            },
            {
                title: 'Distribute',
                path: '/Distribute',
                icon: <AiIcons.AiOutlineStock />,
                cName: 'nav-text'
            },
            {
                title: 'Acknowledge',
                path: '/acknowledge',
                icon: <GiIcons.GiReceiveMoney />,
                cName: 'nav-text'
            },
            {
                title: 'Wastage',
                path: '/wastage',
                icon: <BsIcons.BsTrash />,
                cName: 'nav-text'
            },
        ]
    } else if (userInfo.userToken.orgunitlevel === '4') {
        SidebarData = [
            {
                title: 'Home',
                path: '/',
                icon: <AiIcons.AiFillHome />,
                cName: 'nav-text'
            },
            {
                title: 'Distribute',
                path: '/Distribute',
                icon: <AiIcons.AiOutlineStock />,
                cName: 'nav-text'
            },
            {
                title: 'Request',
                path: '/request',
                icon: <AiIcons.AiOutlinePullRequest />,
                cName: 'nav-text'
            },
            {
                title: 'Return',
                path: '/return',
                icon: <BsIcons.BsArrowReturnLeft />,
                cName: 'nav-text'
            },
            {
                title: 'Redistribute',
                path: '/redistribute',
                icon: <BsIcons.BsArrowReturnLeft />,
                cName: 'nav-text'
            },
            {
                title: 'Acknowledge',
                path: '/acknowledge',
                icon: <GiIcons.GiReceiveMoney />,
                cName: 'nav-text'
            },
            {
                title: 'Wastage',
                path: '/wastage',
                icon: <BsIcons.BsTrash />,
                cName: 'nav-text'
            },
        ]
    } else if (userInfo.userToken.orgunitlevel === '6') {
        SidebarData = [
            {
                title: 'Home',
                path: '/',
                icon: <AiIcons.AiFillHome />,
                cName: 'nav-text'
            },
            {
                title: 'Request',
                path: '/request',
                icon: <AiIcons.AiOutlinePullRequest />,
                cName: 'nav-text'
            },
            {
                title: 'Dispensed',
                path: '/dispensed',
                icon: <AiIcons.AiOutlineStock />,
                cName: 'nav-text'
            },
            {
                title: 'Redistribute',
                path: '/redistribute',
                icon: <BsIcons.BsArrowReturnLeft />,
                cName: 'nav-text'
            },
            {
                title: 'Return',
                path: '/return',
                icon: <BsIcons.BsArrowReturnLeft />,
                cName: 'nav-text'
            },
            {
                title: 'Acknowledge',
                path: '/acknowledge',
                icon: <GiIcons.GiReceiveMoney />,
                cName: 'nav-text'
            },
            {
                title: 'Wastage',
                path: '/wastage',
                icon: <BsIcons.BsTrash />,
                cName: 'nav-text'
            },
        ]
    }
    return (
        <div className="">
            <div>
                <div className="m-2 p-2 border rounded text-light">
                    <div className="text-center">
                        <img className="text-center profile-img m-2" src={Image} alt="profile" />
                    </div>
                    <div className="text-left">
                        <p><b>Username:</b> {userInfo.userToken.username}</p>
                        <p><b>Name:</b> {userInfo.userToken.surname}</p>
                    </div>
                    <div>
                        {userInfo.userToken.orgunitlevel === "1" || userInfo.userToken.orgunitlevel === "4" ?
                            location.pathname === "/" ?
                                <OrgData onChange={value => setSelectedOrgUnit(value)} btnName="View Stock Status" btnColor="btn btn-info" /> : <div><b>Unit:</b>{userInfo.userToken.orgunitname}</div>
                            : <div><b>Unit:</b>{userInfo.userToken.orgunitname}</div>}
                    </div>
                </div>
            </div>
            <ul className="SidebarList">
                {
                    SidebarData.map((val, key) => {
                        return (
                            <li key={key} className="row">
                                <NavLink className="row" to={val.path} key={key} exact activeClassName="active">
                                    <div className="row">
                                        <div id="icon">{val.icon}  </div>{" "}
                                        <div id="title">{val.title}  </div>
                                    </div>
                                </NavLink>
                            </li>
                        );
                    })
                }
                <li className="row" onClick={handleLogout}>
                    <div className="row">
                        <div id="icon"><AiIcons.AiOutlineLogout />  </div>{" "}
                        <div id="title">Logout </div>
                    </div>
                </li>
            </ul>
        </div>
    )
}
export default Sidebar