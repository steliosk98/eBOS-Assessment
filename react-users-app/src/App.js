import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { messages } from './messages';
import LanguageSwitcher from './LanguageSwitcher';
import Users from './Users';
import Albums from './Albums';
import Photos from './Photos';
import BackLink from "./BackLink";
import './App.css';

/**
 * Main application component that sets up routing and internationalization.
 */
function App() {
  // Retrieve the current locale from the LocaleContext
  const { locale } = useLocale();

  return (
      // Provide internationalization support for the app
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <div className="container-fluid">
                <BackLink />
                <div className="collapse navbar-collapse">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    {/* Navigation links can be added here */}
                  </ul>
                </div>
              </div>
              <LanguageSwitcher />
            </nav>

            <div className="container mt-4">
              <Routes>
                <Route path="/" element={<Navigate replace to="/users" />} />
                <Route path="/users" element={<Users />} />
                <Route path="/albums/:userId" element={<Albums />} />
                <Route path="/photos/:userId/:albumId" element={<Photos />} />
              </Routes>
            </div>
          </div>
        </Router>
      </IntlProvider>
  );
}

// Context for managing locale state across the application
const LocaleContext = createContext();

/**
 * Custom hook to access and manipulate the locale context.
 * @returns {object} The current locale and the function to set a new locale.
 */
export const useLocale = () => useContext(LocaleContext);

/**
 * Provides a context provider for locale that allows children components to access and update the locale.
 * @param {object} props - The props object containing children components.
 * @returns {JSX.Element} A context provider wrapping children components.
 */
export const LocaleProvider = ({ children }) => {
  // State to hold the current locale, defaulting to the browser's language setting
  const [locale, setLocale] = useState(navigator.language.split(/[-_]/)[0]);

  // Function to update the locale state
  const changeLocale = (newLocale) => {
    setLocale(newLocale);
  };

  return (
      <LocaleContext.Provider value={{locale, setLocale: changeLocale}}>
        {children}
      </LocaleContext.Provider>
  );
};

export default App;