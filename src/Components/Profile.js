import React from 'react';
import styled from 'styled-components';
import Image from '../MediaFiles/pev.png';
const Container = styled.div`
    margin-top: 2rem;
`
const ProfileImg = styled.img`
    height: 5rem;
`
const ProfileName = styled.h2`
    font-size: 1rem;
    font-weight: 300;
    color: ${({ theme }) => theme.textColor};
`
const Profile = (props) => {
    return (
        <Container>
            <div>
                <ProfileImg src={Image} />
            </div>
            <ProfileName>
                <div className="text-left">
                    <h2 className="text-center"><u><b>USER INFORMATION</b></u></h2>
                    <h3><u>Username:</u></h3>
                    <h2 className="text-center"><b>Test</b></h2>
                    <h3> <u>Organization Unit:</u>Test</h3>
                    <h2 className="text-center"><b>Test</b></h2>
                    <h3><u>Name:</u></h3>
                    <h2 className="text-center"><b>Test</b></h2>
                </div>
            </ProfileName>
        </Container>
    )
}


export default Profile