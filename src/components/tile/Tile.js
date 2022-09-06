import { useEffect, useState } from 'react';
import './Tile.scss';

export function Tile({ color, socket, sendTilesToApp }) {

  const [tiles, setTiles] = useState([]);
  const [canPaint, setCanPaint] = useState(false);

  
  function handleClickOnTile(e) {
    if(canPaint == true){
      if (e.target.style.backgroundColor == color) {
        socket.emit('clickedOnTile', { pixel: e.target.id, color: '' });
      } else {
        socket.emit('clickedOnTile', { pixel: e.target.id, color: color });
      }
    }
  }

 

  function loopThroughTiles(tileList) {
    setTiles([]);

    let colored = false;

    for (let i = 0; i < 225; i++) {
      if (tileList.length == 0) {
        setTiles((current) => [...current, { pixel: i, color: '' }]);
      } else {
        for (let j = 0; j < tileList.length; j++) {
          if (i == tileList[j].pixel) {
            setTiles((current) => [
              ...current,
              { pixel: i, color: tileList[j].color },
            ]);
            colored = true;
            break;
          }
        }

        if (colored == false) {
          setTiles((current) => [...current, { pixel: i, color: '' }]);
        }

        colored = false;
      }
    }
  }

  socket.on('loadIn', function (tileList) {
    loopThroughTiles(tileList);
  });

  socket.on('tileClicked', function (tileList) {
    loopThroughTiles(tileList);
  });

  socket.on('canPaint', function(param){
    setCanPaint(param);
  });

  socket.on('timerDone', function(){
    socket.emit('created_image', tiles);
  })

  useEffect(() => {
    socket.emit('loadIn');
  }, []);

  // function saveImg(tiles) {
  //   //Spara tiles till databasen här

  //   console.log(tiles);

  //   try {
  //     axios.post('http://localhost:4000', tiles).then((res) => {
  //       console.log(res);
  //     });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  useEffect(() => {
    console.log(tiles);
    sendTilesToApp(tiles);
  }, [tiles]);

  return (
    <>
      {tiles.map((tile, i) => {
        return (
          <div
            id={i}
            className="grid-tile"
            onClick={handleClickOnTile}
            key={i}
            style={{ backgroundColor: tile.color }}
          ></div>
        );
      })}
      {/* <button onClick={() => saveImg(tiles)}>SAVE</button> */}
    </>
  );
}
