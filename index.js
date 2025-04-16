const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { sequelize } = require("./db");

const logger = morgan("tiny");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(logger);

// 首页
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// 更新计数
app.post("/api/count", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await sequelize.create();
  } else if (action === "clear") {
    await sequelize.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await sequelize.count(),
  });
});

// 获取计数
app.get("/api/CableList", async (req, res) => {
  // const result = await sequelize.count();
  try{
    const pool = await sequelize;
    const result = await pool.request().query('SELECT SN, CableUser0, CableUser1 FROM QR_info order by Timestamp desc');
    return res.json(result.recordset);

  }
  catch(err){
    console.error('Error fetching data:', err);
    return res.status(500).send('Server error'); 
  }
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
