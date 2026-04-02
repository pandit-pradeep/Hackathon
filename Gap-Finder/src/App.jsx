import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* Public Routes with Navbar & Footer */}
          <Route path="/" element={<><Navbar /><Home /><Footer /><Chatbot /></>} />
          <Route path="/about" element={<><Navbar /><About /><Footer /><Chatbot /></>} />
          <Route path="/features" element={<><Navbar /><Features /><Footer /><Chatbot /></>} />
          <Route path="/contact" element={<><Navbar /><Contact /><Footer /><Chatbot /></>} />
          
          {/* Auth Pages (No Navbar/Footer) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Dashboard (No Navbar/Footer, has own layout) */}
          <Route path="/dashboard" element={<><Dashboard /><Chatbot /></>} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;