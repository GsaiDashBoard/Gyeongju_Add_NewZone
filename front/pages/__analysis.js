import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import Image from "next/image";

import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import Status from "../components/info/Status";
import { LOAD_MY_INFO_REQUEST } from "../reducers/auth";
import wrapper from "../store/configureStore";
import Chart from "../components/charts/analysisChart";
import todayicon from "../public/images/top_analysis_icon2.png";
import stackicon from "../public/images/top_analysis_icon3.png";
import currenticon from "../public/images/top_analysis_icon4.png";
import reicon from "../public/images/top_analysis_icon5.png";

const Background = styled.div`
  background-color: #f6f9fe;

  .total_graph_view {
    width: 49.4%;
    margin: 5px 5px 5px 5px;
    border-radius: 5px;
    box-shadow: 0px 0px 5px #cccccc;
  }
  .pos_left {
    float: left;
    margin: 5px 0 0 7px;
  }
  .pos_right {
    float: right;
    margin: 5px 5px 0 0;
  }

  .pos_right2 {
    float: left;
    margin: 5px 5px 0 1%;
  }
  .total_graph_box_title {
    display: flex;
    width: 100%;
    height: 40px;
    background-color: #fff;
    font-weight: 900;
    font-size: 15pt;
    border-radius: 5px 5px 0 0;
    border-bottom: solid 1px #e4e4e4;
    text-align: left;
    color: #6e6e6e;
    align-items: center;
  }
  .img {
    margin-top: 100px;
  }

  .fpa_graph_box_title .title {
    font-size: 18px;
    font-weight: 600;
    position: absolute;
    margin-top: 7px;
  }

  .total_graph {
    background-color: #fff;
    border-radius: 0 0 5px 5px;
    padding: 10px 5px 0 0;
    height: 280px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .chartForm {
    display: grid;
    grid-template-columns: 1fr 10fr;
  }

  .chartZone {
    text-align: center;
  }

  .chartZoneButton {
    border-radius: 5px;
    border: 0;

    display: inline-block;
    color: white;
    font-weight: bolder;
    font-size: 13pt;
    padding: 5px;
    width: 140px;
    margin: 4.5px;
    text-align: center;
  }

  .zoneBt1 {
    background: rgba(243, 51, 145, 0.6);
  }
  .zoneBt2 {
    background: rgba(150, 103, 211, 0.6);
  }
  .zoneBt3 {
    background: rgba(108, 128, 209, 0.7);
  }
  .zoneBt4 {
    background: rgba(17, 159, 102, 0.7);
  }
  .zoneBt5 {
    //background: rgba(0, 201, 249, 0.6);
    background: rgba(213, 118, 13, 0.7);
  }
  .chart {
    width: 98%;
    height: 100%;
    margin-left: 1%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .darkback {
    background-color: #1b2137;
    height: 940px;
    color: white;

    .total_graph_box_title {
      background-color: #3c496e;
      border-radius: 5px 5px 0 0;
      border-bottom: solid 0px #e4e4e4;
      color: white;
    }

    .total_graph {
      background-color: #354060;
    }

    .total_graph_view {
      box-shadow: 0px 0px 0px;
    }
  }
`;

