import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../../api';
import { Link, useNavigate } from 'react-router-dom';
import { saveGroup } from '../../api';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';


const ScheduleCreate = () => {
  const [users, setUsers] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
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
  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);
  const navigate = useNavigate();
  const renderUserOptions = () => {
    if (users.length > 0) {
      return (
        <>
          <option value="">-- ユーザを選択してください --</option>
          {users.map(user => {
            let disabled = false;
            return (
              <option key={user.user_code} value={user.user_code} data-email={user.email} disabled={disabled}>
                {user.email}
              </option>
            );
          })}
        </>
      );
    } else {
      return <option value="">-- ユーザを選択してください --</option>;
    }
  };
  const onAllDayFlgChange = async (event) => {
  };
  const onRepeatTypeChange = async (event) => {
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const guestPermissionFlgChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      saveGroup(values).then(res => {
        navigate('/schedule/users');
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
          <h2 className="text-center">スケジュールの登録</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <div className="col-sm-9">
                    <div className="form-group col-sm-12">
                      <label htmlFor="scheduleTitle"> スケジュールタイトル :</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scheduleTitle"
                        onChange={(e) => setValues({ ...values, user_name: e.target.value })}
                        placeholder="スケジュールタイトル"
                      />
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label htmlFor="scheduleTitle"> スケジュールの開始日時 :</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scheduleTitle"
                          onChange={(e) => setValues({ ...values, user_name: e.target.value })}
                          placeholder="スケジュールの開始日時"
                        />
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="scheduleTitle"> スケジュールの終了日時 :</label>
                        <input
                          type="text"
                          className="form-control"
                          id="scheduleTitle"
                          onChange={(e) => setValues({ ...values, user_name: e.target.value })}
                          placeholder="スケジュールの終了日時"
                        />
                      </div>
                    </div>

                    <div className="form-group col-sm-12">
                      <label htmlFor="scheduleThemeColor">スケジュールテーマカラー</label>
                      <input
                        type="color"
                        id="scheduleThemeColor"
                        name="scheduleThemeColor"
                        className="custom-color_box"
                      />
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-2" style={{ marginTop: '20px' }}>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          id="allDayFlgChk"
                          onChange={(e) => onAllDayFlgChange(e.target.checked)}
                        />
                        <label htmlFor="allDayFlgChk">一日中</label>
                      </div>
                      <div className="col-sm-3">
                        <label htmlFor="repeatType">繰り返しの種類:</label>
                        <select
                          id="repeatType"
                          name="repeatType"
                          onChange={(e) => onRepeatTypeChange(e.target.value)}
                          className="form-control">
                          <option value="01">リピートなし</option>
                          <option value="02">毎日</option>
                          <option value="03">毎週</option>
                          <option value="04">毎月</option>
                          <option value="05">毎年</option>
                        </select>
                      </div>
                      <div className="form-group" id="repeateDetail">
                        <div className="col-sm-3" id="repeatDayDiv" style={{ display: 'none' }}>
                          <label htmlFor="repeatDayOfWeek">週の繰り返し日:</label>
                          <select
                            id="repeatDayOfWeek"
                            name="repeatDayOfWeek"
                            className="form-control"
                          >
                            <option value="01">日曜日</option>
                            <option value="02">月曜日</option>
                            <option value="03">火曜日</option>
                            <option value="04">水曜日</option>
                            <option value="05">木曜日</option>
                            <option value="06">金曜日</option>
                            <option value="07">土曜日</option>
                          </select>
                        </div>
                        <div className="col-sm-3" id="repeatMonthDiv" style={{ display: 'none' }}>
                          <label htmlFor="repeatTypeOfMonth">月の繰り返し日:</label>
                          <select
                            id="repeatTypeOfMonth"
                            name="repeatTypeOfMonth"
                            className="form-control"
                          ></select>
                        </div>
                        <div className="col-sm-4" style={{ display: 'none' }}>
                          <label htmlFor="repeatUntilDateTimeString"> 繰り返す終了日付 :</label>
                          <input
                            type="text"
                            id="repeatUntilDateTimeString"
                            name="repeatUntilDateTimeString"
                            placeholder="YYYY-MM-DD HH:mm:ss"
                            className="form-control"
                          />
                          <span id="repeatUntilDateTimeStringError" style={{ color: 'red', display: 'none' }}>
                            繰り返す終了日付は必須です。
                          </span>
                        </div>
                        <div className="col-sm-12" style={{ marginTop: '5px' }}>
                          <span style={{ color: 'red', display: 'none' }} id="repeatUntilError">
                            スケジュールの終了日時は、繰り返す終了日時よりも前の日時にする必要があります。
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                  <div className="col-sm-3">
                    <div className="panel cus_left-panel">
                      <label htmlFor="eventFlg"> スケジュールタイプ</label>
                      <select
                        name="eventFlg"
                        className="form-control"
                      >
                        <option value="1">イベント</option>
                        <option value="0">タスク</option>
                      </select>
                      <br />
                      <label htmlFor="otherVisibilityFlg"> 公開・非公開の表示</label>
                      <select
                        name="otherVisibilityFlg"
                        className="form-control"
                      >
                        <option value="0">公開</option>
                        <option value="1">非公開</option>
                      </select>
                      <br />
                      <label htmlFor="scheduleDisplayFlg"> スケジュール表示 </label>
                      <select
                        name="scheduleDisplayFlg"
                        className="form-control"
                      >
                        <option value="0">無料</option>
                        <option value="1">忙しい</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group col-sm-12">
                  <label htmlFor="meetLink"> ミーティングのリンク :</label>
                  <input type="text" id="meetLink" name="meetLink" placeholder="ミーティングのリンク" className="form-control" />
                  <span><span style={{ color: 'red' }} /></span>

                  <div className="form-group col-sm-12">
                    <label htmlFor="location"> ロケーション :</label>
                    <input type="text" id="location" name="location" placeholder="ロケーション" className="form-control" />
                    <span><span style={{ color: 'red' }} /></span>
                  </div>

                  <div className="form-group" id="divReminder">
                    <div className="col-sm-12">
                      <label htmlFor="reminder"> 通知の種類:</label>
                    </div>
                    {[...Array(2).keys()].map(i => (
                      <div key={i} className="col-sm-12 row">
                        <div className="col-sm-2">
                          <select name={`scheduleReminders[${i}].notiMethodFlg`} className="form-control">
                            <option value="0">メール</option>
                            <option value="1">通知</option>
                          </select>
                        </div>
                        <div className="col-sm-2">
                          <input type="number" id={`scheduleReminderTime${i}`} name={`scheduleReminders[${i}].scheduleReminderTime`} min="1" value="1" className="form-control" />
                        </div>
                        <div className="col-sm-2">
                          <select name={`scheduleReminders[${i}].scheduleReminderType`} className="form-control">
                            <option value="01">分間</option>
                            <option value="02">時間</option>
                          </select>
                        </div>
                        <div className="col-sm-12 mrg_form"></div>
                      </div>
                    ))}
                  </div>

                  <div className="form-group col-sm-12">
                    <label htmlFor="scheduleDescription"> スケジュールの説明 :</label>
                    <textarea id="scheduleDescription" name="scheduleDescription" placeholder="スケジュールの説明" className="form-control"></textarea>
                    <span><span style={{ color: 'red' }} /></span>
                  </div>

                  <div className="form-group col-sm-12">
                    <span style={{ color: 'red' }}>このスケジュールには 5 人のゲストのみを招待できます。</span><br />
                    <label htmlFor="attendees">ゲスト :</label>
                    <div className="col-sm-4">
                      <input type="hidden" id="selectCount" className="form-control" />
                      <select id="attendeesSelect" className="form-control">
                        {renderUserOptions()}
                      </select>
                      <div className="mt-link">
                        <input type="checkbox" className="custom-checkbox" id="guestPermissionFlgChk" onChange={(e) => guestPermissionFlgChange(e)} disabled />
                        <label htmlFor="guestPermissionFlgChk">スケジュールの更新</label>
                      </div>
                    </div>
                  </div>
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

export default ScheduleCreate;
