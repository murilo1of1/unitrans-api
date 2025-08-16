import clienteController from "../controllers/clienteController.js";

export default (app) => {
  app.get('/cliente', clienteController.get);
  app.get('/cliente/:id', clienteController.get);
  app.post('/cliente', clienteController.persist);
  app.patch('/cliente/:id', clienteController.persist);
  app.delete('/cliente/:id', clienteController.destroy);
}