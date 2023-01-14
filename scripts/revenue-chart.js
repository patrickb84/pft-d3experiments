import DATA_REVENUE from '../data/revenue.js';

const data = DATA_REVENUE.slice(0, 12).map(d => ({
  ...d,
  xLabel: d.month.toLocaleString('default', { month: 'short' })
}));

const lineAndBarChart = () => {
  // # set dimensions
  const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // # append the svg obj
  const svg = d3
    .select('#lineAndBarChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // # Add X axis
  const xAxis = d3
    .scaleBand()
    .domain(data.map(d => d.xLabel))
    .rangeRound([0, width])
    .padding(0.5);
  // # Add X axis label
  svg
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xAxis));

  // # Add Y axis
  const yAxis = d3.scaleLinear().domain([0, 50000]).rangeRound([height, 0]);
  // # Add Y axis label
  svg.append('g').call(
    d3
      .axisLeft(yAxis)
      .ticks(12)
      .tickFormat(d => (d >= 1000 ? d / 1000 + 'k' : d))
  );

  // # Show the bars
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', d => {
      if (d.actual === d.budget) return 'bar';
      return d.actual < d.budget ? 'bar red' : 'bar green';
    })
    .attr('x', d => xAxis(d.xLabel))
    .attr('y', d => yAxis(d.actual))
    .attr('width', xAxis.bandwidth())
    .attr('height', d => height - yAxis(d.actual));

  // # Add the line
  const line = d3
    .line()
    .x(d => xAxis(d.xLabel) + xAxis.bandwidth() / 2)
    .y(d => yAxis(d.budget));

  // # Add the dots
  svg
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => xAxis(d.xLabel) + xAxis.bandwidth() / 2)
    .attr('cy', d => yAxis(d.budget))
    .attr('r', 5)
    .style('fill', 'royalblue')
    .style('stroke', 'black');

  // # Add the path
  svg.append('path').datum(data).attr('class', 'line').attr('d', line);
};

export default lineAndBarChart;
