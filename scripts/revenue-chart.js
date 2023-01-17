import DATA_REVENUE from '../data/revenue.js';


// ! COMMON
const formatDateTimeToShortMonth = dateTime => dateTime.toLocaleString('default', { month: 'short' })
const margin = { top: 30, right: 30, bottom: 50, left: 50 };
const getElDimensions = el => ({
  width: () => el.offsetWidth,
  height: () => el.offsetHeight,
  innerWidth: () => el.offsetWidth - margin.left - margin.right,
  innerHeight: () => el.offsetHeight - margin.top - margin.bottom,
  outerWidth: () => el.offsetWidth + margin.left + margin.right,
  outerHeight: () => el.offsetHeight + margin.top + margin.bottom
})
const padding_between_bars = 0.5

// ! MOCK DATA
const __DATA__ = DATA_REVENUE.slice(0, 12).map(d => ({
  ...d,
  shortMonth: formatDateTimeToShortMonth(d.month)
}));



// ! Chart function
const drawD3LineAndBar = (selector = "#revenue-chart", data = __DATA__, xDomain = __DATA__.map(d => d.shortMonth)) => {
  const max_y_value = 50000
  const y_axis_tick_count = 12
  const format_ticks_use_k = d => (d >= 1000 ? d / 1000 + 'k' : d)
  const padding_between_bars = 0.5

  // # get element
  const el = document.querySelector(selector)
  el.classList.add('d3', 'line_and_bar_graph', 'w-100', 'h-100')
  const dimensions = getElDimensions(el)

  // # append svg
  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', dimensions.outerWidth())
    .attr('height', dimensions.outerHeight())
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // # Add X axis
  const x = d3
    .scaleBand()
    .domain(xDomain)
    .rangeRound([0, dimensions.innerWidth()])
    .padding(padding_between_bars);
  svg
    .append('g')
    .attr('transform', `translate(0, ${dimensions.innerHeight()})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

  // # Add Y axis
  const y = d3.scaleLinear().domain([0, max_y_value]).rangeRound([dimensions.innerHeight(), 0]);
  // Add Y axis label
  svg.append('g').call(
    d3
      .axisLeft(y)
      .ticks(y_axis_tick_count)
      .tickFormat(format_ticks_use_k)
  );

  // # Add bars
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', d => {
      if (d.actual === d.budget) return 'bar fill-primary';
      return d.actual < d.budget ? 'bar fill-danger' : 'bar fill-success';
    })
    .attr('x', d => x(d.shortMonth))
    .attr('y', d => y(d.actual))
    .attr('width', x.bandwidth())
    .attr('height', d => dimensions.innerHeight() - y(d.actual));

  // # Add line
  const line = d3
    .line()
    .x(d => x(d.shortMonth) + x.bandwidth() / 2)
    .y(d => y(d.budget));
  // Append to line to path
  svg.append('path').datum(data).attr('class', 'line').attr('d', line);
  // Append dots
  svg
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('cx', d => x(d.shortMonth) + x.bandwidth() / 2)
    .attr('cy', d => y(d.budget))
    .attr('r', 5)
    .attr('class', 'fill-primary')
    .style('stroke', 'black');
};

export default drawD3LineAndBar;
