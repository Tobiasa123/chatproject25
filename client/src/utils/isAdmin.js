import { jwtDecode } from 'jwt-decode';

//util to check if user is admin
export const isAdmin = () => {
  const token = sessionStorage.getItem('authToken');
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.role === 'admin';
  } catch (error) {
    console.error('Invalid token:', error);
    return false;
  }
};
