import { useState } from 'react';
import './Timer.scss';

export function Timer({ socket }) {
  const [gameTimer, setGameTimer] = useState(30);
  const [showTimer, setShowTimer] = useState(false);

  //Sätter värdet på timer.
  socket.on('timer', (timer) => {
    setGameTimer(timer);
  });

  //Visar speltimern när countdowntimern är 0.
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
