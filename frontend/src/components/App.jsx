import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {NavBar} from "./Navbar/NavBar";
import {Home} from './pages/Home';
import {History} from './pages/History';


export const App = () => {
    return (
        <div className={'content'}>
            <BrowserRouter>
                <NavBar />

                <Routes>
                    <Route path="/" element={<Home />}/>
                    <Route path="/history" element={<History />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}
