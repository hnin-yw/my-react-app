import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import Cookies from 'js-cookie';

function LoginForm() {
  const [values, setValues] = useState({
    user_name: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handelLoginSubmit = (event) => {
    event.preventDefault();
    try {
      if (values.user_name && values.password) {
        login(values).then(res => {
          if (res && res.length > 0) {
            Cookies.set('userId', res[0].id);
            Cookies.set('userCode', res[0].user_code);
            Cookies.set('groupCode', res[0].group_code);
            Cookies.set('userName', res[0].user_first_name + '_' + res[0].user_last_name);
            navigate('/schedule/schedules');
          } else {
            setError('ユーザ名とパスワードが間違っています。');
          }
        })
      } else {
        setError('ユーザ名とパスワードを入力してください。');
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <div className="container pt-5">
      <h1 className="text-center">Login Form</h1>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <strong>{error}</strong>
                </div>
              )}
              <div className="card-body">
                <form onSubmit={handelLoginSubmit}>
                  <div className="form-group">
                    <label htmlFor="userName"> ユーザ名 :</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setValues({ ...values, user_name: e.target.value })}
                      placeholder="ユーザ名"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password"> パスワード :</label>
                    <input
                      type="password"
                      className="form-control"
                      onChange={(e) => setValues({ ...values, password: e.target.value })}
                      placeholder="パスワード"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    ログイン
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;
