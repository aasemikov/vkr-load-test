import { createTheme } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppMenu from './components/menu/Menu';
import HomePage from './pages/HomePage';
import MethodologyPage from './pages/MethodologyPage';
import ReportsPage from './pages/ReportsPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <Router>
            <AppMenu />
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/methodology" element={<MethodologyPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;