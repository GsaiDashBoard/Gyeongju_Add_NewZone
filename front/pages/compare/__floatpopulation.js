import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import { CSVLink, CSVDownload } from "react-csv";
import Head from "next/head";

import Header from "../../components/common/Header";
import Nav from "../../components/common/Nav";
import StackStatistics from "../../components/info/StackStatistics";
import FloatPopulationInfo from "../../components/info/FloatPopulationInfo";
import NavBottom from "../../components/common/NavBottom";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/auth";
import { LOAD_ARDATA_REQUEST } from "../../reducers/ardata";
import wrapper from "../../store/configureStore";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Background = styled.div`
  background-color: #f6f9fe;

  .Sel_date {
    width: 40%;
    background-color: white;
    box-shadow: 0px 0px 5px #cccccc;
    margin: 5px auto 5px auto;
    padding: 5px 0 5px 0;
    border-radius: 5px;
    text-align: center;
    color: black;
  }
  .stackinfo {
    box-shadow: 0px 0px 5px #cccccc;
  }
  .button {
    text-transform: uppercase;
    border: 0;
    text-align: center;
    color: white;
    font-size: 13px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
    padding: 3px 15px 3px 15px;
    margin: 2px 4px 0px 4px;
    border-radius: 5px;
    background: #7b8df8;

    &:hover {
      background: #d59866;
    }
  }
  .compare_list {
    width: 100%;
    height: 100%;
    float: left;
    margin: 0 0 0 0;
    padding: 5px 10px 0 0;
  }
  .division {
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
    margin: 0 5% 0 5%;
  }
  .csv {
    color: white;
    text-decoration: none;
  }

  .darkback {
    background-color: #1b2137;

    .Sel_date {
      background-color: #3c496e;
      box-shadow: 0px 0px 0px #b1b1b1;
      color: white;
    }
    .csv {
      color: white;
      text-decoration: none;
    }
  }
`;

