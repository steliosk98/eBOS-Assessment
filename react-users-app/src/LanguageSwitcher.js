import React from 'react';
import { useLocale } from './App';

const LanguageSwitcher = () => {
    const { setLocale } = useLocale();

    const handleLanguageChange = (event) => {
        setLocale(event.target.value);
    };

    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                Select Language
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li>
                    <button className="dropdown-item" onClick={() => handleLanguageChange({ target: { value: 'en' } })}>
                        <span className="flag-icon flag-icon-us mr-2"></span> English
                    </button>
                </li>
                <li>
                    <button className="dropdown-item" onClick={() => handleLanguageChange({ target: { value: 'el' } })}>
                        <span className="flag-icon flag-icon-gr mr-2"></span> Greek
                    </button>
                </li>
            </ul>
        </div>
    );
};

export default LanguageSwitcher;