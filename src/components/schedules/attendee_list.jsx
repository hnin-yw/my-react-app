import React, { useState, useEffect } from 'react';
import { getAllAttendeesBySchedule } from '../../api';
import { Link, useParams  } from 'react-router-dom';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';

function AttendeeList() {
    const { id } = useParams();
    const [attendees, setAttendees] = useState([]);

    useEffect(() => {
        async function fetchAttendees() {
            try {
                const data = await getAllAttendeesBySchedule(id);
                console.log(data);
                setAttendees(data);
            } catch (error) {
                console.error('Error fetching Attendees:', error);
            }
        }
        fetchAttendees();
    }, [id]);

    return (
        <div className="container-fluid">
            <div className="row content">
                <Navbar />
                <Sidebar />
                <div className="col-sm-10 content_body">
                    <h2 className="text-center">グループ一覧</h2>
                    <div className="col-sm-12">
                        {attendees && attendees.length > 0 && (
                            <div className="form-group col-sm-12 list-group">
                                {attendees.map((attendee, index) => (
                                    <a key={index} className="list-group-item">{index + 1}. {attendee.email}</a>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="up-btn-gp col-sm-12">
                        <Link to="/schedule/schedules"><button type="button" className='btn btn-light'>戻る</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendeeList;

