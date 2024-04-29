import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

/**
 * Component to render pagination controls.
 * @param {object} props - Component props.
 * @param {number} props.itemsPerPage - Number of items per page.
 * @param {number} props.totalItems - Total number of items.
 * @param {function} props.paginate - Function to set the current page.
 */
function Pagination({ itemsPerPage, totalItems, paginate }) {
    const pageNumbers = [];

    // Calculate the total number of pages
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

/**
 * Component to manage and display photos within an album.
 */
function Photos() {
    const { userId, albumId } = useParams(); // Retrieve userId and albumId from URL parameters
    const [photos, setPhotos] = useState([]); // State to store photo data
    const [albumTitle, setAlbumTitle] = useState(''); // State to store the album title
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [photosPerPage] = useState(10); // State to set number of photos per page

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

    /**
     * Function to handle deleting a photo.
     * @param {number} photoId - The ID of the photo to delete.
     */
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

    // Calculate indices for slicing the photo array to implement pagination
    const indexOfLastPhoto = currentPage * photosPerPage;
    const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
    const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);

    // Function to change the current page
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