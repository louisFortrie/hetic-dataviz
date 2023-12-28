import * as d3 from 'd3';
import { DataType } from './DataType.ts';
import { generateRow } from './generateRow.ts';

const filterTableData = (data: d3.DSVParsedArray<DataType>) => {
  const year = parseInt((d3.select('#year_choice').node() as HTMLInputElement)?.value);
  const region = (d3.select('#region_choice').node() as HTMLInputElement)?.value;
  const size = parseInt((d3.select('input[name="size"]:checked').node() as HTMLInputElement).value);

  const yearFilter = (d: DataType) => d.Year == year || isNaN(year);
  const regionFilter = (d: DataType) => d.Region == region || region == 'All';
  const sizeFilter = (d: DataType) => d.Rank <= size;

  return d3.filter(data, (d) => yearFilter(d) && regionFilter(d) && sizeFilter(d));
};

export const generateTable = (data: d3.DSVParsedArray<DataType>) => {
  const reversed = (d3.select('input[name="flop"]:checked').node() as HTMLInputElement)?.checked;
  const filteredData = filterTableData(data);
  const tableData = reversed ? filteredData.reverse() : filteredData;

  d3.select('#table_top')
    .html('')
    .selectAll('tr')
    .data(tableData)
    .enter()
    .append('tr')
    .style('visibility', (_d, i) => {
      return i + 1 >
        parseInt((d3.select('input[name="size"]:checked').node() as HTMLInputElement)?.value)
        ? 'hidden'
        : 'visible';
    })
    .html(generateRow);
};
