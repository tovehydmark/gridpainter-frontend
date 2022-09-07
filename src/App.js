import './App.scss';
import { Chat } from './components/chat/Chat';
import { Tile } from './components/tile/Tile.js';
import { useEffect, useState } from 'react';
import { GetImage } from './components/getImage/GetImage';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Timer } from './components/timer/Timer';
import { CountdownTimer } from './components/timer/CountdownTimer';
import { Checkimage } from './components/checkimage/Checkimage';

const io = require('socket.io-client');

const socket = io.connect('https://grid-painter-backend.herokuapp.com');

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
  const [count, setCount] = useState(30);

  socket.on('userData', (data) => {
    setColor(data);
  });


  socket.on('joinedRoom', (response) => {

    if (response === 'available') { //Spelvy visas för spelaren
      setInGame(true);
    } else if (response === 'getImage') { //Hämtar bild från db när 4 är inloggade och timer startas
      setInGame(true);
      setGetImage(true);
      socket.emit('startCountdownTimer');
    } else {
      alert('Game is full');
    }
  });

  socket.on('disableSaveButton', function(){
    setDisableSave(true);
    setSaveButtonStyle('gray');
  });

  socket.on('enableSaveButton', function(){
    setDisableSave(false);
    setSaveButtonStyle('#22cf29');
  });

  //Disconnectar alla spelare efter 30 sek och laddar om sidan så att ett nytt spel kan startas
  socket.on('timerDone', function(){
    setGameOver(true);
    let i = 30;

    setInterval(() => {
        if(i > 0){
            i--;
        }
        setCount(i);

        if(i === 0){
            socket.disconnect();
            setInGame(false);
            window.location.reload();
        }
    }, 1000);

  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username) {
      socket.emit(
        'join-game',
        { username: username, roomName: roomName },
        (error) => {
          if (error) {
            console.log(error);
          }
        }
      );
    }
  };

  //Funktion som körs från Tile.js via props när spelare färglägger en ruta genom att klicka på en tile
  function sendTilesToApp(tiles) {
    setTilesFromTileJS(tiles); //Uppdaterad array med alla färgade tiles
  }

  //Färdig bild sparas till databasen
  function saveImg(tilesFromTileJS) {
    try {
      axios
        .post('https://grid-painter-backend.herokuapp.com', tilesFromTileJS)
        .then((res) => {
        });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div id="body">
      {/* Visar login-vy om inGame är false, annars visas spelvy */}
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
          <Link to="/artGallery" className="to-art-gallery-btn">
            VIEW ART GALLERY
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
                />
              </div>
              <div className="grid-container">
                <GetImage getImage={getImage} socket={socket} />
              </div>
            </section>
            <CountdownTimer socket={socket} />
            <Timer socket={socket} />
            <Checkimage socket={socket} />
            {gameOver && <p>Game over, you will be disconnected in {count} seconds.</p>}
            <div className="button-container">
              <Link to="/artGallery">
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
