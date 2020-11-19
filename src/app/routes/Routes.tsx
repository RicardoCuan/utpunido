/** 
 * Routes de la plataforma del Cliente
 * 
 * Se debe de procurrar que el contenido esté 
 * reflejado en el archivo app/routes/Routes.tsx
 * 
 * Created in 07/08/2020
 * 
 * @class Routes
 * @author Ricardo Cuan {@link rcuan@ayudinga.com}
 * @category app
*/
import React, { Component } from 'react'
import { BrowserRouter,Switch,Route } from 'react-router-dom'

import Landing from '../../Landing/Landing'
import NotFound from '../../common/containers/NotFound'


class routes extends Component{
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route component={NotFound}/>
        </Switch>
      </BrowserRouter>
    )
  }
}


export default routes
