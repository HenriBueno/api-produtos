import { Router } from "express";
import ParametroMedicaoController from "../controllers/parametroMedicao.controller";

const routes = () => {
  const router = Router();
  const controller = new ParametroMedicaoController();

  router.get("/:produtoId/:projetoId/:amostraId/:medicaoId", (req, res) => {
    controller.list(req, res);
  });

  router.post("/:produtoId/:projetoId/:amostraId/:medicaoId", (req, res) => {
    controller.create(req, res);
  });

  router.put("/:produtoId/:projetoId/:amostraId/:medicaoId/:parametroId", (req, res) => {
    controller.update(req, res);
  });

  router.delete("/:produtoId/:projetoId/:amostraId/:medicaoId/:parametroId", (req, res) => {
    controller.delete(req, res);
  });

  return router;
};

export default routes;
