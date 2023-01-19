import revenue from '../data/revenue.js';
import chartUtils from './utils.js';

export const REVENUE_DATA = revenue.slice(0, 12).map(d => {
  return {
    ...d,
    shortMonth: chartUtils.formatShortMonth(d.date)
  }
});

