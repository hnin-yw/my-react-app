import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import GroupList from './components/groups/list';
import GroupCreate from './components/groups/create';
import GroupEdit from './components/groups/edit';

import UserList from './components/users/list';
import UserCreate from './components/users/create';
import UserEdit from './components/users/edit';

import ScheduleList from './components/schedules/list';
import ScheduleCreate from './components/schedules/create';

import LoginForm from './components/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<LoginForm />} />

        {/* Users */}
        <Route path="/schedule/users" element={<UserList />} />
        <Route path="/schedule/users/create" element={<UserCreate />} />
        <Route path="/schedule/users/edit/:id" element={<UserEdit />} />

        {/* Groups */}
        <Route path="/schedule/groups" element={<GroupList />} />
        <Route path="/schedule/groups/create" element={<GroupCreate />} />
        <Route path="/schedule/groups/edit/:id" element={<GroupEdit />} />

        {/* Schedules */}
        <Route path="/schedule/schedules" element={<ScheduleList />} />
        <Route path="/schedule/schedules/create" element={<ScheduleCreate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;