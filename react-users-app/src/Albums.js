import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

function Pagination({ itemsPerPage, totalItems, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handleClick = (e, number) => {
        e.preventDefault();  // Prevent the default anchor link behavior
        paginate(number);
    };

    return (
        <nav>
            <ul className='pagination'>
                {pageNumbers.map(number => (
                    <li key={number} className='page-item'>
                        <a onClick={(e) => handleClick(e, number)} href='!#' className='page-link'>
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

function Albums() {
    const { userId } = useParams();
    const [albums, setAlbums] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [albumsPerPage] = useState(10);

    useEffect(() => {
        fetch(`http://localhost:4000/albums?userId=${userId}`)
            .then(response => response.json())
            .then(data => setAlbums(data))
            .catch(error => console.error('Error fetching albums:', error));
    }, [userId]);

    // Get current albums
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h2><FormattedMessage id="album.title" defaultMessage="Albums" /></h2>
            <div className="row">
                {currentAlbums.map(album => (
                    <div className="col-md-4 mb-3" key={album.id}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{album.title}</h5>
                                <p className="card-text"><FormattedMessage id="album.totalphotos" defaultMessage="Total Photos:" /> {album.photoCount}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination itemsPerPage={albumsPerPage} totalItems={albums.length} paginate={paginate} />
        </div>
    );
}

export default Albums;