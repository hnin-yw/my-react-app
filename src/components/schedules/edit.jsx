import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getGroupById, updateGroup } from '../../api';

const GroupEdit = () => {
  const { id } = useParams();
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
  }, []);

  const handleUpdateSubmit = async (event) => {
    try {
      event.preventDefault();
      updateGroup(values).then(res => {
        navigate('/groups');
      })
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className='d-flex vh-100 bg-primary justify-content-center aligin-items-center'>
      <div className='w-50 bg-white rounded p-3'>
        <form onSubmit={handleUpdateSubmit}>
          <h2>グループ編集</h2>
          <div>
            <input type='hidden' value={values.id} onChange={(e) => setValues({ ...values, id: e.target.value })} />
          </div>
          <div className='mb-2'>
            <label htmlFor=''>グループ名</label>
            <input type='text'
              value={values.group_name}
              placeholder='グループ名'
              className='form-control'
              onChange={(e) => setValues({ ...values, group_name: e.target.value })}
            />
          </div>
          <button type="submit">更新</button>
          <Link to="/groups" className='btn btn-Light'><button type="button">キャンセル</button></Link>
        </form>
      </div>
    </div>
  );
};

export default GroupEdit;
