import React, { useState, useContext } from 'react';
import Header from './components/Header';
import './App.css';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import AdminPage from './pages/admin/Admin';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { TabProvider } from './context/TabContext';
import { SummaryProvider } from './context/SummaryContext';




function App() {
  const {currentUser} = useContext(AuthContext)

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  return (
    <>
      <div className='appView'>

      <div className='appView_sub'>
          <Header />   
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route path="login" element={<Login />} />
                <Route
                  index
                  element={
                    <RequireAuth>
                      <TabProvider >
                        <SummaryProvider>
                          <Home />
                        </SummaryProvider>
                      </TabProvider>                                
                    </RequireAuth>
                  }
                  />

                <Route path="admin" element={<AdminPage />} />
                <Route
                index
                element={                             
                  <Home />
                  }
                  />                
              </Route>
            </Routes>
          </BrowserRouter>
        </div>
        </div>
      </>
  );
}

export default App;
