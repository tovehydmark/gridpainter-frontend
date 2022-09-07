import axios from 'axios';
import { useEffect, useState } from 'react';
import './ArtGallery.scss';

export function ArtGallery() {
  const [artGallery, setArtGallery] = useState([]);

  // Hämtar en array av sparade bilder från db och sparar i artGallery
  async function getArtGallery() {
    let res = await axios.get('https://grid-painter-backend.herokuapp.com/saved_images');
    //let res = await axios.get('http://localhost:4000/saved_images');

    setArtGallery(res.data);
  }

  useEffect(() => {
    getArtGallery();
  }, []);

  return (
    <div className="outer-div">
      {artGallery.length > 0 &&
        artGallery.map((gallery, i) => {
          return (
            <div className="grid-container" key={i}>
              {gallery.tiles.map((tile, i) => {
                return (
                  <div
                    key={i}
                    className="grid-tile"
                    style={{ backgroundColor: tile.color }}
                  ></div>
                );
              })}
            </div>
          );

        })}
    </div>
  );
}
