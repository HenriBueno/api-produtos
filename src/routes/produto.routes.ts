import { Router } from "express";
import ProdutoController from "../controllers/produto.controller";

const routes = () => {
  const router = Router();
  const controller = new ProdutoController()

  router.get("/", (req, res) => {controller.list(req, res)})
  router.post("/", (req, res) => {controller.create(req, res)})
  router.get("/:id", (req, res) => {controller.show(req, res)})
  router.put("/:id", (req, res) => {controller.update(req, res)})
  router.delete("/:id", (req, res) => {controller.delete(req, res)})
  return router;
};
export default routes;

