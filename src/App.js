import revenueChart from './scripts/revenue-chart.js';
import gamesChart from './scripts/games-chart.js';
import progressChart from './scripts/email-chart.js';

// revenueChart();
// gamesChart();
// progressChart();
revenueChart();

// const PAYLOAD_LINE_AND_BAR___CS = () => {
//   return {
//     selector: '#revenue-over-time', // DOM selector
//     xDomain: [], // array of dates, in the code it's as 01/01/2020, 02/01/2020, 03/01/2020, etc)
//     yDomain: [0, 50000],
//     yAxisTitle: 'REVENUE VS BUDGET OVER TIME', // y axis title
//     data: {
//       values: [
//         {

//         }
//       ]
//     }
//   }
// }

// const drawD3LineAndBar = function ({ }) {

//   // ! ONLY DOES A LINE
//   // get el, add class 'd3 line'

//   // get el width (default width)
//   // set width/height properties

//   // calculate if legend position

//   // set _xDomain from xDomain arg
//   // set _dates from dates arg

//   // set x/y by d3 scale...

//   // call line

//   // create svg

//   // append tooltip

//   // x/y .domain is called

//   // xAxis is called with settings

//   // xAxisGroup is called with settings

//   // legend is appended depending on if legend position

//   // yAxis is called with settings AND title

//   // append yAxis

//   // append "vx axis??"

//   // ticks on x axis group


// }

// // data is list array of D3Series
// // D3Series = { values: [] // of D3Points}

// const D3Point = {
//   dateData: new Date(),
//   data: '',
//   value: 0.0,
//   formattedValue: '',
//   markDate: '',
//   dateLabel: '',
// }

// // data.values is list array of D3Points

// let data = [
//   {
//     name: 'series1',
//     values: [
//       {
//         dateDate: null,
//         date: '',
//         value: 0.0,
//         formattedValue: '',
//         markDate: '',
//         dateLabel: '',
//       },
//       {
//         dateDate: null,
//         date: '',
//         value: 0.0,
//         formattedValue: '',
//         markDate: '',
//         dateLabel: '',
//       },
//     ]
//   },
//   {
//     name: 'series2',
//     values: [
//       {
//         dateDate: null,
//         date: '',
//         value: 0.0,
//         formattedValue: '',
//         markDate: '',
//         dateLabel: '',
//       },
//       {
//         dateDate: null,
//         date: '',
//         value: 0.0,
//         formattedValue: '',
//         markDate: '',
//         dateLabel: '',
//       },
//     ]
//   }
// ]
// /**
//  * data.values is list array of D3Points
//  * 
//  * data.values = [
//  * {
//  * dateData: null,
//  * data: '',
//  * value: 0.0,
//  * formattedValue: '',
//  * markDate: '',
//  * dateLabel: '',
//  * },
//  */