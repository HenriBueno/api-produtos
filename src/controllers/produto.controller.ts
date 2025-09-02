import { Request, Response } from "express";
import db from "../database/prisma.connection";
import { Prisma } from "@prisma/client";
class ProdutoController {
  async list(req: Request, res: Response) {
    try {
      const produtos = await db.produto.findMany({
        include: {
          parametros: true,
          projetos: {
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
          },
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Lista de produtos.",
        data: produtos,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro interno no servidor",
      });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, tipo, referencia } = req.body;

      if (!nome || !tipo || !referencia) {
        return res.status(400).json({
          success: false,
          msg: "Campos obrigatórios faltando: nome, tipo e referencia",
        });
      }

      const produto = await db.produto.create({
        data: {
          nome,
          referencia,
          tipo,
        },
      });

      return res.status(201).json({
        success: true,
        msg: "Produto criado com sucesso.",
        data: produto,
      });
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = error.meta?.target;

        if (Array.isArray(target) && target.includes("referencia")) {
          return res.status(409).json({
            success: false,
            msg: "Essa referência já existe! Use uma referência única.",
          });
        }

        return res.status(409).json({
          success: false,
          msg: `Já existe um registro com o campo único duplicado: ${target}`,
        });
      }

      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao criar o produto.",
      });
    }
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const produto = await db.produto.findUnique({
        where: { id },
        include: {
          parametros: true,
          projetos: {
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
          },
        },
      });

      if (produto) {
        return res.status(200).json({
          success: true,
          msg: "Produto listado.",
          data: produto,
        });
      }

      return res.status(404).json({
        success: false,
        msg: "Produto não encontrado.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro interno no servidor",
      });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { referencia, nome, tipo } = req.body;

    try {
      const produto = await db.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        return res.status(404).json({
          success: false,
          msg: "Produto não encontrado",
        });
      }

      const dataToUpdate: any = {};
      if (referencia !== undefined) dataToUpdate.referencia = referencia;
      if (nome !== undefined) dataToUpdate.nome = nome;
      if (tipo !== undefined) dataToUpdate.tipo = tipo;

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({
          success: false,
          msg: "Nenhum campo para atualizar",
        });
      }

      await db.produto.update({
        where: { id },
        data: dataToUpdate,
      });

      return res.status(200).json({
        success: true,
        msg: "Produto modificado com sucesso.",
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const target = error.meta?.target;

        if (Array.isArray(target) && target.includes("referencia")) {
          return res.status(409).json({
            success: false,
            msg: "Essa referência já existe! Use uma referência única.",
          });
        }

        return res.status(409).json({
          success: false,
          msg: `Já existe um registro com o campo único duplicado: ${target}`,
        });
      }

      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro no banco de dados",
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const produto = await db.produto.findUnique({
        where: { id },
      });

      if (!produto) {
        return res.status(404).json({
          success: false,
          msg: "Produto não encontrado.",
        });
      }

      await db.produto.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        msg: "Produto deletado com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao deletar o produto no banco de dados.",
      });
    }
  }
}
export default ProdutoController;
