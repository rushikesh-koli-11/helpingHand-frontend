import React, { useState, useEffect } from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FaBars, FaTimes } from 'react-icons/fa';
import './styles/SidebarComponent.css'; 

const SidebarComponent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close sidebar when switching from mobile to desktop
      if (!mobile && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    // Check on mount
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          className="d-md-none sidebar-toggle-btn fixfromtop"
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '70px',
            left: '10px',
            zIndex: 1051,
            backgroundColor: '#039695',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            color: 'white',
          }}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </Button>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="sidebar-overlay d-md-none"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            width: '100%',
            height: 'calc(100vh - 56px)',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1040,
          }}
        />
      )}

      <div style={{ display: 'flex', overflow: 'hidden'}} className='fixfromtop'>
        <CDBSidebar 
          textColor="#fff" 
          backgroundColor="#039695"
          className={sidebarOpen && isMobile ? 'show' : ''}
          style={{
            position: isMobile ? 'fixed' : 'relative',
            top: isMobile ? '56px' : '0',
            left: isMobile && !sidebarOpen ? '-100%' : '0',
            height: isMobile ? 'calc(100vh - 56px)' : 'auto',
            zIndex: 1050,
            transition: 'left 0.3s ease',
            width: isMobile ? '280px' : 'auto',
            maxWidth: isMobile ? '80vw' : 'none',
          }}
        >
          <CDBSidebarContent className="sidebar-content">
            <CDBSidebarMenu>
              <NavLink to="/fundraiser-details" className="activeClicked" onClick={closeSidebar}>
                <CDBSidebarMenuItem icon="columns">Fundraiser Details</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to="/medical-documents" className="activeClicked" onClick={closeSidebar}>
                <CDBSidebarMenuItem icon="table">Medical Documents</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to="/patient-verification" className="activeClicked" onClick={closeSidebar}>
                <CDBSidebarMenuItem icon="user">Patient Verification</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to="/background" className="activeClicked" onClick={closeSidebar}>
                <CDBSidebarMenuItem icon="chart-line">Background</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to="/hospital-details" className="activeClicked" onClick={closeSidebar}>
                <CDBSidebarMenuItem icon="exclamation-circle">Hospital Details</CDBSidebarMenuItem>
              </NavLink>
              <NavLink to="/bank-details" className="activeClicked" onClick={closeSidebar}>
                <CDBSidebarMenuItem icon="exclamation-circle">Bank Details</CDBSidebarMenuItem>
              </NavLink>
            </CDBSidebarMenu>
          </CDBSidebarContent>
        </CDBSidebar>
      </div>
    </>
  );
};

export default SidebarComponent;
