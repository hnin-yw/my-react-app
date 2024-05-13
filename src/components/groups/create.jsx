import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { saveGroup } from '../../api';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const GroupCreate = () => {
  const [values, setValues] = useState({
    group_name: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      saveGroup(values).then(res => {
        navigate('/schedule/groups');
      })
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row content">
        <Navbar />
        <Sidebar />
        <div className="col-sm-10 content_body">
          <h2 className="text-center">グループの登録</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="groupName"> グループ名 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="groupName"
                    onChange={(e) => setValues({ ...values, group_name: e.target.value })}
                    placeholder="グループ名"
                  />
                </div>
                <div className="up-btn-gp col-sm-12">
                  <Link to="/schedule/groups"><button type="button" className='btn btn-light'>キャンセル</button></Link>
                  <button type="submit" className="btn btn-primary">登録</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupCreate;
