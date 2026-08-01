import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import '../styles/TodoList.css';
import { useAuth } from '../context/AuthContext';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await API.get('/todos');
      setTodos(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to fetch todos');
      }
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/todos', { title, description });
      setTodos([response.data, ...todos]);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const response = await API.put(`/todos/${todo._id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map(t => t._id === todo._id ? response.data : t));
    } catch (err) {
      setError('Failed to update todo');
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Failed to delete todo');
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem('token');
    // navigate('/login');
    logout()
  };

  return (
    <div className="todo-container">
      <div className="header">
        <h2>My Todos</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      <div className="todos-list">
        {todos.length === 0 ? (
          <p>No todos yet. Add one to get started!</p>
        ) : (
          todos.map((todo) => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo)}
              />
              <div className="todo-content">
                <h3>{todo.title}</h3>
                {todo.description && <p>{todo.description}</p>}
              </div>
              <button onClick={() => handleDeleteTodo(todo._id)} className="delete-btn">
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}