const Home = () => {
  const dispatch = useDispatch();
  const { me, yearFirst, today } = useSelector((state) => state.auth);

  //권역
  const [todayVisitorGraphALL, setTodayVisitorGraphALL] = useState([0, 0, 0, 0]);
  const [stackVisitorGraphALL, setStackVisitorGraphALL] = useState([0, 0, 0, 0]);
  const [advVisitTimeGraphALL, setAdvVisitTimeGraphALL] = useState([0, 0, 0, 0]);
  const [reVisitGraphALL, setReVisitGraphALL] = useState([0, 0, 0, 0]);
  //황리단길
  const [todayVisitorGraphHD, setTodayVisitorGraphHD] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [stackVisitorGraphHD, setStackVisitorGraphHD] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [advVisitTimeGraphHD, setAdvVisitTimeGraphHD] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [reVisitGraphHD, setReVisitGraphHD] = useState([
    0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  //동부사적지
  const [todayVisitorGraphDB, setTodayVisitorGraphDB] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [stackVisitorGraphDB, setStackVisitorGraphDB] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [advVisitTimeGraphDB, setAdvVisitTimeGraphDB] = useState([
    0, 0, 0, 0, 0,
  ]);
  const [reVisitGraphDB, setReVisitGraphDB] = useState([0, 0, 0, 0, 0]);
  //불국사
  const [todayVisitorGraphBG, setTodayVisitorGraphBG] = useState([0, 0]);
  const [stackVisitorGraphBG, setStackVisitorGraphBG] = useState([0, 0]);
  const [advVisitTimeGraphBG, setAdvVisitTimeGraphBG] = useState([0, 0]);
  const [reVisitGraphBG, setReVisitGraphBG] = useState([0, 0]);
  
  //대릉원
  const [todayVisitorGraphDR, setTodayVisitorGraphDR] = useState([0]);
  const [stackVisitorGraphDR, setStackVisitorGraphDR] = useState([0]);
  const [advVisitTimeGraphDR, setAdvVisitTimeGraphDR] = useState([0]);
  const [reVisitGraphDR, setReVisitGraphDR] = useState([0]);


  //차트관련
  const labels = [
    "불국사",
    "석굴암",
    "봉황대고분",
    "동궁과월지",
    "첨성대",
    "교촌마을",
    "터미널",
    "황리단길",
  ];
  const labelHD = [
    "중심거리1",
    "중심거리2",
    "중심거리3",
    "북동거리",
    "동남거리",
    "동방거리",
    "서방거리",
    "서남거리",
  ];
  const labelDB = [
    "봉황대고분",
    "동궁과월지",
    "첨성대",
    "교촌마을",
    "경주 터미널",
  ];
  const labelBG = ["불국사", "석굴암"];
  const labelDR = ["경주 대릉원"];
  const labelALL = ["황리단길 권역", "동부사적지 권역", "불국사 권역", "대릉원 권역"];
  const zones = [
    "불국사존",
    "석굴암존",
    "봉황대고분존",
    "동궁과월지존",
    "첨성대존",
    "교촌마을존",
    "경주 터미널 온누리 약국 앞",
    "황리단길 전체",
    "전체",
  ];
  const zoneHD = [
    "황리단길 중심거리 1",
    "황리단길 중심거리 2",
    "황리단길 중심거리 3",
    "황리단길 북동",
    "황리단길 동남",
    "황리단길 동",
    "황리단길 서",
    "황리단길 서남",
  ];
  const zoneDB = [
    "봉황대고분존",
    "동궁과월지존",
    "첨성대존",
    "교촌마을존",
    "경주 터미널 온누리 약국 앞",
  ];
  const zoneBG = ["불국사존", "석굴암존"];
  const zoneDR = ["경주 대릉원"];
  const zoneALL = ["황리단길 권역", "동부사적지 권역", "불국사 권역"];

  const [label, setLabel] = useState(labelHD); //x축
  const [todayVisitorGraph, setTodayVisitorGraph] = useState(todayVisitorGraphHD);
  const [stackVisitorGraph, setStackVisitorGraph] = useState(stackVisitorGraphHD);
  const [advVisitTimeGraph, setAdvVisitTimeGraph] = useState(advVisitTimeGraphHD);
  const [reVisitGraph, setReVisitGraph] = useState(reVisitGraphHD);

  const getAPIdata = async () => {
    // 데이터 받아오기
    /**
     * 오늘자 방문객 그래프
     */
    try {
      const responseToday = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly?unit=10m`
      );
      let arrHD = [0, 0, 0, 0, 0, 0, 0, 0];
      let arrDB = [0, 0, 0, 0, 0];
      let arrBG = [0, 0];
      let arrAll = [0, 0, 0, 0];
      let arrDR = 0;

      for (let i of responseToday.data) {
        if (i.zone_id === zoneHD[0]) {
          arrHD[0] = i.data;
        } else if (i.zone_id === zoneHD[1]) {
          //황리
          arrHD[1] = i.data;
        } else if (i.zone_id === zoneHD[2]) {
          arrHD[2] = i.data;
        } else if (i.zone_id === zoneHD[3]) {
          arrHD[3] = i.data;
        } else if (i.zone_id === zoneHD[4]) {
          arrHD[4] = i.data;
        } else if (i.zone_id === zoneHD[5]) {
          arrHD[5] = i.data;
        } else if (i.zone_id === zoneHD[6]) {
          arrHD[6] = i.data;
        } else if (i.zone_id === zoneHD[7]) {
          arrHD[7] = i.data;
        } else if (i.zone_id === zoneDB[0]) {
          //동부
          arrDB[0] = i.data;
        } else if (i.zone_id === zoneDB[1]) {
          arrDB[1] = i.data;
        } else if (i.zone_id === zoneDB[2]) {
          arrDB[2] = i.data;
        } else if (i.zone_id === zoneDB[3]) {
          arrDB[3] = i.data;
        } else if (i.zone_id === zoneDB[4]) {
          arrDB[4] = i.data;
        } else if (i.zone_id === zoneBG[0]) {
          //불국사
          arrBG[0] = i.data;
        } else if (i.zone_id === zoneBG[1]) {
          arrBG[1] = i.data;
        } else if (i.zone_id === zoneALL[0]) {
          //권역
          arrAll[0] = i.data;
        } else if (i.zone_id === zoneALL[1]) {
          arrAll[1] = i.data;
        } else if (i.zone_id === zoneALL[2]) {
          arrAll[2] = i.data;
        } else if (i.zone_id === zoneDR[0]) {
          arrDR = i.data;
        }
      }

      setTodayVisitorGraphALL([arrAll[0], arrAll[1], arrAll[2], arrDR]);
      setTodayVisitorGraphHD([arrHD[0], arrHD[1], arrHD[2], arrHD[3], arrHD[4], arrHD[5], arrHD[6], arrHD[7]]);
      setTodayVisitorGraphDB([
        arrDB[0],
        arrDB[1],
        arrDB[2],
        arrDB[3],
        arrDB[4]
      ]);
      setTodayVisitorGraphBG([arrBG[0], arrBG[1]]);
      setTodayVisitorGraph([arrHD[0],
        arrHD[1],
        arrHD[2],
        arrHD[3],
        arrHD[4],
        arrHD[5],
        arrHD[6],
        arrHD[7]]);
      setTodayVisitorGraphDR([arrDR]);
      console.log('1',arrDR);
    } catch (err) {
      console.error(err);
    }

    /**
     * 이달의 누적 방문객 그래프
     */
    try {
      const responseYesterdayStack = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=${yearFirst}&to=${today}`
      );
      //const responseYesterdayStack = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountDay?from=${yearFirst}&to=${today}`);

      let arrHD = [0, 0, 0, 0, 0, 0, 0, 0];
      let arrDB = [0, 0, 0, 0, 0];
      let arrBG = [0, 0];
      let arrAll = [0, 0, 0, 0];
      let arrDR = 0;

      for (let i of responseYesterdayStack.data) {
        if (i.zone === zoneHD[0]) {
          //황리
          arrHD[0] = arrHD[0] + Number(i.data);
        } else if (i.zone === zoneHD[1]) {
          arrHD[1] = arrHD[1] + Number(i.data);
        } else if (i.zone === zoneHD[2]) {
          arrHD[2] = arrHD[2] + Number(i.data);
        } else if (i.zone === zoneHD[3]) {
          arrHD[3] = arrHD[3] + Number(i.data);
        } else if (i.zone === zoneHD[4]) {
          arrHD[4] = arrHD[4] + Number(i.data);
        } else if (i.zone === zoneHD[5]) {
          arrHD[5] = arrHD[5] + Number(i.data);
        } else if (i.zone === zoneHD[6]) {
          arrHD[6] = arrHD[6] + Number(i.data);
        } else if (i.zone === zoneHD[7]) {
          arrHD[7] = arrHD[7] + Number(i.data);
        } else if (i.zone === zoneDB[0]) {
          //동부
          arrDB[0] = arrDB[0] + Number(i.data);
        } else if (i.zone === zoneDB[1]) {
          arrDB[1] = arrDB[1] + Number(i.data);
        } else if (i.zone === zoneDB[2]) {
          arrDB[2] = arrDB[2] + Number(i.data);
        } else if (i.zone === zoneDB[3]) {
          arrDB[3] = arrDB[3] + Number(i.data);
        } else if (i.zone === zoneDB[4]) {
          arrDB[4] = arrDB[4] + Number(i.data);
        } else if (i.zone === zoneBG[0]) {
          //불국사
          arrBG[0] = arrBG[0] + Number(i.data);
        } else if (i.zone === zoneBG[1]) {
          arrBG[1] = arrBG[1] + Number(i.data);
        } else if (i.zone === zoneALL[0]) {
          //권역
          arrAll[0] = arrAll[0] + Number(i.data);
        } else if (i.zone === zoneALL[1]) {
          arrAll[1] = arrAll[1] + Number(i.data);
        } else if (i.zone === zoneALL[2]) {
          arrAll[2] = arrAll[2] + Number(i.data);
        } else if (i.zone == zoneDR[0]) {
          arrDR = arrDR + Number(i.data);
          console.log(i.data,'i');
        }
      }

      setStackVisitorGraphALL([arrAll[0], arrAll[1], arrAll[2], arrDR]);
      setStackVisitorGraphHD([
        arrHD[0],
        arrHD[1],
        arrHD[2],
        arrHD[3],
        arrHD[4],
        arrHD[5],
        arrHD[6],
        arrHD[7]
      ]);
      setStackVisitorGraphDB([
        arrDB[0],
        arrDB[1],
        arrDB[2],
        arrDB[3],
        arrDB[4]
      ]);
      setStackVisitorGraphBG([arrBG[0], arrBG[1]]);
      setStackVisitorGraph([
        arrHD[0],
        arrHD[1],
        arrHD[2],
        arrHD[3],
        arrHD[4],
        arrHD[5],
        arrHD[6],
        arrHD[7]]);
      setStackVisitorGraphDR([arrDR]);  
      console.log('2',arrDR);
      
    } catch (err) {
      console.error(err);
    }

    /**
     * 체류시간 그래프
     */
    try {
      const responseTime = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceResidenceTime`
      );
      //const responseTime = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly`);

      let arrHD = [0, 0, 0, 0, 0, 0, 0, 0];
      let arrDB = [0, 0, 0, 0, 0];
      let arrBG = [0, 0];
      let arrAll = [0, 0, 0];
      let arrDR = 0;

      for (let i of responseTime.data) {
        if (i.zone === zoneHD[0]) {
          arrHD[0] = Number(i.data);
        } else if (i.zone === zoneHD[1]) {
          //황리
          arrHD[1] = i.data;
        } else if (i.zone === zoneHD[2]) {
          arrHD[2] = i.data;
        } else if (i.zone === zoneHD[3]) {
          arrHD[3] = i.data;
        } else if (i.zone === zoneHD[4]) {
          arrHD[4] = i.data;
        } else if (i.zone === zoneHD[5]) {
          arrHD[5] = i.data;
        } else if (i.zone === zoneHD[6]) {
          arrHD[6] = i.data;
        } else if (i.zone === zoneHD[7]) {
          arrHD[7] = i.data;
        } else if (i.zone === zoneDB[0]) {
          //동부
          arrDB[0] = i.data;
        } else if (i.zone === zoneDB[1]) {
          arrDB[1] = i.data;
        } else if (i.zone === zoneDB[2]) {
          arrDB[2] = i.data;
        } else if (i.zone === zoneDB[3]) {
          arrDB[3] = i.data;
        } else if (i.zone === zoneDB[4]) {
          arrDB[4] = i.data;
        } else if (i.zone === zoneBG[0]) {
          //불국사
          arrBG[0] = i.data;
        } else if (i.zone === zoneBG[1]) {
          arrBG[1] = i.data;
        } else if (i.zone === zoneALL[0]) {
          //권역
          arrAll[0] = i.data;
        } else if (i.zone === zoneALL[1]) {
          arrAll[1] = i.data;
        } else if (i.zone === zoneALL[2]) {
          arrAll[2] = i.data;
        }  else if (i.zone === zoneDR[0]) {
          arrDR = i.data;
        }
      }

      let chartDatasHD = [
        Math.round(arrHD[0] / 60),
        Math.round(arrHD[1] / 60),
        Math.round(arrHD[2] / 60),
        Math.round(arrHD[3] / 60),
        Math.round(arrHD[4] / 60),
        Math.round(arrHD[5] / 60),
        Math.round(arrHD[6] / 60),
        Math.round(arrHD[7] / 60),
      ];
      let chartDatasDB = [
        Math.round(arrDB[0] / 60),
        Math.round(arrDB[1] / 60),
        Math.round(arrDB[2] / 60),
        Math.round(arrDB[3] / 60),
        Math.round(arrDB[4] / 60),
      ];
      let chartDatasBG = [Math.round(arrBG[0] / 60), Math.round(arrBG[1] / 60)];
      let chartDatas = [
        Math.round(arrAll[0] / 60),
        Math.round(arrAll[1] / 60),
        Math.round(arrAll[2] / 60),
        Math.round(arrDR / 60),
      ];
      
      let chartDatasDR = [Math.round(arrDR / 60)];

      setAdvVisitTimeGraphALL(chartDatas);
      setAdvVisitTimeGraphHD(chartDatasHD);
      setAdvVisitTimeGraphDB(chartDatasDB);
      setAdvVisitTimeGraphBG(chartDatasBG);
      setAdvVisitTimeGraph(chartDatasHD);
      setAdvVisitTimeGraphDR(chartDatasDR);
      
      console.log('3',chartDatasDR);
    } catch (err) {
      console.error(err);
    }

    /**
     * 재방문 그래프
     */
    try {
      const responseRevisit = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountRevisit`
      );
      //const responseRevisit = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountRevisit`);

      let arrHD = [0, 0, 0, 0, 0, 0, 0, 0];
      let arrDB = [0, 0, 0, 0, 0];
      let arrBG = [0, 0];
      let arrAll = [0, 0, 0];
      let arrDR = 0;

      for (let i of responseRevisit.data) {
        if (i.zone == zoneHD[0]) {
          arrHD[0] = i.data;
        } else if (i.zone == zoneHD[1]) {
          //황리
          arrHD[1] = i.data;
        } else if (i.zone == zoneHD[2]) {
          arrHD[2] = i.data;
        } else if (i.zone == zoneHD[3]) {
          arrHD[3] = i.data;
        } else if (i.zone == zoneHD[4]) {
          arrHD[4] = i.data;
        } else if (i.zone == zoneHD[5]) {
          arrHD[5] = i.data;
        } else if (i.zone == zoneHD[6]) {
          arrHD[6] = i.data;
        } else if (i.zone == zoneHD[7]) {
          arrHD[7] = i.data;
        } else if (i.zone == zoneDB[0]) {
          //동부
          arrDB[0] = i.data;
        } else if (i.zone == zoneDB[1]) {
          arrDB[1] = i.data;
        } else if (i.zone == zoneDB[2]) {
          arrDB[2] = i.data;
        } else if (i.zone == zoneDB[3]) {
          arrDB[3] = i.data;
        } else if (i.zone == zoneDB[4]) {
          arrDB[4] = i.data;
        } else if (i.zone == zoneBG[0]) {
          //불국사
          arrBG[0] = i.data;
        } else if (i.zone == zoneBG[1]) {
          arrBG[1] = i.data;
        } else if (i.zone == zoneALL[0]) {
          //권역
          arrAll[0] = i.data;
        } else if (i.zone == zoneALL[1]) {
          arrAll[1] = i.data;
        } else if (i.zone == zoneALL[2]) {
          arrAll[2] = i.data;
        }
         //대릉원
        else if (i.zone == "경주 대릉원"){
          arrDR = i.data;
        }
      }

      setReVisitGraphALL([arrAll[0], arrAll[1], arrAll[2], arrDR]);
      setReVisitGraphHD([arrHD[0], arrHD[1], arrHD[2], arrHD[3], arrHD[4], arrHD[5], arrHD[6], arrHD[7]]);
      setReVisitGraphDB([arrDB[0], arrDB[1], arrDB[2], arrDB[3], arrDB[4]]);
      setReVisitGraphBG([arrBG[0], arrBG[1]]);
      setReVisitGraph([arrHD[0], arrHD[1], arrHD[2], arrHD[3], arrHD[4], arrHD[5], arrHD[6], arrHD[7]]);
      setReVisitGraphDR([arrDR]);
      
      console.log('4',arrDR);
      
      console.log("chartDatas");
    } catch (err) {
      console.error(err);
        setTimeout(() => {
          getAPIdata();
        }, 2000);
    }
    
    
    
    
  };

  useEffect(() => {
    getAPIdata();
    // 30분마다 새로 고침 하여 데이터를 신규로 받아옴.
    // 30분 = 1800초 * 100 하여 밀리세컨단위로 변환 1800000
    setInterval(getAPIdata, 900000);
  }, []);

  useEffect(() => {
    if (!(me && me.id)) {
      Router.replace("/login");
    }
  }, [me && me.id]);

  const onClickHD = () => {
    setLabel(labelHD);
    setTodayVisitorGraph(todayVisitorGraphHD);
    setStackVisitorGraph(stackVisitorGraphHD);
    setAdvVisitTimeGraph(advVisitTimeGraphHD);
    setReVisitGraph(reVisitGraphHD);
  };

  const onClickDB = () => {
    setLabel(labelDB);
    setTodayVisitorGraph(todayVisitorGraphDB);
    setStackVisitorGraph(stackVisitorGraphDB);
    setAdvVisitTimeGraph(advVisitTimeGraphDB);
    setReVisitGraph(reVisitGraphDB);
  };

  const onClickBG = () => {
    setLabel(labelBG);
    setTodayVisitorGraph(todayVisitorGraphBG);
    setStackVisitorGraph(stackVisitorGraphBG);
    setAdvVisitTimeGraph(advVisitTimeGraphBG);
    setReVisitGraph(reVisitGraphBG);
  };

  const onClickALL = () => {
    setLabel(labelALL);
    setTodayVisitorGraph(todayVisitorGraphALL);
    setStackVisitorGraph(stackVisitorGraphALL);
    setAdvVisitTimeGraph(advVisitTimeGraphALL);
    setReVisitGraph(reVisitGraphALL);
  };
  
  const onClickDR = () => {
    setLabel(labelDR);
    setTodayVisitorGraph(todayVisitorGraphDR);
    setStackVisitorGraph(stackVisitorGraphDR);
    setAdvVisitTimeGraph(advVisitTimeGraphDR);
    setReVisitGraph(reVisitGraphDR);
    
    console.log(labelDR, todayVisitorGraphDR, stackVisitorGraphDR, advVisitTimeGraphDR, reVisitGraphDR)
  };

  return (
    <Background>
      <div className="lightback">
        <Header />
        <Nav value={"2"} />
        <Status theme="light" />
        {/* <Chart /> */}
        <div className="chartForm">
          <div className="chartZone">
            <button className="chartZoneButton zoneBt1" onClick={onClickHD}>
              황리단길권역
            </button>
            <button className="chartZoneButton zoneBt2" onClick={onClickDB}>
              동부사적지권역
            </button>
            <button className="chartZoneButton zoneBt3" onClick={onClickBG}>
              불국사권역
            </button>
            <button className="chartZoneButton zoneBt4" onClick={onClickDR}>
              대릉원권역
            </button>
            <button className="chartZoneButton zoneBt5" onClick={onClickALL}>
              권역별
            </button>
          </div>
          <div>
            {/* <!--오늘자 방문객--> */}
            <div className="total_graph_view pos_left">
              <div className="total_graph_box_title">
                &nbsp;
                <Image className="img" src={todayicon} alt="..." />
                <span className="title">&nbsp;현재 방문객</span>
              </div>
              <div className="total_graph">
                <div id="visit1" className="chart">
                  <Chart
                    labels={label}
                    label={"방문객수(명)"}
                    datas={todayVisitorGraph}
                    theme={me && me.theme === "dark" ? "dark" : "light"}
                  />
                </div>
              </div>
            </div>
            {/* <!--누적 방문객--> */}
            <div className="total_graph_view pos_right">
              <div className="total_graph_box_title">
                &nbsp;
                <Image
                  className="img"
                  src={stackicon}
                  margin-top={10}
                  alt="..."
                />
                <span className="title">&nbsp;이달의 방문객</span>
              </div>
              <div className="total_graph">
                <div id="visit2" className="chart">
                  <Chart
                    labels={label}
                    label={"방문객수(명)"}
                    datas={stackVisitorGraph}
                    theme={me && me.theme === "dark" ? "dark" : "light"}
                  />
                </div>
              </div>
            </div>
            {/* <!--체류시간&체류인원--> */}
            <div className="total_graph_view pos_left">
              <div className="total_graph_box_title">
                &nbsp;
                <Image
                  className="img"
                  src={currenticon}
                  margin-top={10}
                  alt="..."
                />
                <span className="title">&nbsp;체류시간</span>
              </div>
              <div className="total_graph">
                <div id="visit3" className="chart">
                  <Chart
                    labels={label}
                    label={"체류시간(분)"}
                    datas={advVisitTimeGraph}
                    theme={me && me.theme === "dark" ? "dark" : "light"}
                  />
                </div>
              </div>
            </div>
            {/* <!--재방문객&재방문률--> */}
            <div className="total_graph_view pos_right">
              <div className="total_graph_box_title">
                &nbsp;
                <Image className="img" src={reicon} margin-top={10} alt="..." />
                <span className="title">&nbsp;전일 재방문객</span>
              </div>
              <div className="total_graph">
                <div id="visit4" className="chart">
                  <Chart
                    labels={label}
                    label={"방문객수(명)"}
                    datas={reVisitGraph}
                    theme={me && me.theme === "dark" ? "dark" : "light"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const cookie = req ? req.headers.cookie : "";
      //쿠키 공유되는 문제 해결
      axios.defaults.headers.Cookie = "";
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      store.dispatch({
        type: LOAD_MY_INFO_REQUEST,
      });
      store.dispatch(END);
      await store.sagaTask.toPromise();
    }
);

export default Home;