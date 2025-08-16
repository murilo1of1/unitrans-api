const getAll = (req, res) => {
  return res.status(200).send({
    message: 'todos os livros',
  });
}

const getId = (req, res) => {
  const { idLivro } = req.params;

  return res.status(200).send({
    message: 'livro:', idLivro
  });
}

const create = (req, res) => {
  const { nomeLivro, descLivro } = req.body;
  
  return res.status(201).send({
    message: 'Livro criado',
    data: {
      nomeLivro,
      descLivro
    }
  });
}

export default {
  getAll,
  getId,
  create,
}