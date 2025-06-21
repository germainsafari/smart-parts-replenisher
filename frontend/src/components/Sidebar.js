import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Sidebar = () => {
  const menuItems = [
    { icon: <HomeIcon />, name: 'Dashboard', path: '/' },
    { icon: <DescriptionIcon />, name: 'Requisitions', path: '/requisitions' },
    { icon: <InventoryIcon />, name: 'Purchase Orders', path: '/purchase-orders' },
    { icon: <AssessmentIcon />, name: 'Reports', path: '/reports' },
  ];

  const activeLinkClass = "flex items-center p-3 rounded-lg bg-slate-700 cursor-pointer";
  const inactiveLinkClass = "flex items-center p-3 rounded-lg hover:bg-slate-700 cursor-pointer";


  return (
    <div className="bg-slate-800 text-white w-64 min-h-screen p-4 flex flex-col justify-between">
      <div>
        <Link to="/" className="flex items-center mb-10 text-white no-underline">
            <svg className="w-8 h-8 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7h-2V5a2 2 0 00-2-2h-2.5V1M4 7h2V5a2 2 0 012-2h2.5V1M4 14v5a2 2 0 002 2h12a2 2 0 002-2v-5m-4-1l-2-1m0 0l-2 1m2-1V9.5"></path></svg>
            <h1 className="text-2xl font-bold">Replenisher</h1>
        </Link>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
                <NavLink 
                    to={item.path}
                    className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}
                >
                    {item.icon}
                    <span className="ml-4">{item.name}</span>
                </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link to="/logout" className={inactiveLinkClass}>
            <ExitToAppIcon />
            <span className="ml-4">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar; 