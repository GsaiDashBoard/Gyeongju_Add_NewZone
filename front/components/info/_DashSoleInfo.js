// 통합분석, 비교분석의 네비게이션 바 밑에 바로 나오는 상태들
//api 불러와서 바로 적용
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import Image from "next/image";

import DashTotalInfo from "./DashTotalInfo";

import red_icon from "../../public/images/scanner_rd.png";
import orange_icon from "../../public/images/scanner_or.png";
import green_icon from "../../public/images/scanner_gr.png";
import yellow_icon from "../../public/images/scanner_yl.png";
import blue_icon from "../../public/images/scanner_bl.png";
import brown_icon from "../../public/images/scanner_br.png";
import purple_icon from "../../public/images/scanner_pu.png";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/auth";
import wrapper from "../../store/configureStore";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//인디케이터 디자인
const Block = styled.div`
  .dark {
    .fpa_box {
      background-color: #3c496e;
      box-shadow: 0px 0px 0px #cccccc;
    }
    .fpa_box_table {
      background-color: #3c496e;
      border-radius: 7px;
    }
    .fpa_title {
      font-size: 15px;
      color: white;
      font-weight: normal;
    }

    .td {
      border-right: solid 1px #526395;
    }
    .fpa_box_table .td:nth-child(1) {
      border-left: solid 0;
    }
    .fpa_box_table .td:nth-child(6) {
      border-right: solid 0;
    }
    .fpa_num1 {
      font-size: 22px;
      font-weight: normal;
      color: white;
    }
    .fpa_num2 {
      font-size: 14px;
      color: white;
    }
    .fpa_num3 {
      font-size: 14px;
      margin: 0 0 0 5px;
      color: #e5004f;
    }

    .fpa_num3_1 {
      font-size: 14px;
      margin: 0 0 0 5px;
      color: #00b7ee;
    }
    .fpa_num4 {
      font-size: 14px;
      color: white;
    }
  }

  .onclickalldevice {
    background: rgba(255, 255, 255, 0);
    border: none;
    font-weight: bold;
    font-size: 15px;
  }
`;

const StatusBlock = styled.div`
  .fpa_box {
    width: 95%;
    margin: 10px 2.5% 0px 2.5%;
    background-color: #72c5ee;
    border-radius: 7px;
    box-shadow: 0px 0px 5px #cccccc;
  }

  .back_1 {
    background-color: #6babf1;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_2 {
    background-color: #69b1f3;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_3 {
    background-color: #6cbbf0;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_4 {
    background-color: #72c5ee;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_5 {
    background-color: #6eccdc;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_6 {
    background-color: #6cd0d1;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_7 {
    background-color: #6bd3cd;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }
  .back_8 {
    background-color: #69d7c2;
    //background: rgba(75, 192, 192, 0.8);
    //background: rgba(241, 88, 83, 0.8);
    //background-color: #6babf1;
  }

  .division {
    display: flex;
    margin: 0;
  }

  .icon {
    width: 40px;
    height: 45px;
    margin-top: 4px;
    margin-left: 5px;
  }

  .fpa_box_table {
    width: 100%;
    //height: 100%;
    text-align: center;
  }

  .fpa_box_table .tr {
    display: grid;
    grid-template-columns: 2.2fr 1fr 1fr 1fr;
    margin: 1px 5px 0px 0;
    height: 100%;
    line-height: 300%;
    .fpa_title {
      font-size: 17.5px;
      color: white;
      font-weight: 500;
    }
    .first {
      display: flex;
    }
  }
  .fpa_box_table .trDevice {
    display: grid;
    grid-template-columns: 1fr 1fr;
    line-height: 150%;
    margin: 0;
    .fpa_title {
      font-size: 15px;
      color: white;
      font-weight: 500;
    }
  }
  .tr .td {
    border-right: solid 1px white;
  }
  .fpa_box_table .td:nth-child(1) {
    border-left: solid 0;
  }
  .fpa_box_table .tr .td:nth-child(4) {
    border-right: solid 0;
  }

  .onclickdevice {
    cursor: pointer;
  }
`;

