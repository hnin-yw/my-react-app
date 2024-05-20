import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../api';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';
import cookies from 'js-cookie';
import Message from '../Message';

const UserList = () => {
    const userCode = cookies.get('userCode');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    const location = useLocation();
    const message = location.state?.message || '';

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    useEffect(() => {
        async function fetchUsers() {
            try {
                const data = await getAllUsers();
                setUsers(data);

                if (location.state && location.state.message) {
                    window.history.replaceState({}, '')
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
        fetchUsers();
    }, []);

    const [deleteIdValue, setDeleteIdValue] = useState('');
    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = (id) => {
        setShowModal(true);
        setDeleteIdValue(id);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };
    const handleDelete = async () => {
        try {
            const res = await deleteUser(deleteIdValue);
            window.alert(res.message);
            setShowModal(false);
            if (res.status === 200) {
                window.location.reload();
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
                    <h2 className="text-center">ユーザ一覧</h2>
                    <div className="col-sm-12">
                        {message !== '' && <Message isError={false} message={message} />}
                        <div className="up-btn-gp">
                            <Link to="/schedule/users/create" className='btn btn-primary'>ユーザを登録</Link>
                        </div>
                        <table className="table table-bordered" style={{ marginTop: '10px' }}>
                            <thead className="tbl-header-ft">
                                <tr>
                                    <th>ユーザ名</th>
                                    <th>ユーザの名</th>
                                    <th>ユーザの姓</th>
                                    <th>グループ名</th>
                                    <th>メール</th>
                                    <th>アクション</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? (
                                    currentItems.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.user_name}</td>
                                            <td>{user.user_first_name}</td>
                                            <td>{user.user_last_name}</td>
                                            <td>{user.group_name}</td>
                                            <td>{user.email}</td>
                                            <td style={{ width: '20%' }}>
                                                {user.user_code !== userCode ? (
                                                    <Link
                                                        to={`/schedule/users/edit/${user.id}`}
                                                        className='btn btn-primary'
                                                    >
                                                        編集
                                                    </Link>
                                                ) : (
                                                    <button
                                                        type='button'
                                                        className='btn btn-primary'
                                                        disabled={user.user_code === userCode}
                                                    >
                                                        編集
                                                    </button>
                                                )}
                                                <button
                                                    type="button"
                                                    className="mx-2 btn btn-danger"
                                                    onClick={() => user.user_code !== userCode && handleOpenModal(user.id)}
                                                    disabled={user.user_code === userCode}>削除</button>
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
                                                                    <p>ユーザの情報を削除してもよろしいですか?</p>
                                                                </div>
                                                                <div className="modal-footer">
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger"
                                                                        onClick={() => { handleDelete(); }}
                                                                    >
                                                                        削除
                                                                    </button>
                                                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>キャンセル</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}


                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6">ユーザはありません。</td>
                                    </tr>
                                )}
                            </tbody>

                        </table>
                        {users && users.length > 0 && (
                            <PaginationComponent
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>);
};

export default UserList;
