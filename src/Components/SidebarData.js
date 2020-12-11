import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as GiIcons from 'react-icons/gi';
import * as BsIcons from 'react-icons/bs';


export const SidebarData = [
    {
        title: 'Home',
        path: '/',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Vaccine / Users',
        path: '/add',
        icon: <AiIcons.AiOutlineFileAdd />,
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
        title: 'Dispensed',
        path: '/dispensed',
        icon: <AiIcons.AiOutlineStock />,
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