function DashSoleInfo({ theme, zone }) {
  const { me } = useSelector((state) => state.auth);
  const slideEl = useRef(null);
  const [settings, setSettings] = useState({});
  const [allDeviceStatus, setAllDeviceStatus] = useState(false);

  const [HDAllZoneInfo, setHDAllZoneInfo] = useState(0); //황리단길 전체
  const [DBAllZoneInfo, setDBAllZoneInfo] = useState(0); //
  const [BGAllZoneInfo, setBGAllZoneInfo] = useState(0); //

  //황리단길
  //금일방문
  const [zoneInfo11, setZoneInfo11] = useState(0);
  const [zoneInfo12, setZoneInfo12] = useState(0);
  const [zoneInfo13, setZoneInfo13] = useState(0);
  const [zoneInfo14, setZoneInfo14] = useState(0);
  const [zoneInfo15, setZoneInfo15] = useState(0);
  const [zoneInfo16, setZoneInfo16] = useState(0);
  const [zoneInfo17, setZoneInfo17] = useState(0);
  const [zoneInfo18, setZoneInfo18] = useState(0);
  //재방문
  const [zoneInfo21, setZoneInfo21] = useState(0);
  const [zoneInfo22, setZoneInfo22] = useState(0);
  const [zoneInfo23, setZoneInfo23] = useState(0);
  const [zoneInfo24, setZoneInfo24] = useState(0);
  const [zoneInfo25, setZoneInfo25] = useState(0);
  const [zoneInfo26, setZoneInfo26] = useState(0);
  const [zoneInfo27, setZoneInfo27] = useState(0);
  const [zoneInfo28, setZoneInfo28] = useState(0);
  //체류시간
  const [zoneInfo31, setZoneInfo31] = useState(0);
  const [zoneInfo32, setZoneInfo32] = useState(0);
  const [zoneInfo33, setZoneInfo33] = useState(0);
  const [zoneInfo34, setZoneInfo34] = useState(0);
  const [zoneInfo35, setZoneInfo35] = useState(0);
  const [zoneInfo36, setZoneInfo36] = useState(0);
  const [zoneInfo37, setZoneInfo37] = useState(0);
  const [zoneInfo38, setZoneInfo38] = useState(0);

  //신규
  //금일방문
  const [zoneInfo1_1, setZoneInfo1_1] = useState(0);
  const [zoneInfo1_2, setZoneInfo1_2] = useState(0);
  const [zoneInfo1_3, setZoneInfo1_3] = useState(0);
  const [zoneInfo1_4, setZoneInfo1_4] = useState(0);
  const [zoneInfo1_5, setZoneInfo1_5] = useState(0);
  const [zoneInfo1_6, setZoneInfo1_6] = useState(0);
  const [zoneInfo1_7, setZoneInfo1_7] = useState(0);
  const [zoneInfo1_8, setZoneInfo1_8] = useState(0);
  //재방문
  const [zoneInfo2_1, setZoneInfo2_1] = useState(0);
  const [zoneInfo2_2, setZoneInfo2_2] = useState(0);
  const [zoneInfo2_3, setZoneInfo2_3] = useState(0);
  const [zoneInfo2_4, setZoneInfo2_4] = useState(0);
  const [zoneInfo2_5, setZoneInfo2_5] = useState(0);
  const [zoneInfo2_6, setZoneInfo2_6] = useState(0);
  const [zoneInfo2_7, setZoneInfo2_7] = useState(0);
  const [zoneInfo2_8, setZoneInfo2_8] = useState(0);
  //체류시간
  const [zoneInfo3_1, setZoneInfo3_1] = useState(0);
  const [zoneInfo3_2, setZoneInfo3_2] = useState(0);
  const [zoneInfo3_3, setZoneInfo3_3] = useState(0);
  const [zoneInfo3_4, setZoneInfo3_4] = useState(0);
  const [zoneInfo3_5, setZoneInfo3_5] = useState(0);
  const [zoneInfo3_6, setZoneInfo3_6] = useState(0);
  const [zoneInfo3_7, setZoneInfo3_7] = useState(0);
  const [zoneInfo3_8, setZoneInfo3_8] = useState(0);

  //대릉원
  //금일방문
  const [zoneInfoHistory1, setZoneInfoHistory1] = useState(0);
  //재방문
  const [zoneInfoHistory2, setZoneInfoHistory2] = useState(0);
  //체류시간
  const [zoneInfoHistory3, setZoneInfoHistory3] = useState(0);


  const zones = [
    "황리단길 중심거리 1",
    "황리단길 중심거리 2",
    "황리단길 중심거리 3",
    "황리단길 북동",
    "황리단길 동남",
    "황리단길 동",
    "황리단길 서",
    "황리단길 서남",
  ];
  const zones2 = [
    "불국사존",
    "석굴암존",
    "봉황대고분존",
    "동궁과월지존",
    "첨성대존",
    "교촌마을존",
    "경주 터미널 온누리 약국 앞",
    "황리단길 전체",
  ];

  const zoneHistory = '경주 대릉원';

  const zoneids = [
    "2070",
    "2071",
    "2072",
    "2073",
    "2074",
    "2075",
    "2076",
    "2077",
  ];
  const zoneids2 = [
    "2082",
    "2083",
    "2084",
    "2085",
    "2086",
    "2087",
    "2088",
    "2078",
  ];
  const zoneidHistory = "2100";

  //경주 실제
  const device2070 = [
    //황리단길 중심거리1
    {
      mac: "D86595040401",
      intmac: "1116768396760",
      zone_id: 2070,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040402",
      intmac: "2216280024536",
      zone_id: 2070,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040403",
      intmac: "3315791652312",
      zone_id: 2070,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504041C",
      intmac: "30803582346712",
      zone_id: 2070,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504041D",
      intmac: "31903093974488",
      zone_id: 2070,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2071 = [
    //황리단길 중심거리2
    {
      mac: "D86595040404",
      intmac: "4415303280088",
      zone_id: 2071,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040407",
      intmac: "7713838163416",
      zone_id: 2071,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504040A",
      intmac: "11012373046744",
      zone_id: 2071,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504041E",
      intmac: "33002605602264",
      zone_id: 2071,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너 + 센서",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2072 = [
    //황리단길 중심거리3
    {
      mac: "D86595040412",
      intmac: "19808466068952",
      zone_id: 2072,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040419",
      intmac: "27505047463384",
      zone_id: 2072,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504041A",
      intmac: "28604559091160",
      zone_id: 2072,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040420",
      intmac: "35201628857816",
      zone_id: 2072,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2073 = [
    //황리단길 북동
    {
      mac: "D86595040400",
      intmac: "17256768984",
      zone_id: 2073,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040408",
      intmac: "8813349791192",
      zone_id: 2073,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040409",
      intmac: "9912861418968",
      zone_id: 2073,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504040B",
      intmac: "12111884674520",
      zone_id: 2073,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504040C",
      intmac: "13211396302296",
      zone_id: 2073,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2074 = [
    //황리단길 동남
    {
      mac: "D86595040413",
      intmac: "20907977696728",
      zone_id: 2074,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040414",
      intmac: "22007489324504",
      zone_id: 2074,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040415",
      intmac: "23107000952280",
      zone_id: 2074,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504041B",
      intmac: "29704070718936",
      zone_id: 2074,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2075 = [
    //황리단길 동
    {
      mac: "D8659504040D",
      intmac: "14310907930072",
      zone_id: 2075,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504040E",
      intmac: "15410419557848",
      zone_id: 2075,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040416",
      intmac: "24206512580056",
      zone_id: 2075,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040417",
      intmac: "25306024207832",
      zone_id: 2075,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2076 = [
    //황리단길 서
    {
      mac: "D86595040405",
      intmac: "5514814907864",
      zone_id: 2076,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040406",
      intmac: "6614326535640",
      zone_id: 2076,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2077 = [
    //황리단길 서남
    {
      mac: "D86595040410",
      intmac: "17609442813400",
      zone_id: 2077,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040411",
      intmac: "18708954441176",
      zone_id: 2077,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040418",
      intmac: "26405535835608",
      zone_id: 2077,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];
  
  const device2082 = [
    {
      mac: "D86595040421",
      intmac: "36301140485592",
      zone_id: 2082,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2083 = [
    {
      mac: "D86595040422",
      intmac: "37400652113368",
      zone_id: 2083,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2084 = [
    {
      mac: "D86595040429",
      intmac: "38500163741144",
      zone_id: 2084,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040424",
      intmac: "39599675368920",
      zone_id: 2084,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2085 = [
    {
      mac: "D86595040425",
      intmac: "40699186996696",
      zone_id: 2085,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2086 = [
    {
      mac: "D86595040426",
      intmac: "41798698624472",
      zone_id: 2086,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040427",
      intmac: "42898210252248",
      zone_id: 2086,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2087 = [
    {
      mac: "D86595040428",
      intmac: "43997721880024",
      zone_id: 2087,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2088 = [
    {
      mac: "D86595040423",
      intmac: "45097233507800",
      zone_id: 2088,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  const device2100 = [
    {
      mac: "D8659504042A",
      intmac: "46196745135576",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504042B",
      intmac: "47296256763352",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504042C",
      intmac: "48395768391128",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040423",
      intmac: "45097233507800",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504042D",
      intmac: "49495280018904",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504042E",
      intmac: "50594791646680",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D8659504042F",
      intmac: "51694303274456",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040430",
      intmac: "52793814902232",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040431",
      intmac: "53893326530008",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040432",
      intmac: "54992838157784",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040433",
      intmac: "56092349785560",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040434",
      intmac: "57191861413336",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040435",
      intmac: "58291373041112",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040436",
      intmac: "59390884668888",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040437",
      intmac: "60490396296664",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "D86595040438",
      intmac: "61589907924440",
      zone_id: 2100,
      status: "ON",
      ins_loc: "실외",
      type: "스캐너",
    },
    {
      mac: "status",
      good: 0,
      weird: 0,
      warning: 0,
      error: 0,
      good_info: "",
      weird_info: "",
      warning_info: "",
      error_info: "",
    },
  ];

  //경주
  const [device2070Arr, setDevice2070Arr] = useState(device2070);
  const [device2071Arr, setDevice2071Arr] = useState(device2071);
  const [device2072Arr, setDevice2072Arr] = useState(device2072);
  const [device2073Arr, setDevice2073Arr] = useState(device2073);
  const [device2074Arr, setDevice2074Arr] = useState(device2074);
  const [device2075Arr, setDevice2075Arr] = useState(device2075);
  const [device2076Arr, setDevice2076Arr] = useState(device2076);
  const [device2077Arr, setDevice2077Arr] = useState(device2077);
  const [device2082Arr, setDevice2082Arr] = useState(device2082);
  const [device2083Arr, setDevice2083Arr] = useState(device2083);
  const [device2084Arr, setDevice2084Arr] = useState(device2084);
  const [device2085Arr, setDevice2085Arr] = useState(device2085);
  const [device2086Arr, setDevice2086Arr] = useState(device2086);
  const [device2087Arr, setDevice2087Arr] = useState(device2087);
  const [device2088Arr, setDevice2088Arr] = useState(device2088);
  const [device2100Arr, setDevice2100Arr] = useState(device2100);

  const getAPIdata1 = async () => {
    // 오늘 누적방문객
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly?unit=1d-1h`
      ); //오늘누적
      const cnt = [0, 0, 0, 0, 0, 0, 0, 0];
      const temp = [0, 0, 0, 0, 0, 0, 0, 0];
      const temp2 = [0, 0, 0, 0, 0, 0, 0, 0];
      var tempHistory = 0;

      for (let i of response.data) {
        if (i.zone_id === zones[0] && i.data > temp[0]) {
          setZoneInfo11(i.data);
          sessionStorage.setItem(zoneids[0], i.data);
          temp[0] = i.data;
          cnt[0] = 1;
        } else if (i.zone_id === zones[1] && i.data > temp[1]) {
          setZoneInfo12(i.data);
          sessionStorage.setItem(zoneids[1], i.data);
          cnt[1] = 1;
          temp[1] = i.data;
        } else if (i.zone_id === zones[2] && i.data > temp[2]) {
          setZoneInfo13(i.data);
          sessionStorage.setItem(zoneids[2], i.data);
          cnt[2] = 1;
          temp[2] = i.data;
        } else if (i.zone_id === zones[3] && i.data > temp[3]) {
          setZoneInfo14(i.data);
          sessionStorage.setItem(zoneids[3], i.data);
          cnt[3] = 1;
          temp[3] = i.data;
        } else if (i.zone_id === zones[4] && i.data > temp[4]) {
          setZoneInfo15(i.data);
          sessionStorage.setItem(zoneids[4], i.data);
          cnt[4] = 1;
          temp[4] = i.data;
        } else if (i.zone_id === zones[5] && i.data > temp[5]) {
          setZoneInfo16(i.data);
          sessionStorage.setItem(zoneids[5], i.data);
          cnt[5] = 1;
          temp[5] = i.data;
        } else if (i.zone_id === zones[6] && i.data > temp[6]) {
          setZoneInfo17(i.data);
          sessionStorage.setItem(zoneids[6], i.data);
          cnt[6] = 1;
          temp[6] = i.data;
        } else if (i.zone_id === zones[7] && i.data > temp[7]) {
          setZoneInfo18(i.data);
          sessionStorage.setItem(zoneids[7], i.data);
          cnt[7] = 1;
          temp[7] = i.data;
        } else if (i.zone_id === zones2[0] && i.data > temp2[0]) {
          setZoneInfo1_1(i.data);
          sessionStorage.setItem(zoneids2[0], i.data);
          cnt[0] = 1;
          temp2[0] = i.data;
        } else if (i.zone_id === zones2[1] && i.data > temp2[1]) {
          setZoneInfo1_2(i.data);
          sessionStorage.setItem(zoneids2[1], i.data);
          cnt[1] = 1;
          temp2[1] = i.data;
        } else if (i.zone_id === zones2[2] && i.data > temp2[2]) {
          setZoneInfo1_3(i.data);
          sessionStorage.setItem(zoneids2[2], i.data);
          cnt[2] = 1;
          temp2[2] = i.data;
        } else if (i.zone_id === zones2[3] && i.data > temp2[3]) {
          setZoneInfo1_4(i.data);
          sessionStorage.setItem(zoneids2[3], i.data);
          cnt[3] = 1;
          temp2[3] = i.data;
        } else if (i.zone_id === zones2[4] && i.data > temp2[4]) {
          setZoneInfo1_5(i.data);
          sessionStorage.setItem(zoneids2[4], i.data);
          cnt[4] = 1;
          temp2[4] = i.data;
        } else if (i.zone_id === zones2[5] && i.data > temp2[5]) {
          setZoneInfo1_6(i.data);
          sessionStorage.setItem(zoneids2[5], i.data);
          cnt[5] = 1;
          temp2[5] = i.data;
        } else if (i.zone_id === zones2[6] && i.data > temp2[6]) {
          setZoneInfo1_7(i.data);
          sessionStorage.setItem(zoneids2[6], i.data);
          cnt[6] = 1;
          temp2[6] = i.data;
        } else if (i.zone_id === zones2[7] && i.data > temp2[7]) {
          setZoneInfo1_8(i.data);
          sessionStorage.setItem(zoneids2[7], i.data);
          cnt[7] = 1;
          temp2[7] = i.data;
        } else if (i.zone_id === zoneHistory && i.data > tempHistory) {
          setZoneInfoHistory1(i.data);
          sessionStorage.setItem(zoneidHistory, i.data);
          cnt[7] = 1;
          tempHistory = i.data;
        }
      }

      if (cnt[0] != 1 && sessionStorage.getItem(zoneids[0])) {
        setZoneInfo11(sessionStorage.getItem(zoneids[0]));
      } else if (cnt[1] != 1 && sessionStorage.getItem(zoneids[1])) {
        setZoneInfo12(sessionStorage.getItem(zoneids[1]));
      } else if (cnt[2] != 1 && sessionStorage.getItem(zoneids[2])) {
        setZoneInfo13(sessionStorage.getItem(zoneids[2]));
      } else if (cnt[3] != 1 && sessionStorage.getItem(zoneids[3])) {
        setZoneInfo14(sessionStorage.getItem(zoneids[3]));
      } else if (cnt[4] != 1 && sessionStorage.getItem(zoneids[4])) {
        setZoneInfo15(sessionStorage.getItem(zoneids[4]));
      } else if (cnt[5] != 1 && sessionStorage.getItem(zoneids[5])) {
        setZoneInfo16(sessionStorage.getItem(zoneids[5]));
      } else if (cnt[6] != 1 && sessionStorage.getItem(zoneids[6])) {
        setZoneInfo17(sessionStorage.getItem(zoneids[6]));
      } else if (cnt[7] != 1 && sessionStorage.getItem(zoneids[7])) {
        setZoneInfo18(sessionStorage.getItem(zoneids[7]));
      } else if (cnt[0] != 1 && sessionStorage.getItem(zoneids2[0])) {
        setZoneInfo1_1(sessionStorage.getItem(zoneids2[0]));
      } else if (cnt[1] != 1 && sessionStorage.getItem(zoneids2[1])) {
        setZoneInfo1_2(sessionStorage.getItem(zoneids2[1]));
      } else if (cnt[2] != 1 && sessionStorage.getItem(zoneids2[2])) {
        setZoneInfo1_3(sessionStorage.getItem(zoneids2[2]));
      } else if (cnt[3] != 1 && sessionStorage.getItem(zoneids2[3])) {
        setZoneInfo1_4(sessionStorage.getItem(zoneids2[3]));
      } else if (cnt[4] != 1 && sessionStorage.getItem(zoneids2[4])) {
        setZoneInfo1_5(sessionStorage.getItem(zoneids2[4]));
      } else if (cnt[5] != 1 && sessionStorage.getItem(zoneids2[5])) {
        setZoneInfo1_6(sessionStorage.getItem(zoneids2[5]));
      } else if (cnt[6] != 1 && sessionStorage.getItem(zoneids2[6])) {
        setZoneInfo1_7(sessionStorage.getItem(zoneids2[6]));
      } else if (cnt[7] != 1 && sessionStorage.getItem(zoneids2[7])) {
        setZoneInfo1_8(sessionStorage.getItem(zoneids2[7]));
      } 
    } catch (err) {
      console.error(err);
      console.log("금일방문재시작");
      setTimeout(() => {
        getAPIdata1();
      }, 2000);
    }
  };

  const getAPIdata2 = async () => {
    try {
      const response2 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountRevisit`
      ); //재방문
     // console.log(response2);
      
      var tempTime = '2021-04-24T10:50:00.000Z';

      for (let i of response2.data) {
        if (i.zone === zones[0]) {
          setZoneInfo21(i.data);
        } else if (i.zone === zones[1]) {
          setZoneInfo22(i.data);
        } else if (i.zone === zones[2]) {
          setZoneInfo23(i.data);
        } else if (i.zone === zones[3]) {
          setZoneInfo24(i.data);
        } else if (i.zone === zones[4]) {
          setZoneInfo25(i.data);
        } else if (i.zone === zones[5]) {
          setZoneInfo26(i.data);
        } else if (i.zone === zones[6]) {
          setZoneInfo27(i.data);
        } else if (i.zone === zones[7]) {
          setZoneInfo28(i.data);
        } else if (i.zone === zones2[0]) {
          setZoneInfo2_1(i.data);
        } else if (i.zone === zones2[1]) {
          setZoneInfo2_2(i.data);
        } else if (i.zone === zones2[2]) {
          setZoneInfo2_3(i.data);
        } else if (i.zone === zones2[3]) {
          setZoneInfo2_4(i.data);
        } else if (i.zone === zones2[4]) {
          setZoneInfo2_5(i.data);
        } else if (i.zone === zones2[5]) {
          setZoneInfo2_6(i.data);
        } else if (i.zone === zones2[6]) {
          setZoneInfo2_7(i.data);
        } else if (i.zone === zones2[7]) {
          setZoneInfo2_8(i.data);
        } else if (i.zone === zoneHistory && i.time > tempTime) {
          setZoneInfoHistory2(i.data);
          tempTime = i.time;
        }
      }
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        getAPIdata2();
      }, 2000);
    }
  };

  const getAPIdata3 = async () => {
    try {
      const response3 = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceResidenceTime`
      ); //평균체류인원
      var tempTime = '2021-04-24T10:50:00.000Z';

      for (let i of response3.data) {
        if (i.zone === zones[0]) {
          setZoneInfo31(Math.round(i.data / 60));
        } else if (i.zone === zones[1]) {
          setZoneInfo32(Math.round(i.data / 60));
        } else if (i.zone === zones[2]) {
          setZoneInfo33(Math.round(i.data / 60));
        } else if (i.zone === zones[3]) {
          setZoneInfo34(Math.round(i.data / 60));
        } else if (i.zone === zones[4]) {
          setZoneInfo35(Math.round(i.data / 60));
        } else if (i.zone === zones[5]) {
          setZoneInfo36(Math.round(i.data / 60));
        } else if (i.zone === zones[6]) {
          setZoneInfo37(Math.round(i.data / 60));
        } else if (i.zone === zones[7]) {
          setZoneInfo38(Math.round(i.data / 60));
        } else if (i.zone === zones2[0]) {
          setZoneInfo3_1(Math.round(i.data / 60));
        } else if (i.zone === zones2[1]) {
          setZoneInfo3_2(Math.round(i.data / 60));
        } else if (i.zone === zones2[2]) {
          setZoneInfo3_3(Math.round(i.data / 60));
        } else if (i.zone === zones2[3]) {
          setZoneInfo3_4(Math.round(i.data / 60));
        } else if (i.zone === zones2[4]) {
          setZoneInfo3_5(Math.round(i.data / 60));
        } else if (i.zone === zones2[5]) {
          setZoneInfo3_6(Math.round(i.data / 60));
        } else if (i.zone === zones2[6]) {
          setZoneInfo3_7(Math.round(i.data / 60));
        } else if (i.zone === zones2[7]) {
          setZoneInfo3_8(Math.round(i.data / 60));
        } else if (i.zone === zoneHistory && i.time > tempTime) {
          setZoneInfoHistory3(Math.round(i.data / 60));
          tempTime = i.time;
        }
      }
    } catch (err) {
      console.error(err);
      setTimeout(() => {
        getAPIdata3();
      }, 2000);
    }
  };

  const getDeviceStatus = async () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const day = ("0" + today.getDate()).slice(-2);
    const date = year + "-" + month + "-" + day;

    try {
      const deviceResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceStatus`
      );

      const resultData = deviceResponse.data;

      let newDevice = [];

      newDevice.push(device2070Arr);
      newDevice.push(device2071Arr);
      newDevice.push(device2072Arr);
      newDevice.push(device2073Arr);
      newDevice.push(device2074Arr);
      newDevice.push(device2075Arr);
      newDevice.push(device2076Arr);
      newDevice.push(device2077Arr);
      newDevice.push(device2082Arr);
      newDevice.push(device2083Arr);
      newDevice.push(device2084Arr);
      newDevice.push(device2085Arr);
      newDevice.push(device2086Arr);
      newDevice.push(device2087Arr);
      newDevice.push(device2088Arr);
      newDevice.push(device2100Arr);

      //스캐너 정보저장
      const ScannerStatus = (scannerInfo) => ` 
          [장비정보]
          MAC : ${scannerInfo["mac"]} 
          INTMAC : ${scannerInfo["intmac"]} 
          설치장소 : ${scannerInfo["ins_loc"]} 
          장비타입 : ${scannerInfo["type"]}
          `;

      // 값 초기화

      for (let i = 0; i < newDevice.length; i++) {
        newDevice[i][newDevice[i].length - 1].good = 0;
        newDevice[i][newDevice[i].length - 1].error = 0;
      }

      for (var i = 0; i < resultData.length; i++) {
        let mac = resultData[i].MAC;
        let status = resultData[i].ALIVE;

        for (var j = 0; j < newDevice.length; j++) {
          for (var a = 0; a < newDevice[j].length; a++) {
            let macJ = newDevice[j][a].mac;
            let device = newDevice[j];

            if (String(mac) === String(macJ)) {
              newDevice[j][a].status = status;

              if (status === 1) {
                device[device.length - 1].good =
                  device[device.length - 1].good + 1;
              } else {
                device[device.length - 1].error =
                  device[device.length - 1].error + 1;
              }
            }
          }
        }
      }

      //경주

      setDevice2070Arr(newDevice[0]);
      setDevice2071Arr(newDevice[1]);
      setDevice2072Arr(newDevice[2]);
      setDevice2073Arr(newDevice[3]);
      setDevice2074Arr(newDevice[4]);
      setDevice2075Arr(newDevice[5]);
      setDevice2076Arr(newDevice[6]);
      setDevice2077Arr(newDevice[7]);
      setDevice2082Arr(newDevice[8]);
      setDevice2083Arr(newDevice[9]);
      setDevice2084Arr(newDevice[10]);
      setDevice2085Arr(newDevice[11]);
      setDevice2086Arr(newDevice[12]);
      setDevice2087Arr(newDevice[13]);
      setDevice2088Arr(newDevice[14]);
      setDevice2100Arr(newDevice[15]);
      
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setSettings({
      dots: true,
      infinite: true,
      speed: 700,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      arrows: false,
      waitForAnimate: false,
      autoplaySpeed: 4000, // 4000
    });
    getAPIdata1();
    getAPIdata2();
    getAPIdata3();
    getDeviceStatus();
    setInterval(getAPIdata1, 900000);
    setInterval(getAPIdata2, 900000);
    setInterval(getAPIdata3, 900000);
    setInterval(getDeviceStatus, 1800000);
  }, []);

  const onClickAllZoneDevice = () => {
    setAllDeviceStatus(!allDeviceStatus);
  };

  const Box = ({ name, zoneInfos, zoneScannerInfos, back, colorss }) => {
    const [deviceStatus, setDeviceStatus] = useState(false);

    const makeNumber = (param) => {
      return param.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    const onClickZoneDevice = () => {
      setDeviceStatus(!deviceStatus);
    };

    return (
      <div className={"fpa_box " + back}>
        <div className="fpa_box_table">
          <div className="tr">
            <div className="td onclickdevice">
              <span className="fpa_title first" onClick={onClickZoneDevice}>
                <div className="icon">
                  <Image src={colorss} />
                </div>
                {name}{" "}
              </span>
            </div>
            <div className="td">
              <span className="fpa_title">
                {zoneInfos ? makeNumber(Number(zoneInfos[0])) + "명" : "-"}
              </span>
            </div>
            <div className="td">
              <span className="fpa_title">
                {zoneInfos ? makeNumber(Number(zoneInfos[1])) + "명" : "-"}
              </span>
            </div>
            <div className="td">
              <span className="fpa_title">
                {zoneInfos ? makeNumber(Number(zoneInfos[2])) + "분" : "-"}
              </span>
            </div>
          </div>
          {deviceStatus || allDeviceStatus ? (
            <div className="trDevice">
              <div className="td">
                <span className="fpa_title">
                  정상 : {zoneScannerInfos[zoneScannerInfos.length - 1].good}대
                </span>
              </div>
              <div className="td">
                <span className="fpa_title">
                  고장 : {zoneScannerInfos[zoneScannerInfos.length - 1].error}대
                </span>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  };

  return (
    <Block>
      <div className="column">
        <button className="tr onclickalldevice" onClick={onClickAllZoneDevice}>
          개소명
        </button>
        <div className="tr">금일방문</div>
        <div className="tr">재방문</div>
        <div className="tr">체류시간</div>
      </div>
      <div className={me && me.theme === "dark" ? "darkback" : "lightback"}>
        <StatusBlock className={me && me.theme === "dark" ? "dark" : "light"}>
          <div className="compare_list">
            <Slider ref={slideEl} {...settings}>
              {zone == "불국사 권역" ? (
                <div>
                  <div className="division">
                    <Box name={"불국사"}   zoneInfos={[zoneInfo1_1, zoneInfo2_1, zoneInfo3_1]} zoneScannerInfos={device2082Arr} back={"back_1"} colorss={red_icon} />
                  </div>
                  <div className="division">
                    <Box name={"석굴암"} zoneInfos={[zoneInfo1_2, zoneInfo2_2, zoneInfo3_2]} zoneScannerInfos={device2083Arr} back={"back_2"} colorss={orange_icon} />
                  </div>
                </div>
              ) : zone == "황리단길 권역" ? (
                <div>
                  <div className="division">
                    <Box name={"황리단길 중심1"} zoneInfos={[zoneInfo11, zoneInfo21, zoneInfo31]} zoneScannerInfos={device2070Arr} back={"back_1"} colorss={red_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 중심2"} zoneInfos={[zoneInfo12, zoneInfo22, zoneInfo32]} zoneScannerInfos={device2071Arr} back={"back_2"} colorss={orange_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 중심3"} zoneInfos={[zoneInfo13, zoneInfo23, zoneInfo33]} zoneScannerInfos={device2072Arr} back={"back_3"} colorss={yellow_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 북동"} zoneInfos={[zoneInfo14, zoneInfo24, zoneInfo34]} zoneScannerInfos={device2073Arr} back={"back_4"} colorss={green_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 동남"} zoneInfos={[zoneInfo15, zoneInfo25, zoneInfo35]} zoneScannerInfos={device2074Arr} back={"back_5"} colorss={blue_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 동"} zoneInfos={[zoneInfo16, zoneInfo26, zoneInfo36]} zoneScannerInfos={device2075Arr} back={"back_6"} colorss={purple_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 서"} zoneInfos={[zoneInfo17, zoneInfo27, zoneInfo37]} zoneScannerInfos={device2076Arr} back={"back_7"} colorss={brown_icon} />
                  </div>
                  <div className="division">
                    <Box name={"황리단길 서남"} zoneInfos={[zoneInfo18, zoneInfo28, zoneInfo38]} zoneScannerInfos={device2077Arr} back={"back_8"} colorss={blue_icon} />
                  </div>
                </div>
              ) : zone == "동부사적지 권역" ?(
                <div>
                  <div className="division">
                    <Box name={"봉황대고분"} zoneInfos={[zoneInfo1_3, zoneInfo2_3, zoneInfo3_3]} zoneScannerInfos={device2084Arr} back={"back_1"} colorss={yellow_icon} />
                  </div>
                  <div className="division">
                    <Box name={"동궁과월지"} zoneInfos={[zoneInfo1_4, zoneInfo2_4, zoneInfo3_4]} zoneScannerInfos={device2085Arr} back={"back_2"} colorss={green_icon} />
                  </div>
                  <div className="division">
                    <Box name={"첨성대"} zoneInfos={[zoneInfo1_5, zoneInfo2_5, zoneInfo3_5]} zoneScannerInfos={device2086Arr} back={"back_3"} colorss={blue_icon} />
                  </div>
                  <div className="division">
                    <Box name={"교촌마을"} zoneInfos={[zoneInfo1_6, zoneInfo2_6, zoneInfo3_6]} zoneScannerInfos={device2087Arr} back={"back_4"} colorss={purple_icon} />
                  </div>
                  <div className="division">
                    <Box name={"경주터미널"} zoneInfos={[zoneInfo1_7, zoneInfo2_7, zoneInfo3_7]} zoneScannerInfos={device2088Arr} back={"back_5"} colorss={brown_icon} />
                  </div>
                </div>
              ): zone == "경주 대릉원" ?(
                <div>
                  <div className="division">
                    <Box name={"대릉원"} zoneInfos={[zoneInfoHistory1, zoneInfoHistory2, zoneInfoHistory3]} zoneScannerInfos={device2100Arr} back={"back_1"} colorss={yellow_icon} />
                  </div>
                </div>
              ): zone == "동궁과월지존" ?(
                <div>
                  <div className="division">
                    <Box name={"동궁과월지"} zoneInfos={[zoneInfo1_4, 570, 24]} zoneScannerInfos={device2100Arr} back={"back_1"} colorss={green_icon} />
                  </div>
                </div>
              ):zone == "사적관리존" ?(
                <div>
                  <div className="division">
                    <Box name={"첨성대"} zoneInfos={[zoneInfo1_5, zoneInfo2_5, zoneInfo3_5]} zoneScannerInfos={device2100Arr} back={"back_1"} colorss={blue_icon} />
                  </div>
                  <div className="division">
                    <Box name={"국립경주박물관"} zoneInfos={[zoneInfo1_6, zoneInfo2_6, zoneInfo3_6]} zoneScannerInfos={device2100Arr} back={"back_2"} colorss={orange_icon} />
                  </div>
                  <div className="division">
                    <Box name={"연꽃단지"} zoneInfos={[zoneInfo1_3, zoneInfo2_3, zoneInfo3_3]} zoneScannerInfos={device2100Arr} back={"back_3"} colorss={red_icon} />
                  </div>
                </div>
              ):''}
            </Slider>
          </div>
        </StatusBlock>
      </div>
    </Block>
  );
}

export default DashSoleInfo;
