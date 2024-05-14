import React, { useState, useEffect } from 'react';
import { getAllGroups, deleteGroup } from '../../api';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import PaginationComponent from '../PaginationComponent';

function GroupList() {
    const [groups, setGroups] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalItems = groups.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = groups.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getAllGroups();
                setGroups(data);
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        }
        fetchGroups();
    }, []);

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('このグループを削除してもよろしいですか?');
            if (confirmed) {
                const res = await deleteGroup(id);
                window.alert(res.message);
                if (res.statusCode === 200) {
                    window.location.reload();
                }
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
                        <div className="up-btn-gp">
                            <Link to="/schedule/groups/create" className='btn btn-primary'>グループを登録</Link>
                        </div>
                        <table className="table table-bordered" style={{ marginTop: '10px' }}>
                            <thead className="tbl-header-ft">
                                <tr>
                                    <th><b>グループ名</b></th>
                                    <th></th>
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
                                                <button type='button' onClick={() => handleDelete(group.id)} className='mx-2 btn btn-danger'>削除</button>
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

