import GAMES from '../data/data-games.js';

const data = GAMES.map(d => ({
  ...d,
  stackDiff: d.registered - d.attended,
  xLabel: d.month.toLocaleString('default', { month: 'short' })
}));

const stackedBarChart = () => {
  // # set dimensions
  const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // # append the svg obj
  const svg = d3
    .select('#stackedBarChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // # List of subgroups -> constitutes a bar
  const keys = ['attended', 'stackDiff'];

  // # Add X axis
  const xAxis = d3
    .scaleBand()
    .domain(data.map(d => d.xLabel))
    .rangeRound([0, width])
    .padding([0.5]);

  // # Add X axis label
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xAxis).tickSizeOuter(0));

  // # Add Y axis
  const yAxis = d3.scaleLinear().domain([0, 150]).rangeRound([height, 0]);

  // # Add Y axis label
  svg.append('g').call(d3.axisLeft(yAxis).ticks(8));

  // # color palette
  const color = d3.scaleOrdinal().domain(keys).range(['green', 'gray']);

  // # Stack the data
  const stackedData = d3.stack().keys(keys)(data);
  // console.log(stackedData);

  // # Show the bars
  svg
    .append('g')
    .selectAll('g')
    // * Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter()
    .append('g')
    .attr('fill', d => color(d.key))
    .selectAll('rect')
    // * enter a second time = loop subgroup per subgroup to add all rectangles
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => xAxis(d.data.xLabel))
    .attr('y', d => yAxis(d[1]))
    .attr('width', xAxis.bandwidth())
    .attr('height', d => yAxis(d[0]) - yAxis(d[1]));
};

export default stackedBarChart;
