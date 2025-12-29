import { Routes, Route } from 'react-router-dom';
import Home from '../pages/frontend/Home';
import Login from '../pages/sign-in/Login';
import Sign_up from '../pages/sign-in/Sign_up';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/sign_up' element={<Sign_up/>} />
    </Routes>
  );
}
