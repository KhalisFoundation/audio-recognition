import * as React from 'react';
import './App.css';
import { Microphone } from './components/microphone';

function App() {
  return (
    <div className="App">
      <div className="App-container">
        <h1>ਵਾਹਿਗੁਰੂਜੀਕਾਖ਼ਾਲਸਾ ਵਾਹਿਗੁਰੂਜੀਕੀਫ਼ਤਿਹ</h1>
        <h3>Audio-recognition Demo</h3>
        <Microphone/>
       </div>
    </div>
  );
}

export default App;
