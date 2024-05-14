import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getGroupById, updateGroup } from '../../api';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const GroupEdit = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    id: '',
    group_name: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchGroup() {
      try {
        const data = await getGroupById(id);
        setValues({
          id: data[0].id,
          group_name: data[0].group_name
        });
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    }
    fetchGroup();
  }, [id]);

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = {};
      if (!values.group_name.trim()) {
        errors.group_name = 'グループ名は必須です。';
      }
      setErrors(errors);

      if (Object.keys(errors).length === 0) {
        updateGroup(values).then(res => {
          navigate('/schedule/groups');
        })
      }
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
          <h2 className="text-center">グループの編集</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleUpdateSubmit}>
                <div className="form-group">
                  <label htmlFor="groupName"> グループ名 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="groupName"
                    value={values.group_name}
                    onChange={(e) => setValues({ ...values, group_name: e.target.value })}
                    placeholder="グループ名"
                  />
                  {errors.group_name && <span className="error">{errors.group_name}</span>}
                </div>
                <div className="up-btn-gp col-sm-12">
                  <Link to="/schedule/groups"><button type="button" className='btn btn-light'>キャンセル</button></Link>
                  <button type="submit" className="btn btn-primary">編集</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupEdit;
