import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchTasks();
      }
    });
  }, []);

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) console.error('Error fetching tasks:', error);
    else setTasks(data || []);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert('Sign up error: ' + error.message);
    else alert('Check your email to confirm your account!');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Sign in error: ' + error.message);
    else {
      setEmail('');
      setPassword('');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setTasks([]);
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        { title: input, completed: false, user_id: session.user.id }
      ])
      .select();
    if (error) console.error('Error adding task:', error);
    else {
      setTasks([data[0], ...tasks]);
      setInput('');
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) console.error('Error deleting task:', error);
    else setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleTask = async (id, completed) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id);
    if (error) console.error('Error updating task:', error);
    else setTasks(tasks.map(task => task.id === id ? { ...task, completed: !completed } : task));
  };

  if (!session) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <h1>Todo App</h1>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} className="toggle-btn">
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>My Todo App</h1>
        <button onClick={handleSignOut} className="logout-btn">Logout</button>
      </div>
      <div className="app-content">
        <form onSubmit={addTask} className="add-task-form">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Add a new task..." />
          <button type="submit">Add Task</button>
        </form>
        <ul className="task-list">
          {tasks.map(task => (
            <li key={task.id} className={task.completed ? 'completed' : ''}>
              <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id, task.completed)} />
              <span>{task.title}</span>
              <button onClick={() => deleteTask(task.id)} className="delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;