import { useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'

const TodoItem = ({ todo, toggleComplete, editTodo, deleteTodo }) => {
  return (
    <div className={`flex flex-wrap w-full items-center rounded-md px-3 py-2 justify-between todo-item gap-x-2 transition duration-300 shadow-md hover:shadow-lg ${todo.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          className="cursor-pointer"
          defaultChecked={todo.completed}
          onClick={() => toggleComplete(todo.id)}
        />
        <span
          className="ml-3 text-lg font-medium transition duration-300"
          style={{
            textDecoration: todo.completed ? 'line-through' : 'none',
            cursor: 'pointer',
            color: todo.completed ? 'gray' : 'black',
          }}
        >
          {todo.text}
        </span>
      </div>

      <div className="flex gap-x-1">
        <button className="bg-gray-600 text-white px-3 py-1 rounded-full shadow-sm hover:bg-gray-500 transition transform hover:scale-105"
          onClick={() => editTodo(todo.id)}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>

        <button className="bg-red-600 text-white px-3 py-1 rounded-full shadow-sm hover:bg-red-500 transition transform hover:scale-105"
          onClick={() => deleteTodo(todo.id)}
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  );
};

function App() {
  let [todos, setTodos] = useState([]);
  let [newTodo, setNewTodo] = useState('');
  let [editId, setEditId] = useState(null);
  let [darkMode, setDarkMode] = useState(false); // Dark mode state

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos && storedTodos !== 'undefined') {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch(error) {
        console.error('Failed to parse todos from local storage:', error);
        localStorage.removeItem('todos');
      }
    }
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos]);

  console.log('localStorage: ', localStorage);

  const inputRef = useRef(null);

  // Toggle todo complete
  const toggleComplete = (id) => {
    setTodos((prevTodos) =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    )
  };

  // Edit todo  
  const editTodo = (id) => {
    const todo = todos.find(todo => todo.id === id);
    setEditId({ id });
    setNewTodo(todo.text);
    inputRef.current?.select();
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Form submission handling
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newTodo.trim()) return;

    if (editId) {
      editId = editId.id;

      setTodos((prevTodo) =>
        prevTodo.map(todo =>
          todo.id === editId ? { ...todo, text: newTodo } : todo
        )
      );
      setEditId(null);
    } else {
      const newTask = {
        id: uuidv4(),
        text: newTodo,
        completed: false
      };

      setTodos([...todos, newTask]);
    }
    setNewTodo('');
  };

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const completedTasks = todos.filter(todo => todo.completed).length;
  const totalTasks = todos.length;

  return (
    <div className={darkMode ? 'bg-gray-900 text-gray-200 min-h-screen transition duration-500 rounded-lg px-5 py-5' : 'bg-gray-100 text-gray-900 min-h-screen transition duration-500 rounded-lg px-5 py-5'}>
      {/* Dark Mode Toggle */}
      <button
        className={`fixed top-10 p-3 right-48 rounded-full shadow-lg ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} transition transform hover:scale-110`}
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <i className="fa-solid fa-sun"></i>
        ) : (
          <i className="fa-solid fa-moon"></i>
        )}
      </button>

      <div className={darkMode ? "w-full max-w-xl mx-auto px-2 py-4 rounded-lg mb-3 border-2 border-gray-700"
        : "w-full max-w-xl mx-auto px-2 py-4 rounded-lg mb-3 shadow-lg"
      }>
        <div className="flex items-center justify-center gap-x-2 w-full mx-auto">
          <i className="fa-solid fa-list-check opacity-90 text-blue-600" style={{ fontSize: '2em' }}></i>
          <h2 className="text-4xl font-bold text-blue-600 px-3 py-3">Todo App</h2>
        </div>
        <hr className={darkMode ? "bg-gray-700 rounded my-3" : "bg-gray-200 rounded my-3"} />

        {/* Progress Indicator */}
        {totalTasks > 0 && (
          <div className="px-4 py-2">
            <p className="text-lg">Progress: {completedTasks} / {totalTasks} tasks completed</p>
            <div className="w-full bg-gray-300 rounded-full h-2 mb-4 mt-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-wrap justify-center px-1 py-3">
          <label htmlFor="addTodo" className={darkMode ? "w-full text-start px-4 py-1 font-semibold text-gray-300"
            : "w-full text-start px-4 py-1 font-semibold text-gray-600"
          }>Add Task</label>
          <div className="flex items-center gap-x-2 w-full justify-center px-3 py-2">
            <input
              className={darkMode ? "bg-transparent outline-none text-gray-300 border-2 border-gray-700 px-3 py-2 rounded-lg w-full shadow-md focus:ring-2 focus:ring-blue-400"
                : "outline-none px-3 py-2 rounded-lg w-full shadow-md focus:ring-2 focus:ring-blue-400"
              }
              placeholder="Enter the task"
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              ref={inputRef}
            />
            <button
              className="bg-blue-600 px-4 py-2 rounded-lg text-white shadow-md hover:bg-blue-500 transition duration-300"
              type="submit"
            >
              {!editId ? 'Add' : 'Edit'}
            </button>
          </div>
        </form>
      </div>

      <div className={darkMode ? "w-full max-w-xl mx-auto px-2 py-4 rounded-lg shadow-lg border-2 border-gray-700"
        : "w-full max-w-xl mx-auto px-2 py-4 rounded-lg shadow-lg"
      }>
        <h2 className="text-2xl font-bold px-3 py-3 text-blue-700">Tasks</h2>
        <div className="flex flex-col px-5 py-3 gap-y-3">
          {todos.length > 0 ? (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleComplete={toggleComplete}
                editTodo={editTodo}
                deleteTodo={deleteTodo}
              />
            ))
          ) : (
            <p className={darkMode ? "text-gray-300 text-center" : "text-gray-600 text-center"}>No tasks yet!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
