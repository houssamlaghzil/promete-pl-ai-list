import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PlaylistGenerator from './components/PlaylistGenerator';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<PlaylistGenerator />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
