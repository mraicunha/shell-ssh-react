import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import stripAnsi from 'strip-ansi';
import './App.css';

const ws = socketIOClient('http://localhost:5000', {
  auth: {
    token: 'oi',
  },
});

export default function App () {
  const [commend, setCommend] = useState('');
  const [commendList, setCommendList] = useState([]);

  function updateScroll () {
    const element = document.getElementById('shell');
    element.scrollTop = element.scrollHeight;
  }

  useEffect(() => {
    alert('O terminal é um recurso em fase BETA.');
    ws.on('message', (msg) => {
      const data = JSON.parse(msg);
      data.data = stripAnsi(data.data);
      setCommendList((currentState) => ([...currentState, data]));
      setCommend('');
      updateScroll();
    });

    ws.on('connect_error', (err) => {
      console.log('aqui');
      console.log(err instanceof Error); // true
      console.log(err.message); // not authorized
      console.log(err.data); // { content: "Please retry later" }
    });
  }, []);
  useEffect(() => {
    function envia () {
      const data = { method: 'command', command: 'screen -a' };
      ws.emit('message', JSON.stringify(data));
      updateScroll();
    }
    setTimeout(() => {
      envia();
    }, 1000);
  }, []);

  const onSend = () => {
    const data = { method: 'command', command: commend };
    ws.emit('message', JSON.stringify(data));
    setCommend('');
    updateScroll();
  };

  // console.log('commendList', commendList);

  return (
    <>
      <div className="terminal space shadow">
        <div className="top">
          <div className="btns">
            <span className="circle red" />
            <span className="circle yellow" />
            <span className="circle green" />
          </div>
          <div className="title">bash anoditac</div>
        </div>
        <pre id="shell" className="body">
          <div>
            {commendList.map((list, i) => (
              <div
                id="history"
                style={{ textAlign: 'left' }}
                key={i}
              >
                {list.data}
              </div>
            ))}
          </div>
          <div className="line">
            <span id="path">
              &nbsp;
              {'>'}
            &nbsp;
            </span>
            <input
              type="text"
              value={commend}
              onChange={(e) => setCommend(e.target.value)}
              placeholder="Entre com o comando"
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  onSend();
                  updateScroll();
                }
              }}
            />
          </div>
        </pre>

      </div>
      {/* <div id="shell" className="shell">
        <pre>
          <div className="terminal">
            {commendList.map((list, i) => (
              <div
                id="history"
                style={{ textAlign: 'left' }}
                key={i}
              >
                {list.data}
              </div>
            ))}
            <div className="line">
              <span id="path">
                &nbsp;
                {'>'}
            &nbsp;
              </span>
              <input
                type="text"
                value={commend}
                onChange={(e) => setCommend(e.target.value)}
                placeholder="Entre com o comando"
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    onSend();
                    updateScroll();
                  }
                }}
              />
            </div>
          </div>
        </pre>
      </div>
              */}
    </>
  );
}
