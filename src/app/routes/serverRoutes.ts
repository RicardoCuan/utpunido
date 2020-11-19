/**
 * Rutas de la plataforma del Server
 * 
 * Se debe de procurrar que el contenido esté 
 * reflejado en el archivo app/routes/Routes.tsx
 * 
 * Created in 18/11/2020
 * 
 * @const serverRoutes
 * @type {object[]}
 * @category app
 * @author Ricardo Cuan {@link ricardo.cuan@utp.ac.pa}
 */
import NotFound from '../../common/containers/NotFound'
import Landing from '../../Landing/Landing'

/** Arreglo de rutas de la página web */
const serverRoutes:object[] = [
  {
    exact: true,
    path: '/',
    component: Landing
  },
  {
    name: 'NotFound',
    component: NotFound
  },
]

export default serverRoutes
