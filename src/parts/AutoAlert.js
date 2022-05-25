import React from 'react';
import Alert from 'react-bootstrap/Alert';

export default function AutoAlert(props) {
  return (
    <React.Fragment>
    { props.children ? <Alert {...props}>{props.children}</Alert> : <React.Fragment /> }
    </React.Fragment>
  )
}
