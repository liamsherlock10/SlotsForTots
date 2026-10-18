/*All the calls to the backend live here so the pages don't have to know the details*/
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const request = async (path, { token, body } = {}) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    let response;
    try {
        response = await fetch(API_URL + path, {
            method: body === undefined ? 'GET' : 'POST',
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        throw new Error("Can't reach the server. Is it running?");
    }
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
    }
    return data;
};

export const register = (username, password) => request('/api/register', { body: { username, password } });
export const login = (username, password) => request('/api/login', { body: { username, password } });
export const getMe = (token) => request('/api/me', { token });
export const placeBet = (token, amount) => request('/api/bet', { token, body: { amount } });
export const earnMoney = (token) => request('/api/earn', { token, body: {} });
