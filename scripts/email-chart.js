// ! COMMON
const margin = { top: -5, right: 25, bottom: 100, left: 115 };
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
const EMAIL_DATA = {
  total: 5030,
  opened: 4453,
  clicked: 3243,
  undelivered: 123
};

// ! Chart function
const progressChart = (selector = "#email-chart", data = EMAIL_DATA, yDomain = ['Opened', 'Clicked', 'Undelivered']) => {
  // # get element
  const el = document.querySelector(selector)
  el.classList.add('d3', 'stacked_bar_graph')
  const dimensions = getElDimensions(el)

  // # append "Total" text
  const header = d3
    .select(selector)
    .append('h3')
    .attr('class', 'chart-header')
    .text(`${data.total / 1000}k`);
  const elHeader = document.querySelector(`${selector} .chart-header`);

  // # append svg
  const svg = d3
    .select(el)
    .append('svg')
    .attr('width', dimensions.outerWidth())
    .attr('height', dimensions.outerHeight() - elHeader.offsetHeight - 40)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // # Add X axis
  const x = d3
    .scaleLinear()
    .domain([0, data.total])
    .rangeRound([0, dimensions.innerWidth()]);

  // # Add Y axis
  const y = d3
    .scaleBand()
    .domain(yDomain)
    .rangeRound([0, dimensions.innerHeight()])
    .padding(padding_between_bars);

  const bars = svg.selectAll('.bar').data(yDomain).enter().append('g');

  bars
    .append('text')
    .attr('class', 'bar-text')
    // .attr('x', d => x(d) - 10)
    .attr('y', d => y(d) + y.bandwidth() / 2)
    .html(d => {
      let num = null;
      switch (d) {
        case 'Opened':
          num = data.opened;
          break;
        case 'Clicked':
          num = data.clicked;
          break;
        default:
          num = data.undelivered;
      }
      return `<tspan style="font-weight:bold" x="-90" dy="-2"> ${num} </tspan><tspan x="-90" dy="1.2em">${d}</tspan>`;
    })
    .attr('text-anchor', 'start');

  bars
    .append('rect')
    .attr('class', 'background-bar')
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('y', d => y(d))
    .attr('width', d => x(data.total))
    .attr('class', 'fill-light');

  bars
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('y', d => y(d))
    .attr('width', d => {
      switch (d) {
        case 'Opened':
          return x(data.opened);
        case 'Clicked':
          return x(data.clicked);
        default:
          return x(data.undelivered);
      }
    })
    .attr('fill', d => {
      switch (d) {
        case 'Opened':
          return 'purple';
        case 'Clicked':
          return 'blue';
        default:
          return 'goldenrod';
      }
    });
};

export default progressChart;
