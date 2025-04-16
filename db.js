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
    allowNull: false
  },
  OEM: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Variant: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Phase: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  Length: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  InorEx: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  CableType: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  CableUser0: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  CableUser1: {
    type: DataTypes.STRING(50),
    allowNull: true
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
