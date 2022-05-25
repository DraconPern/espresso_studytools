import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';

import { login, logout } from 'redux-implicit-oauth2';

const config = {
  url: process.env.REACT_APP_ESPRESSOAPI_URL +"/oauth2/authorize",
  client: process.env.REACT_APP_CLIENT_ID,
  redirect: process.env.REACT_APP_CALLBACK_URL,
  scope: "",
  width: 400, // Width (in pixels) of login popup window. Optional, default: 400
  height: 400 // Height (in pixels) of login popup window. Optional, default: 400
}

export default function Layout({content}) {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn)
  const [currentuser, setcurrentuser] = useState("");
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if(token) {
      fetch(process.env.REACT_APP_ESPRESSOAPI_URL + '/api/users', { headers: { Authorization: "Bearer " + token }})
      .then((res1) => res1.json())
      .then((response) => setcurrentuser(response.user.name))
    }
    else {
      setcurrentuser("");
    }
  }, [token]);

  return (
    <React.Fragment>
      <Container>
        <h3>Espresso Studytool</h3>
      </Container>
      {isLoggedIn &&
        <React.Fragment>
          <Container>
            <div>Welcome {currentuser}</div>
            <Button onClick={() => dispatch(logout())}>Logout</Button>
          </Container>
        </React.Fragment>
      }
      {!isLoggedIn &&
        <React.Fragment>
          <Container>
            <Button onClick={() => dispatch(login(config))}>Login</Button>
          </Container>
        </React.Fragment>
      }
      {isLoggedIn &&
        <Container className="mt-4">{content}</Container>
      }
    </React.Fragment>
  );
}
