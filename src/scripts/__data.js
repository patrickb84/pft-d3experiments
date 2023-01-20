import revenue from '../data/revenue.js';

// Format to short month
const formatShortMonth = dateTime =>
  dateTime.toLocaleString('default', { month: 'short' })

export const REVENUE_DATA = revenue.slice(0, 12).map(d => {
  const data = {
    ...d,
    month: formatShortMonth(d.date)
  }
  // console.log(data);
  return data
});