import React from 'react';
import Navigation from './components/Navigation';
import LoginLogoutButton from './components/LoginLogoutButton';
import 'normalize.css';

import "styles/base/_main.sass"  // Global styles
import "styles/base/_common.sass"  // Global styles
import styles from "./app.sass"  // Css-module styles

const Install = () => (
  <div>    
    <div><LoginLogoutButton /></div>
  </div>
);

export default Install;
