import { useEffect, useState } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import './Chat.scss';

export function Chat({ socket, username, roomName }) {
  const [msgToBeSent, setMsgToBeSent] = useState('');
  const [allMessages, setAllMessages] = useState([]);

  function submit(e) {
    e.preventDefault();

    console.log(msgToBeSent);
    console.log(username);

    if (msgToBeSent) {
      socket.emit('message', {
        text: msgToBeSent,
        username: username,
        roomName: roomName,
      });
      setMsgToBeSent('');
    }
  }
  useEffect(() => {
    socket.on('message', function (msg, username) {
      setAllMessages((prev) => [
        ...prev,
        { username: msg.username, text: msg.text },
      ]);
    });
  }, [socket]);

  const messageHTML = allMessages.map((message, i) => {
    return (
      <p key={i}>
        {message.username}: {message.text}
      </p>
    );
  });

  return (
    <div id="chat">
      <ScrollToBottom className="chatWindowDiv">{messageHTML}</ScrollToBottom>
      <form onSubmit={submit}>
        <input
          value={msgToBeSent}
          type="text"
          id="input"
          onChange={(e) => {
            setMsgToBeSent(e.target.value);
          }}
        />
        <input type="submit" id="sendChat" value="SEND" />
      </form>
    </div>
  );
}
