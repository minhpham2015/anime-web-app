import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import SearchPage from './components/SearchPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/search" component={SearchPage} />
      </Switch>
    </div>
  );
}

export default App; 