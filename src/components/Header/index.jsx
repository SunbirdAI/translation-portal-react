import React from 'react';

import {Nav, Title} from "./Header.styles";
import img from '../../images/logo.png';

const Header = () => (
    <Nav>
        <div className='h-12'>
        <img className="w-full h-full object-contain" alt="Logo" src={img}/>
        </div>
        <Title>
            Translate
        </Title>
    </Nav>
);

export default Header;
