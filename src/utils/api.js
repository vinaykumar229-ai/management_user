import axios from "axios";

const BASE = "https://jsonplaceholder.typicode.com/users";

export const fetchUsers = () => axios.get(BASE);
export const createUser = (user) => axios.post(BASE, user);
export const updateUser = (id, user) => axios.put(`${BASE}/${id}`, user);
export const removeUser = (id) => axios.delete(`${BASE}/${id}`);
