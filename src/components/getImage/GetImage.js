import axios from 'axios';
import { useEffect, useState } from 'react';

import './GetImage.scss';

export function GetImage({ getImage, socket }) {
  const [image, setImage] = useState([]);

  //Hämtar bilden och emittar den till alla andra spelare.
  async function getRandomImage() {
    let res = await axios.get('https://grid-painter-backend.herokuapp.com/default');
    // let res = await axios.get('http://localhost:4000/default');
    socket.emit('randomImageFromServer', res.data[0].tiles);
  }

  //Hämtar och sparar bilden man ska måla.
  useEffect(() => {
    socket.on('randomImageFromServer', function (image) {
      setImage(image);
      socket.emit('default_image', image);
    });
  }, []);

  //När fjärde spelaren loggar in så hämtas en bild.
  useEffect(() => {
    if (getImage) {
      getRandomImage();
    }
  }, []);

  return (
    <>
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
