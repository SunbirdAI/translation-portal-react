import React from 'react';

import ReactGA from "react-ga4";
import "./App.css";
import {Wrapper} from "./GlobalStyles";
import Header from "./components/Header";
import Translate from "./components/Translate";
import {useEffect} from "react";
import {tracking_id} from "./API";


function App() {
    useEffect(() => {
        ReactGA.initialize(tracking_id);
        ReactGA.send("pageview");
    }, []);
    return (
        <div className="h-screen">
            <Header/>
            <Wrapper>
                <Translate/>
            </Wrapper>
        </div>
    );
}

export default App;
