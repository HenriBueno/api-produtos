import { Router } from "express";
import ParametroProdutoController from "../controllers/parametroProduto.controller";

const routes = () => {
  const router = Router();
  const controller = new ParametroProdutoController();

  router.get("/:produtoId", (req, res) => {
    controller.list(req, res);
  });

  router.post("/:produtoId", (req, res) => {
    controller.create(req, res);
  });

  router.put("/:produtoId/:parametroId", (req, res) => {
    controller.update(req, res);
  });

  router.delete("/:produtoId/:parametroId", (req, res) => {
    controller.delete(req, res);
  });

  return router;
};

export default routes;
