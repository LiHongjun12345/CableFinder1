const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, CableList, SampleManage } = require("./db");

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
app.post("/api/CableList", async (req, res) => {
  const { action } = req.body;
  if (action === "inc") {
    await CableList.create();
  } else if (action === "clear") {
    await CableList.destroy({
      truncate: true,
    });
  }
  res.send({
    code: 0,
    data: await CableList.count(),
  });
});

// 获取线束列表
app.get("/api/CableList", async (req, res) => {
  const result = await CableList.findAll({
    attributes: ['SN', 'CableUser0', 'CableUser1'],
    raw: true
  });
  res.send({
    data: result
  });
});

app.get("/api/sample", async (req, res) => {
  const result = await SampleManage.findAll({
    attributes: ['ProjectName', 'SampleName', 'BOM'],
    raw: true
  });
  res.send({
    data: result
  });
});

// //样件登记
app.post('/api/sample', async (req, res) => {
    
  const { ProjectName, SampleName, StorageLocation, BOM, SN, Receiver, DeliveryDate, Comment} = req.body; // 替换为你的表字段
  
  try {
      const dut = await SampleManage.create({
        ProjectName, SampleName, StorageLocation, BOM, SN, Receiver, DeliveryDate, Comment
      })
      return res.status(201).json(dut);
  } catch (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Server error!');
  }
});

// 小程序调用，获取微信 Open ID
app.get("/api/wx_openid", async (req, res) => {
  if (req.headers["x-wx-source"]) {
    res.send(req.headers["x-wx-openid"]);
  }
});

const port = 80;//process.env.PORT || 80;

async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
