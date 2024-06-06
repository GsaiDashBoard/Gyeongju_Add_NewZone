import React, { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import axios from "axios";
import Router from "next/router";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { END } from "redux-saga";
import warning from "../../public/images/warning.png"
import danger from "../../public/images/danger.png"
//import dangerAudio from "../../public/sound/danger.wav"

import Header from "../../components/common/Header";
import Nav from "../../components/common/Nav";
import DoughnutChart from  "../../components/charts/densityDoughnutChart"
import BarChart from "../../components/charts/densityBarChart";
import charticon from "../../public/images/chart_icon.png";
import redcircle from "../../public/images/redcircle.png";
import orangecircle from "../../public/images/orangecircle.png";
import greencircle from "../../public/images/greencircle.png";
import bluecircle from "../../public/images/bluecircle.png";
import infopng from "../../public/images/infopng.png";

import { LOAD_MY_INFO_REQUEST } from "../../reducers/auth";
import {
  LOAD_ZONELISTS_REQUEST,
  LOAD_SCANNERLISTS_REQUEST,
  LOAD_ZONELISTS_HISTORY_REQUEST,
  LOAD_SCANNERLISTS_HISTORY_REQUEST,
} from "../../reducers/scanner";
import wrapper from "../../store/configureStore";
import Script from "next/script";
import styled from "styled-components";


//지도 css
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
    display: inline-block;
    text-align: center;
    font-weight: bolder;
    font-size:13pt;
    color: white;
    //text-shadow: -0.5px 0 #000, 0 0.5px #000, 0.5px 0 #000, 0 -0.5px #000;
    
  }
  
   .blue {
    background: rgba(0,112,192,0.8);
  }
  .br {
    background: rgba(172,145,115,0.8);
  }
  .gr {
    background: rgba(7,154,62,0.8);
  }
  .or {
    background: rgba(235,97,0,0.8);
  }
  .pu {
    background: rgba(112,0,236,0.8);
  }
  .yl {
    background: rgba(242,236,0,0.8);
  }
  .red {
    background: rgba(236,0,0,0.8);
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
    left: 455px;
    display:grid;
  }
  .arrowbtnnext {
    position:absolute;
    top: 50%;
    right: 435px;
    display:grid;
  }
  .prev {
    heigth:5px;
  }
`;

//대시보드 전체 css
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
  .overlay {
    position:absolute;
    top:142px;
    right: 0;
    display: grid;
    width: 450px;
    height: 820px;
    background: rgba(255,255,255,0.9);  
  }
  .overlaydash {
    width: 450px;
    height: 820px;
    right: 0;
    //background: rgba(255,255,255,0.7);
    transform: translate(0px, 0px);
    transition-duration: 0.5s;
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
 

  .scannerbtn {
    margin: 30px;
  }
  .zoneleft{
    margin: 0;
    //margin-left: 11px;
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
    width: 102.8px;
    margin:  3px 1px 0 1px;
    text-align: center;
  }


  
  .total2 {
    margin-bottom: 0;
  }
  
  .infotitle {
    margin-top: 20px;
    font-weight:bolder;
    font-size: 13.5pt;
    color: #303030;
    text-align: center;
  }

  .infoexplain {
    margin-top: 15px;
    margin-left : 40px;
    font-size: 10pt;
  }

  .popup {
    position:absolute;       
    width: 320px;
    height: 200px;
    background: rgba(255,255,255); 
    box-shadow: 0px 0px 10px gray;
    border-radius: 15px;
    text-align : center;
    font-weight:600;
    font-size:15pt;
  }

  .unpopup {
    display : none;
  }

  .location0 {
    top:20%;
    left: 15%;
  }

  .location1 {
    top:410px;
    left: 20px;
  }

  .location2 {
    top:200px;
    left: 20px;
  }

  .warnings {
    margin : 30px 10px 20px 60px;
  }

  .infopng {
    position:absolute;
    top:150px;
    right: 450px;
  }


`;

