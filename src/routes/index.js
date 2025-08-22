import empresaRoute from "./empresaRoute.js";
import alunoRoute from "./alunoRoute.js";
import veiculoRoute from "./veiculoRoute.js";

function Routes(app) {
  empresaRoute(app);
  alunoRoute(app);
  veiculoRoute(app);
}

export default Routes;
