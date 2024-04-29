import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

function Users() {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    useEffect(() => {
        fetch('http://localhost:4000/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    // Get current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h2><FormattedMessage id="users.title" /></h2>
            <div className="row">
                {currentUsers.map(user => (
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-3" key={user.id}>
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

function Pagination({ usersPerPage, totalUsers, paginate }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
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