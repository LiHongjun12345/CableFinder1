const { Sequelize, DataTypes } = require("sequelize");

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = process.env;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("wechat_qrinfo", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const CableList = sequelize.define("CableList", {
  SN: {
    type: DataTypes.STRING(50),
    allowNull: false,
    primaryKey: true
  },
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: true
  },
  OEM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Variant: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Phase: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Length: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  InorEx: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  CableType: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  CableUser0: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  CableUser1: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
},
{
  tableName: 'qr_info',
  timestamps: false
}
);

const SampleManage = sequelize.define("sample_manage", {
  ProjectName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  SampleName: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  StorageLocation: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  BOM: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  SN: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  Receiver: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  DeliveryDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  Comment: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  // UpdateTime: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  //   defaultValue: sequelize.fn('NOW')
  // }
},
{
  tableName: 'sample_manage',
  timestamps: false
}
);

// 数据库初始化方法
async function init() {
  await CableList.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  CableList,
  SampleManage
};
