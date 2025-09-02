import { Request, Response } from "express";
import db from "../database/prisma.connection";

class AmostraController {
  async list(req: Request, res: Response) {
    const { produtoId, projetoId } = req.params;

    try {
      const projeto = await db.projeto.findFirst({
        where: { id: projetoId, produtoId },
        include: {
          amostras: {
            include: {
              medicoes: {
                include: {
                  parametros: true,
                },
              },
            },
          },
        },
      });

      if (!projeto) {
        return res.status(404).json({
          success: false,
          msg: "Projeto não encontrado para o produto informado",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Amostras listadas com sucesso",
        data: projeto.amostras,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao listar amostras",
      });
    }
  }

  async create(req: Request, res: Response) {
    const { produtoId, projetoId } = req.params;
    const { codigo } = req.body;

    try {
      const projeto = await db.projeto.findFirst({
        where: { id: projetoId, produtoId },
      });

      if (!projeto) {
        return res.status(404).json({
          success: false,
          msg: "Projeto não encontrado para o produto informado",
        });
      }

      const amostraExistente = await db.amostra.findFirst({
        where: { codigo, projetoId },
      });

      if (amostraExistente) {
        return res.status(400).json({
          success: false,
          msg: `Amostra com código "${codigo}" já existe para este projeto.`,
        });
      }

      const amostra = await db.amostra.create({
        data: {
          codigo,
          projeto: { connect: { id: projetoId } },
        },
      });

      return res.status(201).json({
        success: true,
        msg: "Amostra criada com sucesso",
        data: amostra,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao criar amostra",
      });
    }
  }

  async update(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId } = req.params;
    const { codigo } = req.body;

    try {
      const amostra = await db.amostra.findFirst({
        where: {
          id: amostraId,
          projeto: {
            id: projetoId,
            produtoId: produtoId,
          },
        },
      });

      if (!amostra) {
        return res.status(404).json({
          success: false,
          msg: "Amostra não encontrada para o projeto e produto informados",
        });
      }

      const atualizado = await db.amostra.update({
        where: { id: amostraId },
        data: { codigo },
      });

      return res.status(200).json({
        success: true,
        msg: "Amostra atualizada com sucesso",
        data: atualizado,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao atualizar amostra",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId } = req.params;

    try {
      const amostra = await db.amostra.findFirst({
        where: {
          id: amostraId,
          projeto: {
            id: projetoId,
            produtoId: produtoId,
          },
        },
      });

      if (!amostra) {
        return res.status(404).json({
          success: false,
          msg: "Amostra não encontrada para o projeto e produto informados",
        });
      }

      await db.amostra.delete({ where: { id: amostraId } });

      return res.status(200).json({
        success: true,
        msg: "Amostra excluída com sucesso",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao excluir amostra",
      });
    }
  }
}
export default AmostraController;
