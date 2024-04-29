import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4000/users')
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div>
            <h2><FormattedMessage id="users.title" /></h2>
            <div className="row">
                {users.map(user => (
                    <div className="col-md-4 mb-3" key={user.id}>
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
        </div>
    );
}

export default Users;