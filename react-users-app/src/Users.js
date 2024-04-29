import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';

/**
 * Component to display a list of users and manage pagination.
 */
function Users() {
    const [users, setUsers] = useState([]); // State to store user data
    const [currentPage, setCurrentPage] = useState(1); // State to track the current page
    const [usersPerPage] = useState(10); // State to set number of users per page
    const navigate = useNavigate(); // Hook to navigate between routes

    // Fetch users from the server when the component mounts
    useEffect(() => {
        fetch('http://localhost:4000/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // Calculate indices for slicing the user array to implement pagination
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Handler for clicking on a user card
    const handleUserClick = (userId) => {
        navigate(`/albums/${userId}`);
    };

    // Function to change the current page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h2><FormattedMessage id="users.title" /></h2>
            <div className="row">
                {currentUsers.map(user => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3" key={user.id} onClick={() => handleUserClick(user.id)}>
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{user.name}</h5>
                                <p className="card-text">
                                    <FormattedMessage id="user.email" values={{ email: user.email }} />
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Pagination usersPerPage={usersPerPage} totalUsers={users.length} paginate={paginate} />
        </div>
    );
}

export default Users;

/**
 * Component to render pagination controls.
 * @param {object} props - Component props.
 * @param {number} props.usersPerPage - Number of users per page.
 * @param {number} props.totalUsers - Total number of users.
 * @param {function} props.paginate - Function to set the current page.
 */
function Pagination({ usersPerPage, totalUsers, paginate }) {
    const pageNumbers = [];

    // Calculate the total number of pages
    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
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