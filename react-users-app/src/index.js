import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import '../node_modules/flag-icon-css/css/flag-icons.min.css';
import App, { LocaleProvider } from './App';
import { IntlProvider } from 'react-intl';
import { messages } from './messages';


// Default to English if the browser language is not Greek
const language = navigator.language.startsWith('el') ? 'el' : 'en';

// Use createRoot to manage the root
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create a root.

root.render(
    <React.StrictMode>
        <IntlProvider locale={language} messages={messages[language]}>
            <LocaleProvider>
                <App />
            </LocaleProvider>
        </IntlProvider>
    </React.StrictMode>
);