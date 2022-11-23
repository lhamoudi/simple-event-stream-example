const Twilio = require("twilio");

/**
 * This function serves as our event callback handler 
 *
 * @param {*} context
 * @param {*} event
 * @param {*} callback
 * @returns
 */
exports.handler = async function (context, event, callback) {
  // const { ACCOUNT_SID, AUTH_TOKEN } = context;
  // const twilioClient = Twilio(ACCOUNT_SID, AUTH_TOKEN);

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST GET");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");
  response.appendHeader("Content-Type", "application/json");

  
  const payload = event[0]["data"];

  if (!payload) {
    console.warn('Event payload not present', event[0]);
    return callback(null, {});
  }
  
  console.info(`BEGIN event logging...`);
  logObject(event);
  console.info(`END event logging.`);



  response.setBody({
    success: true,
  });

  callback(null, response);
};

function logObject(obj, indent = 1, indentChar = '>') {
  Object.entries(obj).forEach(([key,value]) => {
    if (typeof value === 'object' &&
          !Array.isArray(value) &&
          value !== null) {
      console.info(`${indenter(indent, indentChar)} ${key}: `);
      logObject(value, indent+1);
    } else {
      console.info(`${indenter(indent, indentChar)} ${key}: ${value}`);
    }
  });
}

function indenter(numSpaces, indentChar) {
  var indent = '';
  for (let index = 0; index < numSpaces; index++) {
    indent += indentChar ? indentChar : '';
  }
  return indent;
}