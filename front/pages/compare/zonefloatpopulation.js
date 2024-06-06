import React, { useEffect, useState , useRef, useCallback }  from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import axios from 'axios';
import Router from 'next/router';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { CSVLink, CSVDownload } from "react-csv";
import Chart from "../../components/charts/zoneFloatChart"

import Header from '../../components/common/Header';
import Nav from '../../components/common/Nav';
import StackStatistics from '../../components/info/StackStatistics';
import FloatPopulationInfo from '../../components/info/FloatPopulationInfo';
import NavBottom from '../../components/common/NavBottom';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/auth';
import wrapper from '../../store/configureStore';

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
    //display: flex;
    //width: 100%;
    //grid-template-columns: 1fr 1fr 1fr;
    float: left;
    margin: 0 5% 0 5%;
  }
  .csv {
    color:white;
    text-decoration: none;
  }

  .charts {
    //display: relative;
     width: 40%;
  }

  .darkback {
    background-color: #1b2137;

    .Sel_date {
      background-color: #3c496e;
      box-shadow: 0px 0px 0px #b1b1b1;
      color: white;    
    }
    .csv {
      color:white;
      text-decoration: none;
    }
  }

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
    border-bottom: solid 1px #E4E4E4;
    text-align: left;
    color: #6e6e6e;
    align-items:center;
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
    display:flex;
    justify-content: center;
    align-items:center;
  }

  .chart {
    width:98%;
    height: 100%;
    margin-left:1%;
    display:flex;
    justify-content: center;
    align-items:center;
  }

