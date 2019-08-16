import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { login, logout } from 'redux-implicit-oauth2'
import appconfig from '../appconfig'

const config = {
  url: appconfig.ESPRESSOWEB_URL +"/oauth2/authorize",
  client: appconfig.CLIENT_ID,
  redirect: "http://127.0.0.1:8888",
  scope: "",
  width: 400, // Width (in pixels) of login popup window. Optional, default: 400
  height: 400 // Height (in pixels) of login popup window. Optional, default: 400
}

const LoginLogoutButton = ({ isLoggedIn, login, logout }) => {
  if (isLoggedIn) {
    return (
      <div>
        <div>Back to <a href={appconfig.ESPRESSOWEB_URL}>Espresso Medical</a></div>
        <button type='button' onClick={logout}>Logout</button>
      </div>
    )
  } else {
    return <button type='button' onClick={login}>Login</button>
  }
}

LoginLogoutButton.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = ({ auth }) => ({
  isLoggedIn: auth.isLoggedIn
})

const mapDispatchToProps = {
  login: () => login(config),
  logout
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginLogoutButton)
