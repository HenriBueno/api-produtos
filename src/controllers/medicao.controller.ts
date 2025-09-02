import { Request, Response } from "express";
import db from "../database/prisma.connection";

class MedicaoController {
  async list(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId } = req.params;

    try {
      const amostra = await db.amostra.findFirst({
        where: {
          id: amostraId,
          projeto: {
            id: projetoId,
            produtoId,
          },
        },
      });

      if (!amostra) {
        return res.status(404).json({
          success: false,
          msg: "Amostra não encontrada no projeto e produto informados",
        });
      }

      const medicoes = await db.medicao.findMany({
        where: { amostraId },
      });

      return res.status(200).json({
        success: true,
        msg: "Medições listadas com sucesso",
        data: medicoes,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao listar medições",
      });
    }
  }

  async create(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId } = req.params;
    const { tipoMedicao } = req.body;

    try {
      const amostra = await db.amostra.findFirst({
        where: {
          id: amostraId,
          projeto: {
            id: projetoId,
            produtoId,
          },
        },
      });

      if (!amostra) {
        return res.status(404).json({
          success: false,
          msg: "Amostra não encontrada no projeto e produto informados",
        });
      }

      const medicao = await db.medicao.create({
        data: {
          tipoMedicao,
          amostra: { connect: { id: amostraId } },
        },
      });

      return res.status(201).json({
        success: true,
        msg: "Medição criada com sucesso",
        data: medicao,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao criar medição",
      });
    }
  }

  async update(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId, medicaoId } = req.params;
    const { tipoMedicao } = req.body;

    try {
      const medicao = await db.medicao.findFirst({
        where: {
          id: medicaoId,
          amostra: {
            id: amostraId,
            projeto: {
              id: projetoId,
              produtoId,
            },
          },
        },
      });

      if (!medicao) {
        return res.status(404).json({
          success: false,
          msg: "Medição não encontrada para a amostra, projeto e produto informados",
        });
      }

      const atualizado = await db.medicao.update({
        where: { id: medicaoId },
        data: { tipoMedicao },
      });

      return res.status(200).json({
        success: true,
        msg: "Medição atualizada com sucesso",
        data: atualizado,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao atualizar medição",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId, medicaoId } = req.params;

    try {
      const medicao = await db.medicao.findFirst({
        where: {
          id: medicaoId,
          amostra: {
            id: amostraId,
            projeto: {
              id: projetoId,
              produtoId,
            },
          },
        },
      });

      if (!medicao) {
        return res.status(404).json({
          success: false,
          msg: "Medição não encontrada para a amostra, projeto e produto informados",
        });
      }

      await db.medicao.delete({
        where: { id: medicaoId },
      });

      return res.status(200).json({
        success: true,
        msg: "Medição excluída com sucesso",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao excluir medição",
      });
    }
  }
}

export default MedicaoController;
