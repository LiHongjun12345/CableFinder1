const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { init: initDB, CableList, SampleManage } = require("./db");
const sequelize = require("sequelize");

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
  await CableList.update(
    { CableUser1: sequelize.col('CableUser0') },
    {
      where:{
        CableUser1: null,
      }
    }
  );
  const result = await CableList.findAll({
    attributes: ['SN', 'CableUser0', 'CableUser1'],
    raw: true
  });
  res.send({
    data: result
  });
});

//获取选取线束的信息
app.post("/api/Users", async(req, res) => {
  const { SN } = req.body;
  try{
    const Cable = await CableList.findByPk(SN, {
      attributes: ['CableUser0', 'CableUser1'],
    });
    return res.json(Cable);
  }catch(err){
    console.error('Error inserting data:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }

});

//更新当前线束使用者
app.post('/api/newUser', async(req, res) => {
  const { SN, CableUser1 } = req.body;
  try{
    const newUser = await CableList.update({ CableUser1 },
      {
        where: { SN }
      }
    );
    res.json(newUser);
  }catch(err){
    console.error('Error inserting data:', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

//扫码时检查该线束是否已上传数据库，若无则自动上传
app.post('/api/Checkdata', async(req, res) => {
  const { SN, OEM, Variant, Phase, Length, InOrEx, CableType, CableUser0 } = req.body;
  console.log(SN);
  try{
    const [ cable, created ] = await CableList.findOrCreate({
      where: { SN: SN },
      defaults: {
        OEM: OEM,
        Variant: Variant,
        Phase: Phase,
        Length: Length,
        InOrEx: InOrEx,
        CableType: CableType,
        CableUser0: CableUser0
      }
    });
    res.json({ cable, created });
  }catch(err){
    console.error('Error checking/creating data: ', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
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
  const { id } = req.body;
  const whereConditions = {};
  whereConditions.id = id;
  try{
    await SampleManage.destroy({
      where: whereConditions
    });
    return res.json({message: 'delete succeeded !'});
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
//  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}

bootstrap();
