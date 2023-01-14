export default function runDatabindingScript() {
  const countryData = {
    items: ['China', 'India', 'USA'],
    addItem(item) {
      this.items.push(item);
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    updateItem(index, item) {
      this.items[index] = item;
    }
  };

  d3.select('ul')
    .selectAll('li')
    .data(countryData.items, data => data) // index
    .enter()
    .append('li')
    .text(item => item);

  setTimeout(() => {
    countryData.addItem('Germany');
    d3.select('ul')
      .selectAll('li')
      .data(countryData.items, data => data)
      .enter()
      .append('li')
      .classed('added', true)
      .text(data => data);
  }, 2000);

  setTimeout(() => {
    countryData.removeItem(0);
    d3.select('ul')
      .selectAll('li')
      .data(countryData.items, data => data)
      .exit()
      .classed('redundant', true)
  }, 4000);

  setTimeout(() => {
    countryData.updateItem(1, 'Russia');
    d3.select('ul')
      .selectAll('li')
      .data(countryData.items, data => data)
      .exit() // we have removed the item from the array
      .classed('updated', true)
      .text('Russia')
  }, 6000)

  // end
}
