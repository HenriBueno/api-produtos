import { Request, Response } from "express";
import db from "../database/prisma.connection";

export default class ProjetoController {
  async list(req: Request, res: Response) {
    const { produtoId } = req.params;
    try {
      const projeto = await db.produto.findUnique({
        where: { id: produtoId },
        include: {
          projetos: {
            include: {
              amostras: true,
            },
          },
        },
      });

      if (!projeto) {
        return res
          .status(404)
          .json({ success: false, msg: "Projeto ou produto não encontrado" });
      }

      return res.status(200).json({
        success: true,
        msg: "Projetos listados com sucesso",
        data: projeto,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, msg: "Erro ao listar projetos" });
    }
  }
  async show(req: Request, res: Response) {
    const { produtoId, projetoId } = req.params;

    try {
      const projeto = await db.projeto.findFirst({
        where: { id: projetoId, produtoId },
        include: {
          amostras: true,
        },
      });

      if (!projeto) {
        return res
          .status(404)
          .json({ success: false, msg: "Projeto não encontrado" });
      }

      return res.status(200).json({
        success: true,
        msg: "Projeto encontrado com sucesso",
        data: projeto,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, msg: "Erro ao buscar projeto" });
    }
  }

  async create(req: Request, res: Response) {
    const { produtoId } = req.params;
    const { numero } = req.body;

    if (!numero) {
      return res
        .status(400)
        .json({ success: false, msg: "Campo 'numero' é obrigatório" });
    }

    try {
      const produto = await db.produto.findUnique({ where: { id: produtoId } });

      if (!produto) {
        return res
          .status(404)
          .json({ success: false, msg: "Produto não encontrado" });
      }

      // Verifica se já existe um projeto com o mesmo numero para esse produto
      const projetoExistente = await db.projeto.findFirst({
        where: {
          numero,
          produtoId,
        },
      });

      if (projetoExistente) {
        return res.status(409).json({
          success: false,
          msg: "Já existe um projeto com esse número.",
        });
      }

      const projeto = await db.projeto.create({
        data: { numero, produtoId },
      });

      return res.status(201).json({
        success: true,
        msg: "Projeto criado com sucesso",
        data: projeto,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, msg: "Erro ao criar projeto" });
    }
  }

  async update(req: Request, res: Response) {
    const { produtoId, projetoId } = req.params;
    const { numero } = req.body;

    try {
      const projeto = await db.projeto.findFirst({
        where: { id: projetoId, produtoId },
      });

      if (!projeto) {
        return res
          .status(404)
          .json({ success: false, msg: "Projeto não encontrado" });
      }

      // Verifica se já existe outro projeto com o mesmo numero para o mesmo produto
      const projetoComMesmoNumero = await db.projeto.findFirst({
        where: {
          numero,
          produtoId,
          NOT: { id: projetoId }, // exclui o próprio projeto da verificação
        },
      });

      if (projetoComMesmoNumero) {
        return res.status(409).json({
          success: false,
          msg: "Já existe outro projeto com esse número para este produto.",
        });
      }

      const projetoAtualizado = await db.projeto.update({
        where: { id: projetoId },
        data: { numero },
      });

      return res.status(200).json({
        success: true,
        msg: "Projeto atualizado com sucesso",
        data: projetoAtualizado,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, msg: "Erro ao atualizar projeto" });
    }
  }

  async delete(req: Request, res: Response) {
    const { produtoId, projetoId } = req.params;
    try {
      const projeto = await db.projeto.findFirst({
        where: { id: projetoId, produtoId },
      });

      if (!projeto) {
        return res
          .status(404)
          .json({ success: false, msg: "Projeto não encontrado" });
      }

      await db.projeto.delete({ where: { id: projetoId } });

      return res
        .status(200)
        .json({ success: true, msg: "Projeto deletado com sucesso" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ success: false, msg: "Erro ao deletar projeto" });
    }
  }
}
