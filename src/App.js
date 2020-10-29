import React from 'react';
import './App.css';
import AddPoll from './components/AddPoll'
import Poll from './components/Poll'
import Results from './components/Result'
import { BrowserRouter as Router, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Route path="/" exact component={AddPoll} />
        <Route path="/AddPoll" exact component={AddPoll} />
        <Route path="/Poll/:id" exact component={Poll} />
        <Route path="/Results/:id" exact component={Results} />
      </Router>
    </div>
  );
}

export default App;
