import React, {useEffect} from 'react';
import AppBar from './components/AppBar/AppBar';
import Dashboard from './views/Dashboard/Dashboard';
import History from './views/History/History';
import Login from './views/Login/Login';
import { Route } from "react-router";
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { ApolloProvider,  Mutation } from 'react-apollo';
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { Redirect } from 'react-router';
import { useHistory } from "react-router-dom";

export default function App() {
    // const classes = useStyles();

    const [login, setLogin] = React.useState({token : ''});
    const onGetToken = async (newToken) => {
      await setLogin({ token : newToken, });
      console.log(newToken)
    }

    return (
      <BrowserRouter>
        <div style={{width: '100vw', height: '100vh',overflowX:'hidden'}}>
          <Route exact path="/" component={() => <Login  passToken={onGetToken} />} />
          <Route path="/dashboard" component={() => <Dashboard />} />
          <Route path="/history" component={() => <History /> } />
          {/* <Route component={NotFound} /> */}
        </div>
      </BrowserRouter>
    )
}
