import { useState } from 'react';
import './Timer.scss';

export function Timer({ socket }) {
  const [gameTimer, setGameTimer] = useState(30);
  const [countDown, setCountDown] = useState(5);
  const [showTimer, setShowTimer] = useState(false);

  socket.on('timer', (timer) => {
    setGameTimer(timer);
    console.log(timer);
  });

  socket.on('countdownTimer', (timer) => {
    if(timer === 0){
      setShowTimer(true);
    }
  });

  return (
    <>
      <div className="timer">{showTimer && gameTimer > 0 && 'Time left: ' + gameTimer + ' sec'}</div>
    </>
  );
}
