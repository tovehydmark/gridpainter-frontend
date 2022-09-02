import axios from 'axios';
import { useEffect, useState } from 'react';

import './GetImage.scss';

export function GetImage({ getImage, socket }) {
  const [image, setImage] = useState([]);
  const [counter, setCounter] = useState(5);

  async function getRandomImage() {
    let res = await axios.get(
      'https://gridpainter-grupp4.herokuapp.com/default'
    );
    socket.emit('randomImageFromServer', res.data[0].tiles);
    //setImage(res.data[0].tiles);
    // setTilesArr(res.data[0].tiles);
    // console.log('random :', res.data[0].tiles);
  }

  //Se till att timern slutar köras med clearInterval (https://usehooks-ts.com/react-hook/use-interval)
  useEffect(() => {
    socket.on('randomImageFromServer', function (image) {
      setImage(image);
      socket.emit('default_image', image);
    });
  }, []);

  useEffect(() => {
    if (getImage) {
      getRandomImage();
    }
  }, []);

  return (
    <>
      {/* {counter > 0 ? (
        <div>
          <p>Get ready to play in: {counter} </p>
        </div>
      ) : (
        <div> Timer som tickar ned </div>
      )}

      {counter <= 0 &&
        image.map((tile, i) => {
          return (
            <div
              id="i"
              key={i}
              style={{ backgroundColor: tile.color }}
              className="grid-tile"
            ></div>
          );
        })} */}

      {image.map((tile, i) => {
        return (
          <div
            id="i"
            key={i}
            style={{ backgroundColor: tile.color }}
            className="grid-tile"
          ></div>
        );
      })}
    </>
  );
}
