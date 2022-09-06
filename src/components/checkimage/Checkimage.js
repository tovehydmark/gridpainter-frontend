import './Checkimage.scss';
import { useEffect, useState } from 'react';

export function Checkimage({socket}){

    const [defaultImage, setDefaultImage] = useState([]);
    const [createdImage, setCreatedImage] = useState([]);
    const [score, setScore] = useState(0);

    socket.on('default_image', function(img){
        setDefaultImage(img);
    });

    socket.on('created_image', function(img){
        setCreatedImage(img);
    });

    socket.on('timerDone', function(){

        let correctPixels = 0;

        for(let i = 0; i < 225; i++){

            if(defaultImage[i].color == createdImage[i].color){
                correctPixels++;
            }
        }

        setScore(Math.floor(correctPixels / 225 * 100));
        
    });

    return(
    <>
        {defaultImage.length > 0 && createdImage.length > 0 && <div>Image is {score}% accurate</div>}
    </>
    );
}