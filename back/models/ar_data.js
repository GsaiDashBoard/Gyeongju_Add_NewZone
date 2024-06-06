module.exports = (sequelize, DataTypes) => {
  const Ar_data = sequelize.define('AR_DATA',{ //'User' -> users 테이블로 mysql로 저장
    //id는 기본적으로 적혀있음
    /*id: {
      type: DataTypes.INTEGER(50),
      allowNull: false, //필수
    },*/
    mixture_id: {
      type: DataTypes.INTEGER,
      allowNull: false, //필수
    },
    zone_id: {//순서
      type: DataTypes.INTEGER,
    },
    unit_exp: {
      type: DataTypes.STRING(45),
      allowNull: false, //필수
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false, //필수
    },
    data: {
      type: DataTypes.DECIMAL(10,2),
    },
    detail: {
      type: DataTypes.JSON,
    }   


  }, {
    charset: 'utf8',
    collate: 'utf8_general_ci', //한글 저장

  });
  //User.associate = (db) => {}; // 관련성
  return Ar_data;

};