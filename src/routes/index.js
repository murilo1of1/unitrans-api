import empresaRoute from "./empresaRoute.js";
import alunoRoute from "./alunoRoute.js";
import veiculoRoute from "./veiculoRoute.js";
import vinculoRoute from "./vinculoRoute.js";
import rotaRoute from "./rotaRoute.js";
import pontoRoute from "./pontoRoute.js";

function Routes(app) {
  empresaRoute(app);
  alunoRoute(app);
  veiculoRoute(app);
  vinculoRoute(app);
  rotaRoute(app);
  pontoRoute(app);
}

export default Routes;
