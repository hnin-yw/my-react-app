import React, { useState, useEffect } from 'react';
import { getAllGroups, deleteGroup } from '../../api';
import { Link, useLocation } from 'react-router-dom'; // Import useHistory from 'react-router'
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';
import Message from '../Message';

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalItems = groups.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);

    const location = useLocation();
    const message = location.state?.message || '';

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getAllGroups();
                setGroups(data);

                if (location.state && location.state.message) {
                    window.history.replaceState({}, '')
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        }
        fetchGroups();
    }, [location]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
            const res = await deleteGroup(deleteIdValue);
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
                    <h2 className="text-center">グループ一覧</h2>
                    <div className="col-sm-12">
                        {message !== '' && <Message isError={false} message={message} />}
                        <div className="up-btn-gp">
                            <Link to="/schedule/groups/create" className='btn btn-primary'>グループを登録</Link>
                        </div>
                        <table className="table table-bordered" style={{ marginTop: '10px' }}>
                            <thead className="tbl-header-ft">
                                <tr>
                                    <th><b>グループ名</b></th>
                                    <th>アクション</th>
                                </tr>
                            </thead>
                            <tbody className="tbl-body-ft">
                                {groups && groups.length > 0 ? (
                                    currentItems.map((group, index) => (
                                        <tr key={index}>
                                            <td>{group.group_name}</td>
                                            <td style={{ width: '20%' }}>
                                                <Link to={`/schedule/groups/edit/${group.id}`} className='btn btn-primary'>
                                                    編集
                                                </Link>
                                                <button type="button" className="mx-2 btn btn-danger" onClick={() => handleOpenModal(group.id)}>削除</button>
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
                                                                    <p>グループの情報を削除してもよろしいですか?</p>
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
                                        <td colSpan="2">グループはありません。</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {groups && groups.length > 0 && (
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

export default GroupList;
