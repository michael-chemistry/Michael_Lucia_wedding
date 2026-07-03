/**
 * Michael & Lucia — Save the Date form backend.
 *
 * Paste this into the Apps Script editor that is bound to your Google Sheet
 * (Sheet menu: Extensions -> Apps Script), then deploy it as a Web App.
 * Full step-by-step instructions are in SETUP.md.
 *
 * Each form submission is appended as a new row, one column per field, so the
 * sheet stays mail-merge ready.
 */

// Column headers, in order. Also written by setupHeaders() below.
var HEADERS = [
  'Timestamp',
  'Your full name',
  'Partner/guest full name',
  'Street address',
  'City',
  'State/Province',
  'ZIP/Postal code',
  'Country',
  'Email address'
];

// Field names sent by the website form, matched to the columns above.
var FIELD_ORDER = [
  'fullName',
  'partnerName',
  'street',
  'city',
  'state',
  'zip',
  'country',
  'email'
];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Responses');
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  // Make sure the header row exists.
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Receives the POST from the website and appends a row.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // avoid two submissions writing at once
  } catch (err) {
    return jsonOut_({ result: 'error', message: 'Server busy, please retry.' });
  }

  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var sheet = getSheet_();

    var row = [ params.submittedAt ? new Date(params.submittedAt) : new Date() ];
    FIELD_ORDER.forEach(function (name) {
      row.push(params[name] ? String(params[name]) : '');
    });

    sheet.appendRow(row);
    return jsonOut_({ result: 'success' });
  } catch (err) {
    return jsonOut_({ result: 'error', message: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/**
 * A friendly response if someone opens the Web App URL in a browser.
 */
function doGet() {
  return jsonOut_({ result: 'ok', message: 'Save-the-date endpoint is live.' });
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * OPTIONAL: run this once from the editor to write the header row up front.
 */
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.setName('Responses');
  sheet.clear();
  sheet.appendRow(HEADERS);
  sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
}