`;

const Floatpopulation = () => {
  
const { me, ago7day, today } = useSelector((state) => state.auth);
const [sttdate, setSttdate] = useState(ago7day);
const [enddate, setEnddate] = useState(today);
const [zoneInfo1, setZoneInfo1] = useState([0, 0, 0, 0, 0, 0]); 
const [zoneInfo2, setZoneInfo2] = useState([0, 0, 0, 0, 0, 0]);
const [zoneInfo3, setZoneInfo3] = useState([0, 0, 0, 0, 0, 0]);
const [zoneInfo4, setZoneInfo4] = useState([0, 0, 0, 0, 0, 0]);
const [zoneInfo5, setZoneInfo5] = useState([0, 0, 0, 0, 0, 0]);
const [zoneInfo6, setZoneInfo6] = useState([0, 0, 0, 0, 0, 0]);
const [zoneInfo7, setZoneInfo7] = useState([0, 0, 0, 0, 0, 0]);
const [allInfo, setAllInfo] = useState([0, 0, 0, 0, 0, 0, 0]);
const [settings, setSettings] = useState({});
const slideEl = useRef(null);

const zones = ['2078', '2082', '2083', '2084', '2085', '2086', '2088'];
//const zones = [1859, 1860, 1861, 1862, 1910, 1911, 1912, 1913];

const arrY2078 = ['불국사존', '석굴암존', '봉황대고분존', '동궁과월지존', '첨성대존', '경주버스터미널','신경주역','동부해안가', '보문단지']; //"황리단길 권역", 
const arrY2082 = ['황리단길 권역', '석굴암존', '봉황대고분존', '동궁과월지존', '첨성대존', '경주버스터미널','신경주역','동부해안가', '보문단지']; //"불국사존", 
const arrY2083 = ['황리단길 권역', '불국사존', '봉황대고분존', '동궁과월지존', '첨성대존', '경주버스터미널','신경주역','동부해안가', '보문단지']; //"석굴암존", 
const arrY2084 = ['황리단길 권역', '불국사존', '석굴암존', '동궁과월지존', '첨성대존', '경주버스터미널','신경주역','동부해안가', '보문단지']; //"봉황대고분존", 
const arrY2085 = ['황리단길 권역', '불국사존', '석굴암존', '봉황대고분존', '첨성대존', '경주버스터미널','신경주역','동부해안가', '보문단지']; //"동궁과월지존", 
const arrY2086 = ['황리단길 권역', '불국사존', '석굴암존', '봉황대고분존', '동궁과월지존', '경주버스터미널','신경주역','동부해안가', '보문단지']; //"첨성대존", 
const arrY2088 = ['황리단길 권역', '불국사존', '석굴암존', '봉황대고분존', '동궁과월지존', '첨성대존','신경주역','동부해안가', '보문단지']; //"교촌마을존", 

const rgbChartStyle = [['rgba(243, 51, 145, 0.5)', 'rgba(200, 78, 213, 0.5)', 'rgba(150, 103, 211, 0.5)', 'rgba(108, 128, 209, 0.5)', 'rgba(138, 181, 237, 0.5)', 'rgba(0, 201, 249, 0.5)'],
['rgba(249, 111, 96, 0.5)', 'rgba(200, 78, 213, 0.5)', 'rgba(150, 103, 211, 0.5)', 'rgba(108, 128, 209, 0.5)', 'rgba(138, 181, 237, 0.5)', 'rgba(0, 201, 249, 0.5)'],
['rgba(249, 111, 96, 0.5)', 'rgba(243, 51, 145, 0.5)', 'rgba(150, 103, 211, 0.5)', 'rgba(108, 128, 209, 0.5)', 'rgba(138, 181, 237, 0.5)', 'rgba(0, 201, 249, 0.5)'],
['rgba(249, 111, 96, 0.5)', 'rgba(243, 51, 145, 0.5)', 'rgba(200, 78, 213, 0.5)', 'rgba(108, 128, 209, 0.5)', 'rgba(138, 181, 237, 0.5)', 'rgba(0, 201, 249, 0.5)'],
['rgba(249, 111, 96, 0.5)', 'rgba(243, 51, 145, 0.5)', 'rgba(200, 78, 213, 0.5)', 'rgba(150, 103, 211, 0.5)', 'rgba(138, 181, 237, 0.5)', 'rgba(0, 201, 249, 0.5)'],
['rgba(249, 111, 96, 0.5)', 'rgba(243, 51, 145, 0.5)', 'rgba(200, 78, 213, 0.5)', 'rgba(150, 103, 211, 0.5)', 'rgba(108, 128, 209, 0.5)', 'rgba(0, 201, 249, 0.5)'],
['rgba(249, 111, 96, 0.5)', 'rgba(243, 51, 145, 0.5)', 'rgba(200, 78, 213, 0.5)', 'rgba(150, 103, 211, 0.5)', 'rgba(108, 128, 209, 0.5)', 'rgba(138, 181, 237, 0.5)']]



const getAPIdata = async () => {
  const zoneData = [{zoneid : '2078', name : '황리단길 권역', data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0},
                    {zoneid : '2082', name : '불국사존', data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0},
                    {zoneid : '2083', name : '석굴암존', data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0},
                    {zoneid : '2084', name : '봉황대고분존', data : [0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0},
                    {zoneid : '2085', name : '동궁과월지존', data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0},
                    {zoneid : '2086', name : '첨성대존', data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0},
                    {zoneid : '2088', name : '경주버스터미널', data : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], alldata : 0}];
  
 // console.log('test',zoneData.zoneid)

  /**
   * 유동인구 수
   */

    try {       
      const responseVisit = await axios.get(`${process.env.NEXT_PUBLIC_API_GJ_URL}/DayMove?from=${sttdate}&to=${enddate}`);
      //const responseVisit = await axios.get('http://54.180.158.22:8000/v1/Gasi/DeviceCountDay?from='+sttdate+'&to='+enddate);  

      //.slice(0,10)

    

      for (let i of responseVisit.data) {
        //console.log('test',i.zone_move.slice(0,4), selectZoneId)
        for (let j of zoneData){          
          if (i.zone_move.slice(0,4) === j.zoneid){
            //console.log(i.zone_move.slice(0,4),i.zone_move.slice(5,9), j.zoneid, zones[1]);
            if(i.zone_move.slice(5,9) === zones[0]){
              j.data[0] = j.data[0] + i.data;
            } else if (i.zone_move.slice(5,9) === zones[1]){
              j.data[1] = j.data[1] + i.data;
            } else if (i.zone_move.slice(5,9) === zones[2]){
              j.data[2] = j.data[2] + i.data;
            } else if (i.zone_move.slice(5,9) === zones[3]){
              j.data[3] = j.data[3] + i.data;
            } else if (i.zone_move.slice(5,9) === zones[4]){
              j.data[4] = j.data[4] + i.data;
            } else if (i.zone_move.slice(5,9) === zones[5]){
              j.data[5] = j.data[5] + i.data;
            } else if (i.zone_move.slice(5,9) === zones[6]){
              j.data[6] = j.data[6] + i.data;
            }
            j.alldata = j.alldata + i.data;
          } else if (i.zone_move.slice(5,9) === j.zoneid){
            if(i.zone_move.slice(0,4) === zones[0]){
              j.data[0] = j.data[0] + i.data;
            } else if (i.zone_move.slice(0,4) === zones[1]){
              j.data[1] = j.data[1] + i.data;
            } else if (i.zone_move.slice(0,4) === zones[2]){
              j.data[2] = j.data[2] + i.data;
            } else if (i.zone_move.slice(0,4) === zones[3]){
              j.data[3] = j.data[3] + i.data;
            } else if (i.zone_move.slice(0,4) === zones[4]){
              j.data[4] = j.data[4] + i.data;
            } else if (i.zone_move.slice(0,4) === zones[5]){
              j.data[5] = j.data[5] + i.data;
            } else if (i.zone_move.slice(0,4) === zones[6]){
              j.data[6] = j.data[6] + i.data;
            }
            j.alldata = j.alldata + i.data;
          } 
        }       

      }
      
      for(let i = 0; i < zones.length; i++){
        zoneData[i].data.splice(i,1); 
      }      
      //console.log(zoneData);
      setZoneInfo1(zoneData[0].data);
      setZoneInfo2(zoneData[1].data);
      setZoneInfo3(zoneData[2].data);
      setZoneInfo4(zoneData[3].data);
      setZoneInfo5(zoneData[4].data);
      setZoneInfo6(zoneData[5].data);
      setZoneInfo7(zoneData[6].data);
      setAllInfo([zoneData[0].alldata, zoneData[1].alldata, zoneData[2].alldata, zoneData[3].alldata, zoneData[4].alldata, zoneData[5].alldata, zoneData[6].alldata]);


  
    } catch (err) {
        console.error(err);
    }


}



  useEffect (() => {

  if (!(me && me.id)) {
      Router.replace('/login');
    }
    
    
   }, [me && me.id]);

   useEffect (() => {
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
    })
    getAPIdata();
    setInterval(getAPIdata, 1800000)
  }, []);


//기간선택후 검색 클릭시
   const searchHandler = () => {
    getAPIdata();
  }

 



  return (  

    <Background>
      <div className={me && me.theme === 'dark'? 'darkback':'lightback'}>
      <Header page={'0'} />
      <Nav value={'3'} bottomValue={"3"} />
      <div className="Sel_date">
          분석기간 선택&nbsp;
          <input type="date" id='currentDate' value={sttdate} onChange={(e)=> setSttdate(e.target.value)}
          />&nbsp;&nbsp;~&nbsp;&nbsp;
          <input type="date" id='currentDate2' value={enddate} onChange={(e)=> setEnddate(e.target.value)}/>
          &nbsp;&nbsp;&nbsp;<button type="button " className="button" onClick={searchHandler}>검 색</button>
      </div>
      <div className="compare_list">
          <Slider ref={slideEl} {...settings}>   
              <div> 
              <div className="total_graph_view pos_left">
                <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;황리단길 (전체 - {allInfo[0]}명)</span></div>
                <div className="total_graph" >
                  <div id="visit1" className='chart'>
                    <Chart labels={arrY2078} datas={zoneInfo1} theme={rgbChartStyle[0]} />
                  </div>
                </div>
              </div>
            <div className="total_graph_view pos_right">
              <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;불국사 (전체 - {allInfo[1]}명)</span></div>
              <div className="total_graph" >
                <div id="visit2" className='chart' >
                <Chart labels={arrY2082} datas={zoneInfo2} theme={rgbChartStyle[1]} />
                </div>
              </div>
            </div>
            <div className="total_graph_view pos_left">
              <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;석굴암 (전체 - {allInfo[2]}명)</span></div>
              <div className="total_graph" >
                <div id="visit3" className='chart' >
                <Chart labels={arrY2083} datas={zoneInfo3} theme={rgbChartStyle[2]} />
                </div>
              </div>
            </div>
            <div className="total_graph_view pos_right">
              <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;봉황대고분 (전체 - {allInfo[3]}명)</span></div>
              <div className="total_graph" >
                <div id="visit4" className='chart' >
                <Chart labels={arrY2084} datas={zoneInfo4} theme={rgbChartStyle[3]} />            
                </div>
              </div>
            </div>
          </div>
        <div>
        <div className="total_graph_view pos_left">
              <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;동궁과월지 (전체 - {allInfo[4]}명)</span></div>
              <div className="total_graph" >
                <div id="visit1" className='chart'>
                  <Chart labels={arrY2085}  datas={zoneInfo5} theme={rgbChartStyle[4]} />
                </div>
              </div>
            </div>
          <div className="total_graph_view pos_right">
            <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;첨성대 (전체 - {allInfo[5]}명)</span></div>
            <div className="total_graph" >
              <div id="visit2" className='chart' >
              <Chart labels={arrY2086} datas={zoneInfo6} theme={rgbChartStyle[5]} />
              </div>
            </div>
          </div>
          <div className="total_graph_view pos_left">
            <div className="total_graph_box_title">&nbsp;<span className="title">&nbsp;경주버스터미널 (전체 - {allInfo[6]}명)</span></div>
            <div className="total_graph" >
              <div id="visit3" className='chart' >
              <Chart labels={arrY2088} datas={zoneInfo7} theme={rgbChartStyle[6]} />
              </div>
            </div>
          </div>
        </div>
        </Slider>
        </div>
    
      </div>
    </Background>

  )
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({req}) => {
  const cookie = req ? req.headers.cookie : '';
  //쿠키 공유되는 문제 해결
  axios.defaults.headers.Cookie = ''; 
  if (req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default Floatpopulation;