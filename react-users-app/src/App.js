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


function App() {
  const { locale } = useLocale();

  return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <BackLink />
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">

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

const LocaleContext = createContext();

export const useLocale = () => useContext(LocaleContext);

export const LocaleProvider = ({ children }) => {
  const [locale, setLocale] = useState(navigator.language.split(/[-_]/)[0]);

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