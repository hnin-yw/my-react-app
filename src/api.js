import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

export const login = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, loginData);
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw new Error('Failed to update group. Please try again later.');
    }
};

export const getAllSchedules = async (values) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/schedules`, values);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch schedules. Please try again later.');
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

//Groups
export const getAllGroups = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/groups`);
        return response.data;
    } catch (error) {
        throw new Error('Failed to fetch groups. Please try again later.');
    }
};

export const saveGroup = async (gpData) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/groups/code`);
        const group_code = response.data.group_code;
        gpData.group_code = group_code;

        const saveResponse = await axios.post(`${API_BASE_URL}/groups`, gpData);

        return saveResponse.data;
    } catch (error) {
        console.error('Error saving group:', error);
        throw new Error('Failed to save group. Please try again later.');
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

export const updateGroup = async (gpData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/groups/update`, gpData);
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
        throw new Error('Failed to update group. Please try again later.');
    }
};

export const deleteGroup = async (id) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/groups/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
        throw new Error('Failed to delete group. Please try again later.');
    }
};
