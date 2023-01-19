import GAMES from '../data/data-games.js';

// ! COMMON
const formatDateTimeToShortMonth = dateTime => dateTime.toLocaleString('default', { month: 'short' })
const margin = { top: 30, right: 30, bottom: 140, left: 50 };
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
const __DATA__ = GAMES.map(d => ({
  ...d,
  stackDiff: d.registered - d.attended,
  shortMonth: formatDateTimeToShortMonth(d.month)
}));


// ! Chart function
function drawD3StackedBar() {
  function redraw(selector, data, xDomain) {
    const max_y_value = 150

    // # get element
    const el = document.querySelector(selector)
    el.classList.add('d3', 'stacked_bar_graph', 'w-100', 'h-100')
    const dimensions = getElDimensions(el)

    // # append svg
    const svg = d3
      .select(el)
      .append('svg')
      .attr('width', dimensions.outerWidth())
      .attr('height', dimensions.outerHeight())
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // # List of subgroups -> constitutes a bar
    const stackedGroups = ['attended', 'stackDiff'];

    // # Add X axis
    const x = d3
      .scaleBand()
      .domain(xDomain)
      .rangeRound([0, dimensions.innerWidth()])
      .padding([padding_between_bars]);
    svg
      .append('g')
      .attr('transform', `translate(0, ${dimensions.innerHeight()})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    // # Add Y axis
    const y = d3.scaleLinear().domain([0, max_y_value]).rangeRound([dimensions.innerHeight(), 0]);
    // Add Y axis label
    svg.append('g').call(d3.axisLeft(y).ticks(12).tickSizeOuter(0));

    // # color palette
    const color = d3.scaleOrdinal().domain(stackedGroups).range(['fill-purple', 'fill-light']);

    // # Stack the data
    const stackedData = d3.stack().keys(stackedGroups)(data);

    // # Show the bars
    svg
      .append('g')
      .selectAll('g')
      .data(stackedData)
      .enter()
      .append('g')
      .attr('class', d => color(d.key))
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', d => x(d.data.shortMonth))
      .attr('y', d => y(d[1]))
      .attr('width', x.bandwidth())
      .attr('height', d => y(d[0]) - y(d[1]));
  }

  return (selector, data, xDomain) => {
    redraw(selector, data, xDomain)
    let redrawTimeout = null;

    const queueRedraw = () => {
      console.log('redraw');
      clearTimeout(redrawTimeout);
      redrawTimeout = setTimeout(
        () => redraw(selector, data, xDomain),
        250
      );
    };

    window.addEventListener('resize', queueRedraw);
  }
};

const draw = () => drawD3StackedBar()("#registered-chart", __DATA__, __DATA__.map(d => d.shortMonth))

export default draw;
