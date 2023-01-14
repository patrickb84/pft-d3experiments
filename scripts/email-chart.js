const data = {
  total: 5030,
  opened: 4453,
  clicked: 3243,
  undelivered: 123
};

const progressChart = () => {
  // # set dimensions
  const margin = { top: 10, right: 30, bottom: 20, left: 50 },
    width = 500 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  // # append the svg obj
  // creates a centered header above the chart that displays the total number of emails sent
  const header = d3
    .select('#progressChart')
    .append('h3')
    .attr('class', 'chart-header')
    .text(`${data.total / 1000}k`);

  const svg = d3
    .select('#progressChart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left + 60},${margin.top})`);

  const keys = ['Opened', 'Clicked', 'Undelivered'];

  // # Add X axis
  const x = d3
    .scaleLinear()
    .domain([0, data.total])
    .rangeRound([0, width - margin.left - margin.right]);

  // # Add Y axis
  const y = d3
    .scaleBand()
    .domain(keys)
    .rangeRound([0, height - margin.top - margin.bottom])
    .padding(0.4);

  // # Add Y axis label
  //   svg.append('g').call(d3.axisLeft(y));

  const bars = svg.selectAll('.bar').data(keys).enter().append('g');

  bars
    .append('text')
    .attr('class', 'bar-text')
    .attr('x', d => x(d) - 10)
    .attr('y', d => y(d) + y.bandwidth() / 2)
    .html(d => {
      let num = null;
      if (d === 'Opened') {
        num = data.opened;
      } else if (d === 'Clicked') {
        num = data.clicked;
      } else {
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
    .attr('width', x.domain()[1])
    .attr('fill', 'lightgrey');

  bars
    .append('rect')
    .attr('class', 'bar')
    .attr('x', 0)
    .attr('height', y.bandwidth())
    .attr('y', d => y(d))
    .attr('width', d => {
      if (d === 'Opened') {
        return x(data.opened);
      } else if (d === 'Clicked') {
        return x(data.clicked);
      } else {
        return x(data.undelivered);
      }
    })
    .attr('fill', d => {
      if (d === 'Opened') {
        return 'purple';
      } else if (d === 'Clicked') {
        return 'blue';
      } else {
        return 'goldenrod';
      }
    });

  //   bars
  //     .append('text')
  //     .attr('class', 'bar-text')
  //     .attr('x', d => {
  //       if (d === 'Opened') {
  //         return xAxis(data.openedOutOfSent);
  //       } else if (d === 'Clicked') {
  //         return xAxis(data.clickedOutOfSent);
  //       } else {
  //         return xAxis(data.bouncedOutOfSent);
  //       }
  //     })
  //     .attr('y', d => yAxis(d) + yAxis.bandwidth() / 2)
  //     .attr('dx', -3)
  //     .attr('dy', '.35em')
  //     .attr('text-anchor', 'end')
  //     .text(d => {
  //       if (d === 'Opened') {
  //         return data.openedOutOfSent;
  //       } else if (d === 'Clicked') {
  //         return data.clickedOutOfSent;
  //       } else {
  //         return data.bouncedOutOfSent;
  //       }
  //     });
};

export default progressChart;
