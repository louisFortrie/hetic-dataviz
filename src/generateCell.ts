export const generateCell = function (d: any) {
  return "<td class='" + (isNaN(parseInt(d)) ? 'texte' : 'nombre') + "'>" + d + '</td>';
};
