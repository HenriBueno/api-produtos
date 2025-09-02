import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import produtoRoutes from "./routes/produto.routes";
import parametroProdutoRoutes from "./routes/parametroProduto.routes";
import projetoRoutes from "./routes/projeto.routes";
import amostraRoutes from "./routes/amostra.routes";
import medicaoRoutes from "./routes/medicao.routes";
import parametroMedicaoRoutes from "./routes/parametroMedicao.routes";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//ROUTES
app.use("/produtos", produtoRoutes());
app.use("/parametroProduto", parametroProdutoRoutes());
app.use("/projeto", projetoRoutes());
app.use("/amostra", amostraRoutes());
app.use("/medicao", medicaoRoutes());
app.use("/parametro-medicao", parametroMedicaoRoutes());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}...`);
});
