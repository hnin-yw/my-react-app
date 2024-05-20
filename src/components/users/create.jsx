import React, { useEffect, useState } from 'react';
import { getAllGroups } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { saveUser } from '../../api';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Message from '../Message';

const UserCreate = () => {
  const [isError, setIsError] = useState(false);
  const [msg, setInfoMsg] = useState('');
  const [errors, setErrors] = useState({});
  const [groups, setGroups] = useState([]);
  const [values, setValues] = useState({
    group_code: '',
    user_name: '',
    password: '',
    user_first_name: '',
    user_last_name: '',
    post_code: '',
    address: '',
    tel_number: '',
    email: ''
  });
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchAllGroups() {
      try {
        const data = await getAllGroups();
        setGroups(data);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    }
    fetchAllGroups();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = {};
      const numberPattern = /^[0-9-]+$/;
      if (values.group_code === "") {
        errors.group_code = 'グループ名は必須です。';
      }
      if (!values.user_name.trim()) {
        errors.user_name = 'ユーザ名またはログイン名は必須です。';
      } else if (values.user_name.length > 7) {
        errors.user_name = 'ユーザ名またはログイン名は最大7文字までです。';
      }
      if (!values.password.trim()) {
        errors.password = 'パスワードは必須です。';
      }
      if (!values.user_first_name.trim()) {
        errors.user_first_name = 'ユーザの名は必須です。';
      } else if (values.user_first_name.length > 100) {
        errors.user_first_name = 'ユーザの名は最大100文字までです。';
      }
      if (!values.user_last_name.trim()) {
        errors.user_last_name = 'ユーザの姓は必須です。';
      } else if (values.user_last_name.length > 100) {
        errors.user_last_name = 'ユーザの姓は最大100文字までです。';
      }
      if (!values.post_code.trim()) {
        errors.post_code = '郵便番号は必須です';
      } else if (values.post_code.length > 20) {
        errors.post_code = '郵便番号は最大20文字までです。';
      } else if (!numberPattern.test(values.post_code)) {
        errors.post_code = '郵便番号が無効です。';
      }
      if (!values.address.trim()) {
        errors.address = '住所は必須です。';
      } else if (values.address.length > 250) {
        errors.address = '住所は最大250文字までです。';
      }
      if (!values.tel_number.trim()) {
        errors.tel_number = '電話番号は必須です';
      } else if (values.tel_number.length > 20) {
        errors.tel_number = '電話番号は最大20文字までです。';
      } else if (!numberPattern.test(values.tel_number)) {
        errors.tel_number = '電話番号が無効です。';
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!values.email.trim()) {
        errors.email = 'メールは必須です';
      } else if (values.email.length > 100) {
        errors.email = 'メールは最大100文字までです。';
      } else if (!emailPattern.test(values.email)) {
        errors.email = 'メールが無効です。「例) @ を含める必要があります」';
      }
      setErrors(errors);

      if (Object.keys(errors).length === 0) {
        saveUser(values).then(res => {
          if (res && res.status === 201) {
            setIsError(true);
            setInfoMsg(res.message);
          } else {
            navigate('/schedule/users', { state: { message: res.message } });
          }
        });
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
          <h2 className="text-center">ユーザの登録</h2>
          <div className="card">
            <div className="card-body">
            {msg !== '' && <Message isError={isError} message={msg} />}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="groupCode"> グループ :</label>
                  <select
                    className="form-control"
                    id="groupCode"
                    onChange={(e) => setValues({ ...values, group_code: e.target.value })} >
                    <option value="">-- グループを選択してください --</option>
                    {groups.map((group, index) => (
                      <option key={index} value={group.group_code}>
                        {group.group_name}
                      </option>
                    ))}
                  </select>
                  {errors.group_code && <span className="error">{errors.group_code}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="userName"> ユーザ名・ログイン名 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    onChange={(e) => setValues({ ...values, user_name: e.target.value })}
                    placeholder="ユーザ名・ログイン名"
                  />
                  {errors.user_name && <span className="error">{errors.user_name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="password"> パスワード :</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    placeholder="パスワード"
                  />
                  {errors.password && <span className="error">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="userFirstName"> ユーザの名 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userFirstName"
                    onChange={(e) => setValues({ ...values, user_first_name: e.target.value })}
                    placeholder="ユーザの名"
                  />
                  {errors.user_first_name && <span className="error">{errors.user_first_name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="userLastName"> ユーザの姓 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userLastName"
                    onChange={(e) => setValues({ ...values, user_last_name: e.target.value })}
                    placeholder="ユーザの姓"
                  />
                  {errors.user_last_name && <span className="error">{errors.user_last_name}</span>}
                </div>
                <div className="form-group row">
                  <div className="col-sm-4">
                    <label htmlFor="postCode"> 郵便番号 :</label>
                    <input
                      type="text"
                      id="postCode"
                      name="postCode"
                      placeholder="000-0000"
                      className="form-control"
                      onChange={(e) => setValues({ ...values, post_code: e.target.value })}
                    />
                    {errors.post_code && <span className="error">{errors.post_code}</span>}
                  </div>
                  <div className="col-sm-8">
                    <label htmlFor="address"> 住所 :</label>
                    <textarea
                      id="address"
                      name="address"
                      placeholder="ユーザの住所"
                      className="form-control"
                      onChange={(e) => setValues({ ...values, address: e.target.value })}
                    />
                    {errors.address && <span className="error">{errors.address}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="telNumber"> 電話番号 :</label>
                  <input
                    type="text"
                    id="telNumber"
                    name="telNumber"
                    placeholder="000-0000-0000"
                    className="form-control"
                    onChange={(e) => setValues({ ...values, tel_number: e.target.value })}
                  />
                  {errors.tel_number && <span className="error">{errors.tel_number}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email"> メール :</label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="メール"
                    className="form-control"
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="up-btn-gp col-sm-12">
                  <Link to="/schedule/users"><button type="button" className='btn btn-light'>キャンセル</button></Link>
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

export default UserCreate;
