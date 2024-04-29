import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

function BackLink() {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);  // This navigates one step back in the browser historyMake
    };

    return (
        <button className="btn btn-primary" onClick={goBack} style={{ backgroundColor: 'gray', borderColor: 'gray' }}>
            <FormattedMessage id="back.link" defaultMessage="Back" />
        </button>
    );
}

export default BackLink;