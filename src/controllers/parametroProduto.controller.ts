import { Request, Response } from "express";
import db from "../database/prisma.connection";

class ParametroProdutoController {
  async list(req: Request, res: Response) {
    const { produtoId } = req.params;

    try {
      const produtoExiste = await db.produto.findUnique({
        where: { id: produtoId },
        include: {
          parametros: true,
        },
      });

      if (!produtoExiste) {
        return res.status(404).json({
          success: false,
          msg: "Produto não encontrado.",
        });
      }

      return res.status(200).json({
        success: true,
        msg: "Parâmetros listados com sucesso.",
        data: produtoExiste.parametros,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao listar os parâmetros.",
      });
    }
  }
  async create(req: Request, res: Response) {
    const { produtoId } = req.params;
    const { nome, valor, unidade } = req.body;

    if (!nome || valor === undefined || !produtoId) {
      return res.status(400).json({
        success: false,
        msg: "Campos obrigatórios: nome, valor, produtoId",
      });
    }

    try {
      const produtoExiste = await db.produto.findUnique({
        where: { id: produtoId },
      });

      if (!produtoExiste) {
        return res.status(404).json({
          success: false,
          msg: "Produto não encontrado.",
        });
      }

      const parametro = await db.parametroProduto.create({
        data: {
          nome,
          valor: parseFloat(valor),
          unidade,
          produtoId,
        },
      });

      return res.status(201).json({
        success: true,
        msg: "Parâmetro criado com sucesso.",
        data: parametro,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao criar o parâmetro.",
      });
    }
  }
  async update(req: Request, res: Response) {
    const { produtoId, parametroId } = req.params;
    const { nome, valor, unidade } = req.body;

    if (!nome && valor === undefined && unidade === undefined) {
      return res.status(400).json({
        success: false,
        msg: "Pelo menos um campo (nome, valor ou unidade) deve ser fornecido para atualizar.",
      });
    }

    try {
      // Verifica se o parâmetro existe e pertence ao produto
      const parametroExiste = await db.parametroProduto.findUnique({
        where: { id: parametroId },
      });

      if (!parametroExiste || parametroExiste.produtoId !== produtoId) {
        return res.status(404).json({
          success: false,
          msg: "Parâmetro não encontrado para este produto.",
        });
      }

      // Atualiza somente os campos informados
      const parametroAtualizado = await db.parametroProduto.update({
        where: { id: parametroId },
        data: {
          ...(nome !== undefined && { nome }),
          ...(valor !== undefined && { valor: parseFloat(valor) }),
          ...(unidade !== undefined && { unidade }),
        },
      });

      return res.status(200).json({
        success: true,
        msg: "Parâmetro atualizado com sucesso.",
        data: parametroAtualizado,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao atualizar o parâmetro.",
      });
    }
  }
  async delete(req: Request, res: Response) {
    const { produtoId, parametroId } = req.params;

    try {
      // Verifica se o parâmetro existe e pertence ao produto
      const parametroExiste = await db.parametroProduto.findUnique({
        where: { id: parametroId },
      });

      if (!parametroExiste || parametroExiste.produtoId !== produtoId) {
        return res.status(404).json({
          success: false,
          msg: "Parâmetro não encontrado para este produto.",
        });
      }

      // Deleta o parâmetro
      await db.parametroProduto.delete({
        where: { id: parametroId },
      });

      return res.status(200).json({
        success: true,
        msg: "Parâmetro deletado com sucesso.",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        msg: "Erro ao deletar o parâmetro.",
      });
    }
  }
}
export default ParametroProdutoController;