const Floatpopulation = () => {
  const dispatch = useDispatch();
  const { me, ago7day, today } = useSelector((state) => state.auth);
  const [sttdate, setSttdate] = useState(ago7day);
  const [enddate, setEnddate] = useState(today);
  const { logs } = useSelector((state) => state.ardata);
  const [zoneInfo1_1, setZoneInfo1_1] = useState([0, 0, 0, 0, 0]); // [0]: 방문자수 [1]: 재방문자수 [2]: 체류시간 [3]: 체류인원
  const [zoneInfo1_2, setZoneInfo1_2] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo1_3, setZoneInfo1_3] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo1_4, setZoneInfo1_4] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo1_5, setZoneInfo1_5] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo1_6, setZoneInfo1_6] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo1_7, setZoneInfo1_7] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo1_8, setZoneInfo1_8] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_1, setZoneInfo2_1] = useState([0, 0, 0, 0, 0]); // [0]: 방문자수 [1]: 재방문자수 [2]: 체류시간 [3]: 체류인원
  const [zoneInfo2_2, setZoneInfo2_2] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_3, setZoneInfo2_3] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_4, setZoneInfo2_4] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_5, setZoneInfo2_5] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_6, setZoneInfo2_6] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_7, setZoneInfo2_7] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_8, setZoneInfo2_8] = useState([0, 0, 0, 0, 0]);
  const [zoneInfo2_9, setZoneInfo2_9] = useState([0, 0, 0, 0, 0]);
  const [allInfo, setAllInfo] = useState([0, 0, 0, 0, 0]);
  const [excelData, setExcelData] = useState([]);

  const [settings, setSettings] = useState({});
  const slideEl = useRef(null);

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
    "황리단길 권역",
    "경주 대릉원",
  ];
  const zonesAll = "경주 전체";
  const zoneids = [
    2070,
    2071,
    2072,
    2073,
    2074,
    2075,
    2076,
    2077,
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

  const zones3 = [
    "황리단길 중심거리 전체",
    "황리단길 북동 동남 동",
    "황리단길 서 서남",
    "동부사적지 권역",
    "불국사 권역",
    "경주 전체",
    "경주 대릉원"
  ];

  const zoneids3 = [
    2079,
    2080,
    2081,
    2089,
    2090,
    2091,
    2100
  ];
  //const zones = [1859, 1860, 1861, 1862, 1910, 1911, 1912, 1913];

  const arrY1_1 = [0, 0, 0, 0]; //"중심거리1",
  const arrY1_2 = [0, 0, 0, 0]; //"중심거리2",
  const arrY1_3 = [0, 0, 0, 0]; //"중심거리3",
  const arrY1_4 = [0, 0, 0, 0]; //"북동거리",
  const arrY1_5 = [0, 0, 0, 0]; //"동남거리",
  const arrY1_6 = [0, 0, 0, 0]; //"동방거리",
  const arrY1_7 = [0, 0, 0, 0]; //"서방거리",
  const arrY1_8 = [0, 0, 0, 0]; //"서남거리",
  const arrY2_1 = [0, 0, 0, 0]; //"중심거리1",
  const arrY2_2 = [0, 0, 0, 0]; //"중심거리2",
  const arrY2_3 = [0, 0, 0, 0]; //"중심거리3",
  const arrY2_4 = [0, 0, 0, 0]; //"북동거리",
  const arrY2_5 = [0, 0, 0, 0]; //"동남거리",
  const arrY2_6 = [0, 0, 0, 0]; //"동방거리",
  const arrY2_7 = [0, 0, 0, 0]; //"서방거리",
  const arrY2_8 = [0, 0, 0, 0]; //"서남거리",
  const arrY2_9 = [0, 0, 0, 0]; //"대릉원",
  const arrYAll = [0, 0, 0, 0]; //전체

  const excels = [];
  const floatpepleExecels = JSON.parse(JSON.stringify(logs));

  if (floatpepleExecels) {
    for (let i of floatpepleExecels) {
      if (i.zone_id == zoneids[0]){
        i.zone_id = zones[0]
      } else if (i.zone_id == zoneids[1]){
        i.zone_id = zones[1]
      } else if (i.zone_id == zoneids[2]){
        i.zone_id = zones[2]
      } else if (i.zone_id == zoneids[3]){
        i.zone_id = zones[3]
      } else if (i.zone_id == zoneids[4]){
        i.zone_id = zones[4]
      } else if (i.zone_id == zoneids[5]){
        i.zone_id = zones[5]
      } else if (i.zone_id == zoneids[6]){
        i.zone_id = zones[6]
      } else if (i.zone_id == zoneids[7]){
        i.zone_id = zones[7]
      } else if (i.zone_id == zoneids2[0]){
        i.zone_id = zones[0]
      } else if (i.zone_id == zoneids2[1]){
        i.zone_id = zones2[1]
      } else if (i.zone_id == zoneids2[2]){
        i.zone_id = zones2[2]
      } else if (i.zone_id == zoneids2[3]){
        i.zone_id = zones2[3]
      } else if (i.zone_id == zoneids2[4]){
        i.zone_id = zones2[4]
      } else if (i.zone_id == zoneids2[5]){
        i.zone_id = zones2[5]
      } else if (i.zone_id == zoneids2[6]){
        i.zone_id = zones2[6]
      } else if (i.zone_id == zoneids2[7]){
        i.zone_id = zones2[7]
      } else if (i.zone_id == zoneids3[0]){
        i.zone_id = zones3[0]
      } else if (i.zone_id == zoneids3[1]){
        i.zone_id = zones3[1]
      } else if (i.zone_id == zoneids3[2]){
        i.zone_id = zones3[2]
      }else if (i.zone_id == zoneids3[3]){
        i.zone_id = zones3[3]
      } else if (i.zone_id == zoneids3[4]){
        i.zone_id = zones3[4]
      } else if (i.zone_id == zoneids3[5]){
        i.zone_id = zones3[5]
      } else if (i.zone_id == zoneids3[6]){
        i.zone_id = zones3[6]
      }
    }
  }

  const getAPIdata = async () => {
    /**
     * 방문객 수
     */

    try {
      const responseVisit = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=${sttdate}&to=${enddate}T09:00:00`
      );
      //const responseVisit = await axios.get('http://54.180.158.22:8000/v1/Gasi/DeviceCountDay?from='+sttdate+'&to='+enddate);
      //console.log(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=${sttdate}&to=${enddate}%09:00:00`);

      let arr1_1 = ["중심거리1", 0];
      let arr1_2 = ["중심거리2", 0];
      let arr1_3 = ["중심거리3", 0];
      let arr1_4 = ["북동거리", 0];
      let arr1_5 = ["동남거리", 0];
      let arr1_6 = ["동방거리", 0];
      let arr1_7 = ["서방거리", 0];
      let arr1_8 = ["서남거리", 0];
      let arr2_1 = ["불국사", 0];
      let arr2_2 = ["석굴암", 0];
      let arr2_3 = ["봉황대고분", 0];
      let arr2_4 = ["동궁과월지", 0];
      let arr2_5 = ["첨성대", 0];
      let arr2_6 = ["교촌마을", 0];
      let arr2_7 = ["경주터미널", 0];
      let arr2_8 = ["황리단길전체", 0];
      let arr2_9 = ["대릉원", 0];
      let arrAll = ["전체", 0];

      for (let i of responseVisit.data) {
        if (i.zone === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
        } else if (i.zone === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        } else if (i.zone === zonesAll) {
          arrAll[1] = arrAll[1] + Number(i.data);
        }
        i.gbname = "방문객수";
        excels.push(i);
      }

      arrY1_1[0] = arr1_1[1];
      arrY1_2[0] = arr1_2[1];
      arrY1_3[0] = arr1_3[1];
      arrY1_4[0] = arr1_4[1];
      arrY1_5[0] = arr1_5[1];
      arrY1_6[0] = arr1_6[1];
      arrY1_7[0] = arr1_7[1];
      arrY1_8[0] = arr1_8[1];
      arrY2_1[0] = arr2_1[1];
      arrY2_2[0] = arr2_2[1];
      arrY2_3[0] = arr2_3[1];
      arrY2_4[0] = arr2_4[1];
      arrY2_5[0] = arr2_5[1];
      arrY2_6[0] = arr2_6[1];
      arrY2_7[0] = arr2_7[1];
      arrY2_8[0] = arr2_8[1];
      arrY2_9[0] = arr2_9[1];
      arrYAll[0] = arrAll[1];
    } catch (err) {
      console.error(err);
    }

    /**
     * 재방문객 수
     */

    try {
      const responseRevisit = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountRevisit?from=${sttdate}&to=${enddate}T09:00:00`
      );
      //const responseRevisit = await axios.get('http://54.180.158.22:8000/v1/Gasi/DeviceCountRevisit?from='+sttdate+'&to='+enddate);
      //console.log(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountRevisit?from=${sttdate}&to=${enddate}T09:00:00`);

      let arr1_1 = ["중심거리1", 0];
      let arr1_2 = ["중심거리2", 0];
      let arr1_3 = ["중심거리3", 0];
      let arr1_4 = ["북동거리", 0];
      let arr1_5 = ["동남거리", 0];
      let arr1_6 = ["동방거리", 0];
      let arr1_7 = ["서방거리", 0];
      let arr1_8 = ["서남거리", 0];
      let arr2_1 = ["불국사", 0];
      let arr2_2 = ["석굴암", 0];
      let arr2_3 = ["봉황대고분", 0];
      let arr2_4 = ["동궁과월지", 0];
      let arr2_5 = ["첨성대", 0];
      let arr2_6 = ["교촌마을", 0];
      let arr2_7 = ["경주터미널", 0];
      let arr2_8 = ["황리단길전체", 0];
      let arr2_9 = ["대릉원", 0];
      let arrAll = ["전체", 0];

      for (let i of responseRevisit.data) {
        if (i.zone === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
        } else if (i.zone === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        } else if (i.zone === zonesAll) {
          arrAll[1] = arrAll[1] + Number(i.data);
        }
        i.gbname = "재방문객수";
        excels.push(i);
      }

      arrY1_1[1] = arr1_1[1];
      arrY1_2[1] = arr1_2[1];
      arrY1_3[1] = arr1_3[1];
      arrY1_4[1] = arr1_4[1];
      arrY1_5[1] = arr1_5[1];
      arrY1_6[1] = arr1_6[1];
      arrY1_7[1] = arr1_7[1];
      arrY1_8[1] = arr1_8[1];
      arrY2_1[1] = arr2_1[1];
      arrY2_2[1] = arr2_2[1];
      arrY2_3[1] = arr2_3[1];
      arrY2_4[1] = arr2_4[1];
      arrY2_5[1] = arr2_5[1];
      arrY2_6[1] = arr2_6[1];
      arrY2_7[1] = arr2_7[1];
      arrY2_8[1] = arr2_8[1];
      arrY2_9[1] = arr2_9[1];
      arrYAll[1] = arrAll[1];
    } catch (err) {
      console.error(err);
    }

    /**
     * 체류인원
     */

    try {
      const responseStay = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=${sttdate}&to=${enddate}T09:00:00`
      );
      //const responseStay = await axios.get('http://54.180.158.22:8000/v1/Gasi/DeviceCountDay?from='+sttdate+'&to='+enddate);

      //console.log(responseStay);

      let arr1_1 = ["중심거리1", 0];
      let arr1_2 = ["중심거리2", 0];
      let arr1_3 = ["중심거리3", 0];
      let arr1_4 = ["북동거리", 0];
      let arr1_5 = ["동남거리", 0];
      let arr1_6 = ["동방거리", 0];
      let arr1_7 = ["서방거리", 0];
      let arr1_8 = ["서남거리", 0];
      let arr2_1 = ["불국사", 0];
      let arr2_2 = ["석굴암", 0];
      let arr2_3 = ["봉황대고분", 0];
      let arr2_4 = ["동궁과월지", 0];
      let arr2_5 = ["첨성대", 0];
      let arr2_6 = ["교촌마을", 0];
      let arr2_7 = ["경주터미널", 0];
      let arr2_8 = ["황리단길전체", 0];
      let arr2_9 = ["대릉원", 0];
      let arrAll = ["전체", 0];

      var dateCnt = 1;

      for (let i of responseStay.data) {
        if (i.zone === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
        } else if (i.zone === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        } else if (i.zone === zonesAll) {
          arrAll[1] = arrAll[1] + Number(i.data);
        }
        i.gbname = "체류인원";
        excels.push(i);
      }

      if( dateCnt > 1){
        dateCnt = dateCnt-1;
      }

      arrY1_1[2] = Math.round(Number(arr1_1[1]) / 24 / dateCnt);
      arrY1_2[2] = Math.round(Number(arr1_2[1]) / 24 / dateCnt);
      arrY1_3[2] = Math.round(Number(arr1_3[1]) / 24 / dateCnt);
      arrY1_4[2] = Math.round(Number(arr1_4[1]) / 24 / dateCnt);
      arrY1_5[2] = Math.round(Number(arr1_5[1]) / 24 / dateCnt);
      arrY1_6[2] = Math.round(Number(arr1_6[1]) / 24 / dateCnt);
      arrY1_7[2] = Math.round(Number(arr1_7[1]) / 24 / dateCnt);
      arrY1_8[2] = Math.round(Number(arr1_8[1]) / 24 / dateCnt);
      arrY2_1[2] = Math.round(Number(arr2_1[1]) / 24 / dateCnt);
      arrY2_2[2] = Math.round(Number(arr2_2[1]) / 24 / dateCnt);
      arrY2_3[2] = Math.round(Number(arr2_3[1]) / 24 / dateCnt);
      arrY2_4[2] = Math.round(Number(arr2_4[1]) / 24 / dateCnt);
      arrY2_5[2] = Math.round(Number(arr2_5[1]) / 24 / dateCnt);
      arrY2_6[2] = Math.round(Number(arr2_6[1]) / 24 / dateCnt);
      arrY2_7[2] = Math.round(Number(arr2_7[1]) / 24 / dateCnt);
      arrY2_8[2] = Math.round(Number(arr2_8[1]) / 24 / dateCnt);
      arrY2_9[2] = Math.round(Number(arr2_9[1]) / 24 / dateCnt);
      arrYAll[2] = Math.round(Number(arrAll[1]) / 24 / dateCnt);
      //console.log(Number(arr1[1])/dateCnt, arr1[1]);
    } catch (err) {
      console.error(err);
    }

    /**
     * 체류시간
     */

    try {
      const responseTime = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceResidenceTime?from=${sttdate}&to=${enddate}T09:00:00`
      );
      //const responseTime = await axios.get('http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly?from='+sttdate+'&to='+enddate);

      let arr1_1 = ["중심거리1", 0];
      let arr1_2 = ["중심거리2", 0];
      let arr1_3 = ["중심거리3", 0];
      let arr1_4 = ["북동거리", 0];
      let arr1_5 = ["동남거리", 0];
      let arr1_6 = ["동방거리", 0];
      let arr1_7 = ["서방거리", 0];
      let arr1_8 = ["서남거리", 0];
      let arr2_1 = ["불국사", 0];
      let arr2_2 = ["석굴암", 0];
      let arr2_3 = ["봉황대고분", 0];
      let arr2_4 = ["동궁과월지", 0];
      let arr2_5 = ["첨성대", 0];
      let arr2_6 = ["교촌마을", 0];
      let arr2_7 = ["경주터미널", 0];
      let arr2_8 = ["황리단길전체", 0];
      let arr2_9 = ["대릉원", 0];
      let arrAll = ["전체", 0];

      var dateCnt = 0;

      for (let i of responseTime.data) {
        if (i.zone === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
          dateCnt = dateCnt + 1;
        } else if (i.zone === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        } else if (i.zone === zonesAll) {
          arrAll[1] = arrAll[1] + Number(i.data);
        }
        i.gbname = "체류시간";
        excels.push(i);
      }

      arrY1_1[3] = Math.round(Number(arr1_1[1]) / 60 / dateCnt);
      arrY1_2[3] = Math.round(Number(arr1_2[1]) / 60 / dateCnt);
      arrY1_3[3] = Math.round(Number(arr1_3[1]) / 60 / dateCnt);
      arrY1_4[3] = Math.round(Number(arr1_4[1]) / 60 / dateCnt);
      arrY1_5[3] = Math.round(Number(arr1_5[1]) / 60 / dateCnt);
      arrY1_6[3] = Math.round(Number(arr1_6[1]) / 60 / dateCnt);
      arrY1_7[3] = Math.round(Number(arr1_7[1]) / 60 / dateCnt);
      arrY1_8[3] = Math.round(Number(arr1_8[1]) / 60 / dateCnt);
      arrY2_1[3] = Math.round(Number(arr2_1[1]) / 60 / dateCnt);
      arrY2_2[3] = Math.round(Number(arr2_2[1]) / 60 / dateCnt);
      arrY2_3[3] = Math.round(Number(arr2_3[1]) / 60 / dateCnt);
      arrY2_4[3] = Math.round(Number(arr2_4[1]) / 60 / dateCnt);
      arrY2_5[3] = Math.round(Number(arr2_5[1]) / 60 / dateCnt);
      arrY2_6[3] = Math.round(Number(arr2_6[1]) / 60 / dateCnt);
      arrY2_7[3] = Math.round(Number(arr2_7[1]) / 60 / dateCnt);
      arrY2_8[3] = Math.round(Number(arr2_8[1]) / 60 / dateCnt);
      arrY2_9[3] = Math.round(Number(arr2_9[1]) / 60 / dateCnt);
      arrYAll[3] = Math.round(Number(arrAll[1]) / 60 / dateCnt);
    } catch (err) {
      console.error(err);
    }

    setZoneInfo1_1(arrY1_1);
    setZoneInfo1_2(arrY1_2);
    setZoneInfo1_3(arrY1_3);
    setZoneInfo1_4(arrY1_4);
    setZoneInfo1_5(arrY1_5);
    setZoneInfo1_6(arrY1_6);
    setZoneInfo1_7(arrY1_7);
    setZoneInfo1_8(arrY1_8);
    setZoneInfo2_1(arrY2_1);
    setZoneInfo2_2(arrY2_2);
    setZoneInfo2_3(arrY2_3);
    setZoneInfo2_4(arrY2_4);
    setZoneInfo2_5(arrY2_5);
    setZoneInfo2_6(arrY2_6);
    setZoneInfo2_7(arrY2_7);
    setZoneInfo2_8(arrY2_8);
    setZoneInfo2_9(arrY2_9);
    setAllInfo(arrYAll);

    setExcelData(excels);
  };

  useEffect(() => {
    if (!(me && me.id)) {
      Router.replace("/login");
    }
  }, [me && me.id]);

  useEffect(() => {
    dispatch({
      type: LOAD_ARDATA_REQUEST,
      data: { sttdate, enddate },
    });
  }, []);

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
    getAPIdata();
    setInterval(getAPIdata, 1800000);
  }, []);

  //기간선택후 검색 클릭시
  const searchHandler = () => {
    getAPIdata();
    dispatch({
      type: LOAD_ARDATA_REQUEST,
      data: { sttdate, enddate },
    });
  };

  return (
    <Background>
      <div className={me && me.theme === "dark" ? "darkback" : "lightback"}>
        <Header page={"0"} />
        <Nav value={"3"} bottomValue={"2"} />
        <div className="Sel_date">
          분석기간 선택&nbsp;
          <input
            type="date"
            id="currentDate"
            value={sttdate}
            onChange={(e) => setSttdate(e.target.value)}
          />
          &nbsp;&nbsp;~&nbsp;&nbsp;
          <input
            type="date"
            id="currentDate2"
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
          />
          <button type="button " className="button" onClick={searchHandler}>
            검 색
          </button>
          <button type="button" className="button">
            <CSVLink
              className="csv"
              data={excelData}
              filename={"유동인구데이터-" + sttdate + "-" + enddate}
              onClick={(event) => {
                // console.log("You click the link");
                // return false; // ???? You are stopping the handling of component
              }}
            >
              다운로드
            </CSVLink>
          </button>
          <button type="button" className="button">
            <CSVLink
              className="csv"
              data={floatpepleExecels}
              filename={"시간별유동인구데이터-" + sttdate + "-" + enddate}
              onClick={(event) => {
                /*var datediff = (new Date(enddate)-new Date(sttdate))/(24*60*60*1000);
                console.log(datediff);
                if (datediff > 7){
                  alert('시간별 유동인구 데이터는 분석 기간을 7일 이하로 선택해주세요')
                  return false;
                } else {
                  return true;
                }*/
              }}
            >
              시간별유동인구
            </CSVLink>
          </button>
        </div>
        <StackStatistics
          className="stackinfo"
          Info={allInfo}
          theme={me && me.theme === "dark" ? "dark" : "light"}
        />

        <div className="compare_list">
          <Slider ref={slideEl} {...settings}>
            <div>
              <div className="division">
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_1}
                  zoneName="불국사"
                  zoneIndex="1"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_2}
                  zoneName="석굴암"
                  zoneIndex="2"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_3}
                  zoneName="봉황대고분"
                  zoneIndex="3"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_4}
                  zoneName="동궁과월지"
                  zoneIndex="4"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_5}
                  zoneName="첨성대"
                  zoneIndex="5"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_6}
                  zoneName="교촌마을"
                  zoneIndex="6"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_7}
                  zoneName="황리단길"
                  zoneIndex="7"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_8}
                  zoneName="경주터미널"
                  zoneIndex="8"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_9}
                  zoneName="대릉원"
                  zoneIndex="9"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
            </div>
            <div>
              <div className="division">
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_1}
                  zoneName="중심거리1"
                  zoneIndex="10"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_2}
                  zoneName="중심거리2"
                  zoneIndex="11"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_3}
                  zoneName="중심거리3"
                  zoneIndex="12"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_4}
                  zoneName="북동거리"
                  zoneIndex="13"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_5}
                  zoneName="동남거리"
                  zoneIndex="14"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_6}
                  zoneName="동방거리"
                  zoneIndex="15"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_7}
                  zoneName="서방거리"
                  zoneIndex="16"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <FloatPopulationInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_8}
                  zoneName="서남거리"
                  zoneIndex="17"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
            </div>
          </Slider>
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

export default Floatpopulation;
