import React, { useCallback, useEffect, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:4000');


function App() {
  const [value, setValue] = useState("console.log('hello world!');");
 

  useEffect(() => {
    socket.on('codeChange', (newValue) => {
      setValue(newValue);
    });
  }, [value]);

  const onChange = useCallback((val, viewUpdate) => {
    console.log('value:', val);
    setValue(val);
    socket.emit('codeChange', val); 
  }, []);
  
  return <CodeMirror value={value} height="100vh" theme={dracula} extensions={[javascript({ jsx: true })]} onChange={onChange} />;
}
export default App;