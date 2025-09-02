-- CreateEnum
CREATE TYPE "ProdutoTipo" AS ENUM ('JARDIM', 'FITA', 'FONTE', 'LAMPADA');

-- CreateEnum
CREATE TYPE "TipoMedicao" AS ENUM ('ESFERA_INTEGRADORA', 'GONIOFOTOMETRO');

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "ProdutoTipo" NOT NULL,
    "referencia" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroProduto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT,
    "produtoId" TEXT NOT NULL,

    CONSTRAINT "ParametroProduto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Projeto" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "produtoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projeto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amostra" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "projetoId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Amostra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicao" (
    "id" TEXT NOT NULL,
    "tipoMedicao" "TipoMedicao" NOT NULL,
    "amostraId" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParametroMedicao" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT,
    "medicaoId" TEXT NOT NULL,

    CONSTRAINT "ParametroMedicao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Produto_referencia_key" ON "Produto"("referencia");

-- CreateIndex
CREATE UNIQUE INDEX "Projeto_numero_key" ON "Projeto"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Amostra_codigo_projetoId_key" ON "Amostra"("codigo", "projetoId");

-- AddForeignKey
ALTER TABLE "ParametroProduto" ADD CONSTRAINT "ParametroProduto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projeto" ADD CONSTRAINT "Projeto_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amostra" ADD CONSTRAINT "Amostra_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Projeto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicao" ADD CONSTRAINT "Medicao_amostraId_fkey" FOREIGN KEY ("amostraId") REFERENCES "Amostra"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParametroMedicao" ADD CONSTRAINT "ParametroMedicao_medicaoId_fkey" FOREIGN KEY ("medicaoId") REFERENCES "Medicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;
