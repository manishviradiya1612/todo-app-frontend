import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import './App.css';
import { useAuth } from './context/AuthContext';

function App() {
  // Check token directly from localStorage
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/todos"
          element={isAuthenticated ? <TodoList /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/todos' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;