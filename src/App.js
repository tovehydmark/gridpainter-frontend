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
  const [color, setColor] = useState('');
  const [getImage, setGetImage] = useState(false);
  const [tilesFromTileJS, setTilesFromTileJS] = useState([]);

  socket.on('userData', (data) => {
    setColor(data);
  });

  socket.on('joinedRoom', (response) => {
    if (response === 'avaliable') {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    socket.emit('join-game', { username: username, room: 'room0' }, (error) => {
      if (error) {
        alert(error);
      }
    });
  };

  function sendTilesToApp(tiles) {
    setTilesFromTileJS(tiles); // Ta emot tiles att spara från Tile.js
    console.log(tiles);
  }

  function saveImg(tilesFromTileJS) {
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
              Welcome to Grid painter {username}, <br /> You are {color}!
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
            <div className="button-container">
              <Link to="/artGallery" id="to-art-gallery-btn">
                VIEW GALLERY
              </Link>
              <button onClick={() => saveImg(tilesFromTileJS)}>SAVE</button>
              <button>START</button>
              <button>DONE</button>
            </div>
          </div>
          <div id="chat-container">
            <Chat socket={socket} username={username} className="chat" />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
