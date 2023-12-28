import './style.css';
import * as d3 from 'd3';
import { DataType } from './DataType.ts';
import { generateTable } from './generateTable.ts';
import { generateScatterPlot } from './generateScatterPlot.ts';

// TOP de l'année choisie
const size_choice = d3.select('#top').append('form').attr('class', 'choix').append('fieldset');
size_choice.append('legend').html('Choisir une taille');
size_choice
  .selectAll('input')
  .data([3, 5, 10, 20])
  .enter()
  .append('label')
  .text((d) => d)
  .insert('input')
  .attr('type', 'radio')
  .attr('name', 'size')
  .attr('value', (d) => d)
  .property('checked', (d) => d)
  .on('change', function () {
    console.log(this.value);
  });

const flop_choice = d3.select('#top').append('form').attr('class', 'choix').append('fieldset');
flop_choice.append('legend').html('Choisir si vous souhaitez un FLOP');
flop_choice
  .selectAll('input')
  .data([false])
  .enter()
  .append('label')
  .text('FLOP')
  .insert('input')
  .attr('type', 'checkbox')
  .attr('name', 'flop')
  .attr('value', (d) => d)
  .property('checked', (d) => d)
  .on('change', function () {
    console.log(this.value);
  });

const year_choice = d3.select('#top').append('form').attr('class', 'choix').append('fieldset');
year_choice.append('legend').html('Choisir une année');
year_choice.append('select').attr('name', 'annee').attr('id', 'year_choice');

const region_choice = d3.select('#top').append('form').attr('class', 'choix').append('fieldset');
region_choice.append('legend').html('Choisir une région');
region_choice.append('select').attr('name', 'region').attr('id', 'region_choice');

d3.select('#top')
  .append('table')
  .append('thead')
  .append('tr')
  .selectAll('th')
  .data(['Pays', 'Region', 'Rang', 'Documents', 'Citations', 'H-index'])
  .enter()
  .append('th')
  .html((d) => d);

d3.select('#top').select('table').append('tbody').attr('id', 'table_top');

d3.csv(
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vShuV7YDfFvbcOcpku7BKY0_sN6i3SaVbva9ebY9wzgOEHNS6rb8mX21eeRNnHGQj5ns64_EY2CpJtc/pub?gid=1902854758&single=true&output=csv',
  function (d) {
    return {
      Year: parseInt(d.Year),
      Rank: parseInt(d.Rank),
      Region: d.Region,
      Country: d.Country,
      Documents: parseInt(d.Documents),
      Citations: parseInt(d.Citations),
      AverageCitations: parseFloat(d['Citations per document']),
      Hindex: parseInt(d['H index']),
    };
  },
).then((data) => {
  const newSelectSet = (
    data: d3.DSVParsedArray<DataType>,
    key: 'Year' | 'Region',
    defaultValue?: boolean,
  ) => {
    return defaultValue
      ? Array.from(['All', ...new Set(data.map((d) => d[key]))])
      : Array.from(new Set(data.map((d) => d[key])));
  };

  d3.select('#year_choice')
    .selectAll('option')
    .data(newSelectSet(data, 'Year'))
    .enter()
    .append('option')
    .attr('value', (d) => d)
    .html((d) => String(d));

  d3.select('#region_choice')
    .selectAll('option')
    .data(newSelectSet(data, 'Region', true))
    .enter()
    .append('option')
    .attr('value', (d) => d)
    .html((d) => String(d));

  size_choice.on('change', () => {
    d3.select('#table_top')
      .selectAll('tr')
      .style('display', (_d, i) => {
        return i + 1 >
          parseInt((d3.select('input[name="size"]:checked').node() as HTMLInputElement)?.value)
          ? 'none'
          : 'table-row';
      });
  });

  flop_choice.on('change', () => generateTable(data));
  year_choice.on('change', () => {
    generateTable(data);
    generateScatterPlot(data);
  });
  region_choice.on('change', () => generateTable(data));

  generateTable(data);
  generateScatterPlot(data);
});
