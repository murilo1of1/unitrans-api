import empresaRoute from "./empresaRoute.js";
import alunoRoute from "./alunoRoute.js";

function Routes(app) {
  empresaRoute(app);
  alunoRoute(app);
}

export default Routes;
