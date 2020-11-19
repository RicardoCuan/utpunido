/** 
 * @module server
 * 
 * Created in 08/08/2020
 * 
 * @author Ricardo Cuan {@link rcuan@ayudinga.com}
 * @category app
*/
import fs from 'fs'
import React from 'react'
import dotenv from 'dotenv'
import helmet from 'helmet'
import Express from 'express'
import webpack from 'webpack'
import ReactDOM from 'react-dom/server'
import cookieParser from 'cookie-parser'
import { Store, store } from '../redux/store'
import { StaticRouter } from 'react-router-dom'
import serverRoutes from '../routes/serverRoutes'
import { renderRoutes } from 'react-router-config'
import { Provider as ReduxProvider } from 'react-redux'


dotenv.config()                        /* Cargar .env en process.env */
declare const module: any              /* module del react hot reload */
const express = Express()              /* Instancia de express */
const { ENV, PORT } = process.env      /* Variables de entorno */
const isDev = (ENV === 'development')  /* Devuelve true si se está en modo desarrollo */

express.use(Express.json())                   /* Aplicar Middleware que retorna archivos json */
express.use(cookieParser())                   /* Aplicar MiddleWare que parsea las cookies */
express.use(Express.static(`${__dirname}/`))  /* Servir archivos estáticos de dist/ */


if (isDev) {
} else {
  express.use(helmet())                                           /* Aplicar Middleware que manipula las cabeceras HTTP */
  express.use(helmet.permittedCrossDomainPolicies())              /* Aplicar Middleware que permite cargar contenido de plataformas externas */
  express.disable('x-powered-by')                                 /* Desactivar la cabecera HTTP que delata el FrameWork que se utiliza en el proyecto */
  
  /* Solo se puede consumir contenido de este proyecto y de ayudinga.org mas info en -> https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP */
  express.use(helmet.contentSecurityPolicy({                      /* Aplicar Middleware que determina las políticas de seguridad de contenidos */
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'",'ayudinga.org', 'jsonplaceholder.typicode.com', 'https://www.google-analytics.com'],
    },
  }))
}


/** HTML Template resultante que se entregará al servidor
 *
 * @function
 * @param {string}   html          HTML que envuelve a todo el proyecto
 * @param {Store}   preloadedState InitialState del redux
 * @return {string}                HTML Template del html base del proyecto
 */
const setResponse = (html:string, preloadedState:Store):string => {
  
  type assetsDir = RegExpExecArray | string | null

  let mainBuild:assetsDir = 'app.js'
  let mainStyles:assetsDir = 'app.css'
  let vendorBuild:assetsDir = 'vendor.js'

  if (!isDev) { // Busca los archivos en app-[hash].css assets app-[hash].js vendor-[hash].js
    fs.readdirSync(`${__dirname}/assets/`).forEach(file => { 
      mainBuild = (/app-.*\.js/.exec(file) === null) ? mainBuild : /app-.*\.js/.exec(file)
      mainStyles = (/app-.*\.css/.exec(file) === null) ? mainStyles : /app-.*\.css/.exec(file)
      vendorBuild = (/vendor-.*\.js/.exec(file) === null) ? vendorBuild : /vendor-.*\.js/.exec(file)
    })
  }

  return (`
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="apple-touch-icon" href="/icon.png" />
        <meta name="apple-mobile-web-app-title" content="UTP Unido" />
        <meta name="apple-mobile-web-app-capable" content="no" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta charset="utf-8" />
        <link rel="stylesheet" href="assets/${mainStyles}" type="text/css"/>
        <title>UTP Unido</title>
      </head>
      <body>
        <div id="app">${html}</div>
        <script id="preloadedState">
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
        </script>
        <script src="assets/${mainBuild}" type="text/javascript"></script>
        <script src="assets/${vendorBuild}" type="text/javascript"></script>
      </body>
    </html>
  `)
}


/** Realiza un render html de la página 
 * 
 * @function
 * 
 * @param {*} [req] request del callback
 * @param {*} [res] response del callback
 */
const renderApp = (req?:any, res?:any):void => {
  const preloadedState:Store = store.getState()
  const html:string = ReactDOM.renderToString(
    <ReduxProvider store={store}>
      <StaticRouter location={req.url} context={{}}>
          {renderRoutes(serverRoutes)}
      </StaticRouter>
    </ReduxProvider>,
  )

  res.send(setResponse(html, preloadedState))
}


/** Server
 * 
 * Lógica principal del Server Side Render (SRR)
 * 
 * @function
 */
function server() {

  /** Devolver renderApp a toda petición que se haga */
  express.get('*', renderApp)

  /** instancia de express escucha al puerto 3000 o PORT */
  const server = express.listen((PORT || 3000), (err?:any) => {
    if (err) console.log(err)
    else console.log(`Server running on port ${PORT}`)
  })

  // webpack Hot Module Replacement API
  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => server.close())
  }
}


server()
