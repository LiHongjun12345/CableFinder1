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
// 获取样件整体列表
app.get("/api/sample", async (req, res) => {
  const result = await SampleManage.findAll({
    attributes: ['id', 'ProjectName', 'SampleName', 'StorageLocation', 'BOM', 'SN', 'Receiver', 'DeliveryDate', 'Comment'],
    raw: true
  });
  res.send({
    data: result
  });
});

// //样件登记
app.post('/api/sample', async (req, res) => {
    
  const { ProjectName, SampleName, StorageLocation, BOM, SN, Receiver, DeliveryDate,Comment} = req.body; // 替换为你的表字段 
  
  try {
      const dut = await SampleManage.create({
        ProjectName, SampleName, StorageLocation, BOM, SN, Receiver, DeliveryDate, Comment
      })
      return res.status(201).json(dut);
  } catch (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// //扫码获取样机的最早录入信息
app.post('/api/scanCode', async (req, res) => {    
  const { SN } = req.body; 
  try {
      const result = await SampleManage.findOne({
        where: {SN: SN},
        order: [['UpdateTime', 'ASC']]
      });
          console.log(result);
          return res.send(result);
  } catch (err) {
      console.error('Error finding data:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// //获取当前样机的所有流转信息
app.post('/api/SampleTrace', async (req, res) => {    
  const { ProjectName, SN } = req.body; 
  try {
      const result = await SampleManage.findAll({
        attributes: ['DeliveryDate', 'StorageLocation', 'Receiver', 'Comment'],
        where: { ProjectName: ProjectName,
                SN: SN },
        order: [['UpdateTime', 'DESC']]
      })
        console.log(result);
        return res.json(result);
  } catch (err) {
      console.error('Error finding data:', err);
      return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//样件检索功能
app.post('/api/filter', async(req, res) => {
  const { ProjectName, SN, StorageLocation, Receiver } = req.body;
  const whereConditions = {};
  if(ProjectName) whereConditions.ProjectName = ProjectName;
  if(SN) whereConditions.SN = SN;
  if(StorageLocation) whereConditions.StorageLocation = StorageLocation;
  if(Receiver) whereConditions.Receiver = Receiver;
  try{
    const result = await SampleManage.findAll({
      attributes: ['ProjectName', 'SampleName', 'StorageLocation', 'BOM', 'SN', 'Receiver', 'DeliveryDate', 'Comment'],
      where: whereConditions,
      order: [['UpdateTime', 'DESC']]
    });
    console.log(result);
    console.log(req.body);
    return res.json(result)
  }catch(err) {
    console.error('Error finding data:', err, whereConditions);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//后台删除表格内容
app.post('/api/delete', async(req, res) => {
  const { ProjectName, SN, StorageLocation, Receiver } = req.body;
  const whereConditions = {};
  if(ProjectName) whereConditions.ProjectName = ProjectName;
  if(SN) whereConditions.SN = SN;
  if(StorageLocation) whereConditions.StorageLocation = StorageLocation;
  if(Receiver) whereConditions.Receiver = Receiver;
  try{
    await SampleManage.destroy({
      where: whereConditions
    });
    console.log('delete succeed!');
  }catch(err) {
    console.error('Error deleting data:', err, whereConditions);
    return res.status(500).json({ message: 'Server error', error: err.message });
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
