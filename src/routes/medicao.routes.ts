import { Router } from "express";
import MedicaoController from "../controllers/medicao.controller";

const routes = () => {
  const router = Router();
  const controller = new MedicaoController();

  router.get("/:produtoId/:projetoId/:amostraId", (req, res) => {
    controller.list(req, res);
  });

  router.post("/:produtoId/:projetoId/:amostraId", (req, res) => {
    controller.create(req, res);
  });

  router.put("/:produtoId/:projetoId/:amostraId/:medicaoId", (req, res) => {
    controller.update(req, res);
  });

  router.get("/:produtoId/:projetoId/:amostraId/:medicaoId", (req, res) => {
    controller.show(req, res);
  });

  router.delete("/:produtoId/:projetoId/:amostraId/:medicaoId", (req, res) => {
    controller.delete(req, res);
  });

  return router;
};

export default routes;
