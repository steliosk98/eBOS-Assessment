import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


function Pagination({ itemsPerPage, totalItems, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <button onClick={() => paginate(number)} className='page-link'>
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function Photos() {
    const { userId, albumId } = useParams();
    const [photos, setPhotos] = useState([]);
    const [albumTitle, setAlbumTitle] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [photosPerPage] = useState(10);

    useEffect(() => {
        // Fetch album title
        fetch(`http://localhost:4000/albums/${albumId}?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                setAlbumTitle(data.title);
            })
            .catch(error => console.error('Error fetching album title:', error));

        // Fetch photos
        fetch(`http://localhost:4000/photos?albumId=${albumId}&userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                setPhotos(data);
                setCurrentPage(1);  // Reset to first page whenever albumId changes
            })
            .catch(error => console.error('Error fetching photos:', error));
    }, [userId, albumId]);

    const handleDeletePhoto = (photoId) => {
        fetch(`http://localhost:4000/photos/${photoId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert(data.message);
                    setPhotos(photos.filter(photo => photo.id.toString() !== photoId.toString()));  // Update state to reflect deletion
                }
            })
            .catch(error => {
                console.error('Error deleting photo:', error);
                alert('Failed to delete the photo');
            });
    };

    // Get current photos
    const indexOfLastPhoto = currentPage * photosPerPage;
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h2><FormattedMessage id="photos.title" defaultMessage="Photos in Album:" /> {albumTitle}</h2>
            <div className="row">
                {currentPhotos.map(photo => (
                    <div className="col-md-4 mb-3" key={photo.id}>
                        <div className="card">
                            <img src={photo.url} className="card-img-top" alt={photo.title} />
                            <div className="card-body">
                                <h5 className="card-title">{photo.title}</h5>
                                <button onClick={() => handleDeletePhoto(photo.id)} className="btn btn-danger"><FormattedMessage id="album.delete" defaultMessage="Delete" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination itemsPerPage={photosPerPage} totalItems={photos.length} paginate={paginate} />
        </div>
    );
}

export default Photos;