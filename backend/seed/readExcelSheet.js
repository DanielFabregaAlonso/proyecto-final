const path = require('path');
const ExcelJS = require('exceljs');

async function readExcelSheet(sheetName) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(path.join(__dirname, 'data', 'kickz-data.xlsx'));

  const sheet = workbook.getWorksheet(sheetName);
  if (!sheet) {
    throw new Error(`Hoja "${sheetName}" no encontrada en kickz-data.xlsx`);
  }

  let headers = [];
  const rows = [];

  sheet.eachRow((row, rowNumber) => {
    const values = row.values.slice(1);
    if (rowNumber === 1) {
      headers = values.map((header) => String(header));
      return;
    }
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index];
    });
    rows.push(record);
  });

  return rows;
}

module.exports = readExcelSheet;
