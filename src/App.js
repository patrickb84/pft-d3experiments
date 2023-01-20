import drawLineAndBarChart, {
  REVENUE_CHART_PAYLOAD
} from './scripts/1__line-bar-chart.js';
import { d1 } from './scripts/__aa.js';
import GAMES from './data/data-games.js';
import DATA_REVENUE from './data/revenue.js';

// import drawStackedBarChart from './scripts/stacked-bar-chart.js';
// import drawProgressChart from './scripts/progress-chart.js';

// revenueChart();
// gamesChart();
// progressChart();

console.log('REAL => ', d1);

// console.log(REVENUE_CHART_PAYLOAD);

drawLineAndBarChart()(REVENUE_CHART_PAYLOAD);

function convertGamesData() {
  console.log(GAMES);
  let payload = {
    data: [],
    selector: '#__games_registered_vs_attended__',
    dates: []
  };

  payload.dates = GAMES.map(({ __date__ }) => {
    // this next function converts date to a string of format 'MM/DD/YYYY'
    const formatDate = (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return formatDate(__date__);
  });

  payload.data.push({
    name: 'Registered',
    values: GAMES.map(({ registered, __date__ }) => {
      let dateDate = __date__.toISOString(),
        date = __date__.toISOString();
      let value = registered;

      return {
        dateDate,
        date,
        value,
        formattedValue: null,
        markDate: null,
        dateLabel: null
      };
    })
  });

  payload.data.push({
    name: 'Attended',
    values: GAMES.map(({ attended, __date__ }) => {
      let dateDate = __date__.toISOString(),
        date = __date__.toISOString();
      let value = attended;

      return {
        dateDate,
        date,
        value,
        formattedValue: null,
        markDate: null,
        dateLabel: null
      };
    })
  });

  payload.xDomain = [payload.dates[0], payload.dates[payload.dates.length - 1]];

  payload.yDomain = [0, 200];
  payload.chartHeight = 200;

  console.log('p: ', payload)
  return payload;
}





function convertRevenueData() {
  console.log(DATA_REVENUE);
  let payload = {
    data: [],
    selector: '#___revenue_over_time___',
    dates: []
  };

  payload.dates = DATA_REVENUE.map(({ date }) => {
    // this next function converts date to a string of format 'MM/DD/YYYY'
    const formatDate = (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return formatDate(date);
  });

  payload.data.push({
    name: 'Target',
    values: DATA_REVENUE.map(({ lin, bar, date: __date__ }) => {
      let dateDate = __date__.toISOString(),
        date = __date__.toISOString();
      let value = lin;

      return {
        dateDate,
        date,
        value,
        formattedValue: null,
        markDate: null,
        dateLabel: null
      };
    })
  });

  payload.data.push({
    name: 'Revenue',
    values: DATA_REVENUE.map(({ lin, bar, date: __date__ }) => {
      let dateDate = __date__.toISOString(),
        date = __date__.toISOString();
      let value = bar;

      return {
        dateDate,
        date,
        value,
        formattedValue: null,
        markDate: null,
        dateLabel: null
      };
    })
  });

  payload.xDomain = [payload.dates[0], payload.dates[payload.dates.length - 1]];

  payload.yDomain = [0, 200];
  payload.chartHeight = 200;

  console.log('REV: ', payload)
  return payload;
}

export const STACK_DATA = convertGamesData();
export const NEW_REV_DATA = convertRevenueData();
