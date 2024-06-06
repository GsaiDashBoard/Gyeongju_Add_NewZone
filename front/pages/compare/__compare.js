import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Link from "next/link";
import axios from "axios";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { END } from "redux-saga";
import Head from "next/head";

import Header from "../../components/common/Header";
import Nav from "../../components/common/Nav";
import Status from "../../components/info/Status";
import ZoneInfo from "../../components/info/ZoneInfo";
import NavBottom from "../../components/common/NavBottom";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/auth";
import wrapper from "../../store/configureStore";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Background = styled.div`
  background-color: #f6f9fe;

  .darkback {
    background-color: #1b2137;
  }
  .iframeBox {
    width: 100%;
    height: 830px;
  }
  .iframe {
    width: 100%;
    height: 100%;
  }
  .compare_list {
    width: 100%;
    height: 100%;
    float: left;
    margin: 0 0 0 0;
    padding: 0px 10px 0 0;
  }
  .division {
    display: grid;
    grid-template-columns: 2fr 2fr 2fr;
  }
`;

const Compare = () => {
  const dispatch = useDispatch();
  const slideEl = useRef(null);
  const [settings, setSettings] = useState({});
  const { me, yearFirst, today, yesterday } = useSelector(
    (state) => state.auth
  );

  //황리단길
  const [zoneInfo1_1, setZoneInfo1_1] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_2, setZoneInfo1_2] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_3, setZoneInfo1_3] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_4, setZoneInfo1_4] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_5, setZoneInfo1_5] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_6, setZoneInfo1_6] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_7, setZoneInfo1_7] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo1_8, setZoneInfo1_8] = useState([0, 0, 0, 0, 0, 0]);
  //추가존
  const [zoneInfo2_1, setZoneInfo2_1] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_2, setZoneInfo2_2] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_3, setZoneInfo2_3] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_4, setZoneInfo2_4] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_5, setZoneInfo2_5] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_6, setZoneInfo2_6] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_7, setZoneInfo2_7] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_8, setZoneInfo2_8] = useState([0, 0, 0, 0, 0, 0]);
  const [zoneInfo2_9, setZoneInfo2_9] = useState([0, 0, 0, 0, 0, 0]);

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
    "경주 대릉원"
  ];
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
    "2100"
  ];
  //const zones = [1859, 1860, 1861, 1862, 1910, 1911, 1912, 1913];

  const arrY1_1 = [0, 0, 0, 0, 0, 0]; //"중심거리1",
  const arrY1_2 = [0, 0, 0, 0, 0, 0]; //"중심거리2",
  const arrY1_3 = [0, 0, 0, 0, 0, 0]; //"중심거리3",
  const arrY1_4 = [0, 0, 0, 0, 0, 0]; //"북동거리",
  const arrY1_5 = [0, 0, 0, 0, 0, 0]; //"동남거리",
  const arrY1_6 = [0, 0, 0, 0, 0, 0]; //"동방거리",
  const arrY1_7 = [0, 0, 0, 0, 0, 0]; //"서방거리",
  const arrY1_8 = [0, 0, 0, 0, 0, 0]; //"서남거리",
  const arrY2_1 = [0, 0, 0, 0, 0, 0]; //"불국사",
  const arrY2_2 = [0, 0, 0, 0, 0, 0]; //"석굴암",
  const arrY2_3 = [0, 0, 0, 0, 0, 0]; //"봉황대고분",
  const arrY2_4 = [0, 0, 0, 0, 0, 0]; //"둥궁과월지",
  const arrY2_5 = [0, 0, 0, 0, 0, 0]; //"첨성대",
  const arrY2_6 = [0, 0, 0, 0, 0, 0]; //"교촌마을",
  const arrY2_7 = [0, 0, 0, 0, 0, 0]; //"경주터미널",
  const arrY2_8 = [0, 0, 0, 0, 0, 0]; //"황리단길전체",
  const arrY2_9 = [0, 0, 0, 0, 0, 0]; //"경주대릉원"

  const getAPIdata = async () => {
    // 데이터 받아오기
    /**
     * 오늘자 방문객 그래프
     */
    try {
      const responseToday = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly?unit=1d-1h`
      );

      //const responseToday = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly?unit=1d-1h`);
      const cnt = [0, 0, 0, 0, 0, 0, 0, 0];
      const cnt2 = [0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (let i of responseToday.data) {
        if (i.zone_id === zones[0]) {
          arrY1_1[0] = i.data;
          sessionStorage.setItem(zoneids[0], i.data);
          cnt[0] = 1;
        } else if (i.zone_id === zones[1]) {
          arrY1_2[0] = i.data;
          sessionStorage.setItem(zoneids[1], i.data);
          cnt[1] = 1;
        } else if (i.zone_id === zones[2]) {
          arrY1_3[0] = i.data;
          sessionStorage.setItem(zoneids[2], i.data);
          cnt[2] = 1;
        } else if (i.zone_id === zones[3]) {
          arrY1_4[0] = i.data;
          sessionStorage.setItem(zoneids[3], i.data);
          cnt[3] = 1;
        } else if (i.zone_id === zones[4]) {
          arrY1_5[0] = i.data;
          sessionStorage.setItem(zoneids[4], i.data);
          cnt[4] = 1;
        } else if (i.zone_id === zones[5]) {
          arrY1_6[0] = i.data;
          sessionStorage.setItem(zoneids[5], i.data);
          cnt[5] = 1;
        } else if (i.zone_id === zones[6]) {
          arrY1_7[0] = i.data;
          sessionStorage.setItem(zoneids[6], i.data);
          cnt[6] = 1;
        } else if (i.zone_id === zones[7]) {
          arrY1_8[0] = i.data;
          sessionStorage.setItem(zoneids[7], i.data);
          cnt[7] = 1;
        } else if (i.zone_id === zones2[0]) {
          arrY2_1[0] = i.data;
          sessionStorage.setItem(zoneids2[0], i.data);
          cnt2[0] = 1;
        } else if (i.zone_id === zones2[1]) {
          arrY2_2[0] = i.data;
          sessionStorage.setItem(zoneids2[1], i.data);
          cnt2[1] = 1;
        } else if (i.zone_id === zones2[2]) {
          arrY2_3[0] = i.data;
          sessionStorage.setItem(zoneids2[2], i.data);
          cnt2[2] = 1;
        } else if (i.zone_id === zones2[3]) {
          arrY2_4[0] = i.data;
          sessionStorage.setItem(zoneids2[3], i.data);
          cnt2[3] = 1;
        } else if (i.zone_id === zones2[4]) {
          arrY2_5[0] = i.data;
          sessionStorage.setItem(zoneids2[4], i.data);
          cnt2[4] = 1;
        } else if (i.zone_id === zones2[5]) {
          arrY2_6[0] = i.data;
          sessionStorage.setItem(zoneids2[5], i.data);
          cnt2[5] = 1;
        } else if (i.zone_id === zones2[6]) {
          arrY2_7[0] = i.data;
          sessionStorage.setItem(zoneids2[6], i.data);
          cnt2[6] = 1;
        } else if (i.zone_id === zones2[7]) {
          arrY2_8[0] = i.data;
          sessionStorage.setItem(zoneids2[7], i.data);
          cnt2[7] = 1;
        } else if (i.zone_id === zones2[8]) {
          arrY2_9[0] = i.data;
          sessionStorage.setItem(zoneids2[8], i.data);
          cnt2[8] = 1;
        }
      }

    } catch (err) {
      console.error(err);
    }

    /**
     * 이달의 누적 방문객 그래프
     */
    try {
      const responseToday = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly?unit=1d-1h`
      );
      const responseYesterdayStack = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=${yearFirst}&to=${today}`
      );
      //const responseYesterdayStack = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountDay?from=${yearFirst}&to=${today}`);

      let arr1_1 = ["중심거리1", 0];
      let arr1_2 = ["중심거리2", 0];
      let arr1_3 = ["중심거리3", 0];
      let arr1_4 = ["북동거리", 0];
      let arr1_5 = ["동남거리", 0];
      let arr1_6 = ["동방거리", 0];
      let arr1_7 = ["서방거리", 0];
      let arr1_8 = ["서남거리", 0];
      let arr2_1 = ["불국사존", 0];
      let arr2_2 = ["석굴암존", 0];
      let arr2_3 = ["봉황대고분존", 0];
      let arr2_4 = ["동궁과월지존", 0];
      let arr2_5 = ["첨성대존", 0];
      let arr2_6 = ["교촌마을존", 0];
      let arr2_7 = ["경주 터미널 온누리 약국 앞", 0];
      let arr2_8 = ["황리단길 전체", 0];
      let arr2_9 = ["경주 대릉원", 0];

      for (let i of responseYesterdayStack.data) {
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
        }
      }
      for (let i of responseToday.data) {
        if (i.zone_id === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
        } else if (i.zone_id === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone_id === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone_id === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone_id === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone_id === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone_id === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone_id === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone_id === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone_id === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone_id === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone_id === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone_id === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone_id === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone_id === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone_id === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone_id === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        }
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
    } catch (err) {
      console.error(err);
    }

    /*
     * 금년도 누적방문객
     */
    try {
      const responseToday = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly?unit=1d-1h`
      );
      const responseYesterdayStack = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=${yearFirst}&to=${yesterday}`
      );
      //const responseToday = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly?unit=1d-1h`);
      //const responseYesterdayStack = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountDay?from=${yearFirst}&to=${yesterday}`);

      let arr1_1 = ["중심거리1", 0];
      let arr1_2 = ["중심거리2", 0];
      let arr1_3 = ["중심거리3", 0];
      let arr1_4 = ["북동거리", 0];
      let arr1_5 = ["동남거리", 0];
      let arr1_6 = ["동방거리", 0];
      let arr1_7 = ["서방거리", 0];
      let arr1_8 = ["서남거리", 0];
      let arr2_1 = ["불국사존", 0];
      let arr2_2 = ["석굴암존", 0];
      let arr2_3 = ["봉황대고분존", 0];
      let arr2_4 = ["동궁과월지존", 0];
      let arr2_5 = ["첨성대존", 0];
      let arr2_6 = ["교촌마을존", 0];
      let arr2_7 = ["경주 터미널 온누리 약국 앞", 0];
      let arr2_8 = ["황리단길 전체", 0];
      let arr2_9 = ["경주 대릉원", 0];

      for (let i of responseYesterdayStack.data) {
        if (i.zone_id === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
        } else if (i.zone_id === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone_id === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone_id === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone_id === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone_id === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone_id === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone_id === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone_id === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone_id === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone_id === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone_id === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone_id === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone_id === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone_id === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone_id === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone_id === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        }
      }

      for (let i of responseToday.data) {
        if (i.zone_id === zones[0]) {
          arr1_1[1] = arr1_1[1] + Number(i.data);
        } else if (i.zone_id === zones[1]) {
          arr1_2[1] = arr1_2[1] + Number(i.data);
        } else if (i.zone_id === zones[2]) {
          arr1_3[1] = arr1_3[1] + Number(i.data);
        } else if (i.zone_id === zones[3]) {
          arr1_4[1] = arr1_4[1] + Number(i.data);
        } else if (i.zone_id === zones[4]) {
          arr1_5[1] = arr1_5[1] + Number(i.data);
        } else if (i.zone_id === zones[5]) {
          arr1_6[1] = arr1_6[1] + Number(i.data);
        } else if (i.zone_id === zones[6]) {
          arr1_7[1] = arr1_7[1] + Number(i.data);
        } else if (i.zone_id === zones[7]) {
          arr1_8[1] = arr1_8[1] + Number(i.data);
        } else if (i.zone_id === zones2[0]) {
          arr2_1[1] = arr2_1[1] + Number(i.data);
        } else if (i.zone_id === zones2[1]) {
          arr2_2[1] = arr2_2[1] + Number(i.data);
        } else if (i.zone_id === zones2[2]) {
          arr2_3[1] = arr2_3[1] + Number(i.data);
        } else if (i.zone_id === zones2[3]) {
          arr2_4[1] = arr2_4[1] + Number(i.data);
        } else if (i.zone_id === zones2[4]) {
          arr2_5[1] = arr2_5[1] + Number(i.data);
        } else if (i.zone_id === zones2[5]) {
          arr2_6[1] = arr2_6[1] + Number(i.data);
        } else if (i.zone_id === zones2[6]) {
          arr2_7[1] = arr2_7[1] + Number(i.data);
        } else if (i.zone_id === zones2[7]) {
          arr2_8[1] = arr2_8[1] + Number(i.data);
        } else if (i.zone_id === zones2[8]) {
          arr2_9[1] = arr2_9[1] + Number(i.data);
        }
      }

      arrY1_1[2] = arr1_1[1];
      arrY1_2[2] = arr1_2[1];
      arrY1_3[2] = arr1_3[1];
      arrY1_4[2] = arr1_4[1];
      arrY1_5[2] = arr1_5[1];
      arrY1_6[2] = arr1_6[1];
      arrY1_7[2] = arr1_7[1];
      arrY1_8[2] = arr1_8[1];
      arrY2_1[2] = arr2_1[1];
      arrY2_2[2] = arr2_2[1];
      arrY2_3[2] = arr2_3[1];
      arrY2_4[2] = arr2_4[1];
      arrY2_5[2] = arr2_5[1];
      arrY2_6[2] = arr2_6[1];
      arrY2_7[2] = arr2_7[1];
      arrY2_8[2] = arr2_8[1];
      arrY2_9[2] = arr2_9[1];
    } catch (err) {
      console.error(err);
    }

    /**
     * 체류인원 그래프
     */
    try {
      const responseStay = await axios.get(
        `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly`
      );
      //const responseStay = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly`);

      for (let i of responseStay.data) {
        if (i.zone_id === zones[0]) {
          arrY1_1[3] = i.data;
        } else if (i.zone_id === zones[1]) {
          arrY1_2[3] = i.data;
        } else if (i.zone_id === zones[2]) {
          arrY1_3[3] = i.data;
        } else if (i.zone_id === zones[3]) {
          arrY1_4[3] = i.data;
        } else if (i.zone_id === zones[4]) {
          arrY1_5[3] = i.data;
        } else if (i.zone_id === zones[5]) {
          arrY1_6[3] = i.data;
        } else if (i.zone_id === zones[6]) {
          arrY1_7[3] = i.data;
        } else if (i.zone_id === zones[7]) {
          arrY1_8[3] = i.data;
        } else if (i.zone_id === zones2[0]) {
          arrY2_1[3] = i.data;
        } else if (i.zone_id === zones2[1]) {
          arrY2_2[3] = i.data;
        } else if (i.zone_id === zones2[2]) {
          arrY2_3[3] = i.data;
        } else if (i.zone_id === zones2[3]) {
          arrY2_4[3] = i.data;
        } else if (i.zone_id === zones2[4]) {
          arrY2_5[3] = i.data;
        } else if (i.zone_id === zones2[5]) {
          arrY2_6[3] = i.data;
        } else if (i.zone_id === zones2[6]) {
          arrY2_7[3] = i.data;
        } else if (i.zone_id === zones2[7]) {
          arrY2_8[3] = i.data;
        } else if (i.zone_id === zones2[8]) {
          arrY2_9[3] = i.data;
        }
      }
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

      for (let i of responseTime.data) {
        if (i.zone === zones[0]) {
          arrY1_1[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[1]) {
          arrY1_2[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[2]) {
          arrY1_3[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[3]) {
          arrY1_4[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[4]) {
          arrY1_5[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[5]) {
          arrY1_6[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[6]) {
          arrY1_7[4] = Math.round(i.data / 60);
        } else if (i.zone === zones[7]) {
          arrY1_8[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[0]) {
          arrY2_1[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[1]) {
          arrY2_2[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[2]) {
          arrY2_3[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[3]) {
          arrY2_4[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[4]) {
          arrY2_5[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[5]) {
          arrY2_6[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[6]) {
          arrY2_7[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[7]) {
          arrY2_8[4] = Math.round(i.data / 60);
        } else if (i.zone === zones2[8]) {
          arrY2_9[4] = Math.round(i.data / 60);
        }
      }
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

      for (let i of responseRevisit.data) {
        if (i.zone === zones[0]) {
          arrY1_1[5] = i.data;
        } else if (i.zone === zones[1]) {
          arrY1_2[5] = i.data;
        } else if (i.zone === zones[2]) {
          arrY1_3[5] = i.data;
        } else if (i.zone === zones[3]) {
          arrY1_4[5] = i.data;
        } else if (i.zone === zones[4]) {
          arrY1_5[5] = i.data;
        } else if (i.zone === zones[5]) {
          arrY1_6[5] = i.data;
        } else if (i.zone === zones[6]) {
          arrY1_7[5] = i.data;
        } else if (i.zone === zones[7]) {
          arrY1_8[5] = i.data;
        } else if (i.zone === zones2[0]) {
          arrY2_1[5] = i.data;
        } else if (i.zone === zones2[1]) {
          arrY2_2[5] = i.data;
        } else if (i.zone === zones2[2]) {
          arrY2_3[5] = i.data;
        } else if (i.zone === zones2[3]) {
          arrY2_4[5] = i.data;
        } else if (i.zone === zones2[4]) {
          arrY2_5[5] = i.data;
        } else if (i.zone === zones2[5]) {
          arrY2_6[5] = i.data;
        } else if (i.zone === zones2[6]) {
          arrY2_7[5] = i.data;
        } else if (i.zone === zones2[7]) {
          arrY2_8[5] = i.data;
        } else if (i.zone === zones2[8]) {
          arrY2_9[5] = i.data;
        }
      }
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
  };

  useEffect(() => {
    if (!(me && me.id)) {
      Router.replace("/login");
    }
  }, [me && me.id]);

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

  return (
    <Background>
      <div className={me && me.theme === "dark" ? "darkback" : "lightback"}>
        <Header page={"0"} />
        <Nav value={"3"} bottomValue={"1"} />
        <Status theme={me && me.theme === "dark" ? "dark" : "light"} />
        <div className="compare_list">
          <Slider ref={slideEl} {...settings}>
            <div>
              <div className="division">
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_1}
                  zoneName="불국사"
                  zoneIndex="1"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_2}
                  zoneName="석굴암"
                  zoneIndex="2"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_3}
                  zoneName="봉황대고분"
                  zoneIndex="3"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_4}
                  zoneName="동궁과월지"
                  zoneIndex="4"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_5}
                  zoneName="첨성대"
                  zoneIndex="5"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_6}
                  zoneName="교촌마을"
                  zoneIndex="6"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_8}
                  zoneName="황리단길"
                  zoneIndex="7"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo2_7}
                  zoneName="경주터미널"
                  zoneIndex="8"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
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
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_1}
                  zoneName="중심거리1"
                  zoneIndex="10"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_2}
                  zoneName="중심거리2"
                  zoneIndex="11"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_3}
                  zoneName="중심거리3"
                  zoneIndex="12"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_4}
                  zoneName="북동거리"
                  zoneIndex="13"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_5}
                  zoneName="동남거리"
                  zoneIndex="14"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_6}
                  zoneName="동방거리"
                  zoneIndex="15"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
              </div>
              <div className="division">
                <ZoneInfo
                  className="zonebox"
                  zoneInfo={zoneInfo1_7}
                  zoneName="서방거리"
                  zoneIndex="16"
                  theme={me && me.theme === "dark" ? "dark" : "light"}
                />
                <ZoneInfo
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
        {/* <NavBottom value={'1'} theme={me && me.theme === 'dark'? 'dark':'light'}/> */}
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

export default Compare;
