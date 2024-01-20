import './App.css';
import './Todo.css'
import {
  BrowserRouter,
  Route,
} from 'react-router-dom';
import React from 'react';
import Todo from './components/Todo';
import Header from './components/Header';
import { Routes } from 'react-router-dom/dist';

function App() {

  return (
    <BrowserRouter>
      <div className='page'>
        <Header />
        <br />
        <Routes>
          <Route path="/" element={<Todo todoType={"all"}/>} />
          <Route path="/urgent" element={<Todo todoType={"urgent"}/>} />
          <Route path="/finished" element={<Todo todoType={"finish"}/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
