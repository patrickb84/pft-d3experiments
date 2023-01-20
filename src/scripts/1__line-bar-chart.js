import { REVENUE_DATA } from './__data.js';
const d3 = window.d3;
const $ = window.$;

const drawD3LineAndBar = function () {
  let _data = [];
  let xBand = null;
  let yLinear = null;

  const margin = { top: 30, right: 30, bottom: 30, left: 50 };
  const BAR_PADDING = 0.5;

  /**
   * Draw the SVG element
   * @param {*} param0
   */
  function draw({ selector, xDomain, yDomain }) {
    // clear old graph
    const oldSvg = $(selector).find('svg')[0];
    if (oldSvg) oldSvg.remove();

    const el = document.querySelector(selector);
    el.classList.add('d3', 'line-and-bar');
    el.style.height = '100%';
    el.style.width = '100%';
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3
      .select(selector)
      .append('svg')
      .attr('width', '100%')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    xBand = d3
      .scaleBand()
      .domain(xDomain)
      .rangeRound([0, innerWidth])
      .padding(BAR_PADDING);

    yLinear = d3.scaleLinear().domain(yDomain).rangeRound([innerHeight, 0]);

    svg
      .append('g')
      .call(
        d3.axisLeft(yLinear).tickFormat(n => (n >= 1000 ? n / 1000 + 'k' : n))
      );

    const timeDomain = [_data[0].date, _data[_data.length - 1].date];

    const xTime = d3.scaleTime().domain(timeDomain).range([0, innerWidth]);

    svg
      .append('g')
      .attr('transform', `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xBand).tickSizeOuter(0));

    // # Add bars
    svg
      .selectAll('.bar')
      .data(_data)
      .enter()
      .append('rect')
      .attr('x', d => {
        const _x1 = xBand(d.month);
        const _ti = xTime(d.date);
        console.log({ _x1, _ti });
        return _x1;
      })
      .attr('y', d => yLinear(d.bar))
      .attr('width', xBand.bandwidth())
      .attr('height', d => innerHeight - yLinear(d.bar))
      .attr('class', 'bar fill-light');
    // .attr('class', d => {
    //   if (d.lin === d.bar) return 'bar fill-purple';
    //   return d.lin > d.bar ? 'bar fill-red' : 'bar fill-green-bright';
    // })

    // # Add line
    const _line = d3
      .line()
      .x(d => xBand(d.month) + xBand.bandwidth() / 2)
      .y(d => yLinear(d.lin));
    svg.append('path').datum(_data).attr('class', 'line').attr('d', _line);

    // Append dots
    svg
      .selectAll('.dot')
      .data(_data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xBand(d.month) + xBand.bandwidth() / 2)
      .attr('cy', d => yLinear(d.lin))
      .attr('r', 3)
      .attr('class', 'fill-purple');

    const drawLegend = () => {
      const prevlegend = $(selector).find('.legend')[0];
      if (prevlegend) prevlegend.remove();

      const $legend = `<div class="d3 legend"></div>`;

      const target = `
      <div class="legend-item">
        <div class="legend-item__color" style="background-color: var(--smp-purple);"></div>
        <div class="legend-item__text">${'Target'}</div>
      </div>
    `;

      const aboveTarget = `
      <div class="legend-item">
        <div class="legend-item__color" style="background-color: var(--smp-green-bright);"></div>
        <div class="legend-item__text">${'Above Target'}</div>
      </div>
    `;

      const belowTarget = `
      <div class="legend-item">
        <div class="legend-item__color" style="background-color: var(--smp-red);"></div>
        <div class="legend-item__text">${'Below Target'}</div>
      </div>
    `;

      $(selector).append($legend);
      $(selector).find('.legend').append([target, aboveTarget, belowTarget]);
    };
    drawLegend();
  }

  return payload => {
    const { selector, data, xDomain, yDomain, yTickCount } = payload;

    _data = data;

    draw({ selector, xDomain, yDomain, yTickCount });

    let redraw = null;

    window.addEventListener('resize', () => {
      if (redraw) clearTimeout(redraw);
      redraw = setTimeout(
        () => draw({ selector, xDomain, yDomain, yTickCount }),
        250
      );
    });
  };
};

// ! Data
export const REVENUE_CHART_PAYLOAD = {
  selector: '#___revenue_over_time___',
  data: REVENUE_DATA,
  keys: {
    line: 'Budget',
    bar: 'Revenue'
  },
  xDomain: REVENUE_DATA.map(d => d.month).slice(0, 12),
  yDomain: [0, 50000], // max_y_value
  yTickCount: 12
};

export default drawD3LineAndBar;
