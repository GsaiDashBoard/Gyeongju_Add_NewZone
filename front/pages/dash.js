import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Router from "next/router";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";

import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import DashTotalInfo from "../components/info/DashTotalInfo";
import DashAreaInfo from "../components/info/DashAreaInfo";
import DashSoleInfo from "../components/info/DashSoleInfo";
import charticon from "../public/images/chart_icon.png";
import nexticon from "../public/images/next.png";
import previcon from "../public/images/prev.png";

import DoughnutChart from "../components/charts/dashDoughnutChart";
import LineChart from "../components/charts/dashLineChart";
import BarChart from "../components/charts/dashBarChart";

import { LOAD_MY_INFO_REQUEST } from "../reducers/auth";
import { LOAD_ZONELISTS_REQUEST, LOAD_SCANNERLISTS_REQUEST, LOAD_ZONELISTS_HISTORY_REQUEST, LOAD_SCANNERLISTS_HISTORY_REQUEST } from "../reducers/scanner";
import { LOAD_ZONESECTION_REQUEST } from "../reducers/scanner";
import wrapper from "../store/configureStore";
import Script from "next/script";
import styled from "styled-components";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Mapp = styled.div`
  background-color: #1b2137;
  margin-top:100px
  width: 100%;
  height: 820px;
  .map{
    width: 100%;
    height: 820px;
  }
  .overlaybtn {
   //z-index: 1;
    position:absolute;
    top: 120px;
    left: 465px;
    display:grid;

  }
  .buttons {
    display:grid;

  }

  .button {    
    border-radius: 10px;    
    border: 0;
    padding: 5px 25px;
    margin : 4px;
    //margin : 7px;
    display: inline-block;
    text-align: center;
    font-weight: bold;
    font-size:11pt;
    color: white;
    
  }
  
   .blue {
    background: rgba(0,112,192,0.3);
  }
  .br {
    background: rgba(172,145,115,0.3);
  }
  .gr {
    background: rgba(7,154,62,0.3);
  }
  .or {
    background: rgba(235,97,0,0.3);
  }
  .pu {
    background: rgba(112,0,236,0.3);
  }
  .yl {
    background: rgba(242,236,0,0.4);
  }
  .red {
    background: rgba(236,0,0,0.3);
  }

  .button:active {
    top: 20px; 
    box-shadow: 0 0 gray; 
    background: rgba(168,179,202,0.8);
  }

  .button:active {
    top: 20px; 
    box-shadow: 0 0 gray; 
    background: rgba(168,179,202,0.8);
  }

  .tourOn {
    border-radius: 10px;    
    border: 0;
    //background: linear-gradient(to right, #75A6FC, #75A6FC, rgba(255,255,255,0.3));
    background: rgba(117,166,252,1);
    box-shadow: 0px 4px 0px rgba(168,179,202,1);
    margin : 3px;
    display: inline-block;
    color:white;
    font-weight: bolder;
    font-size: 13pt;
    padding: 3px;
    width: 85px;
    text-align: center;
  }

  .tourOff {
    border-radius: 10px;    
    border: 0;
    background: rgba(168,179,202,1);
    box-shadow:inset 4px 4px rgba(140,140,140,0.8); 
    margin : 3px;
    display: inline-block;
    color:white;
    font-weight: bolder;
    font-size: 13pt;
    padding: 3px;
    width: 85px;
    text-align: center;
  }

  .scanner {
    background: linear-gradient(to right, #75A6FC, #F2D9D8);
    color:white;
    font-weight: bolder;
    font-size: 15pt;
    padding: 6px;
    width: 90px;
  }
  
  .arrowbtnprev {
    position:absolute;
    top: 50%;
		//right: 10px;
    left: 455px;
    display:grid;
  }
  .arrowbtnnext {
    position:absolute;
    top: 50%;
		//right: 10px;
    right: 435px;
    display:grid;
  }
  .prev {
    //width:50%;
    heigth:5px;
  }
`;

const Background = styled.div`
  height:820px;
  .iframeBox {
    position:relative
    width: 100%;
    height: 820px;

  }
  .iframe {
    width: 100%;
    height: 100%;
  }
  .overlayleft {
    top:110px;
    position:absolute;
    display: grid;
    grid-template-columns: 5fr 1fr;
    width: 50px;
    height: 820px;
    //z-index:1;
  }
  .overlaydash {
    width: 450px;
    height: 820px;
    background: rgba(255,255,255,0.7);
    transform: translate(0px, 0px);
    transition-duration: 0.5s;
    //z-index:1;
  }

  .trans {
    transform: translate(-500px, 0px);
    transition-duration: 0.5s;
  }

  .reverse {
    transform: scaleX(-1) translate(500px, 0px);
  }

  
  .column {
    width: 95%;
    margin: 5px 2.5% 5px 2.5%;
    display: grid;
    text-align: center;
    grid-template-columns:2.2fr 1fr 1fr 1fr;
    font-weight: bold;
  }

  .overlayright {
    position:absolute;
    top:110px;
    right: 0;
    display: grid;
    width: 430px;
    height: 820px;
    background: rgba(255,255,255,0.8);
    //z-index:1;
    //text-align: center;
    
  }

  .overlaychart {
    width: 80%;
    height: 820px;
    margin-left: 12%;
  }


  .chart {
    height: 150px;
  }

  .chartd {
    width: 80%;
    margin-left: 10%;
  }

  .charttitle {
    font-weight:bold;
    font-size: 11pt;
    color: black;
    margin-bottom:15px;
    margin-left: -20px;
  }
 
  .darkback{
    .overlay{
    background: rgba(146,155,180,0.4);
  }}

  .scannerbtn {
    margin: 30px;
  }
  .zoneleft{
    margin: 0;
    margin-left: 11px;
  }

  .zone {
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;    
    border: 0;    
    display: inline-block;
    color:white;
    font-weight: bolder;
    font-size: 13pt;
    padding: 2px;
    width: 137.5px;
    margin:  1px 1px 0 1px;
    text-align: center;
  }

  .zoneSelct {
    //background: rgba(117,166,252,1);
    background-color: #6babf1;
  }

  .zoneNotSelct {
   // top: 20px; 
    //box-shadow:inset 4px 4px rgba(140,140,140,0.8); 
    background: rgba(168,179,202,1);
  }
  
  .total2 {
    margin-bottom: 0;
  }
  
  .infotitle {
    //margin-left: 197px;
    margin-top: 5px;
    font-weight:bolder;
    font-size: 13.5pt;
    color: #303030;
    text-align: center;
  }

`;

