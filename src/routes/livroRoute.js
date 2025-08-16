import livroController from "../controllers/livroController.js";

export default (app) => {
  app.get('/livro', livroController.getAll);
  app.get('/livro/:idLivro', livroController.getId);
  app.post('/livro', livroController.create);
}