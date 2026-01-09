import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from 'cdbreact';
import { NavLink } from 'react-router-dom';
import './styles/SidebarComponent.css'; 

const SidebarComponent = () => {
  return (
    <div style={{ display: 'flex', overflow: 'scroll initial'}} className='fixfromtop'>
      <CDBSidebar textColor="#fff" backgroundColor="#039695">
        <CDBSidebarContent className="sidebar-content">
          <CDBSidebarMenu>
            <NavLink to="/fundraiser-details" className="activeClicked">
              <CDBSidebarMenuItem icon="columns">Fundraiser Details</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/medical-documents" className="activeClicked">
              <CDBSidebarMenuItem icon="table">Medical Documents</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/patient-verification" className="activeClicked">
              <CDBSidebarMenuItem icon="user">Patient Verification</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/background" className="activeClicked">
              <CDBSidebarMenuItem icon="chart-line">Background</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/hospital-details" className="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">Hospital Details</CDBSidebarMenuItem>
            </NavLink>
            <NavLink to="/bank-details" className="activeClicked">
              <CDBSidebarMenuItem icon="exclamation-circle">Bank Details</CDBSidebarMenuItem>
            </NavLink>
          </CDBSidebarMenu>
        </CDBSidebarContent>
      </CDBSidebar>
    </div>
  );
};

export default SidebarComponent;
