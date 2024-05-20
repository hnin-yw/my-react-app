import React, { useEffect, useState } from 'react';
import { updateSchedule, getScheduleById, getAllUsers } from '../../api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import moment from 'moment';
import cookies from 'js-cookie';
import { BsFillExclamationTriangleFill } from "react-icons/bs";

const ScheduleEdit = () => {
  const { id } = useParams();
  const user_code = cookies.get('userCode');
  const [errors, setErrors] = useState({});
  const [users, setUsers] = useState([]);
  const [repeatType, setRepeatType] = useState('01');
  const [isEditChange, setIsEditChange] = useState(false);
  const [schedule_theme_color, setScheduleThemeColor] = useState('#FF4013');
  const navigate = useNavigate();
  const [values, setValues] = useState({
    id: '',
    user_code: '',
    group_code: '',
    schedule_code: '',
    schedule_title: '',
    schedule_start_date_time: '',
    schedule_end_date_time: '',
    allday_flg: '',
    repeat_type: '',
    repeat_until: '',
    repeat_day_of_week: '',
    repeat_type_of_month: '',
    schedule_display_flg: '',
    location: '',
    meet_link: '',
    schedule_description: '',
    schedule_theme_color: '',
    event_flg: '',
    other_visibility_flg: '',
    schedule_status_flg: '',
    guest_permission_flg: '',
    schedule_reminder: [],
    attendee: [],
    del_flg: '',
    created_by: '',
    updated_by: '',
  });

  function formatDate(dateString) {
    if (dateString != null) {
      const date = new Date(dateString);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
      return formattedDate;
    } else {
      return '';
    }
  }

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

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const data = await getScheduleById(id);
        const scheduleData = data['schedule'];
        const scheduleReminders = data['scheduleReminders'];
        const attendeeData = data['attendees'];
        if (scheduleData.length > 0) {
          handleScheduleStartDateTimeChange(moment(formatDate(scheduleData[0].schedule_start_date_time)));
          handleScheduleEndDateTimeChange(moment(formatDate(scheduleData[0].schedule_end_date_time)));
          setScheduleStartDateTimeChange(moment(formatDate(scheduleData[0].schedule_start_date_time)));
          setScheduleEndDateTimeChange(moment(formatDate(scheduleData[0].schedule_end_date_time)));
          const newValues = {
            id: scheduleData[0].id,
            user_code: scheduleData[0].user_code,
            group_code: scheduleData[0].group_code,
            schedule_code: scheduleData[0].schedule_code,
            schedule_title: scheduleData[0].schedule_title,
            schedule_start_date_time: moment(formatDate(scheduleData[0].schedule_start_date_time)),
            schedule_end_date_time: moment(formatDate(scheduleData[0].schedule_end_date_time)),
            allday_flg: scheduleData[0].allday_flg,
            repeat_type: scheduleData[0].repeat_type,
            repeat_until: moment(formatDate(scheduleData[0].repeat_until)),
            repeat_day_of_week: scheduleData[0].repeat_day_of_week,
            repeat_type_of_month: scheduleData[0].repeat_type_of_month,
            schedule_display_flg: scheduleData[0].schedule_display_flg,
            location: scheduleData[0].location,
            meet_link: scheduleData[0].meet_link,
            schedule_description: scheduleData[0].schedule_description,
            schedule_theme_color: scheduleData[0].schedule_theme_color,
            event_flg: scheduleData[0].event_flg,
            other_visibility_flg: scheduleData[0].other_visibility_flg,
            schedule_status_flg: scheduleData[0].schedule_status_flg,
            guest_permission_flg: scheduleData[0].guest_permission_flg,
            del_flg: scheduleData[0].del_flg,
            created_by: scheduleData[0].created_by,
            updated_by: user_code
          };
          setValues(newValues);

          setGuestPermissionFlgCheck(scheduleData[0].guest_permission_flg);
          if (!scheduleData[0].allday_flg && scheduleReminders.length > 0) {
            scheduleReminders.forEach((scheduleReminder, index) => {
              handleScheduleReminderChange(index, 'noti_method_flg', scheduleReminder.noti_method_flg);
              handleScheduleReminderChange(index, 'schedule_reminder_time', scheduleReminder.schedule_reminder_time);
              handleScheduleReminderChange(index, 'schedule_reminder_type', scheduleReminder.schedule_reminder_type);
            });
          }
          onAllDayFlgChange(scheduleData[0].allday_flg);
          if (attendeeData.length > 0) {
            const data = attendeeData.map((attendee) => ({
              user_code: attendee.user_code,
              email: attendee.email
            }));
            setAttendees(data);
            setGuestPermissionFlgChk(false);
          }
          setRepeatType(scheduleData[0].repeat_type);
          if (scheduleData[0].repeat_type === '04') {
            setRepeatTypeOfMonth(scheduleData[0].repeat_type_of_month);
          }
          if (formatDate(scheduleData[0].repeat_until) != null) {
            setRepeatUntilDateTimeChange(moment(formatDate(scheduleData[0].repeat_until)));
          }
          onRepeatTypeChange(scheduleData[0].repeat_type);
        }
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    }
    fetchSchedule();
  }, [id, user_code]);

  const [selectedScheduleStartDateTime, setScheduleStartDateTimeChange] = useState('');
  const handleScheduleStartDateTimeChange = (date) => {
    if (date && typeof date.isValid === 'function' && date.isValid()) {
      setScheduleStartDateTimeChange(date);
      repeatTypeOfMonthOptionSet(date);
      repeatDayOfWeekOptionSet(date);

      repeatUntilValueSet(date, repeatType);
      setIsEditChange(true);
      setScheduleEndDateTimeChange(date.clone().add(1, 'hour'));
    }
  };
  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, schedule_start_date_time: selectedScheduleStartDateTime }));
  }, [selectedScheduleStartDateTime]);
  const [selectedScheduleEndDateTime, setScheduleEndDateTimeChange] = useState('');
  const handleScheduleEndDateTimeChange = (date) => {
    if (date && typeof date.isValid === 'function' && date.isValid()) {
      setScheduleEndDateTimeChange(date);
    }
  };
  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, schedule_end_date_time: selectedScheduleEndDateTime }));
  }, [selectedScheduleEndDateTime]);
  const [selectedRepeatUntilDateTime, setRepeatUntilDateTimeChange] = useState('');
  const handleRepeatUntilDateTimeChange = (date) => {
    if (date && typeof date.isValid === 'function' && date.isValid()) {
      setRepeatUntilDateTimeChange(date);
      setIsEditChange(true);
    }
  };
  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, repeat_until: selectedRepeatUntilDateTime }));
  }, [selectedRepeatUntilDateTime]);

  const [scheduleReminders, setScheduleReminders] = useState([
    { noti_method_flg: '0', schedule_reminder_time: '1', schedule_reminder_type: '01' },
    { noti_method_flg: '0', schedule_reminder_time: '1', schedule_reminder_type: '01' },
  ]);
  const handleScheduleReminderChange = (index, field, value) => {
    const newReminders = [...scheduleReminders];
    newReminders[index][field] = value;
    setScheduleReminders(newReminders);
  };

  const [attendees, setAttendees] = useState([]);
  const [selectedAttendee] = useState('0');
  const [guestPermissionFlgCheck, setGuestPermissionFlgCheck] = useState(false);
  const [guestPermissionFlgChk, setGuestPermissionFlgChk] = useState(true);
  const handleAttendeeChange = (value) => {
    if (!attendees.some(attendee => attendee.user_code === value)) {
      const selectedUser = users.find(user => user.user_code === value);
      setAttendees(prevAttendees => [
        ...prevAttendees,
        { user_code: value, email: selectedUser.email }
      ]);
      setGuestPermissionFlgChk(false);
    }
  };
  const handleRemoveAttendee = (value) => {
    if (attendees.some(attendee => attendee.user_code === value)) {
      setAttendees(prevAttendees => {
        const newAttendees = prevAttendees.filter(attendee => attendee.user_code !== value);
        if (newAttendees.length === 0) {
          setGuestPermissionFlgChk(true);
          setGuestPermissionFlgCheck(false);
        }
        return newAttendees;
      });
    }
  };
  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, attendee: attendees }));
  }, [attendees]);

  //一日中 Check Change
  const [divReminderDisplay, setDivReminderDisplay] = useState('block');
  const onAllDayFlgChange = async (event) => {
    if (event) {
      setDivReminderDisplay('none');

      if (selectedScheduleStartDateTime) {
        const dateWithoutTimeStart = selectedScheduleStartDateTime.format('YYYY-MM-DD');
        setScheduleStartDateTimeChange(moment(`${dateWithoutTimeStart} 00:00:00`));
      }
      if (selectedScheduleEndDateTime) {
        const dateWithoutTimeStart = selectedScheduleEndDateTime.format('YYYY-MM-DD');
        setScheduleEndDateTimeChange(moment(`${dateWithoutTimeStart} 00:00:00`));
      }
      if (selectedRepeatUntilDateTime) {
        const dateWithoutTimeStart = selectedRepeatUntilDateTime.format('YYYY-MM-DD');
        setRepeatUntilDateTimeChange(moment(`${dateWithoutTimeStart} 00:00:00`));
      }
    }
    else {
      setDivReminderDisplay('block');
    }
  };

  const onEventFlgChange = async (event) => {
    if (event === '1') {
      setScheduleThemeColor('#FF4013');
    } else {
      setScheduleThemeColor('#00C7FC');
    }
  };
  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, schedule_theme_color: schedule_theme_color }));
  }, [schedule_theme_color]);

  //繰り返しの種類 Change
  const [divRepeatDayDisplay, setDivRepeatDayDisplay] = useState('none');
  const [divRepeatMonthDisplay, setDivRepeatMonthDisplay] = useState('none');
  const [divRepeatUntilDateTimeDisplay, setDivRepeatUntilDateTimeDisplay] = useState('none');
  const [repeatTypeOfMonthOptions, setRepeatTypeOfMonthOptions] = useState([]);
  const [repeatDayOfWeek, setRepeatDayOfWeek] = useState('01');
  const [repeatTypeOfMonth, setRepeatTypeOfMonth] = useState('');
  const onRepeatTypeChange = async (event) => {
    setRepeatType(event);
    setDivRepeatDayDisplay('none');
    setDivRepeatMonthDisplay('none');
    setDivRepeatUntilDateTimeDisplay('none');
    if (event !== '01') {
      setIsEditChange(true);
      if (event === '03') {
        setDivRepeatDayDisplay('block');
        repeatDayOfWeekOptionSet(selectedScheduleStartDateTime);
      } else if (event === '04') {
        setDivRepeatMonthDisplay('block');
        repeatTypeOfMonthOptionSet(selectedScheduleStartDateTime);
      }
      repeatUntilValueSet(selectedScheduleStartDateTime, event);
      setDivRepeatUntilDateTimeDisplay('block');
    }
  };
  const repeatUntilValueSet = (date, type) => {
    if (date && typeof date.isValid === 'function' && date.isValid()) {
      if (type !== '01') {
        let newDate = date.clone().add(1, 'months');
        if (type === '04') {
          newDate = date.clone().add(3, 'months');
        } else if (type === '05') {
          newDate = date.clone().add(3, 'years');
        }
        if (isEditChange) {
          setRepeatUntilDateTimeChange(newDate);
        }
      }
    }
  }
  const repeatDayOfWeekOptionSet = (date) => {
    if (date && typeof date.isValid === 'function' && date.isValid()) {
      let repeatDayOfWeek = parseInt(date.format('d')) + 1;
      setRepeatDayOfWeek('0' + repeatDayOfWeek);
    }
  }
  const repeatTypeOfMonthOptionSet = (date) => {
    if (date && typeof date.isValid === 'function' && date.isValid()) {
      const options = [];
      const nthDayOfMonth = date.format('DD');
      options.push({ value: '01', text: `毎月${nthDayOfMonth}日` });
      const nthAnyDayOfMonth = date.format('d');
      options.push({ value: '02', text: `毎月第4${getDayName(nthAnyDayOfMonth)}` });
      options.push({ value: '03', text: `毎月最終の${getDayName(nthAnyDayOfMonth)}` });
      setRepeatTypeOfMonthOptions(options);
    }
  }
  const getDayName = (type) => {
    let dayName = "日曜日";
    if (type === '1') {
      dayName = "月曜日";
    } else if (type === '2') {
      dayName = "火曜日";
    } else if (type === '3') {
      dayName = "水曜日";
    } else if (type === '4') {
      dayName = "木曜日";
    } else if (type === '5') {
      dayName = "金曜日";
    } else if (type === '6') {
      dayName = "土曜日";
    }
    return dayName;
  }

  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, schedule_reminder: scheduleReminders }));
  }, [scheduleReminders]);
  useEffect(() => {
    setValues(prevValues => ({ ...prevValues, attendee: attendees }));
  }, [attendees]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const errors = {};
      if (!values.schedule_title.trim()) {
        errors.schedule_title = 'スケジュールタイトルは必須です。';
      } else if (values.schedule_title.length > 100) {
        errors.schedule_title = 'スケジュールタイトルは最大100文字までです。';
      }

      if (!values.schedule_start_date_time || !String(values.schedule_start_date_time).trim()) {
        errors.schedule_start_date_time = 'スケジュールの開始日時は必須です。';
      }
      if (!values.schedule_end_date_time || !String(values.schedule_end_date_time).trim()) {
        errors.schedule_end_date_time = 'スケジュールの終了日時は必須です。';
      }
      if (String(values.schedule_start_date_time).trim() && String(values.schedule_end_date_time).trim()) {
        const startDate = new Date(values.schedule_start_date_time);
        const endDate = new Date(values.schedule_end_date_time);
        if (isNaN(startDate.getTime())) {
          errors.schedule_start_date_time = '開始日時は有効な日付でなければなりません。';
        }
        if (isNaN(endDate.getTime())) {
          errors.schedule_end_date_time = '終了日時は有効な日付でなければなりません。';
        }
        if (!errors.schedule_start_date_time && !errors.schedule_end_date_time && endDate < startDate) {
          errors.schedule_end_date_time = '終了日時は開始日時より後でなければなりません。';
        }
      }
      if (values.repeat_type !== '01') {
        if (!values.repeat_until || !String(values.repeat_until).trim()) {
          errors.repeat_until = '繰り返す終了日付は必須です。';
        }
        if (String(values.schedule_end_date_time).trim() && String(values.repeat_until).trim()) {
          const endDate = new Date(values.schedule_end_date_time);
          const repeatUntil = new Date(values.repeat_until);
          if (isNaN(endDate.getTime())) {
            errors.schedule_end_date_time = '終了日時は有効な日付でなければなりません。';
          }
          if (isNaN(repeatUntil.getTime())) {
            errors.repeat_until = '繰り返す終了日付は有効な日付でなければなりません。';
          }
          if (!errors.schedule_end_date_time && !errors.repeat_until && repeatUntil < endDate) {
            errors.repeat_until = '繰り返す終了日はスケジュールの終了日時より後でなければなりません。';
          }

        }
      }

      if (values.location.length > 100) {
        errors.location = 'ロケーションは最大100文字までです。';
      }
      if (values.meet_link.length > 100) {
        errors.meet_link = 'ミーティングのリンクは最大100文字までです。';
      }
      if (values.schedule_description.length > 250) {
        errors.schedule_description = 'スケジュールの説明は最大250文字までです。';
      }
      setErrors(errors);

      if (Object.keys(errors).length === 0) {
        updateSchedule(values).then(res => {
          navigate('/schedule/schedules', { state: { message: res.message } });
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
          <h2 className="text-center">スケジュールの編集</h2>
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group row">
                  <div className="col-sm-9">
                    <div className="form-group col-sm-12">
                      <span style={{ color: 'red' }}>
                        <BsFillExclamationTriangleFill />
                        <b> このスケジュールとその後のすべてのスケジュールが更新されます。</b>
                      </span>
                      <br></br>
                      <br></br>
                      <label htmlFor="scheduleTitle"> スケジュールタイトル :</label>
                      <input
                        type="text"
                        className="form-control"
                        id="scheduleTitle"
                        value={values.schedule_title}
                        onChange={(e) => setValues({ ...values, schedule_title: e.target.value })}
                        placeholder="スケジュールタイトル"
                      />
                      {errors.schedule_title && <span className="error">{errors.schedule_title}</span>}
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label htmlFor="selectedScheduleStartDateTime"> スケジュールの開始日時 :</label>
                        <Datetime
                          id="selectedScheduleStartDateTime"
                          value={values.schedule_start_date_time}
                          dateFormat="YYYY-MM-DD"
                          timeFormat="HH:mm:ss"
                          onChange={(date) => {
                            handleScheduleStartDateTimeChange(date);
                            setValues({ ...values, schedule_start_date_time: date });
                          }}
                          inputProps={{ placeholder: 'スケジュールの開始日時' }}
                        />
                        {errors.schedule_start_date_time && <span className="error">{errors.schedule_start_date_time}</span>}
                      </div>
                      <div className="col-sm-6">
                        <label htmlFor="selectedScheduleEndDateTime"> スケジュールの終了日時 :</label>
                        <Datetime
                          id="selectedScheduleEndDateTime"
                          value={values.schedule_end_date_time}
                          dateFormat="YYYY-MM-DD"
                          timeFormat="HH:mm:ss"
                          onChange={(date) => {
                            handleScheduleEndDateTimeChange(date);
                            setValues({ ...values, schedule_end_date_time: date });
                          }}
                          inputProps={{ placeholder: 'スケジュールの終了日時' }}
                        />
                        {errors.schedule_end_date_time && <span className="error">{errors.schedule_end_date_time}</span>}
                      </div>
                    </div>

                    <div className="form-group col-sm-12">
                      <label htmlFor="scheduleThemeColor">スケジュールテーマカラー</label>
                      <input
                        type="color"
                        id="scheduleThemeColor"
                        name="scheduleThemeColor"
                        className="custom-color_box"
                        value={values.schedule_theme_color}
                        onChange={(e) => {
                          setValues({ ...values, schedule_theme_color: e.target.value });
                          setScheduleThemeColor(e.target.value);
                        }}
                      />

                    </div>

                    <div className="form-group row">
                      <div className="col-sm-2" style={{ marginTop: '20px' }}>
                        <input
                          type="checkbox"
                          className="custom-checkbox"
                          id="allDayFlgChk"
                          checked={values.allday_flg}
                          onChange={(e) => {
                            onAllDayFlgChange(e.target.checked);
                            setValues({ ...values, allday_flg: e.target.checked });
                          }}
                        />

                        <label htmlFor="allDayFlgChk">一日中</label>
                      </div>

                      <div className="col-sm-3">
                        <label htmlFor="repeatType">繰り返しの種類:</label>
                        <select
                          id="repeatType"
                          name="repeatType"
                          value={values.repeat_type}
                          onChange={(e) => {
                            onRepeatTypeChange(e.target.value);
                            setValues({ ...values, repeat_type: e.target.value });
                          }}
                          className="form-control"
                        >
                          <option value="01">リピートなし</option>
                          <option value="02">毎日</option>
                          <option value="03">毎週</option>
                          <option value="04">毎月</option>
                          <option value="05">毎年</option>
                        </select>
                      </div>
                      <div className="col-sm-3" id="repeatDayDiv" style={{ display: divRepeatDayDisplay }}>
                        <label htmlFor="repeatDayOfWeek">週の繰り返し日:</label>
                        <select
                          id="repeatDayOfWeek"
                          name="repeatDayOfWeek"
                          className="form-control"
                          value={repeatDayOfWeek}
                          onChange={(e) => {
                            setValues({ ...values, repeat_day_of_week: e.target.value });
                            setRepeatDayOfWeek(e.target.value);
                          }}
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

                      <div className="col-sm-3" id="repeatMonthDiv" style={{ display: divRepeatMonthDisplay }}>
                        <label htmlFor="repeatTypeOfMonth">月の繰り返し日:</label>
                        <select
                          id="repeatTypeOfMonth"
                          name="repeatTypeOfMonth"
                          className="form-control"
                          value={repeatTypeOfMonth}
                          onChange={(e) => {
                            setValues({ ...values, repeat_type_of_month: e.target.value });
                            setRepeatTypeOfMonth(e.target.value);
                          }}
                        >
                          {repeatTypeOfMonthOptions.map((repeatTypeOfMonthOption, index) => (
                            <option key={index} value={repeatTypeOfMonthOption.value}>{repeatTypeOfMonthOption.text}</option> // Use repeatTypeOfMonthOption.text for display text
                          ))}
                        </select>
                      </div>

                      <div className="col-sm-4" style={{ display: divRepeatUntilDateTimeDisplay }}>
                        <label htmlFor="repeatUntilDateTimeString">繰り返す終了日付 :</label>
                        <Datetime
                          id="repeatUntilDateTimeString"
                          name="repeatUntilDateTimeString"
                          value={values.repeat_until}
                          dateFormat="YYYY-MM-DD"
                          timeFormat="HH:mm:ss"
                          onChange={(date) => {
                            handleRepeatUntilDateTimeChange(date);
                            setValues({ ...values, repeat_until: date });
                          }}
                          inputProps={{ placeholder: '繰り返す終了日付' }}
                        />
                        {errors.repeat_until && <span className="error">{errors.repeat_until}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3">
                    <div className="panel cus_left-panel">
                      <label htmlFor="eventFlg"> スケジュールタイプ</label>
                      <select
                        name="eventFlg"
                        className="form-control"
                        value={values.event_flg}
                        onChange={(e) => {
                          onEventFlgChange(e.target.value);
                          setValues({ ...values, event_flg: e.target.value });
                        }}
                      >
                        <option value="1">イベント</option>
                        <option value="0">タスク</option>
                      </select>
                      <br />
                      <label htmlFor="otherVisibilityFlg"> 公開・非公開の表示</label>
                      <select
                        name="otherVisibilityFlg"
                        className="form-control"
                        value={values.other_visibility_flg}
                        onChange={(e) => setValues({ ...values, other_visibility_flg: e.target.value })}
                      >
                        <option value="0">公開</option>
                        <option value="1">非公開</option>
                      </select>
                      <br />
                      <label htmlFor="scheduleDisplayFlg"> スケジュール表示 </label>
                      <select
                        name="scheduleDisplayFlg"
                        className="form-control"
                        value={values.schedule_display_flg}
                        onChange={(e) => setValues({ ...values, schedule_display_flg: e.target.value })}
                      >
                        <option value="0">無料</option>
                        <option value="1">忙しい</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-group col-sm-12">
                  <label htmlFor="meetLink"> ミーティングのリンク :</label>
                  <input
                    type="text"
                    id="meetLink"
                    name="meetLink"
                    placeholder="ミーティングのリンク"
                    className="form-control"
                    value={values.meet_link}
                    onChange={(e) => setValues({ ...values, meet_link: e.target.value })}
                  />
                  {errors.meet_link && <span className="error">{errors.meet_link}</span>}
                </div>
                <div className="form-group col-sm-12">
                  <label htmlFor="location"> ロケーション :</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="ロケーション"
                    className="form-control"
                    value={values.location}
                    onChange={(e) => setValues({ ...values, location: e.target.value })}
                  />
                  {errors.location && <span className="error">{errors.location}</span>}
                </div>

                <div className="form-group" id="divReminder" style={{ display: divReminderDisplay }}>
                  <div className="col-sm-12">
                    <label htmlFor="reminder">通知の種類:</label>
                  </div>
                  {[...Array(2).keys()].map(i => (
                    <div key={i} className="col-sm-12 row">
                      <div className="col-sm-2">
                        <select
                          name={`scheduleReminder[${i}].notiMethodFlg`}
                          className="form-control"
                          value={scheduleReminders[i].noti_method_flg}
                          onChange={(e) => handleScheduleReminderChange(i, 'noti_method_flg', e.target.value)}
                        >
                          <option value="0">メール</option>
                          <option value="1">通知</option>
                        </select>
                      </div>
                      <div className="col-sm-2">
                        <input
                          type="number"
                          name={`schedule_reminder_time[${i}].scheduleReminderTime`}
                          min="1"
                          max="60"
                          value={scheduleReminders[i].schedule_reminder_time}
                          className="form-control"
                          onChange={(e) => handleScheduleReminderChange(i, 'schedule_reminder_time', e.target.value)}
                        />
                      </div>
                      <div className="col-sm-2">
                        <select
                          name={`scheduleReminder[${i}].scheduleReminderType`}
                          className="form-control"
                          value={scheduleReminders[i].schedule_reminder_type}
                          onChange={(e) => handleScheduleReminderChange(i, 'schedule_reminder_type', e.target.value)}
                        >
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
                  <textarea
                    id="scheduleDescription"
                    name="scheduleDescription"
                    placeholder="スケジュールの説明"
                    className="form-control"
                    value={values.schedule_description}
                    onChange={(e) => setValues({ ...values, schedule_description: e.target.value })}
                  ></textarea>
                  {errors.schedule_description && <span className="error">{errors.schedule_description}</span>}
                </div>

                <div className="form-group row">
                  <span style={{ color: 'red' }}>このスケジュールには 5 人のゲストのみを招待できます。</span><br />
                  <label htmlFor="attendees">ゲスト :</label>
                  <div className="col-sm-4">
                    <select
                      className="form-control"
                      id="attendeesSelect"
                      onChange={(e) => handleAttendeeChange(e.target.value)}
                      value={selectedAttendee}
                    >
                      <option value="0">-- ユーザを選択してください --</option>
                      {users && users.length > 0 && users.map((user, index) => (
                        <option key={index} value={user.user_code} data-email={user.email}
                          disabled={attendees.some(attendee => attendee.user_code === user.user_code)}
                        >
                          {user.email}
                        </option>
                      ))}
                    </select>
                    <div className="mt-link">
                      <input type="checkbox"
                        className="custom-checkbox"
                        id="guestPermissionFlgChk"
                        disabled={guestPermissionFlgChk}
                        checked={guestPermissionFlgCheck}
                        onChange={(e) => {
                          setGuestPermissionFlgCheck(e.target.checked);
                          setValues({ ...values, guest_permission_flg: e.target.checked })
                        }}
                      />
                      <label htmlFor="guestPermissionFlgChk">スケジュールの更新</label>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    {attendees.map((attendee, index) => (
                      <div key={index} className="list-group-item list-group-item-action col-sm-6" style={{ marginLeft: '3px', marginBottom: '3px' }}>
                        {attendee.email}
                        <button type="button" className="close" aria-label="Close" onClick={() => handleRemoveAttendee(attendee.user_code)}>
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="up-btn-gp col-sm-12">
                  <Link to="/schedule/schedules"><button type="button" className='btn btn-light'>キャンセル</button></Link>
                  <button type="submit" className="btn btn-primary">編集</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
};

export default ScheduleEdit;
