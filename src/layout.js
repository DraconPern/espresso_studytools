import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { OAuth2Client, generateCodeVerifier } from '@badgateway/oauth2-client';
import { useLocalStorage } from './useLocalStorage';

const client = new OAuth2Client({
  server: process.env.REACT_APP_ESPRESSOWEB_URL,
  clientId: process.env.REACT_APP_CLIENT_ID,
  tokenEndpoint: '/oauth2/access_token',
  authorizationEndpoint: '/oauth2/authorize',
});

export default function Layout({content}) {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [currentuser, setcurrentuser] = useState("");
  const [token, setToken] = useLocalStorage('token', "");

  // oauth2 states
  const [authState, setauthState] = useLocalStorage('authState', "");
  const [code_verifier, setcode_verifier] = useLocalStorage('code_verifier', "");

  // makes the JSX cleaner
  useEffect(() => {
    if(token.length !== 0)
      setisLoggedIn(true);
    else
      setisLoggedIn(false);
  }, [token])

  // read the user info, if it fails, go back to logged out state
  useEffect(() => {
    if(token.length !== 0) {
      fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/users', { headers: { Authorization: "Bearer " + token }})
      .then((res1) => res1.json())
      .then((response) => {
        setcurrentuser(response.user.name);
      })
      .catch(() => {
        // something went wrong, logout
        setToken("");
      })
    }
    else {
      setcurrentuser("");
    }
  }, [token, setToken]);

  // this effect is used to read the redirect and then use the accesstoken url to get a token
  useEffect(() => {
    if(token.length !== 0)
      return;

    client.authorizationCode.getTokenFromCodeRedirect(
      document.location,
      {
        redirectUri: process.env.REACT_APP_CALLBACK_URL,
        state: authState,
        codeVerifier: code_verifier,
      }
    )
    .then((token) => {
      setToken(token.accessToken);
      document.location = authState;
    })
    .catch(() => {

    })
  }, [code_verifier, authState, token, setToken])

  function login() {
    // use the url as the oauth state
    setauthState(document.location.href);
    generateCodeVerifier()
    .then((codeVerifier) => {
      setcode_verifier(codeVerifier);
      return client.authorizationCode.getAuthorizeUri({
        redirectUri: process.env.REACT_APP_CALLBACK_URL,
        state: document.location.href,
        codeVerifier
      });
    })
    .then((url) => {
      document.location = url;
    })
  }

  return (
    <React.Fragment>
      <Container>
        <h3>Espresso Studytool</h3>
      </Container>
      {isLoggedIn &&
        <React.Fragment>
          <Container>
            <div>Welcome {currentuser}</div>
            <Button onClick={() => setToken("")}>Logout</Button>
          </Container>
        </React.Fragment>
      }
      {!isLoggedIn &&
        <React.Fragment>
          <Container>
            <Button onClick={() => login()}>Login</Button>
          </Container>
        </React.Fragment>
      }
      {isLoggedIn &&
        <Container className="mt-4">{content}</Container>
      }
    </React.Fragment>
  );
}
