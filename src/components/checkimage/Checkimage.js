import './Checkimage.scss';
import { useEffect, useState } from 'react';

export function Checkimage({socket}){

    const [defaultImage, setDefaultImage] = useState([]);
    const [createdImage, setCreatedImage] = useState([]);
    const [score, setScore] = useState(0);
    const [timerDone, setTimerDone] = useState(false);

    //Hämtar "facit bilden"
    socket.on('default_image', function(img){
        if(img.length > 0){
            setDefaultImage(img);
            //console.log('default', img);
        }   
    });

    //Hämtar den "ritade bilden"
    socket.on('created_image', function(img){
        if(img.length > 0){
            setCreatedImage(img);
            //console.log('created', img);
        }
    });

    socket.on('timerDone', function(){
        setTimerDone(true);
    });


    //Jämför pixlar i den "ritade bilden" med "facit bilden" och kollar hur många stämmer överens, i procent
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