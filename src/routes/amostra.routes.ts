import { Router } from "express";
import AmostraController from "../controllers/amostra.controller";

const routes = () => {
  const router = Router();
  const controller = new AmostraController();

  router.get("/:produtoId/:projetoId", (req, res) => {
    controller.list(req, res);
  });

  router.post("/:produtoId/:projetoId", (req, res) => {
    controller.create(req, res);
  });

  router.put("/:produtoId/:projetoId/:amostraId", (req, res) => {
    controller.update(req, res);
  });

  router.delete("/:produtoId/:projetoId/:amostraId", (req, res) => {
    controller.delete(req, res);
  });

  return router;
};

export default routes;
