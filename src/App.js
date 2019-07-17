import React from 'react';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js/dist/popper.min.js';
import 'jquery/dist/jquery.min.js';

import './styles.css';

import Header from './components/Header';
import Main from './pages/main';

const App = () => ( 
  <div className="App">
    <Header />
    <Main />
  </div>
);

export default App;
