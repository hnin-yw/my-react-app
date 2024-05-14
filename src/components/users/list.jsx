import React, { useState, useEffect } from 'react';
import { getAllUsers, deleteUser } from '../../api';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalItems = users.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
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

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('このユーザを削除してもよろしいですか?');
            if (confirmed) {
                deleteUser(id).then(res => {
                    window.alert(res.message);
                    if (res.statusCode === 200) {
                        window.location.reload();
                    }
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
                    <h2 className="text-center">ユーザ一覧</h2>
                    <div className="col-sm-12">
                        <div className="up-btn-gp">
                            <Link to="/schedule/users/create" className='btn btn-primary'>ユーザを登録</Link>
                        </div>
                        <table className="table table-bordered" style={{ marginTop: '10px' }}>
                            <thead className="tbl-header-ft">
                                <tr>
                                    <th>ユーザ名</th>
                                    <th>メール</th>
                                    <th>グループ名</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {users && users.length > 0 ? (
                                    currentItems.map((user, index) => (
                                        <tr key={index}>
                                            <td>{user.user_name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.group_name}</td>
                                            <td style={{ width: '20%' }}>
                                                <Link to={`/schedule/users/edit/${user.id}`} className='btn btn-primary'>
                                                    編集
                                                </Link>
                                                <button type='button' onClick={() => handleDelete(user.id)} className='mx-2 btn btn-danger'>削除</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2">ユーザはありません。</td>
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
