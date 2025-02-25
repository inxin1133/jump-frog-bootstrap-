// 'use strict';
// const fs = require('fs');
// const path = require('path');
const Sequelize = require('sequelize');
// const process = require('process');
// const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

// let sequelize;
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
// db.Post = require('./post')(sequelize, Sequelize);
// db.Hashtag = require('./hashtag')(sequelize, Sequelize);



// db.User.hasMany(db.Post);
// db.Post.belongsTo(db.User);

// db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
// db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });


// // 나를 따르는 사람들(followers) 설정
// db.User.belongsToMany(db.User, {
//   foreignKey: 'followingId',
//   as: 'Followers',
//   through: 'Follow',
// });

// // 내가 따르는 사람들(followings) 설정 
// db.User.belongsToMany(db.User, {
//   foreignKey: 'followerId',
//   as: 'Followings',
//   through: 'Follow',
// });

module.exports = db;


// db.User.hasMany(db.Post, { foreignKey: 'poster', sourceKey: 'id' });
// db.Post.belongsTo(db.User, { foreignKey: 'poster', targetKey: 'id' });


// ------------------------------------------------------------------------------------

// // config/config.js 파일에 있는 정보를 가져와 sequelize 객체를 생성한다.
// let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }


// // 우리가 작성한 Table 파일을 찾아온다.
// fs
//   .readdirSync(__dirname)
//   .filter(file => {
//     return (
//       file.indexOf('.') !== 0 &&
//       file !== basename &&
//       file.slice(-3) === '.js' &&
//       file.indexOf('.test.js') === -1
//     );
//   })
//   .forEach(file => {
//     const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
//     db[model.name] = model;
//   });

// // DB에 모델이름을 연결한다.
// Object.keys(db).forEach(modelName => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });
