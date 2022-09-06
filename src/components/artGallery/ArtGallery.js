import axios from 'axios';
import { useEffect, useState } from 'react';
import './ArtGallery.scss';

export function ArtGallery() {
  const [artGallery, setArtGallery] = useState([]);

  async function getArtGallery() {
    let res = await axios.get(
      'https://grid-painter-backend.herokuapp.com/saved_images'
    );
    // let res = await axios.get('http://localhost:4000/saved_images');

    setArtGallery(res.data);
    console.log(res.data);
    console.log(artGallery);
  }

  useEffect(() => {
    getArtGallery();
  }, []);

  return (
    <div className="outer-div">
      {artGallery.length > 0 &&
        artGallery.map((gallery) => {
          return (
            <div className="grid-container">
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
          // gallery[0] gallery[1]
          //   return gallery.tiles.map((tile, i) => {
          //     return (
          //       <div
          //         key={i}
          //         className="grid-container grid-tile"
          //         style={{
          //           backgroundColor: tile.color,
          //         }}
          //       ></div>
          //     );
          //   });

          // return gallery.tiles.map((tile, i) => {
          //   return (
          //     <div
          //       id={i}
          //       className="grid-tile"
          //       key={i}
          //       style={{ backgroundColor: tile.color }}
          //     ></div>
          //   );
          // });
        })}

      {/* <div className="grid-container">
            {artGallery.length > 0 && artGallery[1].tiles.map((tile, i) => {
                    return (
                    <div
                        id={i}
                        className="grid-tile"
                        key={i}
                        style={{ backgroundColor: tile.color }}
                    ></div>
                    );
            })}
        </div> */}
    </div>
  );
}