const Dash = () => {
  const dispatch = useDispatch();
  const { me, lastMonday, lastSunday, today, ago7day, yesterday } = useSelector((state) => state.auth);
  const { zonedatas, scanners, zonedatasHistory, scannersHistory } = useSelector((state) => state.scanner);
  const scanDevice = scanners;
  const zoneData = zonedatas;

  const zones = [
    //22개 존
    "황리단길 중심거리 1",
    "황리단길 중심거리 2",
    "황리단길 중심거리 3",
    "황리단길 북동",
    "황리단길 동남",
    "황리단길 동",
    "황리단길 서",
    "황리단길 서남",
    "불국사존",
    "석굴암존",
    "봉황대고분존",
    "동궁과월지존",
    "첨성대존",
    "교촌마을존",
    "경주 터미널 온누리 약국 앞",
    "황리단길 전체",
    "경주 대릉원",
    "국립경주박물관",
    "연꽃단지",
    "신경주역 일대",
    "보문단지 일대",
    "동부해안가 일대",
  ];

  // 존 범위 원형으로 표기해야하는 것
  const zone2 = [
    "봉황대고분존",
    "동궁과월지존",
    "첨성대존",
    "교촌마을존",
    "경주 터미널 온누리 약국 앞",
    "황리단길 전체",
    "국립경주박물관",
    "연꽃단지",
    "신경주역 일대",
    "보문단지 일대",
    "동부해안가 일대",
  ];

  const scanDevices = JSON.parse(JSON.stringify(scanDevice)); //json 깊은 복사

  var tourTimer;

  const [zoneSection, setZoneSection] = useState("황리단길 권역");
  const [onchangeZone, setOnChangeZone] = useState(false);
  const [tours, setTours] = useState(0);

  var tourCnt = 0;

  const Map = () => {
    const [onOffZone, setOnOffZone] = useState(false);
    const [onOffScanner, setOnOffScanner] = useState(false);
    const [onOffBound, setOnOffBound] = useState(false);
    const [onClickArrow, setOnClickArrow] = useState(0);

    //방문객 수 황리단길
    const [visitor1, setVisitor1] = useState(0);
    const [visitor2, setVisitor2] = useState(0);
    const [visitor3, setVisitor3] = useState(0);
    const [visitor4, setVisitor4] = useState(0);
    const [visitor5, setVisitor5] = useState(0);
    const [visitor6, setVisitor6] = useState(0);
    const [visitor7, setVisitor7] = useState(0);
    const [visitor8, setVisitor8] = useState(0);
    //신규
    const [visitor9, setVisitor9] = useState(0);
    const [visitor10, setVisitor10] = useState(0);
    const [visitor11, setVisitor11] = useState(0);
    const [visitor12, setVisitor12] = useState(0);
    const [visitor13, setVisitor13] = useState(0);
    const [visitor14, setVisitor14] = useState(0);
    const [visitor15, setVisitor15] = useState(0);
    //사적관리
    const [visitor16, setVisitor16] = useState(0); //박물관
    const [visitor17, setVisitor17] = useState(0); //연꽃단지
    const [visitor18, setVisitor18] = useState(0); //연꽃단지
    const [visitor19, setVisitor19] = useState(0); //연꽃단지

    const [visitor20, setVisitor20] = useState(0); //연꽃단지
    const [visitor21, setVisitor21] = useState(0); //연꽃단지
    const [visitor22, setVisitor22] = useState(0); //연꽃단지

    const [visitorHistory, setVisitorHistory] = useState(0);

    useEffect(() => {
      if (!(me && me.id)) {
        Router.replace("/login");
      }
    }, [me && me.id]);

    //오늘 방문객 데이터 가져오기
    const getAPIdata = async () => {
      console.log("방문객데이터가져오기");

      /**
       * 오늘자 방문객 그래프
       */
      try {
        const responseToday = await axios.get(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly?unit=1d-1h`);

        //const responseToday = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly?unit=1d-1h`);

        let arrY = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i of responseToday.data) {
          for (let j = 0; j < zones.length; j++) {
            if (i.zone_id === zones[j]) {
              arrY[j] = i.data;
              break;
            }
          }
        }

        setVisitor1(arrY[0]);
        setVisitor2(arrY[1]);
        setVisitor3(arrY[2]);
        setVisitor4(arrY[3]);
        setVisitor5(arrY[4]);
        setVisitor6(arrY[5]);
        setVisitor7(arrY[6]);
        setVisitor8(arrY[7]);

        setVisitor9(arrY[8]);
        setVisitor10(arrY[9]);
        setVisitor11(arrY[10]);
        setVisitor12(arrY[11]);
        setVisitor13(arrY[12]);
        setVisitor14(arrY[13]);
        setVisitor15(arrY[14]);
        setVisitor16(arrY[15]);
        setVisitor17(arrY[16]);
        setVisitor18(arrY[17]);
        setVisitor19(arrY[18]);
        setVisitor20(arrY[19]);
        setVisitor21(arrY[20]);
        setVisitor22(arrY[21]);
        setVisitorHistory(arrY[16]);
      } catch (err) {
        console.error(err);
      }
    };

    //장비데이터 가져오기(map)
    const getDeviceStatus2 = async () => {
      console.log("디바이스가져오기");

      //스캐너 정보저장
      const ScannerStatus = (scannerInfo) => {
        return ` 
          <br/>[장비정보] <br/>
          MAC : ${scannerInfo["mac"]} <br/>
          INTMAC : ${scannerInfo["intmac"]} <br/>
          장비타입 : ${scannerInfo["type"]}<br/>
          상태 : ${scannerInfo["status"]}`;
      };

      for (var j of scanDevices) {
        j.info = ScannerStatus(j);
      }

      try {
        //장비정보가져오기API
        //const deviceResponse = await axios.get(`http://54.180.158.22:8000/v1/DaeguDalseong/DeviceStatus`);
        const deviceResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceStatus`);
        const resultData = deviceResponse.data;

        for (let i of resultData) {
          for (var j of scanDevices) {
            if (j.mac == i.MAC) {
              if (i.ALIVE === 1) {
                j.status = "ON";
              } else if (i.ALIVE === 0) {
                j.status = "OFF";
              }
            }
            j.info = ScannerStatus(j);
          }
        }
        //mapConfig();
      } catch (err) {
        console.error(err);
      }
    };

    /**
 * 지도설정

 */
    //지도에 맵 올리기
    const mapConfig = (zonePos, onScanner, onBound, selectZoom) => {
      console.log("맵 올리기");
      getAPIdata();
      getDeviceStatus2();

      var locationss = [sessionStorage.getItem("lat"), sessionStorage.getItem("lon")];

      var zoom = Number(sessionStorage.getItem("zoom"));

      //var zone = new naver.maps.LatLng(locationss[0],locationss[1]);
      var zone = new naver.maps.LatLng(Number(locationss[0]), Number(locationss[1]));

      if (!locationss[0]) {
        var zone = new naver.maps.LatLng(35.8356, 129.2115);
        zoom = 17;
      }

      if (zonePos) {
        var zone = zonePos;
        zoom = selectZoom;
      }

      //맵 설정
      var map1 = new naver.maps.Map("map1", {
        center: zone,
        zoom: zoom,
      });

      //줌레벨 저장
      naver.maps.Event.addListener(map1, "zoom_changed", function (zoom) {
        sessionStorage.setItem("zoom", zoom);
      });

      // 위치정보 저장
      naver.maps.Event.addListener(map1, "bounds_changed", function (bounds) {
        var a = map1.getCenter();
        sessionStorage.setItem("lat", a.y);
        sessionStorage.setItem("lon", a.x);
      });

      var markers = [];
      var infowindows = [];

      var HOME_PATH = window.HOME_PATH || ".";

      //존영역 표시(사각형)
      if (!onBound) {
        for (var i of zoneData) {
          //존영역표시
          if (i.zone == "황리단길 중심거리 1" || i.zone == "황리단길 북동" || i.zone == "황리단길 동" || i.zone == "동부해안가 일대") {
            continue;
          }
          var zoneBound = new naver.maps.Rectangle({
            map: map1,
            bounds: new naver.maps.LatLngBounds(new naver.maps.LatLng(i.boundstartlat, i.boundstartlon), new naver.maps.LatLng(i.boundendlat, i.boundendlon)),
            strokeColor: "rgba(0,0,0,0)",
            fillColor: i.boundcolor,
            fillOpacity: 0.2,
          });
        }
      }

      //존영역 표시(원형)
      if (!onBound) {
        for (var i of zoneData) {
          //존영역표시
          /*if (i.zone == "황리단길 권역") {
            continue;
          }*/
          if (zone2.includes(i.zone)) {
            var zoneBound = new naver.maps.Circle({
              map: map1,
              center: new naver.maps.LatLng(i.lat, i.lon),
              radius: i.radius,
              strokeColor: "rgba(0,0,0,0)",
              fillColor: i.boundcolor,
              fillOpacity: 0.2,
            });
          }

          //존이름표시
        }
      }

      /**
       * 다각형표시
       */
      //대릉원
      if (!onBound) {
        var polygonHistory = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.84031449037823, 129.21337640840258),
              new naver.maps.LatLng(35.839402585638496, 129.20992892570905),
              new naver.maps.LatLng(35.83852732556063, 129.209874207374),
              new naver.maps.LatLng(35.83589457994932, 129.21278052920152),
              new naver.maps.LatLng(35.83561903524143, 129.2134312653564),
              new naver.maps.LatLng(35.83552167714118, 129.2149586593949),
              new naver.maps.LatLng(35.83467568500339, 129.21572598969658),
              new naver.maps.LatLng(35.8351345009379, 129.2162532904292),
              new naver.maps.LatLng(35.83556138199687, 129.21582531931534),
              new naver.maps.LatLng(35.836455173804524, 129.21450849171455),
              new naver.maps.LatLng(35.838148615432644, 129.21368138387695),
              new naver.maps.LatLng(35.84016417112741, 129.2135880180776),
            ],
          ],
          fillColor: "yellow",
          fillOpacity: 0.3,
          strokeColor: "yellow",
          strokeOpacity: 0.6,
          strokeWeight: 3,
        });

        //황리단길 중심1
        var polygonHD1 = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.83898191791158, 129.20985788730358),
              new naver.maps.LatLng(35.83900889118361, 129.2092037966919),
              new naver.maps.LatLng(35.837075054565904, 129.2092037966919),
              new naver.maps.LatLng(35.837075054565904, 129.21106823874374),
              new naver.maps.LatLng(35.837408932457066, 129.21103549946758),
              new naver.maps.LatLng(35.83849852429865, 129.20983402082063),
            ],
          ],
          fillColor: "red",
          fillOpacity: 0.3,
          strokeColor: "red",
          strokeOpacity: 0,
          strokeWeight: 3,
        });

        //황리단길 북동
        var polygonHD2 = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.8369904623295, 129.21149693645486),
              new naver.maps.LatLng(35.83698264246703, 129.21106516124215),
              new naver.maps.LatLng(35.83485404221459, 129.21108679252042),
              new naver.maps.LatLng(35.83485404221459, 129.2131589695413),
              new naver.maps.LatLng(35.83562587173433, 129.2131589695413),
              new naver.maps.LatLng(35.83591508728245, 129.21264554728884),
            ],
          ],
          fillColor: "green",
          fillOpacity: 0.3,
          strokeColor: "green",
          strokeOpacity: 0,
          strokeWeight: 3,
        });

        //황리단길 동
        var polygonHD3 = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.83557858336018319, 129.21375),
              new naver.maps.LatLng(35.8336, 129.21375),
              new naver.maps.LatLng(35.8336, 129.2159),
              new naver.maps.LatLng(35.834592075092345, 129.2159),
              new naver.maps.LatLng(35.8346421681415, 129.2157112257775),
              new naver.maps.LatLng(35.83550508728245, 129.2149428164976),
            ],
          ],
          fillColor: "purple",
          fillOpacity: 0.3,
          strokeColor: "purple",
          strokeOpacity: 0,
          strokeWeight: 3,
        });

        // 불국사
        var polygonHD4 = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.787629664663, 129.32670497556919),
              new naver.maps.LatLng(35.78498223176654, 129.3303432925593),
              new naver.maps.LatLng(35.785339444037625, 129.33190186205036),
              new naver.maps.LatLng(35.78649745802188, 129.33305259142662),
              new naver.maps.LatLng(35.78783193888133, 129.3330031450953),
              new naver.maps.LatLng(35.788854433275105, 129.33417208066066),
              new naver.maps.LatLng(35.790045269958654, 129.33363186537508),
              new naver.maps.LatLng(35.79111561576105, 129.33233610442284),
              new naver.maps.LatLng(35.79074683619695, 129.33090978719363),
              new naver.maps.LatLng(35.78861338943252, 129.32708753796987),
            ],
          ],
          fillColor: "red",
          fillOpacity: 0.3,
          strokeColor: "red",
          strokeOpacity: 0,
          strokeWeight: 3,
        });

        // 석굴암
        var polygonHD5 = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.795695932788945, 129.3506740241697),
              new naver.maps.LatLng(35.795651085670194, 129.3508938925973),
              new naver.maps.LatLng(35.79464959914488, 129.35211408403336),
              new naver.maps.LatLng(35.79408311929781, 129.35159418245811),
              new naver.maps.LatLng(35.79339592479763, 129.351717693233),
              new naver.maps.LatLng(35.79296915889635, 129.35165534553252),
              new naver.maps.LatLng(35.79260734402475, 129.35103642970353),
              new naver.maps.LatLng(35.79269999320869, 129.3502152576068),
              new naver.maps.LatLng(35.789242808570116, 129.3507658691582),
              new naver.maps.LatLng(35.78916936401237, 129.3494532601295),
              new naver.maps.LatLng(35.790997027549395, 129.34906473014843),
              new naver.maps.LatLng(35.79180034790392, 129.34876214516652),
              new naver.maps.LatLng(35.79494502187564, 129.34898745325086),
            ],
          ],
          fillColor: "orange",
          fillOpacity: 0.3,
          strokeColor: "orange",
          strokeOpacity: 0,
          strokeWeight: 3,
        });
        // 동부해안가
        var polygonDH = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
              new naver.maps.LatLng(35.795695932788945, 129.3506740241697),
              new naver.maps.LatLng(35.795651085670194, 129.3508938925973),
              new naver.maps.LatLng(35.79464959914488, 129.35211408403336),
              new naver.maps.LatLng(35.79408311929781, 129.35159418245811),
              new naver.maps.LatLng(35.79339592479763, 129.351717693233),
              new naver.maps.LatLng(35.79296915889635, 129.35165534553252),
              new naver.maps.LatLng(35.79260734402475, 129.35103642970353),
              new naver.maps.LatLng(35.79269999320869, 129.3502152576068),
              new naver.maps.LatLng(35.789242808570116, 129.3507658691582),
              new naver.maps.LatLng(35.78916936401237, 129.3494532601295),
              new naver.maps.LatLng(35.790997027549395, 129.34906473014843),
              new naver.maps.LatLng(35.79180034790392, 129.34876214516652),
              new naver.maps.LatLng(35.79494502187564, 129.34898745325086),
            ],
          ],
          fillColor: "orange",
          fillOpacity: 0.3,
          strokeColor: "orange",
          strokeOpacity: 0,
          strokeWeight: 3,
        });
        var polygonDH = new naver.maps.Polygon({
          map: map1,
          paths: [
            [
                new naver.maps.LatLng(35.82377178483823, 129.50956485831964),
                new naver.maps.LatLng(35.81631731724105, 129.5144628483393),
                new naver.maps.LatLng(35.808058688156336, 129.51300776618075),
                new naver.maps.LatLng(35.80387767246284, 129.50958003218196),
                new naver.maps.LatLng(35.80110916292881, 129.50408462800365),
                new naver.maps.LatLng(35.80060120436417, 129.4999212516157),
                new naver.maps.LatLng(35.793723176445575, 129.5013866060252),
                new naver.maps.LatLng(35.790707154143234, 129.49737734352587),
                new naver.maps.LatLng(35.78846740706556, 129.4950292532601),
                new naver.maps.LatLng(35.78772399101139, 129.49177705744066),
                new naver.maps.LatLng(35.77909556501759, 129.49336517185318),
                new naver.maps.LatLng(35.77706283009327, 129.49580044686854),
                new naver.maps.LatLng(35.771813373186774, 129.49694089770534),
                new naver.maps.LatLng(35.76699657569259, 129.49460132868202),
                new naver.maps.LatLng(35.764741708339734, 129.4951499513151),
                new naver.maps.LatLng(35.76189680133652, 129.4946078251472),
                new naver.maps.LatLng(35.75897887292498, 129.49367657185127),
                new naver.maps.LatLng(35.758586456281705, 129.49130981858664),
                new naver.maps.LatLng(35.75288005735514, 129.49493414162825),
                new naver.maps.LatLng(35.75178011185058, 129.49453503808203),
                new naver.maps.LatLng(35.747037948326486, 129.48815342427696),
                new naver.maps.LatLng(35.74454940700195, 129.48736860206512),
                new naver.maps.LatLng(35.743341135240875, 129.48392700715587),
                new naver.maps.LatLng(35.72965473333002, 129.4865515302447),
                new naver.maps.LatLng(35.72470140932588, 129.48513787499522),
                new naver.maps.LatLng(35.717140567949755, 129.48127911301285),
                new naver.maps.LatLng(35.7125836935818, 129.48029815139023),
                new naver.maps.LatLng(35.697169033924226, 129.47628586568638),
                new naver.maps.LatLng(35.69685994879978, 129.46940600314693),
                new naver.maps.LatLng(35.74479410169277, 129.47813665678115),
                new naver.maps.LatLng(35.8244289183496, 129.49618812973586),
            ],
          ],
          fillColor: "orange",
          fillOpacity: 0.3,
          strokeColor: "orange",
          strokeOpacity: 0,
          strokeWeight: 3,
        });
      }
      }

      /**
       * 존 및 스캐너 마커표시
       */
      if (onScanner) {
        for (var i of zoneData) {
          if (i.zone === zones[0]) {
            var visitor = visitor1;
          } else if (i.zone === zones[1]) {
            var visitor = visitor2;
          } else if (i.zone === zones[2]) {
            var visitor = visitor3;
          } else if (i.zone === zones[3]) {
            var visitor = visitor4;
          } else if (i.zone === zones[4]) {
            var visitor = visitor5;
          } else if (i.zone === zones[5]) {
            var visitor = visitor6;
          } else if (i.zone === zones[6]) {
            var visitor = visitor7;
          } else if (i.zone === zones[7]) {
            var visitor = visitor8;
          } else if (i.zone === zones[8]) {
            var visitor = visitor9;
          } else if (i.zone === zones[9]) {
            var visitor = visitor10;
          } else if (i.zone === zones[10]) {
            var visitor = visitor11;
          } else if (i.zone === zones[11]) {
            var visitor = visitor12;
          } else if (i.zone === zones[12]) {
            var visitor = visitor13;
          } else if (i.zone === zones[13]) {
            var visitor = visitor14;
          } else if (i.zone === zones[14]) {
            var visitor = visitor15;
          } else if (i.zone === zones[16]) {
            var visitor = visitorHistory;
          } else if (i.zone === zones[17]) {
            var visitor = visitor17;
          } else if (i.zone === zones[18]) {
            var visitor = visitor18;
          } else if (i.zone === zones[19]) {
            var visitor = visitor19;
          } else if (i.zone === zones[20]) {
            var visitor = visitor20;
          } else if (i.zone === zones[21]) {
            var visitor = visitor21;
          }

          var marker = new naver.maps.Marker({
            map: map1,
            position: naver.maps.LatLng(i.lat, i.lon),
            title: i.zone,
            icon: {
              content: "<img src=" + HOME_PATH + "/images/marker_" + i.boundcolor + ".png>",
              // content: "<img src=" + HOME_PATH + "/images/marker_green.png>",

              //content: '<img src='+HOME_PATH+'/images/scanner_icon_1.png>',
              //size: new naver.map.Size(50,50),
            },
          });

          //마커 누르면 나오는 정보
          var infowindow = new naver.maps.InfoWindow({
            content: '<div style="text-align:center; padding:10px; border-radius:5px; background:rgba(255,255,255,0.7); border:solid gray 0.5px;"><b>' + i.zone + " - " + visitor + "명</b></div>",
            //maxWidth: 140,
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: "rgba(255,255,255,0)",
            anchorSize: new naver.maps.Size(0, 0),
            anchorSkew: false,
            anchorColor: "#fff",
            pixelOffset: new naver.maps.Point(0, 0),
          });

          markers.push(marker);
          infowindows.push(infowindow);
        }
      } else if (!onScanner) {
        // 스캐너 마커
        for (var i of scanDevices) {
          // 황리단 중심거리1, 불국사존, 연꽃단지, 신경주역
          if (i.zoneid == 2070 || i.zoneid == 2082 || i.zoneid == 2142 || i.zoneid == 3000) {
            var color = "red";
            // 황리단길 중심거리2, 석굴암존, 국립경주박물관, 동부해안가
          } else if (i.zoneid == 2071 || i.zoneid == 2083 || i.zoneid == 2141 || i.zoneid == 3002) {
            var color = "orange";
            // 황리단길 중심거리3, 봉황대고분존, 경주 대릉원, 보문단지
          } else if (i.zoneid == 2072 || i.zoneid == 2084 || i.zoneid == 2100 || i.zoneid == 3001) {
            var color = "yellow";
            // 황리단길 북동, 동궁과월지존
          } else if (i.zoneid == 2073 || i.zoneid == 2085) {
            var color = "green";
            // 황리단길 동남, 황리단길 서남, 첨성대존, 황리단길 권역
          } else if (i.zoneid == 2074 || i.zoneid == 2077 || i.zoneid == 2086 || i.zoneid == 2078) {
            var color = "blue";
            //황리단길 동, 교촌마을존
          } else if (i.zoneid == 2075 || i.zoneid == 2087) {
            var color = "purple";
            // 황리단길 서, 경주 터미널 온누리 약국 앞
          } else if (i.zoneid == 2076 || i.zoneid == 2088) {
            var color = "brown";
          } else {
            var color = "gray";
          }

          //스캐너 아이콘 넣기
          if (i.status == "ON") {
            var marker = new naver.maps.Marker({
              map: map1,
              position: naver.maps.LatLng(i.lat, i.lon),
              title: i.zone + "-" + i.num,
              icon: {
                content: "<img src=" + HOME_PATH + "/images/scanner_" + color + ".png>",
                //url:HOME_PATH + "/images/scanner_" + color +  ".png",
                //size: new naver.map.Size(50,50),
              },
            });
          } else {
            var marker = new naver.maps.Marker({
              map: map1,
              position: naver.maps.LatLng(i.lat, i.lon),
              title: i.zone + "-" + i.num,
              icon: {
                content: "<img src=" + HOME_PATH + "/images/scanner_error.png>",
                //size: new naver.map.Size(50,50),
              },
            });
          }

          //마커 누르면 나오는 정보
          var infowindow = new naver.maps.InfoWindow({
            content: '<div style="text-align:left;padding:10px;border-radius:5px; background:rgba(255,255,255,0.7); border:solid gray 0.5px;"><b>' + i.zone + "</n>" + i.info + "</b></div>",
            //maxWidth: 140,
            backgroundColor: "rgba(255,255,255,0)",
            borderColor: "rgba(255,255,255,0)",
            anchorSize: new naver.maps.Size(0, 0),
            anchorSkew: false,
            anchorColor: "#fff",
            pixelOffset: new naver.maps.Point(0, 0),
          });

          markers.push(marker);
          infowindows.push(infowindow);
        }
      }

      for (let i = 0; i < markers.length; i++) {
        naver.maps.Event.addListener(markers[i], "click", function (e) {
          if (infowindows[i].getMap()) {
            infowindows[i].close();
          } else {
            infowindows[i].open(map1, markers[i]);
          }
        });
      }
      //infowindow.open(map1, marker1);

      //존이름 표시
      if (!onBound) {
        for (var i of zoneData) {
          //존이름표시
          if (i.zone == "황리단길 권역") {
            continue;
          }
          var text = new naver.maps.Marker({
            map: map1,
            position: new naver.maps.LatLng(i.textlat, i.textlon),
            title: i.zonename,
            icon: {
              content: '<div style="text-align:center; font-size:13pt; color:' + i.boundcolor + '; font-weight:bolder; text-shadow:1px 1px 1px #000;">' + i.zonename + "</div>",
            },
          });
        }
      }
    };

    const ChangeZone = (cnt) => {
      if (tourCnt == 1) {
        onClickZonePos9();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 2) {
        onClickZonePos10();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 3) {
        onClickZonePos11();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 4) {
        onClickZonePos12();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 5) {
        onClickZonePos13();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 6) {
        onClickZonePos14();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 7) {
        onClickZonePos15();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 8) {
        onClickZonePos16();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 9) {
        onClickZonePos17();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 10) {
        onClickZonePos18();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 11) {
        onClickZonePos19();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 12) {
        onClickZonePos20();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 13) {
        onClickZonePos21();
        tourCnt = tourCnt + 1;
      } else if (tourCnt == 0) {
        onClickZonePos22();
        tourCnt = 0;
      }
    };

    //양옆화살표 클릭시
    const ArrowChangeZone = (cnt) => {
      //console.log('cnt',cnt);
      if (cnt == 1) {
        onClickZonePos9();
      } else if (cnt == 2) {
        onClickZonePos10();
      } else if (cnt == 3) {
        onClickZonePos11();
      } else if (cnt == 4) {
        onClickZonePos12();
      } else if (cnt == 5) {
        onClickZonePos13();
      } else if (cnt == 6) {
        onClickZonePos14();
      } else if (cnt == 7) {
        onClickZonePos15();
      } else if (cnt == 8) {
        onClickZonePos16();
      } else if (cnt == 9) {
        onClickZonePos17();
      } else if (cnt == 10) {
        onClickZonePos18();
      } else if (cnt == 11) {
        onClickZonePos19();
      } else if (cnt == 12) {
        onClickZonePos20();
      } else if (cnt == 13) {
        onClickZonePos21();
      } else if (cnt == 0) {
        onClickZonePos22();
      }
    };

    const onClickPrev = () => {
      var temp = onClickArrow - 1;
      if (onClickArrow == 0) {
        setOnClickArrow(13);
        temp = 13;
      } else {
        setOnClickArrow(onClickArrow - 1);
      }
      // console.log(temp);
      ArrowChangeZone(temp);
    };

    const onClickNext = () => {
      var temp = onClickArrow + 1;
      if (onClickArrow == 13) {
        setOnClickArrow(0);
        temp = 0;
      } else {
        setOnClickArrow(onClickArrow + 1);
      }
      // console.log(temp);
      ArrowChangeZone(temp);
    };

    //스캐너버튼 클릭시
    const onClickScanner = () => {
      var scanner = !onOffScanner;
      setOnOffScanner(scanner);
      mapConfig(new naver.maps.LatLng(sessionStorage.getItem("lat"), sessionStorage.getItem("lon")), scanner, onOffBound, Number(sessionStorage.getItem("zoom")));
    };

    //존버튼 클릭시
    const onClickZones = () => {
      setOnOffZone(!onOffZone);
    };

    //바운드버튼 클릭시
    const onClickBound = () => {
      var bound = !onOffBound;
      setOnOffBound(!onOffBound);
      mapConfig(new naver.maps.LatLng(sessionStorage.getItem("lat"), sessionStorage.getItem("lon")), onOffScanner, bound, Number(sessionStorage.getItem("zoom")));
    };

    //존 투어버튼 클릭시
    const onChangeZone = () => {
      var zone = !onchangeZone;
      setOnChangeZone(!onchangeZone);
      console.log(tourTimer, "start");
      if (zone) {
        clearInterval(Number(sessionStorage.getItem("tour", tourTimer))); // 다른 창에 갔다 올 때 세션에 저장된 투어 삭제
        tourTimer = setInterval(ChangeZone, 10000); // 10초 간격으로 존 표시영역변경
        sessionStorage.setItem("tour", tourTimer);
        setTours(tourTimer);
        console.log(tourTimer, "zone");
      } else {
        //clearInterval(tours);
        clearInterval(Number(sessionStorage.getItem("tour", tourTimer)));
        console.log(tourTimer, "clear");
      }
      console.log(tourTimer, "end");
    };

    const zonePoss = (lat, lon, zoom) => {
      sessionStorage.setItem("lat", lat);
      sessionStorage.setItem("lon", lon);
      sessionStorage.setItem("zoom", zoom);
      mapConfig(new naver.maps.LatLng(lat, lon), onOffScanner, onOffBound, zoom);
    };

    const onClickZonePos1 = (e) => {
      //황리단 중심1
      zonePoss(35.837865076402906, 129.20975070742932, 18);
    };
    const onClickZonePos2 = (e) => {
      //황리단 중심2
      zonePoss(35.83641772664928, 129.20956946605287, 18);
    };
    const onClickZonePos3 = (e) => {
      //황리단 중심3
      zonePoss(35.833941723885346, 129.20946758606377, 18);
    };
    const onClickZonePos4 = (e) => {
      //황리 북동
      zonePoss(35.835981903795464, 129.21195304644826, 18);
    };
    const onClickZonePos5 = (e) => {
      // 황리 동남
      zonePoss(35.83380721693253, 129.21212502399376, 18);
    };
    const onClickZonePos6 = (e) => {
      //황리 동
      zonePoss(35.83483041104162, 129.21478697840539, 18);
    };
    const onClickZonePos7 = (e) => {
      //황리 서
      zonePoss(35.836666537099184, 129.20804378934835, 18);
    };
    const onClickZonePos8 = (e) => {
      //황리 서남
      zonePoss(35.83428349727689, 129.2082764896501, 18);
    };
    const onClickZonePos9 = (e) => {
      //불국사
      zonePoss(35.7862720928056, 129.32887704033146, 18);
    };
    const onClickZonePos10 = (e) => {
      //석굴암
      zonePoss(35.7897363584415, 129.34948654558244, 18);
    };
    const onClickZonePos11 = (e) => {
      //봉황대
      zonePoss(35.8418396128661, 129.21114087085098, 18);
    };
    const onClickZonePos12 = (e) => {
      //동궁과월지
      zonePoss(35.8333411100388, 129.2267456294713, 18);
    };
    const onClickZonePos13 = (e) => {
      //첨성대
      zonePoss(35.834732295, 129.21760174006871, 18);
    };
    const onClickZonePos14 = (e) => {
      //교촌마을
      zonePoss(35.8295354455455, 129.2147365822213, 18);
    };
    const onClickZonePos15 = (e) => {
      //터미널
      zonePoss(35.8387029950045, 129.20411377849393, 18);
    };
    const onClickZonePos16 = (e) => {
      //황리단길 전체
      zonePoss(35.836147565167735, 129.21115263378698, 17);
    };
    const onClickZonePos17 = (e) => {
      //대릉원
      zonePoss(35.8377193328448, 129.212773131131, 17);
    };

    const onClickZonePos18 = (e) => {
      //국립경주박물관
      zonePoss(35.830571880281866, 129.22836664799445, 17);
    };
    const onClickZonePos19 = (e) => {
      //연꽃 단지
      zonePoss(35.83578771701733, 129.2230822233194, 17);
    };
    const onClickZonePos20 = (e) => {
      // 보문단지
      zonePoss(35.84537558450294, 129.2754849708075, 15);
    };
    const onClickZonePos21 = (e) => {
      // 신경주역
      zonePoss(35.798505702784915, 129.14013545029647, 17);
    };
    const onClickZonePos22 = (e) => {
      // 동부해안가
      zonePoss(35.73642736145261, 129.5036258960885, 12);
    };

    useEffect(() => {
      console.log("api 다시 받아오기");
      getAPIdata();
      getDeviceStatus2();
      setInterval(getAPIdata, 90000);

      setInterval(getDeviceStatus2, 180000);
    }, []);

    useEffect(() => {
      // API 새로 고침할때마다 지도 다시 그려줌
      mapConfig();
    }, [visitor1]);

    useEffect(() => {
      // 왼쪽 overlay 권역 클릭시 맵 위치 변경
      if (zoneSection == "황리단길 권역") {
        sessionStorage.setItem("lat", 35.836147565167735);
        sessionStorage.setItem("lon", 129.21115263378698);
        sessionStorage.setItem("zoom", 17);
        getDeviceStatus2();
        //mapConfig(new naver.maps.LatLng(35.836147565167735, 129.21115263378698), onOffScanner, onOffBound, 17);
        zonePoss(35.836147565167735, 129.21115263378698, 17);
      } else if (zoneSection == "동부사적지 권역") {
        zonePoss(35.834732295, 129.21760174006871, 17);
      } else if (zoneSection == "불국사 권역") {
        zonePoss(35.7862720928056, 129.32887704033146, 17);
      } else if (zoneSection == "경주 대릉원") {
        zonePoss(35.8377193328448, 129.212773131131, 17);
      } else if (zoneSection == "동궁과월지존") {
        zonePoss(35.834200647825405, 129.22679732081485, 18);
      } else if (zoneSection == "사적관리존") {
        zonePoss(35.83496723682759, 129.2186027783338, 17);
      } else if (zoneSection == "보문단지 일대") {
        zonePoss(35.84537558450294, 129.2754849708075, 15);
      } else if (zoneSection == "신경주역 일대") {
        zonePoss(35.798505702784915, 129.14013545029647, 17);
      } else if (zoneSection == "동부해안가 일대") {
        zonePoss(35.73642736145261, 129.5036258960885, 12);
      }
    }, [zoneSection]);

    return (
      <>
        <Script type={"text/javascript"} src={"https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=t0gdynkrzk&submodules=visualization"} onReady={mapConfig}></Script>{" "}
        <Mapp>
          <div id="map1" className="map"></div>

          <div className="overlaybtn">
            <div>
              <button className={onOffScanner ? "tourOff" : "tourOn"} onClick={onClickScanner}>
                {" "}
                scanner
              </button>
              <button className={onOffZone ? "tourOff" : "tourOn"} onClick={onClickZones}>
                {" "}
                zone
              </button>
              <button className={onOffBound ? "tourOff" : "tourOn"} onClick={onClickBound}>
                {" "}
                bound
              </button>
              <button className={onchangeZone ? "tourOff" : "tourOn"} onClick={onChangeZone}>
                {" "}
                tour
              </button>
            </div>
            {onOffZone ? (
              zoneSection == "황리단길 권역" ? (
                <div className="buttons">
                  <button className="button red" onClick={onClickZonePos1}>
                    {" "}
                    황리단길중심거리1
                  </button>
                  <button className="button or" onClick={onClickZonePos2}>
                    {" "}
                    황리단길중심거리2
                  </button>
                  <button className="button yl" onClick={onClickZonePos3}>
                    {" "}
                    황리단길중심거리3
                  </button>
                  <button className="button gr" onClick={onClickZonePos4}>
                    {" "}
                    황리단길북동
                  </button>
                  <button className="button blue" onClick={onClickZonePos5}>
                    {" "}
                    황리단길동남
                  </button>
                  <button className="button pu" onClick={onClickZonePos6}>
                    {" "}
                    황리단길동
                  </button>
                  <button className="button br" onClick={onClickZonePos7}>
                    {" "}
                    황리단길서
                  </button>
                  <button className="button blue" onClick={onClickZonePos8}>
                    {" "}
                    황리단길서남
                  </button>
                </div>
              ) : zoneSection == "불국사 권역" ? (
                <div className="buttons">
                  <button className="button red" onClick={onClickZonePos9}>
                    {" "}
                    불국사
                  </button>
                  <button className="button or" onClick={onClickZonePos10}>
                    {" "}
                    석굴암
                  </button>
                </div>
              ) : zoneSection == "동부사적지 권역" ? (
                <div className="buttons">
                  <button className="button yl" onClick={onClickZonePos11}>
                    {" "}
                    봉황대고분
                  </button>
                  <button className="button gr" onClick={onClickZonePos12}>
                    {" "}
                    동궁과월지
                  </button>
                  <button className="button blue" onClick={onClickZonePos13}>
                    {" "}
                    첨성대
                  </button>
                  <button className="button pu" onClick={onClickZonePos14}>
                    {" "}
                    교촌마을
                  </button>
                  <button className="button br" onClick={onClickZonePos15}>
                    {" "}
                    경주터미널
                  </button>
                </div>
              ) : zoneSection == "경주 대릉원" ? (
                <div className="buttons">
                  <button className="button yl" onClick={onClickZonePos17}>
                    {" "}
                    대릉원
                  </button>
                </div>
              ) : zoneSection == "동궁과월지존" ? (
                <div className="buttons">
                  <button className="button gr" onClick={onClickZonePos12}>
                    {" "}
                    동궁과월지
                  </button>
                </div>
              ) : zoneSection == "보문단지 일대" ? (
                <div className="buttons">
                  <button className="button yl" onClick={onClickZonePos20}>
                    {" "}
                    보문단지
                  </button>
                </div>
              ) : zoneSection == "신경주역 일대" ? (
                <div className="buttons">
                  <button className="button red" onClick={onClickZonePos21}>
                    {" "}
                    신경주역
                  </button>
                </div>
              ) : zoneSection == "동부해안가 일대" ? (
                <div className="buttons">
                  <button className="button or" onClick={onClickZonePos22}>
                    {" "}
                    동부해안가
                  </button>
                </div>
              ) : (
                <div className="buttons">
                  <button className="button blue" onClick={onClickZonePos13}>
                    {" "}
                    첨성대
                  </button>
                  <button className="button or" onClick={onClickZonePos18}>
                    {" "}
                    경주국립박물관
                  </button>
                  <button className="button red" onClick={onClickZonePos19}>
                    {" "}
                    연꽃단지
                  </button>
                </div>
              )
            ) : (
              ""
            )}
          </div>
          <div className="arrowbtnprev">
            <Image className="prev" src={previcon} onClick={onClickPrev}></Image>
          </div>
          <div className="arrowbtnnext">
            <Image className="next" src={nexticon} onClick={onClickNext}></Image>
          </div>
        </Mapp>
      </>
    );
  };

  const Home = () => {
    // 황리단길
    const [allWeekInfoHD, setAllWeekInfoHD] = useState([0, 0, 0, 0, 0, 0, 0]); //BarChart 용
    const [lastWeekRevisitHD, setLastWeekRevisitHD] = useState([0, 0, 0, 0, 0, 0, 0, 0]); // LineChart 용
    const [todayCurrentVisitorChartDatasHD, setTodayCurrentVisitorChartDatasHD] = useState([0, 0, 0, 0, 0, 0, 0, 0]); // DoughnutChart 용
    // 동부사적지
    const [allWeekInfoDB, setAllWeekInfoDB] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitDB, setLastWeekRevisitDB] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasDB, setTodayCurrentVisitorChartDatasDB] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    // 불국사
    const [allWeekInfoBG, setAllWeekInfoBG] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitBG, setLastWeekRevisitBG] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasBG, setTodayCurrentVisitorChartDatasBG] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    // 대릉원
    const [allWeekInfoDR, setAllWeekInfoDR] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitDR, setLastWeekRevisitDR] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasDR, setTodayCurrentVisitorChartDatasDR] = useState([0]);
    // 동궁과월지
    const [allWeekInfoDG, setAllWeekInfoDG] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitDG, setLastWeekRevisitDG] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasDG, setTodayCurrentVisitorChartDatasDG] = useState([0]);
    // 사적관리
    const [allWeekInfoSG, setAllWeekInfoSG] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitSG, setLastWeekRevisitSG] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasSG, setTodayCurrentVisitorChartDatasSG] = useState([0, 0, 0]);
    // 신경주역
    const [allWeekInfoGY, setAllWeekInfoGY] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitGY, setLastWeekRevisitGY] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasGY, setTodayCurrentVisitorChartDatasGY] = useState([0, 0, 0]);

    // 보문단지
    const [allWeekInfoBM, setAllWeekInfoBM] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitBM, setLastWeekRevisitBM] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasBM, setTodayCurrentVisitorChartDatasBM] = useState([0, 0, 0]);

    // 동부해안가
    const [allWeekInfoDH, setAllWeekInfoDH] = useState([0, 0, 0, 0, 0, 0, 0]);
    const [lastWeekRevisitDH, setLastWeekRevisitDH] = useState([0, 0, 0, 0, 0, 0, 0, 0]);
    const [todayCurrentVisitorChartDatasDH, setTodayCurrentVisitorChartDatasDH] = useState([0, 0, 0]);

    // 황리단길
    const [daylabelHD1, setDaylabelHD1] = useState([]);
    const [daylabelHD2, setDaylabelHD2] = useState([]);
    // 동부사적지
    const [daylabelDB1, setDaylabelDB1] = useState([]);
    const [daylabelDB2, setDaylabelDB2] = useState([]);
    // 불국사
    const [daylabelBG1, setDaylabelBG1] = useState([]);
    const [daylabelBG2, setDaylabelBG2] = useState([]);
    // 대릉원
    const [daylabelDR1, setDaylabelDR1] = useState([]);
    const [daylabelDR2, setDaylabelDR2] = useState([]);
    // 동궁과월지
    const [daylabelDG1, setDaylabelDG1] = useState([]);
    const [daylabelDG2, setDaylabelDG2] = useState([]);
    // 사적관리
    const [daylabelSG1, setDaylabelSG1] = useState([]);
    const [daylabelSG2, setDaylabelSG2] = useState([]);
    // 신경주역
    const [daylabelGY1, setDaylabelGY1] = useState([]);
    const [daylabelGY2, setDaylabelGY2] = useState([]);
    //보문단지
    const [daylabelBM1, setDaylabelBM1] = useState([]);
    const [daylabelBM2, setDaylabelBM2] = useState([]);
    // 동부해안가
    const [daylabelDH1, setDaylabelDH1] = useState([]);
    const [daylabelDH2, setDaylabelDH2] = useState([]);

    const pielabelHD = ["중심1", "중심2", "중심3", "북동", "동남", "동", "서", "서남"];
    const pielabelDB = ["봉황대고분존", "동궁과월지존", "첨성대존", "교촌마을존", "경주 터미널 온누리 약국 앞"];
    const pielabelBG = ["불국사", "석굴암"];
    const pielabelSG = ["첨성대", "연꽃단지", "국립경주박물관"];
    const pielabelDH = ["고아라해변", "나정해변", "읍천항"];
    //황리단길
    const zoneHD = ["황리단길 중심거리 1", "황리단길 중심거리 2", "황리단길 중심거리 3", "황리단길 북동", "황리단길 동남", "황리단길 동", "황리단길 서", "황리단길 서남"];
    //동부사적지
    const zoneDB = ["봉황대고분존", "동궁과월지존", "첨성대존", "교촌마을존", "경주 터미널 온누리 약국 앞"];
    //불국사존
    const zoneBG = ["불국사존", "석굴암존"];
    //대릉원
    const zoneDR = ["경주 대릉원"];
    //동궁과월지
    const zoneDG = ["동궁과월지존"];
    //사적관리
    const zoneSG = ["첨성대존", "연꽃단지", "국립경주박물관"];
    // 신경주역
    const zoneGY = ["신경주역 일대"];
    // 보문단지
    const zoneBM = ["보문단지 일대"];
    // 동부해안가
    const zoneDH = ["동부해안가 일대"];

    useEffect(() => {
      if (!(me && me.id)) {
        Router.replace("/login");
      }
    }, [me && me.id]);

    const getAPIdata1 = async () => {
      //지난주 방문객 추이

      try {
        const response1 = await axios.get(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=` + ago7day + "&to=" + today);
        console.log("지난주 방문객 추이", `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountDay?from=` + ago7day + "&to=" + today);

        // 황리단길
        var zone_allHD = [];
        var dayLabelHD = [];
        var dayVisitHD = [];
        // 동부사적지
        var zone_allDB = [];
        var dayLabelDB = [];
        var dayVisitDB = [];
        // 불국사
        var zone_allBG = [];
        var dayLabelBG = [];
        var dayVisitBG = [];
        // 대릉원
        var zone_allDR = [];
        var dayLabelDR = [];
        var dayVisitDR = [];
        // 동궁과월지
        var zone_allDG = [];
        var dayLabelDG = [];
        var dayVisitDG = [];
        // 사적관리
        var zone_allSG = [];
        var dayLabelSG = [];
        var dayVisitSG = [];
        //신경주역
        var zone_allGY = [];
        var dayLabelGY = [];
        var dayVisitGY = [];
        // 보문단지
        var zone_allBM = [];
        var dayLabelBM = [];
        var dayVisitBM = [];
        // 동부해안가
        var zone_allDH = [];
        var dayLabelDH = [];
        var dayVisitDH = [];

        for (let i of response1.data) {
          if (i.zone == "황리단길 권역") {
            dayVisitHD.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "동부사적지 권역") {
            dayVisitDB.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "불국사 권역") {
            dayVisitBG.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "경주 대릉원") {
            dayVisitDR.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "동궁과월지존") {
            dayVisitDG.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "사적관리존") {
            dayVisitSG.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "신경주역 일대") {
            dayVisitGY.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "보문단지 일대") {
            dayVisitBM.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "동부해안가 일대") {
            dayVisitDH.push([i.data, i.time.slice(5, 10)]);
          }
        }

        dayVisitHD.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitDB.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitBG.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitDR.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitDG.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitSG.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitGY.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitBM.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayVisitDH.sort((a, b) => new Date(a[1]) - new Date(b[1]));

        //중복제거 함수
        const samedelete = (arr) => {
          var data = []; //값
          var day = []; //날짜
          for (let i = 0; i < arr.length; i++) {
            if (day.includes(arr[i][1])) {
              continue;
            }
            data.push(arr[i]);
            day.push(arr[i][1]);
          }
          return data;

          //console.log('a',day, data)
        };

        var NdayVisitHD = samedelete(dayVisitHD);
        var NdayVisitDB = samedelete(dayVisitDB);
        var NdayVisitBG = samedelete(dayVisitBG);
        var NdayVisitDR = samedelete(dayVisitDR);
        var NdayVisitDG = samedelete(dayVisitDG);
        var NdayVisitSG = samedelete(dayVisitSG);
        var NdayVisitGY = samedelete(dayVisitGY);
        var NdayVisitBM = samedelete(dayVisitBM);
        var NdayVisitDH = samedelete(dayVisitDH);
        //console.log('NdayVisitDR',NdayVisitDR);

        for (let i = 0; i < NdayVisitHD.length; i++) {
          zone_allHD.push(NdayVisitHD[i][0]);
          dayLabelHD.push(NdayVisitHD[i][1]);
        }
        for (let i = 0; i < NdayVisitDB.length; i++) {
          zone_allDB.push(NdayVisitDB[i][0]);
          dayLabelDB.push(NdayVisitDB[i][1]);
          // console.log(dayVisitDB[i][0],dayVisitDB[i][1])
        }
        for (let i = 0; i < NdayVisitBG.length; i++) {
          zone_allBG.push(NdayVisitBG[i][0]);
          dayLabelBG.push(NdayVisitBG[i][1]);
        }
        for (let i = 0; i < NdayVisitDR.length; i++) {
          zone_allDR.push(NdayVisitDR[i][0]);
          dayLabelDR.push(NdayVisitDR[i][1]);
        }
        for (let i = 0; i < NdayVisitDG.length; i++) {
          zone_allDG.push(NdayVisitDG[i][0]);
          dayLabelDG.push(NdayVisitDG[i][1]);
        }
        for (let i = 0; i < NdayVisitSG.length; i++) {
          zone_allSG.push(NdayVisitSG[i][0]);
          dayLabelSG.push(NdayVisitSG[i][1]);
        }
        for (let i = 0; i < NdayVisitGY.length; i++) {
          zone_allGY.push(NdayVisitGY[i][0]);
          dayLabelGY.push(NdayVisitGY[i][1]);
        }
        for (let i = 0; i < NdayVisitBM.length; i++) {
          zone_allBM.push(NdayVisitBM[i][0]);
          dayLabelBM.push(NdayVisitBM[i][1]);
        }
        for (let i = 0; i < NdayVisitDH.length; i++) {
          zone_allDH.push(NdayVisitDH[i][0]);
          dayLabelDH.push(NdayVisitDH[i][1]);
        }

        setAllWeekInfoHD(zone_allHD);
        setDaylabelHD1(dayLabelHD);

        setAllWeekInfoDB(zone_allDB);
        setDaylabelDB1(dayLabelDB);

        setAllWeekInfoBG(zone_allBG);
        setDaylabelBG1(dayLabelBG);

        setAllWeekInfoDR(zone_allDR);
        setDaylabelDR1(dayLabelDR);

        setAllWeekInfoDG(zone_allDG);
        setDaylabelDG1(dayLabelDG);

        setAllWeekInfoSG(zone_allSG);
        setDaylabelSG1(dayLabelSG);

        setAllWeekInfoGY(zone_allGY);
        setDaylabelGY1(dayLabelGY);

        setAllWeekInfoBM(zone_allBM);
        setDaylabelBM1(dayLabelBM);

        setAllWeekInfoDH(zone_allDH);
        setDaylabelDH1(dayLabelDH);
        //console.log(zone_allDR, dayLabelDR);
      } catch (err) {
        console.error(err);
        setTimeout(() => {
          getAPIdata1();
        }, 2000);
      }
    };

    const getAPIdata2 = async () => {
      // 현재존별방문객비율

      try {
        const response3 = await axios.get(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountHourly`);

        //const response3 = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountHourly`);

        //let resultList = [];
        var zoneDataHD = [];
        var zoneDataDB = [];
        var zoneDataBG = [];
        var zoneDataDR = [];
        var zoneDataDG = [];
        var zoneDataSG = [];
        var zoneDataGY = [];
        var zoneDataBM = [];
        var zoneDataDH = [];
        for (let i of response3.data) {
          const index1 = zoneHD.indexOf(i.zone_id);
          if (index1 !== -1) {
            zoneDataHD[index1] = i.data;
          }
          const index2 = zoneDB.indexOf(i.zone_id);
          if (index2 !== -1) {
            zoneDataDB[index2] = i.data;
          }
          const index3 = zoneBG.indexOf(i.zone_id);
          if (index3 !== -1) {
            zoneDataBG[index3] = i.data;
          }
          const index4 = zoneDR.indexOf(i.zone_id);
          if (index4 !== -1) {
            zoneDataDR[index4] = i.data;
          }
          const index5 = zoneDG.indexOf(i.zone_id);
          if (index5 !== -1) {
            zoneDataDG[index5] = i.data;
          }
          const index6 = zoneSG.indexOf(i.zone_id);
          if (index6 !== -1) {
            zoneDataSG[index6] = i.data;
          }
          const index7 = zoneGY.indexOf(i.zone_id);
          if (index7 !== -1) {
            zoneDataGY[index7] = i.data;
          }
          const index8 = zoneBM.indexOf(i.zone_id);
          if (index8 !== -1) {
            zoneDataBM[index8] = i.data;
          }
          const index9 = zoneDH.indexOf(i.zone_id);
          if (index9 !== -1) {
            zoneDataDH[index9] = i.data;
          }
        }

        setTodayCurrentVisitorChartDatasHD(zoneDataHD);
        setTodayCurrentVisitorChartDatasDB(zoneDataDB);
        setTodayCurrentVisitorChartDatasBG(zoneDataBG);
        setTodayCurrentVisitorChartDatasDR(zoneDataDR);
        setTodayCurrentVisitorChartDatasDG(zoneDataDG);
        setTodayCurrentVisitorChartDatasSG(zoneDataSG);
        //console.log('pie',zoneDataBG);
      } catch (err) {
        console.error(err);
        setTimeout(() => {
          getAPIdata2();
        }, 2000);
      }
    };

    const getAPIdata3 = async () => {
      // 지난주 재방문객
      try {
        //const response4 = await axios.get(`http://54.180.158.22:8000/v1/Gasi/DeviceCountRevisit?from=2021-10-01&to=2021-10-07`);
        const response4 = await axios.get(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountRevisit?from=` + ago7day + "&to=" + today);
        console.log("지난주 재방문객 api", `${process.env.NEXT_PUBLIC_API_GJ_URL}/DeviceCountRevisit?from=` + ago7day + "&to=" + today);

        var day_allHD = [];
        var dayLabelsHD = [];
        var dayReVisitHD = [];

        var day_allDB = [];
        var dayLabelsDB = [];
        var dayReVisitDB = [];

        var day_allBG = [];
        var dayLabelsBG = [];
        var dayReVisitBG = [];

        var day_allDR = [];
        var dayLabelsDR = [];
        var dayReVisitDR = [];

        var day_allDG = [];
        var dayLabelsDG = [];
        var dayReVisitDG = [];

        var day_allSG = [];
        var dayLabelsSG = [];
        var dayReVisitSG = [];

        var day_allGY = [];
        var dayLabelsGY = [];
        var dayReVisitGY = [];

        var day_allBM = [];
        var dayLabelsBM = [];
        var dayReVisitBM = [];

        var day_allDH = [];
        var dayLabelsDH = [];
        var dayReVisitDH = [];

        for (let i of response4.data) {
          if (i.zone == "황리단길 권역") {
            dayReVisitHD.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "동부사적지 권역") {
            dayReVisitDB.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "불국사 권역") {
            dayReVisitBG.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "경주 대릉원") {
            dayReVisitDR.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "동궁과월지존") {
            dayReVisitDG.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "사적관리존") {
            dayReVisitSG.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "신경주역 일대") {
            dayReVisitGY.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "보문단지 일대") {
            dayReVisitBM.push([i.data, i.time.slice(5, 10)]);
          } else if (i.zone == "동부해안가 일대") {
            dayReVisitDH.push([i.data, i.time.slice(5, 10)]);
          }
        }

        dayReVisitHD.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitDB.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitBG.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitDR.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitDG.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitSG.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitGY.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitBM.sort((a, b) => new Date(a[1]) - new Date(b[1]));
        dayReVisitDH.sort((a, b) => new Date(a[1]) - new Date(b[1]));

        for (let i = 0; i < dayReVisitHD.length; i++) {
          day_allHD.push(dayReVisitHD[i][0]);
          dayLabelsHD.push(dayReVisitHD[i][1]);
        }
        for (let i = 0; i < dayReVisitDB.length; i++) {
          day_allDB.push(dayReVisitDB[i][0]);
          dayLabelsDB.push(dayReVisitDB[i][1]);
        }
        for (let i = 0; i < dayReVisitBG.length; i++) {
          day_allBG.push(dayReVisitBG[i][0]);
          dayLabelsBG.push(dayReVisitBG[i][1]);
        }
        for (let i = 0; i < dayReVisitDR.length; i++) {
          day_allDR.push(dayReVisitDR[i][0]);
          dayLabelsDR.push(dayReVisitDR[i][1]);
        }
        for (let i = 0; i < dayReVisitDG.length; i++) {
          day_allDG.push(dayReVisitDG[i][0]);
          dayLabelsDG.push(dayReVisitDG[i][1]);
        }
        for (let i = 0; i < dayReVisitSG.length; i++) {
          day_allSG.push(dayReVisitSG[i][0]);
          dayLabelsSG.push(dayReVisitSG[i][1]);
        }
        for (let i = 0; i < dayReVisitGY.length; i++) {
          day_allGY.push(dayReVisitGY[i][0]);
          dayLabelsGY.push(dayReVisitGY[i][1]);
        }
        for (let i = 0; i < dayReVisitBM.length; i++) {
          day_allBM.push(dayReVisitBM[i][0]);
          dayLabelsBM.push(dayReVisitBM[i][1]);
        }
        for (let i = 0; i < dayReVisitDH.length; i++) {
          day_allDH.push(dayReVisitDH[i][0]);
          dayLabelsDH.push(dayReVisitDH[i][1]);
        }
        setLastWeekRevisitHD(day_allHD);
        setDaylabelHD2(dayLabelsHD);

        setLastWeekRevisitDB(day_allDB);
        setDaylabelDB2(dayLabelsDB);

        setLastWeekRevisitBG(day_allBG);
        setDaylabelBG2(dayLabelsBG);

        setLastWeekRevisitDR(day_allDR);
        setDaylabelDR2(dayLabelsDR);

        setLastWeekRevisitDG(day_allDG);
        setDaylabelDG2(dayLabelsDG);

        setLastWeekRevisitSG(day_allSG);
        setDaylabelSG2(dayLabelsSG);

        setLastWeekRevisitGY(day_allGY);
        setDaylabelGY2(dayLabelsGY);

        setLastWeekRevisitBM(day_allBM);
        setDaylabelBM2(dayLabelsBM);

        setLastWeekRevisitBM(day_allBM);
        setDaylabelBM2(dayLabelsBM);
      } catch (err) {
        console.error(err);
        setTimeout(() => {
          getAPIdata3();
        }, 2000);
      }
    };

    useEffect(() => {
      getAPIdata1();
      getAPIdata2();
      getAPIdata3();
      setInterval(getAPIdata1, 900000);
      setInterval(getAPIdata2, 900000);
      setInterval(getAPIdata3, 900000);
    }, []);

    return (
      <Background>
        <div className="lightback">
          <Header />
          <Nav value={"1"} />
          <div className="iframeBox">
            <Map className="iframe" zonesections={zoneSection} />
          </div>
          <div className="overlayleft">
            <div className="overlaydash">
              <div className="infotitle">권역 전체 방문객</div>
              <DashTotalInfo theme={me ? me.theme : ""} zone={"경주 전체"} />
              <div className="infotitle">권역별 방문객</div>
              <div className="zoneleft">
                {/* 황리단길 */}
                <button className="zone zoneNotSelct" onClick={zoneSection == "황리단길 권역" ? () => setZoneSection("신경주역 일대") : () => setZoneSection("황리단길 권역")}>
                  {" "}
                  {zoneSection == "황리단길 권역" ? "신경주역 일대" : "황리단길"}{" "}
                </button>
                {/* 동부사적지 */}
                <button className="zone zoneNotSelct" onClick={zoneSection == "동부사적지 권역" ? () => setZoneSection("동궁과월지존") : () => setZoneSection("동부사적지 권역")}>
                  {" "}
                  {zoneSection == "동부사적지 권역" ? "보문단지 일대" : "동부사적지"}{" "}
                </button>
                {/* 불국사 */}
                <button className="zone zoneNotSelct" onClick={zoneSection == "불국사 권역" ? () => setZoneSection("동부해안가 일대") : () => setZoneSection("불국사 권역")}>
                  {" "}
                  {zoneSection == "불국사 권역" ? "동부해안가 일대" : "불국사"}{" "}
                </button>
                {/* 대릉원 */}
                <button className="zone zoneNotSelct" onClick={zoneSection == "경주 대릉원" ? () => setZoneSection("신경주역 일대") : () => setZoneSection("경주 대릉원")}>
                  {" "}
                  {zoneSection == "경주 대릉원" ? "신경주역 일대" : "대릉원"}{" "}
                </button>
                {/* 동궁과월지 */}
                <button className="zone zoneNotSelct" onClick={zoneSection == "동궁과월지존" ? () => setZoneSection("보문단지 일대") : () => setZoneSection("동궁과월지존")}>
                  {" "}
                  {zoneSection == "동궁과월지존" ? "보문단지 일대" : "동궁과월지"}{" "}
                </button>
                {/* 사적관리 */}
                <button className="zone zoneNotSelct" onClick={zoneSection == "사적관리존" ? () => setZoneSection("동부해안가 일대") : () => setZoneSection("사적관리존")}>
                  {" "}
                  {zoneSection == "사적관리존" ? "동부해안가 일대" : "사적관리존"}{" "}
                </button>
                {/* 신경주역 */}
                <button
                  className={zoneSection == "황리단길 권역" || zoneSection == "경주 대릉원" || zoneSection == "신경주역 일대" ? "zone zoneSelct" : "zone zoneNotSelct"}
                  onClick={
                    zoneSection === "황리단길 권역"
                      ? () => setZoneSection("황리단길 권역")
                      : zoneSection === "경주 대릉원"
                      ? () => setZoneSection("경주 대릉원")
                      : () => setZoneSection("신경주역 일대")
                  }
                >
                  {" "}
                  {zoneSection === "황리단길 권역" ? "황리단길" : zoneSection === "경주 대릉원" ? "대릉원" : zoneSection === "신경주역 일대" ? "신경주역 일대" : "신경주역 일대"}
                </button>
                {/* 보문단지 */}
                <button
                  className={zoneSection == "동부사적지 권역" || zoneSection == "동궁과월지존" || zoneSection == "보문단지 일대" ? "zone zoneSelct" : "zone zoneNotSelct"}
                  onClick={
                    zoneSection === "동부사적지 권역"
                      ? () => setZoneSection("동부사적지 권역")
                      : zoneSection === "동궁과월지존"
                      ? () => setZoneSection("동궁과월지존")
                      : () => setZoneSection("보문단지 일대")
                  }
                >
                  {" "}
                  {zoneSection === "동부사적지 권역" ? "동부사적지" : zoneSection === "동궁과월지존" ? "동궁과월지" : zoneSection === "보문단지 일대" ? "보문단지 일대" : "보문단지 일대"}
                </button>
                {/* 동부해안가 */}
                <button
                  className={zoneSection == "사적관리존" || zoneSection == "불국사 권역" || zoneSection == "동부해안가 일대" ? "zone zoneSelct" : "zone zoneNotSelct"}
                  onClick={
                    zoneSection == "불국사 권역" ? () => setZoneSection("불국사 권역") : zoneSection === "사적관리존" ? () => setZoneSection("사적관리존") : () => setZoneSection("동부해안가 일대")
                  }
                >
                  {" "}
                  {zoneSection == "불국사 권역" ? "불국사" : zoneSection === "사적관리존" ? "사적관리존" : zoneSection === "동부해안가 일대" ? "동부해안가 일대" : "동부해안가 일대"}{" "}
                </button>
              </div>
              <DashAreaInfo theme={me ? me.theme : ""} zone={zoneSection} />
              <DashSoleInfo zone={zoneSection} scanners={scanners} zonedatas={zonedatas} />
            </div>
          </div>
          <div className="overlayright">
            <div className="overlaychart">
              <br />
              <div>
                <div className="charttitle">
                  <Image src={charticon} width={10} height={10} />{" "}
                  {zoneSection == "황리단길 권역"
                    ? "황리단길 "
                    : zoneSection == "동부사적지 권역"
                    ? "동부사적지 "
                    : zoneSection == "불국사 권역"
                    ? "불국사 및 석굴암 "
                    : zoneSection == "경주 대릉원"
                    ? "대릉원 "
                    : zoneSection == "동궁과월지존"
                    ? "동궁과월지 "
                    : zoneSection == "신경주역 일대"
                    ? "신경주역 일대 "
                    : zoneSection == "보문단지 일대"
                    ? "보문단지 일대 "
                    : zoneSection == "동부해안가 일대"
                    ? "동부해안가 일대 "
                    : "사적관리"}
                  방문객 추이{" "}
                </div>
                <BarChart
                  className="chart"
                  datas={
                    zoneSection == "황리단길 권역"
                      ? allWeekInfoHD
                      : zoneSection == "동부사적지 권역"
                      ? allWeekInfoDB
                      : zoneSection == "불국사 권역"
                      ? allWeekInfoBG
                      : zoneSection == "경주 대릉원"
                      ? allWeekInfoDR
                      : zoneSection == "동궁과월지존"
                      ? allWeekInfoDG
                      : zoneSection == "신경주역 일대"
                      ? allWeekInfoGY
                      : zoneSection == "보문단지 일대"
                      ? allWeekInfoBM
                      : zoneSection == "동부해안가 일대"
                      ? allWeekInfoDH
                      : allWeekInfoSG
                  }
                  daylabel={
                    zoneSection == "황리단길 권역"
                      ? daylabelHD1
                      : zoneSection == "동부사적지 권역"
                      ? daylabelDB1
                      : zoneSection == "불국사 권역"
                      ? daylabelBG1
                      : zoneSection == "경주 대릉원"
                      ? daylabelDR1
                      : zoneSection == "동궁과월지존"
                      ? daylabelDG1
                      : zoneSection == "사적관리존"
                      ? daylabelSG1
                      : zoneSection == "신경주역 일대"
                      ? daylabelGY1
                      : zoneSection == "보문단지 일대"
                      ? daylabelBM1
                      : zoneSection == "동부해안가 일대"
                      ? daylabelDH1
                      : daylabelSG1
                  }
                />
              </div>
              <br />
              <div>
                <div className="charttitle">
                  <Image src={charticon} width={10} height={10} />{" "}
                  {zoneSection == "황리단길 권역"
                    ? "황리단길 "
                    : zoneSection == "동부사적지 권역"
                    ? "동부사적지 "
                    : zoneSection == "불국사 권역"
                    ? "불국사 및 석굴암 "
                    : zoneSection == "경주 대릉원"
                    ? "대릉원 "
                    : zoneSection == "동궁과월지존"
                    ? "동궁과월지 "
                    : zoneSection == "신경주역 일대"
                    ? "신경주역 일대 "
                    : zoneSection == "보문단지 일대"
                    ? "보문단지 일대 "
                    : zoneSection == "동부해안가 일대"
                    ? "동부해안가 일대 "
                    : "사적관리 "}
                  재방문객 추이{" "}
                </div>
                <LineChart
                  className="chart"
                  datas={
                    zoneSection == "황리단길 권역"
                      ? lastWeekRevisitHD
                      : zoneSection == "동부사적지 권역"
                      ? lastWeekRevisitDB
                      : zoneSection == "불국사 권역"
                      ? lastWeekRevisitBG
                      : zoneSection == "경주 대릉원"
                      ? lastWeekRevisitDR
                      : zoneSection == "동궁과월지존"
                      ? lastWeekRevisitDG
                      : zoneSection == "사적관리존"
                      ? lastWeekRevisitSG
                      : zoneSection == "신경주역 일대"
                      ? lastWeekRevisitGY
                      : zoneSection == "보문단지 일대"
                      ? lastWeekRevisitBM
                      : zoneSection == "동부해안가 일대"
                      ? lastWeekRevisitDH
                      : lastWeekRevisitSG
                  }
                  daylabel={
                    zoneSection == "황리단길 권역"
                      ? daylabelHD2
                      : zoneSection == "동부사적지 권역"
                      ? daylabelDB2
                      : zoneSection == "불국사 권역"
                      ? daylabelBG2
                      : zoneSection == "경주 대릉원"
                      ? daylabelDR2
                      : zoneSection == "동궁과월지존"
                      ? daylabelDG2
                      : zoneSection == "사적관리"
                      ? daylabelSG2
                      : zoneSection == "신경주역 일대"
                      ? daylabelGY2
                      : zoneSection == "보문단지 일대"
                      ? daylabelBM2
                      : zoneSection == "동부해안가 일대"
                      ? daylabelDH2
                      : daylabelSG2
                  }
                />
              </div>
              <br />
              {zoneSection == "경주 대릉원" || zoneSection == "동궁과월지존" || zoneSection == "보문단지 일대" || zoneSection == "신경주역 일대" || zoneSection == "동부해안가 일대" ? (
                ""
              ) : (
                <div>
                  <div className="charttitle">
                    <Image src={charticon} width={10} height={10} />{" "}
                    {zoneSection == "황리단길 권역"
                      ? "황리단길 "
                      : zoneSection == "동부사적지 권역"
                      ? "동부사적지 "
                      : zoneSection == "불국사 권역"
                      ? "불국사 및 석굴암 "
                      : zoneSection == "경주 대릉원"
                      ? "대릉원 "
                      : zoneSection == "동궁과월지존"
                      ? "동궁과월지 일대 "
                      : ""}
                    실시간 방문객{" "}
                  </div>
                  <div className="chartd">
                    <DoughnutChart
                      datas={
                        zoneSection == "황리단길 권역"
                          ? todayCurrentVisitorChartDatasHD
                          : zoneSection == "동부사적지 권역"
                          ? todayCurrentVisitorChartDatasDB
                          : zoneSection == "불국사 권역"
                          ? todayCurrentVisitorChartDatasBG
                          : ""
                      }
                      label={zoneSection == "황리단길 권역" ? pielabelHD : zoneSection == "동부사적지 권역" ? pielabelDB : zoneSection == "불국사 권역" ? pielabelBG : ""}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Background>
    );
  };

  return <Home />;
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  const cookie = req ? req.headers.cookie : "";
  //쿠키 공유되는 문제 해결
  axios.defaults.headers.Cookie = "";
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_ZONELISTS_REQUEST,
  });
  store.dispatch({
    type: LOAD_SCANNERLISTS_REQUEST,
  });
  store.dispatch({
    type: LOAD_ZONELISTS_HISTORY_REQUEST,
  });
  store.dispatch({
    type: LOAD_SCANNERLISTS_HISTORY_REQUEST,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
});
export default Dash;
//export default Map;
