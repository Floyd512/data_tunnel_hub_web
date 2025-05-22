import { createBrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import MainLayout from './components/MainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <MainLayout />,
  },
]); 