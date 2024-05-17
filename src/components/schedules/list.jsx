import React, { useState, useEffect } from 'react';
import { getAllSchedules, deleteScheduleOne, deleteScheduleAll, downloadSchedule } from '../../api';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';
import { FiCircle, FiDownload } from 'react-icons/fi';
import cookies from 'js-cookie';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

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
    const [selectedScheduleIds, setSelectedScheduleIds] = useState([]);
    const [isDownloadDisabled, setIsDownloadDisabled] = useState(false);
    const handleCheckboxChange = (event, id) => {
        const { checked } = event.target;
        if (checked) {
            setSelectedScheduleIds(prevSelected => [...prevSelected, id]);
        } else {
            setSelectedScheduleIds(prevSelected => prevSelected.filter(itemId => itemId !== id));
        }
    };
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
    }, [values]);

    const [showModal, setShowModal] = useState(false);
    const [isdeleteAll, setDeleteOption] = useState(true);
    const handleOpenModal = (id) => {
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleRadioChange = (event) => {
        const value = event.target.value;
        if (value !== "deleteAll") {
            setDeleteOption(false);
        } else {
            setDeleteOption(true);
        }
    };
    const handleDelete = async (deleteValue) => {
        try {
            if (isdeleteAll) {
                deleteScheduleAll(deleteValue).then(res => {
                    window.alert(res.message);
                    window.location.reload();
                })
            } else {
                deleteScheduleOne(deleteValue).then(res => {
                    window.alert(res.message);
                    window.location.reload();
                })
            }
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    //Download CSV
    const handleDownloadSchedule = async () => {
        try {
            const confirmed = window.confirm('スケジュールCSVをダウンロードしてもよろしいですか?');
            if (confirmed) {
                const downloadSchedules = await downloadSchedule(selectedScheduleIds);
                generateExcel(downloadSchedules);
            }
        } catch (error) {
            console.error('Error downloading data:', error);
        } finally {
        }
    };
    const generateExcel = (downloadSchedules) => {
        const workbook = XLSX.utils.book_new();
        const sheet = XLSX.utils.aoa_to_sheet([
            ["Schedule Title", "Schedule Start Date Time", "Schedule End Date Time", "AllDay Flg", "Repeat Type",
                "Repeat Until", "Schedule Display Flg", "Location", "Meeting Link", "Schedule Description", "Schedule Theme Color",
                "Other Visibility Flg", "Event Flag", "Schedule Status Flag", "Delete Flag", "Created By", "Created At",
                "Updated By", "Updated At"],
            ...downloadSchedules.map(schedule => [
                schedule.schedule_title,
                formatDate(schedule.schedule_start_date_time),
                formatDate(schedule.schedule_end_date_time),
                schedule.allday_flg,
                schedule.repeat_type,
                schedule.repeat_until ? formatDate(schedule.repeat_until) : null,
                schedule.schedule_display_flg,
                schedule.location,
                schedule.meet_link,
                schedule.schedule_description,
                schedule.schedule_theme_color,
                schedule.other_visibility_flg,
                schedule.event_flg,
                schedule.schedule_status_flg,
                schedule.del_flg,
                schedule.created_by,
                formatDate(schedule.created_at),
                schedule.updated_by,
                formatDate(schedule.updated_at)
            ])
        ]);
        XLSX.utils.book_append_sheet(workbook, sheet, "schedules");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'schedules.xlsx');

        setSelectedScheduleIds([]);
        setIsDownloadDisabled(true);
    };

    function formatDate(dateString) {
        if (dateString != null) {
            const date = new Date(dateString);
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
                                    <th scope="col" rowSpan="2" style={{ width: '19%' }}>アクション</th>
                                </tr>
                                <tr>
                                    <th>スケジュールタイトル</th>
                                    <th>説明</th>
                                    <th>繰り返す終了日付</th>
                                </tr>
                            </thead>
                            <tbody className="tbl-body-ft">

                                {schedules && schedules.length > 0 ? (
                                    currentItems.map((schedule, index) => {
                                        const bgColor = (!schedule.event_flg && schedule.schedule_status_flg) ? '#919191' : schedule.schedule_theme_color;

                                        return (
                                            <React.Fragment key={schedule.id}>
                                                <tr>
                                                    <td rowSpan="2" style={{ width: '2%', backgroundColor: bgColor }}>
                                                        {schedule.user_code === userCode && !schedule.schedule_status_flg && (
                                                            <input type="checkbox"
                                                                id={`chkSelectedIds_${schedule.id}`}
                                                                name={`chkSelectedIds_${schedule.id}`}
                                                                className="custom-checkbox"
                                                                value={schedule.id}
                                                                checked={selectedScheduleIds.includes(schedule.id)}
                                                                onChange={e => handleCheckboxChange(e, schedule.id)}
                                                            />
                                                        )}
                                                    </td>
                                                    <td rowSpan="2" style={{ width: '2%', backgroundColor: bgColor }}>{schedule.allday_flg ? '一日中' : ''}</td>
                                                    <td rowSpan="2" style={{ width: '2%', backgroundColor: bgColor }}>
                                                        {schedule.user_code !== userCode && (
                                                            <>
                                                                {schedule.schedule_display_flg ? (
                                                                    <>
                                                                        <FiCircle style={{ color: 'red' }} />
                                                                        Busy
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FiCircle style={{ color: 'green' }} />
                                                                        Free
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                    </td>
                                                    <td colSpan="2" style={{ width: '47%', backgroundColor: bgColor }}>{formatDate(schedule.schedule_start_date_time)} ~ {formatDate(schedule.schedule_end_date_time)}</td>
                                                    <td rowSpan="2" style={{ width: '4%', backgroundColor: bgColor }}>{schedule.user_name}</td>
                                                    <td colSpan="2" style={{ width: '16%', backgroundColor: bgColor }}>
                                                        {schedule.repeat_type === '01' ? 'リピート無し' :
                                                            schedule.repeat_type === '02' ? '毎日' :
                                                                schedule.repeat_type === '03' ? '毎週' :
                                                                    schedule.repeat_type === '04' ? '毎月' :
                                                                        schedule.repeat_type === '05' ? '毎年' : ''}
                                                    </td>
                                                    <td rowSpan="2" style={{ width: '8%', backgroundColor: bgColor }}>{schedule.event_flg ? 'イベント' : 'タスク'}</td>
                                                    <td rowSpan="2" style={{ width: '19%', backgroundColor: bgColor }}>
                                                        {schedule.user_code === userCode ? (
                                                            <>
                                                                {!schedule.schedule_status_flg && (
                                                                    <Link to={`/schedule/schedules/edit/${schedule.id}`} className='btn btn-primary'>
                                                                        編集
                                                                    </Link>
                                                                )}
                                                                <button type="button" className="mx-2 btn btn-danger" onClick={() => handleOpenModal(schedule.id)}>削除</button>
                                                                {/* Delete confirmation modal */}
                                                                {showModal && (
                                                                    <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                                                                        <div className="modal-dialog" role="document">
                                                                            <div className="modal-content">
                                                                                <div className="modal-header">
                                                                                    <h5 className="modal-title">情報削除の確認</h5>
                                                                                    <button type="button" className="close" onClick={handleCloseModal}>
                                                                                        <span aria-hidden="true">&times;</span>
                                                                                    </button>
                                                                                </div>
                                                                                <div className="modal-body">
                                                                                    <p>スケジュールの情報を削除してもよろしいですか?</p>
                                                                                    <div className="form-check">
                                                                                        <input
                                                                                            type="radio"
                                                                                            id="deleteAllRadio"
                                                                                            className="form-check-input"
                                                                                            name="deleteOption"
                                                                                            value="deleteAll"
                                                                                            checked={isdeleteAll}
                                                                                            onChange={handleRadioChange}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor="deleteAllRadio">すべてのスケジュール削除</label>
                                                                                    </div>
                                                                                    <div className="form-check">
                                                                                        <input
                                                                                            type="radio"
                                                                                            id="deleteSingleRadio"
                                                                                            className="form-check-input"
                                                                                            name="deleteOption"
                                                                                            value="deleteOne"
                                                                                            checked={!isdeleteAll}
                                                                                            onChange={handleRadioChange}
                                                                                        />
                                                                                        <label className="form-check-label" htmlFor="deleteSingleRadio">このスケジュールのみ削除</label>
                                                                                    </div>

                                                                                    {/* You can add more radio options here */}
                                                                                </div>
                                                                                <div className="modal-footer">
                                                                                    <button
                                                                                        type="button"
                                                                                        className="btn btn-danger"
                                                                                        onClick={() => {
                                                                                            if (!isdeleteAll) {
                                                                                                handleDelete(schedule.id);
                                                                                            } else {
                                                                                                handleDelete(schedule.schedule_code);
                                                                                            }
                                                                                        }}
                                                                                    >
                                                                                        削除
                                                                                    </button>
                                                                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>キャンセル</button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
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
                                                <tr>
                                                    <td style={{ backgroundColor: bgColor }}>{schedule.schedule_title}</td>
                                                    <td style={{ backgroundColor: bgColor }}>{schedule.schedule_description}</td>
                                                    <td style={{ backgroundColor: bgColor }}>{formatDate(schedule.repeat_until)}</td>
                                                </tr>
                                            </React.Fragment>
                                        );
                                    })
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
                            disabled={!selectedScheduleIds.length || isDownloadDisabled}
                            onClick={handleDownloadSchedule}
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

