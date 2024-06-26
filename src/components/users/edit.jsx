import React, { useEffect, useState } from 'react';
import { getUserById } from '../../api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { updateUser } from '../../api';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

const UserEdit = () => {
  const { id } = useParams();
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    id: '',
    user_first_name: '',
    user_last_name: '',
    post_code: '',
    address: '',
    tel_number: '',
    email: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await getUserById(id);
        setValues({
          id: data[0].id,
          user_first_name: data[0].user_first_name,
          user_last_name: data[0].user_last_name,
          post_code: data[0].post_code,
          address: data[0].address,
          tel_number: data[0].tel_number,
          email: data[0].email
        });
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    }
    fetchUser();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = {};
      const numberPattern = /^[0-9-]+$/;
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
        errors.postal_code = '郵便番号が無効です。';
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
        updateUser(values).then(res => {
          navigate('/schedule/users', { state: { message: res.message } });
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
              <form onSubmit={handleSubmit}>
                {/* <div className="form-group">
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
                </div>
                <div className="form-group">
                  <label htmlFor="userName"> ユーザ名・ログイン名 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userName"
                    value={values.user_name}
                    onChange={(e) => setValues({ ...values, user_name: e.target.value })}
                    placeholder="ユーザ名・ログイン名"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password"> パスワード :</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={values.password}
                    onChange={(e) => setValues({ ...values, password: e.target.value })}
                    placeholder="パスワード"
                  />
                </div> */}
                <div className="form-group">
                  <label htmlFor="userFirstName"> ユーザの名 :</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userFirstName"
                    value={values.user_first_name}
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
                    value={values.user_last_name}
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
                      value={values.post_code}
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
                      value={values.address}
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
                    value={values.tel_number}
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
                    value={values.email}
                    onChange={(e) => setValues({ ...values, email: e.target.value })}
                  />
                  {errors.email && <span className="error">{errors.email}</span>}
                </div>
                <div className="up-btn-gp col-sm-12">
                  <Link to="/schedule/users"><button type="button" className='btn btn-light'>キャンセル</button></Link>
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

export default UserEdit;
