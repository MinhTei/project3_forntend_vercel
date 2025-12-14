import { useEffect, useState } from 'react';
import './App.css';

// 👇 Dán Link Railway của bạn vào đây (Bỏ dấu / ở cuối)
const API_URL = "https://project3-backend-minhtai.up.railway.app";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  // 1. Lấy danh sách (GET)
  useEffect(() => {
    // Sửa: Dùng API_URL và bỏ /api
    fetch(`${API_URL}/todos`) 
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Lỗi:", err));
  }, []);

  // 2. Thêm mới (POST)
  const addTask = async (e) => {
    e.preventDefault();
    if(!task.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sửa: Backend cần key là 'description', không phải 'task'
        body: JSON.stringify({ description: task }) 
      });
      
      if (!res.ok) {
        alert("Thêm thất bại");
        return;
      }
      
      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
      setTask('');
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  // 3. Xóa (DELETE)
  const deleteTask = async (id) => {
    try {
      // Sửa: Dùng API_URL
      const res = await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      
      if (res.ok) {
        // Sửa: Backend trả về todo_id, nên lọc theo todo_id
        setTodos(todos.filter(t => t.todo_id !== id));
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  // 4. Update trạng thái (PUT)
  const toggleTask = async (id, description, currentCompleted) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Backend yêu cầu cả description khi update (theo code cũ)
        body: JSON.stringify({ 
            description: description, 
            completed: !currentCompleted 
        })
      });
      
      if (res.ok) {
        // Cập nhật lại state cục bộ cho nhanh
        setTodos(todos.map(t => 
            t.todo_id === id ? { ...t, completed: !currentCompleted } : t
        ));
      }
    } catch (err) {
      console.error("Lỗi:", err);
    }
  };

  // Logic lọc công việc
  const pendingTodos = todos.filter(t => !t.completed);
  const completedTodos = todos.filter(t => t.completed);
  const completedCount = completedTodos.length;

  return (
    <div className="app-container">
      <div className="app-wrapper">
        <div className="header">
          <h1>✨ My Tasks (Project 3)</h1>
        </div>

        <form onSubmit={addTask} className="form-container">
          <div className="input-group">
            <input 
              value={task} 
              onChange={e => setTask(e.target.value)} 
              placeholder="Thêm công việc mới..." 
              className="input-field"
              autoFocus
            />
            <button className="btn-add">➕ Thêm</button>
          </div>
        </form>

        <div className="content-wrapper">
          {/* Cột trái: Chưa làm */}
          <div className="left-column">
            <h2>📋 Cần làm ({pendingTodos.length})</h2>
            <ul className="todos-list">
              {pendingTodos.map((t, index) => (
                // LƯU Ý: Dùng t.todo_id thay vì t.id
                <li key={t.todo_id} className="todo-item">
                  <div className="todo-checkbox">
                    <input 
                      type="checkbox"
                      checked={t.completed || false}
                      // Truyền t.description vào hàm toggle
                      onChange={() => toggleTask(t.todo_id, t.description, t.completed)}
                    />
                  </div>
                  {/* LƯU Ý: Dùng t.description thay vì t.task */}
                  <span className="todo-text">{t.description}</span>
                  
                  <button onClick={() => deleteTask(t.todo_id)} className="btn-delete">🗑️</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột phải: Đã xong */}
          <div className="right-column">
            <h2>✅ Đã xong ({completedCount})</h2>
            <ul className="todos-list completed-list">
              {completedTodos.map((t) => (
                <li key={t.todo_id} className="todo-item completed">
                  <div className="todo-checkbox">
                    <input 
                      type="checkbox"
                      checked={t.completed || false}
                      onChange={() => toggleTask(t.todo_id, t.description, t.completed)}
                    />
                  </div>
                  <span className="todo-text">{t.description}</span>
                  <button onClick={() => deleteTask(t.todo_id)} className="btn-delete">🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;