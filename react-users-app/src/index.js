import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min'; // Import Bootstrap JS bundle
import '../node_modules/flag-icon-css/css/flag-icons.min.css'; // Import flag icons for language switcher
import App, { LocaleProvider } from './App';
import { IntlProvider } from 'react-intl';
import { messages } from './messages';

/**
 * Determine the initial locale based on the browser's language settings.
 * Defaults to English ('en') if the browser language is not Greek ('el').
 */
const language = navigator.language.startsWith('el') ? 'el' : 'en';

/**
 * Initialize the root element for the React application.
 */
const rootElement = document.getElementById('root');
const root = createRoot(rootElement); // Create a root container managed by React 18+.

/**
 * Render the application within the React.StrictMode wrapper.
 * React.StrictMode is a tool for highlighting potential problems in an application.
 * It does not render any visible UI but activates additional checks and warnings for its descendants.
 */
root.render(
    <React.StrictMode>
        <IntlProvider locale={language} messages={messages[language]}>
            <LocaleProvider>
                <App />
            </LocaleProvider>
        </IntlProvider>
    </React.StrictMode>
);