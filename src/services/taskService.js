import axios from 'axios';

const baseURL = 'http://localhost:8085/api/task';

const taskService = {
  getAllTasks() {
    return axios.get(`${baseURL}/getAllTask`);
  },
  saveTask(newTask) {
    return axios.post(`${baseURL}/saveTask`, newTask);
  },
  
  updateContent(id, task) {
    return axios.put(`${baseURL}/updateContent/${id}`, task);
  },
  
  softDeleteTask(id) {
    return axios.put(`${baseURL}/softDeleteTask/${id}`);
  },
  
  changeTaskStatus(id) {
    return axios.put(`${baseURL}/changeTaskStatus/${id}`);
  }
};

export default taskService;
