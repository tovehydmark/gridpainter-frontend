import './Checkimage.scss';
import { useEffect, useState } from 'react';

export function Checkimage({socket}){

    const [defaultImage, setDefaultImage] = useState([]);
    const [createdImage, setCreatedImage] = useState([]);
    const [score, setScore] = useState(0);
    const [timerDone, setTimerDone] = useState(false);


    socket.on('default_image', function(img){
        if(img.length > 0){
            setDefaultImage(img);
            console.log('default image', img);
        }
        
    });

    socket.on('created_image', function(img){
        if(img.length > 0){
            setCreatedImage(img);
            console.log('created image', img);
        }
    });

    socket.on('timerDone', function(){
        setTimerDone(true);
    });

  


    useEffect(() => {

        if(defaultImage.length > 0 && createdImage.length > 0){
            let correctPixels = 0;

            for(let i = 0; i < 225; i++){

                if(defaultImage[i].color == createdImage[i].color){
                    correctPixels++;
                }
            }

            setScore(Math.floor(correctPixels / 225 * 100));
        }

    }, [defaultImage, createdImage]);

    return(
    <>
        {timerDone && <div>Image is {score}% accurate</div>}
    </>
    );
}