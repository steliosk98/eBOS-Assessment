import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FormattedMessage, IntlProvider } from 'react-intl';
import { messages } from './messages';
import LanguageSwitcher from './LanguageSwitcher';
import Users from './Users';
import './App.css';


function App() {
  const { locale } = useLocale();

  return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <Router>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/"><FormattedMessage id="home.title" /></Link>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    <Link className="nav-link" to="/users"><FormattedMessage id="users.title" /></Link>
                  </li>
                </ul>
              </div>
            </div>
            <LanguageSwitcher />
          </nav>

          <div className="container mt-4">
            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/" element={<Home />} />
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


function Home() {
  return <h2><FormattedMessage id="home.title" /></h2>;
}

export default App;