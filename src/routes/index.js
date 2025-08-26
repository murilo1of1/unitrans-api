import empresaRoute from "./empresaRoute.js";
import alunoRoute from "./alunoRoute.js";
import veiculoRoute from "./veiculoRoute.js";
import vinculoRoute from "./vinculoRoute.js";

function Routes(app) {
  empresaRoute(app);
  alunoRoute(app);
  veiculoRoute(app);
  vinculoRoute(app);
}

export default Routes;
