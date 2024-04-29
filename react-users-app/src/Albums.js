import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

    // Handle click event on pagination links
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

/**
 * Component to manage and display albums.
 */
function Albums() {
    const { userId } = useParams(); // Retrieve userId from URL parameters
    const [albums, setAlbums] = useState([]); // State to store album data
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [albumsPerPage] = useState(10); // State to set number of albums per page
    const [newAlbumTitle, setNewAlbumTitle] = useState(''); // State for storing new album title input
    const [editing, setEditing] = useState(false); // State to toggle edit mode
    const [currentAlbum, setCurrentAlbum] = useState(null); // State to hold the album currently being edited
    const navigate = useNavigate(); // Hook to navigate between routes

    // Fetch albums from the server when the component mounts or userId changes
    useEffect(() => {
        fetch(`http://localhost:4000/albums?userId=${userId}`)
            .then(response => response.json())
            .then(data => setAlbums(data))
            .catch(error => console.error('Error fetching albums:', error));
    }, [userId]);

    // Function to fetch albums from the server
    const fetchAlbums = () => {
        fetch(`http://localhost:4000/albums?userId=${userId}`)
            .then(response => response.json())
            .then(data => setAlbums(data))
            .catch(error => console.error('Error fetching albums:', error));
    };

    // Function to handle adding a new album
    const handleAddAlbum = () => {
        const albumId = Math.max(...albums.map(a => a.id)) + 1; // Simple ID generation
        const album = { userId: parseInt(userId), id: albumId, title: newAlbumTitle };
        fetch('http://localhost:4000/albums', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(album)
        }).then(() => {
            fetchAlbums();
            setNewAlbumTitle('');
        });
    };

    // Function to handle editing an existing album
    const handleEditAlbum = (e) => {
        e.stopPropagation();
        fetch(`http://localhost:4000/albums/${currentAlbum.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newAlbumTitle })
        }).then(() => {
            fetchAlbums();
            setEditing(false);
            setCurrentAlbum(null);
            setNewAlbumTitle('');
        });
    };

    // Function to handle deleting an album
    const handleDeleteAlbum = (e, albumId) => {
        e.stopPropagation();
        fetch(`http://localhost:4000/albums/${albumId}`, {
            method: 'DELETE'
        }).then(() => {
            fetchAlbums();
        });
    };

    // Function to navigate to the photos of an album
    const handleAlbumClick = (albumId) => {
        navigate(`/photos/${userId}/${albumId}`);
    };

    // Calculate indices for slicing the album array to implement pagination
    const indexOfLastAlbum = currentPage * albumsPerPage;
    const indexOfFirstAlbum = indexOfLastAlbum - albumsPerPage;
    const currentAlbums = albums.slice(indexOfFirstAlbum, indexOfLastAlbum);

    // Function to change the current page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    // Custom button styles
    const buttonStyle = {
        backgroundColor: '#f8f9fa', // Soft gray background
        color: '#333',              // Darker text for better readability
        border: '1px solid #ccc',   // Light gray border
        padding: '5px 10px',        // Padding for better touch area
        margin: '5px',              // Margin to separate buttons
        borderRadius: '5px'         // Rounded corners
    };

    return (
        <div>
            <h2><FormattedMessage id="album.title" defaultMessage="Albums" /></h2>
            {editing ? (
                <div>
                    <input type="text" className="form-control mb-2" value={newAlbumTitle} onChange={(e) => setNewAlbumTitle(e.target.value)} />
                    <button onClick={handleEditAlbum} style={buttonStyle}><FormattedMessage id="album.savechanges" defaultMessage="Save Changes" /></button>
                </div>
            ) : (
                <div>
                    <input type="text" className="form-control mb-2" value={newAlbumTitle} onChange={(e) => setNewAlbumTitle(e.target.value)} />
                    <button onClick={handleAddAlbum} style={buttonStyle}><FormattedMessage id="album.addalbum" defaultMessage="Add Album" /></button>
                </div>
            )}
            <br></br>
            <div className="row">
                {currentAlbums.map(album => (
                    <div className="col-md-4 mb-3" key={album.id} onClick={() => handleAlbumClick(album.id)}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{album.title}</h5>
                                <p className="card-text"><FormattedMessage id="album.totalphotos" defaultMessage="Total Photos:" /> {album.photoCount}</p>
                                <button onClick={(e) => { e.stopPropagation(); setEditing(true); setCurrentAlbum(album); setNewAlbumTitle(album.title); }} style={buttonStyle}><FormattedMessage id="album.edit" defaultMessage="Edit" /></button>
                                <button onClick={(e) => handleDeleteAlbum(e, album.id)} style={{ ...buttonStyle, backgroundColor: '#f8d7da', color: '#721c24' }}><FormattedMessage id="album.delete" defaultMessage="Delete" /></button>
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