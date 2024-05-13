import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const { pathname } = location;
    if (pathname.includes('users')) {
      setActiveTab('users');
    } else if (pathname.includes('groups')) {
      setActiveTab('groups');
    } else if (pathname.includes('schedules')) {
      setActiveTab('schedules');
    }
  }, [location]);

  return (
    <div className="col-sm-2 sidenav">
      <ul className="nav nav-pills nav-stacked">
        <li className={activeTab === 'users' ? 'active' : ''}><a href="/schedule/users">ユーザ</a></li>
        <li className={activeTab === 'groups' ? 'active' : ''}><a href="/schedule/groups">グループ</a></li>
        <li className={activeTab === 'schedules' ? 'active' : ''}><a href="/schedule/schedules">スケジュール</a></li>
      </ul>
    </div>
  );
}

export default Sidebar;
