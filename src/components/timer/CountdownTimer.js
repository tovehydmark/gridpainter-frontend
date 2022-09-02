import { useState } from 'react';
import './Timer.scss';

export function CountdownTimer({ socket }) { 
  const [countDown, setCountDown] = useState(5);

  socket.on('countdownTimer', (timer) => {
    setCountDown(timer);
    console.log(timer);

    if(timer <= 0){
      socket.emit('canPaint');
    }
  });
  return (
    <>
      <div className="timer">{countDown > 0 && 'Game Starts In: ' + countDown + 'sec' || ''}</div>
    </>
  );
}