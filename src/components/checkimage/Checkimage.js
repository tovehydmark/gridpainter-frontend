import './Checkimage.scss';
import { useEffect, useState } from 'react';

export function Checkimage({socket}){

    const [defaultImage, setDefaultImage] = useState([]);
    const [createdImage, setCreatedImage] = useState([]);
    const [score, setScore] = useState(0);

    socket.on('default_image', function(img){
        setDefaultImage(img);
        console.log('default_image:', img);
    });

    socket.on('created_image', function(img){
        setCreatedImage(img);
        console.log('created_image:', img);
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
        {defaultImage.length > 0 && createdImage.length > 0 && <div>Image is {score}% accurate</div>}
    </>
    );
}