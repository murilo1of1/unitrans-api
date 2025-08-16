import clienteRoute from "./clienteRoute.js";
import livroRoute from "./livroRoute.js";

function Routes(app) {
  livroRoute(app);
  clienteRoute(app);
}

export default Routes;