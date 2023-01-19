
const drawD3MultiLine = function () {
  let _data = [];
  let _dates = [];
  let x = null;
  let y = null;
  let defaultWidth = window.innerWidth;
  let defaultHeight = 600;

  const margin = { top: 30, right: 30, bottom: 50, left: 50 };
  let width = 0;
  let height = 0;

  const colors = [
    '#f94144',
    '#577590',
    '#f3722c',
    '#871b4a',
    '#43aa8b',
    '#f9c74f',
    '#A7A5C6',
    '#8797b2',
    '#6d8a96',
    '#90be6d',
    '#66ced6',
    '#053c5e',
    '#a31621',
    '#b5ef8a'
  ];

  function hover(svg, path) {
    if ("ontouchstart" in document) {
      svg
        .style("-webkit-tap-highlight-color", "transparent")
        .on("touchmove", moved)
        .on("touchstart", entered)
        .on("touchend", left)
    }
    else {
      svg
        .on("mousemove", moved)
        .on("mouseenter", entered)
        .on("mouseleave", left);
    }

    const dot = svg.append("g")
      .attr("display", "none");

    dot.append("circle")
      .attr("r", 4);


    const dotLabel = dot.append("g");

    dotLabel.append("rect")
      .attr("width", 240)
      .attr("height", 40)
      .attr("transform", `translate(-2,-14)`)
      .style("fill", "rgba(255,255,255,0.95)")
      .style("outline", "1px solid #999");

    dotLabel.append("text")
      .attr("class", "text1")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);

    dotLabel.append("text")
      .attr("class", "text2")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("y", 20);

    function moved(event) {
      event.preventDefault();
      const pointer = d3.pointer(event, this);
      const xm = x.invert(pointer[0]);
      const ym = y.invert(pointer[1]);
      const i = d3.bisectCenter(_dates, xm);
      const s = d3.least(_data, d => Math.abs(d.values[i]?.value - ym));
      if (s) {
        const date = _dates[i];
        const value = s.values[i].value;

        if (value === null)
          return;

        const formattedValue = s.values[i].formattedValue;
        const dateLabel = s.values[i].dateLabel;

        const shiftLeft = pointer[0] > width / 2 ? -200 : 0;
        const shiftDown = pointer[1] > height / 2 ? -50 : 30;

        path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
        dot.attr("transform", `translate(${x(date)},${y(value)})`);
        dot.select(".text1").text(`${formattedValue || value} ${s.name}`);
        dot.select(".text2").text(dateLabel || `${moment(date).format("MMMM Do")}`);
        dotLabel.attr("transform", `translate(${shiftLeft},${shiftDown})`);
      }
    }

    function entered() {
      path.style("mix-blend-mode", null).attr("stroke", "#ddd");
      dot.attr("display", null);
    }

    function left() {
      path.style("mix-blend-mode", "multiply").attr("stroke", null);
      dot.attr("display", "none");
    }
  }

  function redraw({ dates, selector, xDomain, yDomain, chartWidth, chartHeight, yAxisTitle, legendPosition }) {
    $(selector).html('').addClass('d3 line');

    defaultWidth = $(selector).width();
    width = (chartWidth || defaultWidth);
    height = (chartHeight || defaultHeight);

    if (legendPosition === 'right') {
      width -= 150;
    }

    const _xDomain = xDomain.map((d) => d3.timeParse("%m/%e/%Y")(d));
    _dates = dates.map(d => d3.timeParse("%m/%e/%Y")(d));

    x = d3.scaleTime()
      .range([margin.left, width - margin.right]);

    y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line.call(this)
      .x((d, i) => x(d.date))
      .y(d => y(d.value))
      .defined((d) => d.value !== null && d.value !== undefined);

    const svg = d3.select(selector).append("svg")
      .attr("width", "100%")
      .attr("viewBox", `0 0 ${chartWidth || defaultWidth} ${chartHeight || defaultHeight}`);

    tooltip = d3.select(selector).append("div")
      .attr("class", "tooltip")
      .style("display", "none");

    x.domain(_xDomain);
    y.domain(yDomain);


    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const xAxisGroup = svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (height - margin.bottom) + ")")
      .call(xAxis);

    if (legendPosition === 'right') {
      const key = svg.append("g")
        .attr("class", "key right");

      let i = 0;
      _data.forEach(path => {
        key.append("rect")
          .style("transform", `translate(0, ${i * 22 - 9}px)`)
          .style('fill', colors[i % colors.length]);

        key.append("text").text(path.name)
          .style("transform", `translate(15px, ${i * 22}px)`);

        i++;
      });
    }
    else {
      const key = xAxisGroup.append("g")
        .attr("class", "key");

      let i = 0;
      _data.forEach(path => {
        key.append("rect")
          .style("transform", `translate(${i * 140}px, -9px)`)
          .style('fill', colors[i % colors.length]);

        key.append("text").text(path.name)
          .style("transform", `translate(${i * 140 + 15}px, 0)`);

        i++;
      });
    }


    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 3)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(yAxisTitle)); //TODO: check either here or in the next section

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");


    const vx = svg.append("g")
      .attr("class", "vx axis")
      .append("g")
      .attr("class", "tick");

    const xTickPositionsByData = {};
    xAxisGroup.selectAll(".tick").each(function (data) {
      if (!xTickPositionsByData[data]) {
        const tick = d3.select(this);
        const pos = tick.attr("transform").split(/[,()]+/);
        xTickPositionsByData[data.toUTCString()] = parseFloat(pos[1]);
      }
    });

    _data.forEach(series => {
      series.values.forEach((value, index) => {
        if (value.markDate) {
          const dateUtcString = value.date.toUTCString();
          let left = xTickPositionsByData[dateUtcString];
          if (left === undefined) {
            left = (width - margin.left - margin.right) * index / dates.length + margin.left;
          }
          vx.append("line")
            .attr("x1", left)
            .attr("x2", left)
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom)
            .style("stroke", "#BBB");

          vx.append("text")
            .text(value.markDate)
            .style("transform", `translate(${left + 4}px, ${margin.top + 20}px) rotate(90deg)`)
            .style("fill", "#999")
            .style("font-size", "12px");
        }
      })
    });

    const lineGroup = svg.append("g")
      .attr("class", "line");

    const path = lineGroup
      .selectAll("path")
      .data(_data)
      .join("path")
      .attr("d", d => line(d.values));

    lineGroup.selectAll('path').each((data, i, nodes) => nodes[i].style.stroke = colors[i % colors.length]);

    svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height);

    svg.call(hover, path);
  };

  return ({ data, dates, selector, xDomain, yDomain, chartWidth, chartHeight, yAxisTitle, legendPosition }) => {
    _data = data;

    _data.forEach((series) => {
      series.values.forEach(v => {
        v.date = d3.timeParse("%m/%e/%Y")(v.date);
      });
    });

    redraw({ dates, selector, xDomain, yDomain, chartWidth, chartHeight, yAxisTitle, legendPosition });

    let redrawTimeout = null;

    const queueRedraw = () => {
      clearTimeout(redrawTimeout);
      redrawTimeout = setTimeout(
        () => redraw({ dates, selector, xDomain, yDomain, chartWidth, chartHeight, yAxisTitle, legendPosition }),
        250
      );
    };

    $('#admin-left-nav [onclick]').on('click', queueRedraw);
    $('.horizontal-menu a').on('click', queueRedraw);
    $(window).on('resize', queueRedraw);
  }
};
