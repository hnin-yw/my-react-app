import React, { useState, useEffect } from 'react';
import { getAllSchedules, deleteGroup } from '../../api';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';
import { FiCircle, FiDownload } from 'react-icons/fi';
import cookies from 'js-cookie';

function ScheduleList() {
    const userCode = cookies.get('userCode');
    const groupCode = cookies.get('groupCode');
    const [schedules, setSchedules] = useState([]);

    const [values] = useState({
        user_code: userCode,
        group_code: groupCode
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = schedules.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Function to handle checkbox change
    const [isChecked, setIsChecked] = useState(false);
    const [checkedCount, setCheckedCount] = useState(0);

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        setCheckedCount(prevCount => checked ? prevCount + 1 : prevCount - 1);
    };
    useEffect(() => {
        setIsChecked(checkedCount > 0);
    }, [checkedCount]);
    // End Function to handle checkbox change

    useEffect(() => {
        async function fetchSchedules() {
            try {
                const data = await getAllSchedules(values);
                setSchedules(data);
            } catch (error) {
                console.error('Error fetching Schedules:', error);
            }
        }
        fetchSchedules();
    }, []);

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('このグループを削除してもよろしいですか?');
            if (confirmed) {
                deleteGroup(id).then(res => {
                    window.location.reload();
                })
            }

        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    function formatDate(dateString) {
        if (dateString != null) {
            const date = new Date(dateString);
            date.setHours(0, 0, 0, 0);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
            return formattedDate;
        } else {
            return '';
        }
    }

    return (
        <div className="container-fluid">
            <div className="row content">
                <Navbar />
                <Sidebar />
                <div className="col-sm-10 content_body">
                    <h2 className="text-center">スケジュール一覧</h2>
                    <div className="col-sm-12">
                        <div className="up-btn-gp">
                            <Link to="/schedule/schedules/create" className='btn btn-primary'>スケジュールを登録</Link>
                        </div><table className="table table-bordered" style={{ marginTop: '10px' }}>
                            <thead className="tbl-header-ft">
                                <tr>
                                    <th scope="col" rowSpan="2" style={{ width: '2%' }}></th>
                                    <th scope="col" rowSpan="2" style={{ width: '2%' }}></th>
                                    <th scope="col" rowSpan="2" style={{ width: '2%' }}></th>
                                    <th scope="col" colSpan="2" style={{ width: '47%' }}>イベント開始日時 ~ 終了日時</th>
                                    <th scope="col" rowSpan="2" style={{ width: '4%' }}>作成者</th>
                                    <th scope="col" colSpan="2" style={{ width: '16%' }}>繰り返しタイプ</th>
                                    <th scope="col" rowSpan="2" style={{ width: '8%' }}>タイプ</th>
                                    <th scope="col" rowSpan="2" style={{ width: '19%' }}></th>
                                </tr>
                                <tr>
                                    <th>スケジュールタイトル</th>
                                    <th>説明</th>
                                    <th>繰り返す終了日付</th>
                                </tr>
                            </thead>
                            <tbody className="tbl-body-ft">

                                {schedules && schedules.length > 0 ? (
                                    currentItems.map((schedule, index) => (
                                        <React.Fragment key={schedule.id}>
                                            <tr style={{
                                                backgroundColor: !schedule.event_flg && schedule.schedule_status_flg
                                                    ? '#919191'
                                                    : schedule.schedule_theme_color
                                            }}>
                                                <td rowSpan="2" style={{ width: '2%' }}>
                                                    {schedule.user_code === userCode && !schedule.schedule_status_flg && (
                                                        <input type="checkbox"
                                                            id={`chkSelectedIds_${schedule.id}`}
                                                            name={`chkSelectedIds_${schedule.id}`}
                                                            className="custom-checkbox"
                                                            value={schedule.id}
                                                            onChange={handleCheckboxChange} />
                                                    )}
                                                </td>
                                                <td rowSpan="2" style={{ width: '2%' }}>{schedule.allday_flg ? '一日中' : ''}</td>
                                                <td rowSpan="2" style={{ width: '2%' }}>
                                                    {schedule.user_code !== userCode && schedule.schedule_display_flg ? (
                                                        <>
                                                            <FiCircle style={{ color: 'red' }} />
                                                            Busy
                                                        </>
                                                    ) : <>
                                                        <FiCircle style={{ color: 'green' }} />
                                                        Free
                                                    </>}
                                                </td>
                                                <td colSpan="2" style={{ width: '47%' }}>{formatDate(schedule.schedule_start_date_time)} ~ {formatDate(schedule.schedule_end_date_time)}</td>
                                                <td rowSpan="2" style={{ width: '4%' }}>{schedule.user_name}</td>
                                                <td colSpan="2" style={{ width: '16%' }}>
                                                    {schedule.repeat_type === '01' ? 'リピート無し' :
                                                        schedule.repeat_type === '02' ? '毎日' :
                                                            schedule.repeat_type === '03' ? '毎週' :
                                                                schedule.repeat_type === '04' ? '毎月' :
                                                                    schedule.repeat_type === '05' ? '毎年' : ''}
                                                </td>
                                                <td rowSpan="2" style={{ width: '8%' }}>{schedule.event_flg ? 'イベント' : 'タスク'}</td>
                                                <td rowSpan="2" style={{ width: '19%' }}>
                                                    {schedule.user_code === userCode ? (
                                                        <>
                                                            {!schedule.schedule_status_flg && (
                                                                <Link to={`/schedule/groups/edit/${schedule.id}`} className='btn btn-primary'>
                                                                    編集
                                                                </Link>
                                                            )}
                                                            <button
                                                                type="button"
                                                                data-scheduleid={schedule.id}
                                                                data-schedulecode={schedule.schedule_code}
                                                                id="btnScheduleDelete"
                                                                className="mx-2 btn btn-danger"
                                                                data-toggle="modal"
                                                                data-target="#deleteConfirmModel"
                                                            >
                                                                削除
                                                            </button>
                                                        </>
                                                    ) : <>
                                                        {(() => {
                                                            let isModifySchedule = false;
                                                            if (schedule.attendee_del_flg != null) {
                                                                isModifySchedule = true;
                                                            }
                                                            return (
                                                                <>
                                                                    {!schedule.guest_permission_flg || !isModifySchedule ? (
                                                                        <a href={`/schedule/schedules/attendee_list/${schedule.id}`}>ゲストリスト</a>
                                                                    ) : null}
                                                                    {schedule.guest_permission_flg && isModifySchedule && !schedule.schedule_status_flg ? (
                                                                        <a href={`/schedule/schedules/edit/${schedule.id}`}>
                                                                            <button type="button" className="btn btn-primary">編集</button>
                                                                        </a>
                                                                    ) : null}
                                                                </>
                                                            );
                                                        })()}
                                                    </>}
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: 'lightblue' }} >
                                                <td>{schedule.schedule_title}</td>
                                                <td>{schedule.schedule_description}</td>
                                                <td>{formatDate(schedule.repeat_until)}</td>
                                            </tr>
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10">スケジュールはありません。</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {schedules && schedules.length > 0 && (
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                        <button
                            type="button"
                            className="btn btn-primary"
                            id="btnDownloadSchedule"
                            data-toggle="modal"
                            data-target="#downloadConfirmModel"
                            disabled={!isChecked}
                        // onClick={handleDownloadSchedule}
                        // disabled={!Cookies.get('userId')} // Disable if user is not logged in
                        >
                            <FiDownload /> ダウンロード
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleList;

