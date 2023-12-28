import { generateCell } from './generateCell.ts';

export const generateRow = function (d: {
  Country: string;
  Region: string;
  Rank: number;
  Documents: number;
  Citations: number;
  Hindex: number;
}) {
  return (
    generateCell(d.Country) +
    generateCell(d.Region) +
    generateCell(d.Rank) +
    generateCell(d.Documents) +
    generateCell(d.Citations) +
    generateCell(d.Hindex)
  );
};
