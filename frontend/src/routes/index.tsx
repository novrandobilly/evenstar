import { Routes, Route, Navigate } from 'react-router-dom';
import HomeFeature from '../features/home';
import CreateSessionFeature from '../features/create-session';
import InSessionFeature from '../features/in-session';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeFeature />} />
      <Route path="/create-session" element={<CreateSessionFeature />} />
      <Route path="/in-session" element={<InSessionFeature />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
