import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, loginData);
        return response.data;
    } catch (error) {
        throw new Error('Failed to login. Please try again later.');
    }
};

export const getAllSchedules = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/schedules`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch schedules. Please try again later.');
    }
};

export const getAllAttendeesBySchedule = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/schedules/attendee_list/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch attendees. Please try again later.');
    }
};

export const downloadSchedule = async (scheduleIds) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/schedules/download`, {
            params: { ids: scheduleIds }
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to download schedule. Please try again later.');
    }
};

export const saveSchedule = async (scheduleData) => {
    try {
        const saveResponse = await axios.post(`${API_BASE_URL}/schedules`, scheduleData, {
            withCredentials: true
        });
        return saveResponse.data;
    } catch (error) {
        console.error('Error saving schedule:', error);
        throw new Error('Failed to save schedule. Please try again later.');
    }
};

export const getScheduleById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/schedules/edit/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch schedule details. Please try again later.');
    }
};

export const updateSchedule = async (scheduleData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/schedules/update`, scheduleData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw new Error('Failed to update schedule. Please try again later.');
    }
};

export const deleteScheduleOne = async (deleteValue) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/schedules/deleteOne/${deleteValue}`, null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete Schedule. Please try again later.');
    }
};

export const deleteScheduleAll = async (deleteValue) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/schedules/deleteAll/${deleteValue}`, null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete Schedule. Please try again later.');
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch users. Please try again later.');
    }
};

export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/edit/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch group details. Please try again later.');
    }
};

export const saveUser = async (userData) => {
    try {
        const saveResponse = await axios.post(`${API_BASE_URL}/users`, userData, {
            withCredentials: true
        });

        return saveResponse.data;
    } catch (error) {
        console.error('Error saving user:', error);
        throw new Error('Failed to save user. Please try again later.');
    }
};

export const updateUser = async (userData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/update`, userData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Failed to update user. Please try again later.');
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/users/delete/${id}`, null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user. Please try again later.');
    }
};

//Groups
export const getAllGroups = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/groups`, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch groups. Please try again later.');
    }
};

export const getGroupById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/groups/edit/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch group details. Please try again later.');
    }
};

export const saveGroup = async (gpData) => {
    try {
        const saveResponse = await axios.post(`${API_BASE_URL}/groups`, gpData, {
            withCredentials: true
        });
        return saveResponse.data;
    } catch (error) {
        console.error('Error saving group:', error);
        throw new Error('Failed to save group. Please try again later.');
    }
};

export const updateGroup = async (gpData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/groups/update`, gpData, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to update group. Please try again later.');
    }
};

export const deleteGroup = async (id) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/groups/delete/${id}`, null, {
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete group. Please try again later.');
    }
};
