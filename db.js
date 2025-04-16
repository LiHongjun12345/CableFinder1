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
    primaryKey: true,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  Timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  OEM: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  Variant: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  Phase: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  Length: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  InorEx: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  CableType: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  CableUser0: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'a-b-c-d-e-f-g-h'
  },
  CableUser1: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'a-b-c-d-e-f-g-h'
  }
},
// {
//   tableName: 'qr_info'
// }
);

// 数据库初始化方法
async function init() {
  await CableList.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  CableList,
};
