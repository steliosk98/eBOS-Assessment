import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Photos() {
    const { albumId } = useParams();
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:4000/photos?albumId=${albumId}`)
            .then(response => response.json())
            .then(data => setPhotos(data))
            .catch(error => console.error('Error fetching photos:', error));
    }, [albumId]);

    return (
        <div>
            <h2>Photos in Album {albumId}</h2>
            <div className="row">
                {photos.map(photo => (
                    <div className="col-md-4 mb-3" key={photo.id}>
                        <div className="card">
                            <img src={photo.url} className="card-img-top" alt={photo.title} />
                            <div className="card-body">
                                <h5 className="card-title">{photo.title}</h5>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Photos;