import { Request, Response } from "express";
import db from "../database/prisma.connection";

class ParametroMedicaoController {
  async list(req: Request, res: Response) {
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
        include: { parametros: true },
      });

      if (!medicao) {
        return res.status(404).json({
          success: false,
          msg: "Medição não encontrada no contexto informado",
        });
      }
      return res.status(200).json({
        success: true,
        msg: "Parâmetros listados com sucesso",
        data: medicao.parametros,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao listar parâmetros",
      });
    }
  }

  async create(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId, medicaoId } = req.params;
    const { nome, valor, unidade } = req.body;

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
          msg: "Medição não encontrada no contexto informado",
        });
      }

      const parametroExistente = await db.parametroMedicao.findFirst({
        where: {
          nome,
          medicaoId,
        },
      });

      if (parametroExistente) {
        return res.status(400).json({
          success: false,
          msg: `Parâmetro com nome "${nome}" já existe nessa medição.`,
        });
      }

      const parametro = await db.parametroMedicao.create({
        data: {
          nome,
          valor,
          unidade,
          medicao: { connect: { id: medicaoId } },
        },
      });

      return res.status(201).json({
        success: true,
        msg: "Parâmetro criado com sucesso",
        data: parametro,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao criar parâmetro",
      });
    }
  }

  async update(req: Request, res: Response) {
  const { produtoId, projetoId, amostraId, medicaoId, parametroId } = req.params;
  const { valor } = req.body;

  try {
    // Primeiro, garantimos que o parâmetro realmente pertence ao contexto informado
    const parametro = await db.parametroMedicao.findFirst({
      where: {
        id: parametroId,
        medicao: {
          id: medicaoId,
          amostra: {
            id: amostraId,
            projeto: {
              id: projetoId,
              produtoId,
            },
          },
        },
      },
    });

    if (!parametro) {
      return res.status(404).json({
        success: false,
        msg: "Parâmetro não encontrado no contexto informado",
      });
    }

    // Atualiza apenas o valor
    const atualizado = await db.parametroMedicao.updateMany({
      where: {
        id: parametroId,
        medicao: {
          id: medicaoId,
          amostra: {
            id: amostraId,
            projeto: {
              id: projetoId,
              produtoId,
            },
          },
        },
      },
      data: { valor },
    });

    if (atualizado.count === 0) {
      return res.status(404).json({
        success: false,
        msg: "Não foi possível atualizar o valor no contexto informado",
      });
    }

    return res.status(200).json({
      success: true,
      msg: "Valor atualizado com sucesso",
      data: { id: parametroId, valor },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Erro ao atualizar valor do parâmetro",
    });
  }
}


  async delete(req: Request, res: Response) {
    const { produtoId, projetoId, amostraId, medicaoId, parametroId } =
      req.params;

    try {
      const parametro = await db.parametroMedicao.findFirst({
        where: {
          id: parametroId,
          medicao: {
            id: medicaoId,
            amostra: {
              id: amostraId,
              projeto: {
                id: projetoId,
                produtoId,
              },
            },
          },
        },
      });

      if (!parametro) {
        return res.status(404).json({
          success: false,
          msg: "Parâmetro não encontrado no contexto informado",
        });
      }

      await db.parametroMedicao.delete({
        where: { id: parametroId },
      });

      return res.status(200).json({
        success: true,
        msg: "Parâmetro excluído com sucesso",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao excluir parâmetro",
      });
    }
  }
}

export default ParametroMedicaoController;
