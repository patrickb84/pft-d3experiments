const chartUtils = {}

chartUtils.formatShortMonth = dateTime => {
  console.log(dateTime);
  return dateTime.toLocaleString('default', { month: 'short' })
}

export default chartUtils
