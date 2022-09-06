import './App.scss';
import { Chat } from './components/chat/Chat';
import { Tile } from './components/tile/Tile.js';
import { useState } from 'react';
import { GetImage } from './components/getImage/GetImage';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Timer } from './components/timer/Timer';
import { CountdownTimer } from './components/timer/CountdownTimer';
import { Checkimage } from './components/checkimage/Checkimage';

const io = require('socket.io-client');

const socket = io.connect('https://grid-painter-backend.herokuapp.com');
// const socket = io.connect('http://localhost:4000');

function App() {
  const [inGame, setInGame] = useState(false);
  const [username, setUsername] = useState('');
  const [roomName, setRoomName] = useState('');
  const [color, setColor] = useState('');
  const [getImage, setGetImage] = useState(false);
  const [tilesFromTileJS, setTilesFromTileJS] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const [saveButtonStyle, setSaveButtonStyle] = useState('gray');
  const [gameOver, setGameOver] = useState(false);
  const [count, setCount] = useState(10);

  socket.on('userData', (data) => {
    setColor(data);
  });

  socket.on('joinedRoom', (response) => {
    if (response === 'available') {
      //Här ska det gå att logga in
      setInGame(true);
    } else if (response === 'getImage') {
      //when 4 players are ready
      setInGame(true);
      setGetImage(true);
      socket.emit('startCountdownTimer');
      // socket.emit('startTimer');
    } else {
      alert('Game is full');
    }
  });

  socket.on('disableSaveButton', function(){
    console.log('disable save button');
    setDisableSave(true);
    setSaveButtonStyle('gray');
  });

  socket.on('enableSaveButton', function(){
    setDisableSave(false);
    setSaveButtonStyle('#22cf29');
  });

  //disconnect 10 sec after game ends.
  socket.on('timerDone', function(){

    setGameOver(true);

    let i = 10;

    setInterval(() => {

        if(i > 0){
            i--;
        }
        
        setCount(i);

        if(i == 0){
            socket.disconnect();
            setInGame(false);
            window.location.reload();
        }
    }, 1000);

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      socket.emit(
        'join-game',
        { username: username, roomName: roomName },
        (error) => {
          if (error) {
            alert(error);
          }
        }
      );
    }
  };

  function sendTilesToApp(tiles) {
    setTilesFromTileJS(tiles); // Ta emot tiles att spara från Tile.js
    console.log(tiles);
  }

  function saveImg(tilesFromTileJS) {
    console.log(tilesFromTileJS);
    try {
      axios
        .post('https://grid-painter-backend.herokuapp.com', tilesFromTileJS)
        .then((res) => {
          console.log(res);
        });
    } catch (err) {
      console.log(err);
    }

    // try {
    //   axios.post('http://localhost:4000', tilesFromTileJS).then((res) => {
    //     console.log(res);
    //   });
    // } catch (err) {
    //   console.log(err);
    // }
  }

  return (
    <div id="body">
      {!inGame ? (
        <div className="login-page-container">
          <form onSubmit={handleSubmit}>
            <input
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button id="login-btn">START PAINTING</button>
          </form>
          <Link to="/artGallery" id="to-art-gallery-btn">
            View art gallery
          </Link>
        </div>
      ) : (
        <>
          <div className="loggedin-container">
            <h1>
              Welcome to Grid painter {username}
              <br/>
              {color && <p>You are <span style={{color: color}}>{color}!</span></p>}
            </h1>
            <section>
              <div className="grid-container">
                <Tile
                  color={color}
                  socket={socket}
                  sendTilesToApp={sendTilesToApp}
                ></Tile>
              </div>
              <div className="grid-container">
                <GetImage getImage={getImage} socket={socket}></GetImage>
              </div>
            </section>
            <CountdownTimer socket={socket} />
            <Timer socket={socket} />
            <Checkimage socket={socket} />
            {gameOver && <p>Game over, you will be disconnected in {count} seconds.</p>}
            <div className="button-container">
              <Link to="/artGallery" id="to-art-gallery-btn">
                VIEW GALLERY
              </Link>
              {<button style={{backgroundColor: saveButtonStyle}} disabled={disableSave} onClick={() => {
                    saveImg(tilesFromTileJS);
                    socket.emit('disableSaveButtonClient');
              }}>SAVE</button>}
            </div>
          </div>
          <div id="chat-container">
            <Chat
              socket={socket}
              username={username}
              roomName={roomName}
              className="chat"
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
