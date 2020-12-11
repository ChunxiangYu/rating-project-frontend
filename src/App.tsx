import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Account from './pages/Account/Account';
import Login from './pages/Login/Login';
import Rate from './pages/Rate/Rate';
import { getCurrentUser } from "./utils/requests/User";

type User = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

export const UserContext = React.createContext({
  currentUser: {
    id: '',
    email: '',
    firstname: '',
    lastname: '',
    role: ''
  },
  setCurrentUser(user: {}) {},
});


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({id: '', email: '', firstname: '', lastname: '', role: ''});
  const sessionToken = window.sessionStorage.getItem('ratingToken');

  const populateUserContext = async () => {
    if (sessionToken) {
      const user = await getCurrentUser(sessionToken);
      if (user.data) {
        setCurrentUser(user.data.me);
      }
    }
  };

  useEffect(() => {
    populateUserContext();
  }, [])

  return (
    <section className='App'>
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
          <Router>
            {currentUser.email !== '' &&
              <Header />
            }
            <Switch>
              <Route exact path={'/login'} component={Login} />
              <Route exact path={'/rate'} component={Rate} />
              <Route exact path={'/'} component={Account} />
              <Redirect from={'*'} to={'/404'} />
            </Switch>
          </Router>
        </UserContext.Provider>
    </section>
  );
}

export default App;
