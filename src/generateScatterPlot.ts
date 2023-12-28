import * as d3 from 'd3';
import { DataType } from './DataType.ts';

const filterScatterPlotData = (data: d3.DSVParsedArray<DataType>) => {
  const year = parseInt((d3.select('#year_choice').node() as HTMLInputElement)?.value);
  const yearFilter = (d: DataType) => d.Year == year || isNaN(year);
  return d3.filter(data, (d) => yearFilter(d));
};

export const generateScatterPlot = (data: d3.DSVParsedArray<DataType>) => {
  const filteredData = filterScatterPlotData(data);
  d3.select('#nuage').html('');

  const colorScale = d3.scaleSequential(d3.interpolateRdYlGn).domain([1, filteredData.length]);

  const margin = { top: 10, right: 30, bottom: 30, left: 40 };
  const width = window.innerWidth * 0.9 - margin.left - margin.right;
  const height = window.innerHeight * 0.9 - margin.top - margin.bottom;

  const scatterPlot = d3
    .select('#nuage')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  const xScale = d3
    .scaleLog()
    .domain([1, d3.max(filteredData, (d) => d.Documents) || 1])
    .range([0, width]);
  const yScale = d3
    .scaleLog()
    .domain([0.1, d3.max(filteredData, (d) => d.AverageCitations) || 1])
    .range([height, 0]);

  scatterPlot
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale));
  scatterPlot.append('g').call(d3.axisLeft(yScale));

  scatterPlot
    .append('text')
    .attr('transform', 'translate(' + width / 2 + ' ,' + (height + margin.top + 20) + ')')
    .style('text-anchor', 'middle')
    .text('Nombre de Documents');

  scatterPlot
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Nombre Moyen de Citations par Document');

  scatterPlot
    .selectAll('circle')
    .data(filteredData)
    .enter()
    .append('circle')
    .attr('cx', (d) => xScale(d.Documents))
    .attr('cy', (d) => yScale(d.AverageCitations))
    .attr('r', (d) => Math.sqrt(d.Hindex)) // Ajustez cette formule selon vos besoins
    .style('fill', (d) => colorScale(d.Rank))
    .style('opacity', 0.7)
    .style('stroke', 'black')
    .style('stroke-width', 1);

  const meanDocuments = d3.mean(filteredData, (d) => d.Documents) || 1;
  const meanCitations = d3.mean(filteredData, (d) => d.AverageCitations) || 1;

  scatterPlot
    .append('line')
    .attr('x1', xScale(meanDocuments))
    .attr('x2', xScale(meanDocuments))
    .attr('y1', 0)
    .attr('y2', height)
    .style('stroke', 'black');

  scatterPlot
    .append('line')
    .attr('y1', yScale(meanCitations))
    .attr('y2', yScale(meanCitations))
    .attr('x1', 0)
    .attr('x2', width)
    .style('stroke', 'black');

  const tooltip = d3.select('body').append('div').attr('class', 'tooltip').style('opacity', 0);

  scatterPlot
    .selectAll('circle')
    .on('mouseover', (event, d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html((d as DataType).Country)
        .style('left', event.pageX + 'px')
        .style('top', event.pageY - 28 + 'px');
    })
    .on('mouseout', (_d) => {
      tooltip.transition().duration(500).style('opacity', 0);
    });

  const legend = scatterPlot
    .append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (width - 100) + ',20)');

  legend
    .selectAll('rect')
    .data([1, filteredData.length / 2, filteredData.length])
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', (_d, i) => i * 20)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', (d) => colorScale(d));

  legend
    .selectAll('text')
    .data([1, filteredData.length / 2, filteredData.length])
    .enter()
    .append('text')
    .attr('x', 24)
    .attr('y', (_d, i) => i * 20 + 9)
    .attr('dy', '.35em')
    .text((d) => `Rang: ${Math.round(d)}`);
};
