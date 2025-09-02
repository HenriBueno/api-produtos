import { Router } from "express";
import ProjetoController from "../controllers/projeto.controller";

const routes = () => {
  const router = Router();
  const controller = new ProjetoController();

  router.get("/:produtoId", (req, res) => {
    controller.list(req, res);
  });
  router.get("/:produtoId/:projetoId", (req, res) => {
    controller.show(req, res);
  });
  router.post("/:produtoId", (req, res) => {
    controller.create(req, res);
  });

  router.put("/:produtoId/:projetoId", (req, res) => {
    controller.update(req, res);
  });
  router.delete("/:produtoId/:projetoId", (req, res) => {
    controller.delete(req, res);
  });

  return router;
};

export default routes;
