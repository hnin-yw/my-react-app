import React, { useState, useEffect } from 'react';
import { getAllSchedules, deleteGroup } from '../../api';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';
import Cookies from 'js-cookie';

function ScheduleList() {
    const [schedules, setSchedules] = useState([]);
    // const userCode = Cookies.get('userCode');
    // const groupCode = Cookies.get('groupCode');
    const userCode = 'U000001';
    const groupCode = 'G000003';

    const [values] = useState({
        user_code: userCode,
        group_code: groupCode
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalItems = schedules.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = schedules.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
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
                    console.log(res);
                    window.location.reload();
                })
            }

        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

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
                                    <th scope="col" rowSpan="2" style={{ width: '4%' }}><b>作成者</b></th>
                                    <th scope="col" colSpan="2" style={{ width: '16%' }}><b>繰り返しタイプ</b></th>
                                    <th scope="col" rowSpan="2" style={{ width: '8%' }}><b>タイプ</b></th>
                                    <th scope="col" rowSpan="2" style={{ width: '19%' }}></th>
                                </tr>
                                <tr>
                                    <th><b>スケジュールタイトル</b></th>
                                    <th><b>説明</b></th>
                                    <th><b>繰り返す終了日付</b></th>
                                </tr>
                            </thead>
                            <tbody className="tbl-body-ft">

                                {schedules && schedules.length > 0 ? (
                                    currentItems.map((schedule, index) => (
                                        <React.Fragment key={schedule.id}>
                                            <tr style={{
                                                backgroundColor: schedule.event_flg && !schedule.schedule_status_flg ? '#919191' :
                                                    schedule.schedule_theme_color
                                            }}>
                                                <td rowSpan="2" style={{ width: '2%' }}>
                                                    {schedule.user_code === userCode && !schedule.schedule_status_flg && (
                                                        <input type="checkbox" id="chkSelectedIds" name="chkSelectedIds" className="custom-checkbox" value={schedule.id} />
                                                    )}
                                                </td>
                                                <td rowSpan="2" style={{ width: '2%' }}>{schedule.all_day_flg && '一日中'}</td>
                                                <td rowSpan="2" style={{ width: '2%' }}>
                                                    {!schedule.user_code.equals(userCode) && schedule.schedule_display_flg ? <i className="bi bi-circle" style={{ color: 'red' }}></i> : null}
                                                    {!schedule.user_code.equals(userCode) && !schedule.schedule_display_flg ? <i className="bi bi-circle" style={{ color: 'green' }}></i> : null}
                                                </td>
                                                <td colSpan="2" style={{ width: '47%' }}>{schedule.schedule_start_date_time} ~ {schedule.schedule_end_date_time}</td>
                                                <td rowSpan="2" style={{ width: '4%' }}>{schedule.user.user_name}</td>
                                                <td colSpan="2" style={{ width: '16%' }}>
                                                    {schedule.repeat_type === '01' ? 'リピート無し' :
                                                        schedule.repeat_type === '02' ? '毎日' :
                                                            schedule.repeat_type === '03' ? '毎週' :
                                                                schedule.repeat_type === '04' ? '毎月' :
                                                                    schedule.repeat_type === '05' ? '毎年' : ''}
                                                </td>
                                                <td rowSpan="2" style={{ width: '8%' }}>{schedule.event_flg ? 'イベント' : 'タスク'}</td>
                                                <td rowSpan="2" style={{ width: '19%' }}>
                                                    {schedule.user_code.equals(userCode) && !schedule.schedule_status_flg ? (
                                                        <a href={`/schedule/schedules/edit/${schedule.id}`}>
                                                            <button type="button" className="btn btn-primary">編集</button>
                                                        </a>
                                                    ) : null}
                                                    <button type="button" data-scheduleid={schedule.id} data-schedulecode={schedule.schedule_code} id="btnScheduleDelete" className="btn btn-danger" data-toggle="modal" data-target="#deleteConfirmModel">削除</button>
                                                </td>
                                            </tr>
                                            <tr style={{ backgroundColor: schedule.event_flg && !schedule.schedule_status_flg ? '#919191' : schedule.schedule_theme_color }}>
                                                <td>{schedule.schedule_title}</td>
                                                <td>{schedule.schedule_description}</td>
                                                <td>{schedule.repeat_until_date_time}</td>
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ScheduleList;

