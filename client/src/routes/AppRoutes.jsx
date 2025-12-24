import { Routes, Route } from 'react-router-dom';
import Home from '../pages/frontend/Home';
import Login from '../pages/sign-in/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
