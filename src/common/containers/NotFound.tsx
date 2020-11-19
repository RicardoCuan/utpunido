import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class NotFound extends Component {
  state = {}

  render() {
    return (
      <>
        <h1>Error: 404</h1>
        <h3>Página no encontrada.</h3>
        <Link to='/'>Regresa al Home</Link>
      </>
    )
  }
}

export default NotFound