const Dash = () => {
  const dispatch = useDispatch();
  const [density, setDensity] = useState([0,0,0]);//밀집도
  const [visitor, setVisitor] = useState([0,0,0]);//방문객
  const [zoneNamess, setZoneNamess] = useState(["대릉원 후문", "대릉원 중심", "대릉원 정문", "동궁과월지", "첨성대", "경주국립박물관",  "연꽃단지"])
  const [warningState, setWarningState] = useState(false); //경고창 상태 후문
  const [dangerState, setDangerState] = useState(false); //위험창 상태
  const [warningZone, setWarningZone] = useState(""); //경고창 상태 후문
  const [dangerZone, setDangerZone] = useState(""); //위험창 상태
  const polygonColors = ['rgb(225, 0, 0)','rgb(225, 192, 0)','rgb(0, 176, 80)','rgb(0, 112, 192)']; // 폴리곤 색상

  const zoneState = [
    {zonename : "대릉원후문", zone : "경주 대릉원 밀집도 #1 G6 G7 G9", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path : [35.80314, 129.203376], textlocation : [35.839262, 129.211076]},
    {zonename : "대릉원중심", zone : "경주 대릉원 밀집도 #2 G10 G11 G12", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path : [35.837862, 129.210646], textlocation : [35.837862, 129.211646]},
    {zonename : "대릉원정문", zone : "경주 대릉원 밀집도 #3 G13 G14", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path :[35.836395, 129.212243], textlocation : [35.836395, 129.212843]},
    {zonename : "동궁과월지", zone : "동궁과월지존", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path :[35.835676, 129.226047], textlocation : [35.834676, 129.226047]},
    {zonename : "첨성대", zone : "첨성대존", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path :[35.834525, 129.218688], textlocation : [35.834525, 129.218488]},
    {zonename : "국립박물관", zone : "경주국립박물관", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path :[35.835855, 129.223922], textlocation : [35.835605, 129.223022]},
    {zonename : "연꽃단지", zone : "연꽃단지", warning : false, danger : false, polygoncolor:polygonColors[3], density : 0, visitor : 0, path :[35.830571, 129.228366], textlocation : [35.830311, 129.227666]},
  ]

  const [zoneStateNow, setZoneStateNow] = useState(zoneState);


  //const audio = new Audio('../../public/sound/danger.wav');




  
    
  const { me } = useSelector(
    (state) => state.auth
  );
  const { zonedatas } =
    useSelector((state) => state.scanner);

   
   const getAPIdata = async () => {
    const densityStandard = [10,6,2]

     /**
      * 밀집도 가져오기 고위험 >= 10 > 위험 >= 6 > 주의 >= 2 > 정상  
      */
     try {
       const responseToday = await axios.get(
         `${process.env.NEXT_PUBLIC_API_GJ_URL}/DensityZone`
       );

       let arrDensity = []; // 초기화
       let arrVisitor = []; // 초기화
       let zoneNames = [];
       let dangerZoneString = "";
       let warningZoneString = "";
       

       // 실시간 방문객 가져오기
       for (let i of responseToday.data) {
        for (let j of zoneState){
          if (i.zone_id == j.zone) {
            j.density = i.density;
            j.visitor = i.visitor;
            
            if(i.density >= densityStandard[0]) {
              j.danger = true;
              j.warning = false;
              j.polygoncolor = polygonColors[0];
              
            } else if(i.density >= densityStandard[1]) {
              j.danger = false;
              j.warning = true;
              j.polygoncolor = polygonColors[1];
              
            } else if(i.density >= densityStandard[2]) {
              j.danger = false;
              j.warning = false;
              j.polygoncolor = polygonColors[2];
            } else {
              j.danger = false;
              j.warning = false;
              j.polygoncolor = polygonColors[3];
            }
            break;
          }
        }
      }

      //밀집도 및 방문객 그래프 데이터 넣기
      for (let i of zoneState) {
        arrDensity.push(i.density);
        arrVisitor.push(i.visitor);
        zoneNames.push(i.zonename);
        if(i.danger){
          dangerZoneString = dangerZoneString + " " + i.zonename
        } else if (i.warning) {
          warningZoneString = warningZoneString + " " + i.zonename
        }
      }
      setZoneStateNow(zoneState);
      setDensity(arrDensity);
      setVisitor(arrVisitor);
      setZoneNamess(zoneNames);
      setDangerZone(dangerZoneString);
      setWarningZone(warningZoneString);
      setWarningState(warningZoneString);
      setDangerState(dangerZoneString);

      console.log('zoneNames',zoneNames);


     } catch (err) {
       console.error(err);
     }
   };



  const Map = () => {   

    /**
 * 지도설정

 */
    //지도에 맵 올리기
    const mapConfig = () => {
    console.log('맵 올리기');
      //getAPIdata();    

      var locationss = [
        sessionStorage.getItem("lat"),
        sessionStorage.getItem("lon"),
      ];

      var zoom = Number(sessionStorage.getItem("zoom"));

      //var zone = new naver.maps.LatLng(locationss[0],locationss[1]);
      //var zone = new naver.maps.LatLng(Number(locationss[0]),Number(locationss[1]));
      //var zone = new naver.maps.LatLng(35.8373556,129.2160087);
      var zone = new naver.maps.LatLng(35.834703, 129.220009);
      console.log(locationss)
      
      if (!locationss[0]) {
        //var zone = new naver.maps.LatLng(35.8373556, 129.2160087);
        var zone = new naver.maps.LatLng(35.833304, 129.227051);
        zoom = 17;
      }


      //맵 설정
      var map1 = new naver.maps.Map("map1", {
        center: zone,
        zoom: 16,
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



      var HOME_PATH = window.HOME_PATH || ".";

      //폴리곤 넣기
      var polygon;
      for (let i of zoneStateNow){
        if (i.zonename == '국립박물관' || i.zonename == '연꽃단지'){
          polygon = new naver.maps.Circle({
            map: map1,
            center: new naver.maps.LatLng(i.path[0],i.path[1]),
            radius: 30,
            fillColor: i.polygoncolor,
            fillOpacity: 0.3,
            strokeColor: i.polygoncolor,
            strokeOpacity: 0.6,
            strokeWeight: 3
          });
          continue;
        }
        //다각형 올리기
        else if( i.zonename == "대릉원후문"){
          polygon = new naver.maps.Polygon({
          map: map1,
          paths: i.path = [
            new naver.maps.LatLng(35.840314, 129.213376), new naver.maps.LatLng(35.839402, 129.209928),
            new naver.maps.LatLng(35.838527, 129.209874), new naver.maps.LatLng(35.837862, 129.210646),
            new naver.maps.LatLng(35.838842, 129.213650), new naver.maps.LatLng(35.840164, 129.213588)
        ],
          fillColor: i.polygoncolor,
          fillOpacity: 0.3,
          strokeColor: i.polygoncolor,
          strokeOpacity: 0.6,
          strokeWeight: 3
        })} else if( i.zonename == "대릉원중심"){
          polygon = new naver.maps.Polygon({
          map: map1,
          paths: i.path = [
            new naver.maps.LatLng(35.837862, 129.210646), new naver.maps.LatLng(35.836395, 129.212243),
            new naver.maps.LatLng(35.837095, 129.214083), new naver.maps.LatLng(35.837200, 129.214026),
            new naver.maps.LatLng(35.837806, 129.213681), new naver.maps.LatLng(35.838842, 129.213650),
          ],
          fillColor: i.polygoncolor,
          fillOpacity: 0.3,
          strokeColor: i.polygoncolor,
          strokeOpacity: 0.6,
          strokeWeight: 3
        })} else if( i.zonename == "대릉원정문"){
          polygon = new naver.maps.Polygon({
          map: map1,
          paths: i.path = [            
            new naver.maps.LatLng(35.836395, 129.212243), new naver.maps.LatLng(35.835890, 129.212802),
            new naver.maps.LatLng(35.835619, 129.213431), new naver.maps.LatLng(35.835521, 129.214958),
            new naver.maps.LatLng(35.834675, 129.215725), new naver.maps.LatLng(35.835134, 129.216253),
            new naver.maps.LatLng(35.835561, 129.215825), new naver.maps.LatLng(35.835990, 129.215066),
            new naver.maps.LatLng(35.836365, 129.214600), new naver.maps.LatLng(35.836665, 129.214300),
            new naver.maps.LatLng(35.837095, 129.214083)],
          fillColor: i.polygoncolor,
          fillOpacity: 0.3,
          strokeColor: i.polygoncolor,
          strokeOpacity: 0.6,
          strokeWeight: 3
        })} else if( i.zonename == "동궁과월지"){
          polygon = new naver.maps.Polygon({
          map: map1,
          paths: i.path = [
            new naver.maps.LatLng(35.835676, 129.226047), new naver.maps.LatLng(35.835624, 129.225946),
            new naver.maps.LatLng(35.835147, 129.225908), new naver.maps.LatLng(35.835117, 129.225846),
            new naver.maps.LatLng(35.834686, 129.225875), new naver.maps.LatLng(35.834668, 129.225988),
            new naver.maps.LatLng(35.834456, 129.225999), new naver.maps.LatLng(35.834367, 129.226068),
            new naver.maps.LatLng(35.833726, 129.226103), new naver.maps.LatLng(35.833533, 129.226305),
            new naver.maps.LatLng(35.833447, 129.226449), new naver.maps.LatLng(35.833357, 129.226450),
            new naver.maps.LatLng(35.833390, 129.226854), new naver.maps.LatLng(35.833476, 129.226840),
            new naver.maps.LatLng(35.833494, 129.227031), new naver.maps.LatLng(35.833535, 129.227024),
            new naver.maps.LatLng(35.833558, 129.227424), new naver.maps.LatLng(35.833486, 129.227424),
            new naver.maps.LatLng(35.833484, 129.228041), new naver.maps.LatLng(35.833697, 129.228085),
            new naver.maps.LatLng(35.833740, 129.228085), new naver.maps.LatLng(35.833740, 129.228031),
            new naver.maps.LatLng(35.833902, 129.227987), new naver.maps.LatLng(35.834000, 129.227900),
            new naver.maps.LatLng(35.834100, 129.227820), new naver.maps.LatLng(35.835060, 129.227730),
            new naver.maps.LatLng(35.835207, 129.228030), new naver.maps.LatLng(35.835407, 129.228030),
            new naver.maps.LatLng(35.835507, 129.227950), new naver.maps.LatLng(35.835535, 129.227850),
            new naver.maps.LatLng(35.835480, 129.227600), new naver.maps.LatLng(35.835490, 129.227420),
            new naver.maps.LatLng(35.835485, 129.227240), new naver.maps.LatLng(35.835510, 129.227070),
            new naver.maps.LatLng(35.835499, 129.226860), new naver.maps.LatLng(35.835520, 129.226790),
            new naver.maps.LatLng(35.835610, 129.226720), new naver.maps.LatLng(35.835690, 129.226550),
          ],
          fillColor: i.polygoncolor,
          fillOpacity: 0.3,
          strokeColor: i.polygoncolor,
          strokeOpacity: 0.6,
          strokeWeight: 3
        })} else if( i.zonename == "첨성대"){
          polygon = new naver.maps.Polygon({
          map: map1,
          paths: i.path = [
            new naver.maps.LatLng(35.834525, 129.218688), new naver.maps.LatLng(35.834635, 129.218600),
            new naver.maps.LatLng(35.834665, 129.218600), new naver.maps.LatLng(35.834785, 129.218700),
            new naver.maps.LatLng(35.834855, 129.218715), new naver.maps.LatLng(35.834920, 129.218790),
            new naver.maps.LatLng(35.834950, 129.219150), new naver.maps.LatLng(35.834910, 129.219210),
            new naver.maps.LatLng(35.834870, 129.219238), new naver.maps.LatLng(35.834840, 129.219325),
            new naver.maps.LatLng(35.834802, 129.219365), new naver.maps.LatLng(35.834700, 129.219400),
            new naver.maps.LatLng(35.834590, 129.219350), new naver.maps.LatLng(35.834450, 129.219100),
            new naver.maps.LatLng(35.834450, 129.218800),
        ],
          fillColor: i.polygoncolor,
          fillOpacity: 0.3,
          strokeColor: i.polygoncolor,
          strokeOpacity: 0.6,
          strokeWeight: 3
        })} 
      }

      //존이름 표시

        for (var i of zoneStateNow) {
          var text = new naver.maps.Marker({
            map: map1,
            position: new naver.maps.LatLng(i.textlocation[0], i.textlocation[1]),
            title: i.zonename,
            icon: {
              content:
                '<div style="text-align:center; font-size:13pt; color:' +
                i.polygoncolor +
                '; font-weight:bolder; text-shadow:1px 1px 1px #000;">' +
                i.zonename +
                "</div>",
            },
          });
        }    
      
    };    

    useEffect(() => {
      // API 새로 고침할때마다 지도 다시 그려줌
      mapConfig();
    }, [visitor]);




    return (
      <>

        <Script
          type={"text/javascript"}
          src={"https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=t0gdynkrzk&submodules=visualization"}
          onReady={mapConfig}
        ></Script>{" "}
        <Mapp>
          <div id="map1" className="map"></div>
        </Mapp>
      </>
    );
  };

  const Home = () => {    

    useEffect(() => {
      if (!(me && me.id)) {
        Router.replace("/login");
      }
    }, [me && me.id]);

    return (
      <Background>
        <div className="lightback">
          <Header />
          <Nav value={"3"} bottomValue={"7"} />
          <div className="iframeBox">
            <Map className="iframe"  />
          </div>
          <div className="infopng"><Image src={infopng} alt='123' width={300} height={30} /></div>
          <div className="overlay">
            <div className="overlaydash">
              <div>
              <div className="infotitle"><Image src={charticon} width={10} height={10} /> 구역별 현재 다중밀집도</div>
              <div className="infoexplain"> <Image src={redcircle} width={10} height={10} /> 고위험 <Image src={orangecircle} width={10} height={10} /> 위험 <Image src={greencircle} width={10} height={10} /> 보통 <Image src={bluecircle} width={10} height={10} /> 안전</div>
                <BarChart
                  className="chart"
                  datas={density}
                  daylabel={zoneNamess}
                />
                <div className="infotitle">
                  <Image src={charticon} width={10} height={10} /> 구역별 실시간 방문객 </div>
                <DoughnutChart
                  className="chart"
                  datas={visitor}
                  label={zoneNamess}
                />
              </div>              
            </div>
          </div>
          <div>
            {warningState ? <div className="popup location1" ><div className='warnings' ><Image src={warning} alt='123' width={240} height={70} /></div> {warningZone} 인원이 많습니다. </div> : ''}
            {dangerState ?<div className="popup location2" ><div className='warnings' ><Image src={danger} alt='123' width={240} height={70} /></div> {dangerZone} 인원이 너무 많습니다.</div> : ''}
         </div>
            {/* {warningState1 ? <div className="popup location1" onClick={openCloseWarning1}><div className='warnings' ><Image src={warning} alt='123' width={240} height={70} /></div>후문 구역 인원이 너무 많습니다.</div> : ''}
            {warningState2 ? <div className="popup location2" onClick={openCloseWarning2}><div className='warnings' ><Image src={warning} alt='123' width={240} height={70} /></div>중앙 구역 인원이 너무 많습니다.</div> : ''}         
            {warningState3 ? <div className="popup location3" onClick={openCloseWarning3}><div className='warnings' ><Image src={warning} alt='123' width={240} height={70} /></div>정문 구역 인원이 너무 많습니다.</div> : ''}  
            {dangerState1 ? <div className="popup location1" onClick={openCloseDanger1}><div className='warnings' ><Image src={danger} alt='123' width={240} height={70} /></div>후문 구역 인원이 너무 많습니다.</div> : ''}
            {dangerState2 ? <div className="popup location2" onClick={openCloseDanger2}><div className='warnings' ><Image src={danger} alt='123' width={240} height={70} /></div>중앙 구역 인원이 너무 많습니다.</div> : ''}         
            {dangerState3 ? <div className="popup location3" onClick={openCloseDanger3}><div className='warnings' ><Image src={danger} alt='123' width={240} height={70} /></div>정문 구역 인원이 너무 많습니다.</div> : ''}                                 */}
        </div>
      </Background>
    );
  };

  useEffect(() => {
    console.log('api 다시 받아오기');
     getAPIdata();
     let id = setInterval(getAPIdata, 300000);

     return () => clearInterval(id);
     
   }, []);

  return <Home />;
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
    }
);
export default Dash;
//export default Map;
