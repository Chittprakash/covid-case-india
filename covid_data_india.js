// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: magic;
// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: green; icon-glyph: magic;
/*https://api.covid19india.org*/
const state_wise_date = "https://api.covid19india.org/state_district_wise.json";
const daily_data = "https://api.covid19india.org/states_daily.json";

const STATE_DATE = [
  {
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    state: "up",
  },
  {
    stateCode: "KA",
    stateName: "Karnataka",
    state: "ka",
  },
  {
    stateCode: "WB",
    stateName: "West Bengal",
    state: "wb",
  },
  {
    stateCode: "MH",
    stateName: "Maharashtra",
    state: "mh",
  }
];


function getStateConversionData(code) {
  
  const stateDate = String(code);
  
  const {
      stateCode = "KA",
      stateName = "Karnataka",
      state = "ka",
    } = STATE_DATE.find(({ stateCode }) => stateDate == stateCode) || {};
    
  return {
    stateCode,
    stateName,
    state,
  }  
}

/** @type {Array<LevelAttribute>} sorted by threshold desc. */
const LEVEL_ATTRIBUTES = [
  {
    threshold: 6,
    startColor: "76205d",
    endColor: "521541",
    textColor: "f0f0f0",
    darkStartColor: "333333",
    darkEndColor: "000000",
    darkTextColor: "ce4ec5",
  },
  {
    threshold: 5,
    startColor: "9c2424",
    endColor: "661414",
    textColor: "f0f0f0",
    darkStartColor: "333333",
    darkEndColor: "000000",
    darkTextColor: "f33939",
  },
  {
    threshold: 4,
    startColor: "da5340",
    endColor: "bc2f26",
    textColor: "eaeaea",
    darkStartColor: "333333",
    darkEndColor: "000000",
    darkTextColor: "f16745",
  },
  {
    threshold: 3,
    startColor: "f5ba2a",
    endColor: "d3781c",
    textColor: "1f1f1f",
    darkStartColor: "333333",
    darkEndColor: "000000",
    darkTextColor: "f7a021",
  },
  {
    threshold: 2,
    startColor: "f2e269",
    endColor: "dfb743",
    textColor: "1f1f1f",
    darkStartColor: "333333",
    darkEndColor: "000000",
    darkTextColor: "f2e269",
  },
  {
    threshold: 1,
    startColor: "8fec74",
    endColor: "77c853",
    textColor: "1f1f1f",
    darkStartColor: "333333",
    darkEndColor: "000000",
    darkTextColor: "6de46d",
  },
];


/**
 * Constructs an SFSymbol from the given symbolName
 *
 * @param {string} symbolName
 * @returns {object} SFSymbol
 */
function createSymbol(symbolName) {
  const symbol = SFSymbol.named(symbolName);
  symbol.applyFont(Font.systemFont(15));
  return symbol;
}

function getArrowTrend( yesterday, today ) {
  //if (today < 1) return "xmark.rectangle.portrait";
  if (today < 1) return "xmark.rectangle.portrait";
  if (yesterday > today) return "chevron.down";
  if (today > yesterday) return "chevron.up";
  return "xmark.rectangle.portrait";
}

function getArrowColor(arrow, data) {
  if(data == "Confirmed") {
    if (arrow == "chevron.down") return 1;
    if (arrow == "chevron.up") return 5;
  }
  
  if(data == "Recovered") {
    if (arrow == "chevron.down") return 5;
    if (arrow == "chevron.up") return 1;
  }
  
  return 3;
}

function getTrend( yesterday, today ) {
  if (yesterday > today) return -1;
  if (today > yesterday) 1;
  return "xmark.rectangle.portrait";
}
/** @type {LatLon} */
const { latitude, longitude } = await Location.current();

/**
 * Fetch reverse geocode
 *
 * @param {string} lat
 * @param {string} lon
 * @returns {Promise<GeospatialData>}
 */
async function getGeoData(lat, lon) {
  const latitude = Number.parseFloat(lat);
  const longitude = Number.parseFloat(lon);

  const geo = await Location.reverseGeocode(latitude, longitude);
  //console.log({ geo: geo });

  return {
    neighborhood: geo[0].subLocality,
    city: geo[0].locality,
    state: geo[0].administrativeArea,
  };
}

async function getLocation(latitude, longitude) {
  try {
    if (args.widgetParameter) {
      return data.loc;
    }

    const geoData = await getGeoData(latitude, longitude);
    //console.log({ geoData });

    if (geoData.neighborhood && geoData.city) {
        return `${geoData.neighborhood}, ${geoData.city}`;
    } else {
        return geoData.city || data.loc;
    }
  } catch (error) {
    console.log(`Could not cleanup location: ${error}`);
    return data.loc;
  }
}


function calculateColor(range) {
  const level = Number(range) || 0;

  const {
    label = "Weird",
    startColor = "white",
    endColor = "white",
    textColor = "black",
    darkStartColor = "009900",
    darkEndColor = "007700",
    darkTextColor = "000000",
    threshold = -Infinity,
  } = LEVEL_ATTRIBUTES.find(({ threshold }) => level == threshold) || {};

  return {
    label,
    startColor,
    endColor,
    textColor,
    darkStartColor,
    darkEndColor,
    darkTextColor,
    threshold,
    level,
  };
}


async function getDailyCovidData(date, state) {
  try {
    const request = new Request(daily_data);
    const response = await request.loadJSON();
  
    //console.log(response.states_daily);
    const daily = response.states_daily;
  
    function getDataForDate(dateymd) {
      return daily.filter(
          function(daily){ return daily.dateymd == dateymd }
      );
    }
  
    var dailyDate = getDataForDate(date);
    //console.log(dailyDate);
    
    function getDataForConfirmed(status) {
      return dailyDate.filter(
          function(dailyDate){ return dailyDate.status == status }
      );
    }
    
    var confirmedCaseOnDate = getDataForConfirmed('Confirmed');
    var recoveredCaseonDate = getDataForConfirmed('Recovered');
    console.log("Confirmed Cases on "+date+" for the state "+state.toUpperCase()+" = "+confirmedCaseOnDate[0][state]);
    console.log("Recovered Cases on "+date+" for the state "+state.toUpperCase()+" = "+recoveredCaseonDate[0][state]);
    } 
    
  catch( e ) {
      console.log("Confirmed/Recovered Cases on "+date+" 0 for state "+state.toUpperCase()+" (No Data Availaible) - Source : https://api.covid19india.org/states_daily.json");   
      return 0;
    }

  return {
    confirmed: confirmedCaseOnDate[0][state],
    recovered: recoveredCaseonDate[0][state]
  };
}


async function getCOVIDData(state, city) {
  const request = new Request(state_wise_date);
  const response = await request.loadJSON();
  return {
    //neighborhood: geo[0].subLocality,
    activeCase: response[state].districtData[city].active,
    confirmedCase: response[state].districtData[city].delta.confirmed,
    recoveredCase: response[state].districtData[city].delta.recovered
  };
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
    //return [day, month, year].join('-');
}

function formatedNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*function getConfirmedCaseToday_WhenZero(date) {
    let caseDayBeforeYesterday = await getDailyCovidData(new String(dayBeforeYesterday),state.state);
}*/

//Defind widget and the data associated
async function createWidget() {
  
  //Testing for other locations.
  //Karnataka, Kannamangla
  //const location = await getLocation("13.2097027","77.6497893");
  //const geoData = await getGeoData("13.2097027","77.6497893");
  
  //West Bengal Darjeeling
  //const location = await getLocation("27.033267","88.2296555");
  //const geoData = await getGeoData("27.033267", "88.2296555");
  
  //PowaiMumbai Maharastra
  //const location = await getLocation("19.1250879","72.8875394");
  //const geoData = await getGeoData("19.1250879", "72.8875394");
  
  const location = await getLocation(latitude,longitude);
  const geoData = await getGeoData(latitude, longitude);
  
  console.log({ geoData });
  
  const state = getStateConversionData(geoData.state);
    
  const todayDate = formatDate(new Date());
  //const yesterday = formatDate(new Date(Date.now() - 864e5)); //https://stackoverflow.com/questions/5495815/javascript-code-for-showing-yesterdays-date-and-todays-date/5495838
  const yesterday = formatDate(new Date(Date.now() - 24 * 3600 * 1000)); //https://stackoverflow.com/questions/5495815/javascript-code-for-showing-yesterdays-date-and-todays-date/5495838
  const dayBeforeYesterday = formatDate(Date.now() - 2 * 24 * 3600 * 1000);

  //console.log(todayDate);console.log(yesterday);console.log(dayBeforeYesterday);
  let caseDayBeforeYesterday = await getDailyCovidData(new String(dayBeforeYesterday),state.state);
  let caseYesterday = await getDailyCovidData(new String(yesterday),state.state);
  let caseToday = await getDailyCovidData(new String(todayDate),state.state);
  //let caseToday = await getDailyCovidData("2021-04-24","up"); // HardCoded to check variation for other dates || Comparision
  
  const level = calculateColor(4);
  
  const updatedAt = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }); 

    
  const gradient = new LinearGradient();
  
  const startColor = Color.dynamic(new Color(level.startColor), new Color(level.darkStartColor));
  const endColor = Color.dynamic(new Color(level.endColor), new Color(level.darkEndColor));
  const textColor = Color.dynamic(new Color(level.textColor), new Color(level.darkTextColor));
    
  gradient.colors = [startColor, endColor];
  gradient.locations = [0.0, 1];
    
  const listWidget = new ListWidget();
  
  let date = new Date()
  date.setHours(date.getHours() + 3);
  listWidget.refreshAfterDate = date;

  listWidget.backgroundGradient = gradient;
  
  const arrow = getArrowTrend(caseYesterday, caseToday);
  const trendSymbol = createSymbol(arrow);
  
  let covidData = await getCOVIDData(state.stateName, geoData.city);
  let activeCaseData = covidData.activeCase.toString();
  let confirmedCaseData = covidData.confirmedCase.toString();
  let recoveredCaseData = covidData.recoveredCase.toString();
  
  //const header = listWidget.addText(`${geoData.state} COVID Case's`);
  const header = listWidget.addText(`${geoData.city}'s Case`);
  header.textColor = textColor;
  header.font = Font.regularSystemFont(11);
  header.minimumScaleFactor = 0.50;
  
  listWidget.addSpacer(4);
  const activeCase = listWidget.addStack();
  const caseContent = activeCase.addText("Active "+formatedNumber(activeCaseData));
  //const caseContent = activeCase.addText("Active "+formatedNumber(999999));
  activeCase.layoutHorizontally();
  activeCase.centerAlignContent();
  caseContent.font = Font.semiboldSystemFont(15);
  //activeCase.setPadding(7, 7, 7, 7)
  //content.textColor = textColor;
  //content.minimumScaleFactor = 0.50;
  //const trendImg = activeCase.addImage(trendSymbol.image);
  //trendImg.resizable = false;
  //trendImg.tintColor = textColor;
  //trendImg.imageSize = new Size(25, 10);
  
  listWidget.addSpacer(4);
  const confirmedCase = listWidget.addStack();
  if( confirmedCaseData == 0 ) {
      confirmedCaseData = Math.abs(Number(caseDayBeforeYesterday.confirmed) - Number(caseYesterday.confirmed));
      
      const confirmedContent = confirmedCase.addText("Today "+formatedNumber(confirmedCaseData));
      var arrowConfirmed = getArrowTrend(Number(caseDayBeforeYesterday.confirmed), Number(caseYesterday.confirmed));
      console.log("Confimed Cases not published for today; Displaying confirmedCaseData = "+Number(caseDayBeforeYesterday.confirmed)+" - "+Number(caseYesterday.confirmed)+" = "+formatedNumber(confirmedCaseData));
      confirmedContent.font = Font.semiboldSystemFont(12);
  } else {
      const confirmedContent = confirmedCase.addText("Today "+formatedNumber(confirmedCaseData));
      var arrowConfirmed = getArrowTrend(Math.abs(Number(caseDayBeforeYesterday.confirmed) - Number(caseYesterday.confirmed)), Number(confirmedCaseData));
      confirmedContent.font = Font.semiboldSystemFont(12);
  }
  
  var arrowColorNumber = getArrowColor(arrowConfirmed, "Confirmed");
  var arrowColor = calculateColor(arrowColorNumber);
  var arrowstartColor = Color.dynamic(new Color(arrowColor.startColor), new Color(arrowColor.darkStartColor));
  var arrowendColor = Color.dynamic(new Color(arrowColor.endColor), new Color(arrowColor.darkEndColor));
  var arrowtextColor = Color.dynamic(new Color(arrowColor.textColor), new Color(arrowColor.darkTextColor));
  
  
  const trendConfirmed = createSymbol(arrowConfirmed);
  const confirmedTrend = confirmedCase.addImage(trendConfirmed.image);
  confirmedTrend.resizable = false;
  confirmedTrend.tintColor = arrowtextColor;
  confirmedTrend.imageSize = new Size(46, 16);
  confirmedCase.centerAlignContent();
  //confirmedContent.textColor = textColor;
  //confirmedCase.minimumScaleFactor = 0.50;


  
  listWidget.addSpacer(4);
  const recoveredCase = listWidget.addStack();
  if( recoveredCaseData == 0 ) {
       recoveredCaseData = Math.abs(Number(caseDayBeforeYesterday.recovered) - Number(caseYesterday.recovered));
       const recoveredContent = recoveredCase.addText("Healed "+formatedNumber(recoveredCaseData));
       var arrowRecovered = getArrowTrend(Number(caseDayBeforeYesterday.recovered), Number(caseYesterday.recovered));
       console.log("Recovered Cases not published for today; Displaying recoveredCaseData = "+Number(caseDayBeforeYesterday.recovered)+" - "+Number(caseYesterday.recovered)+" = "+formatedNumber(recoveredCaseData));
      recoveredContent.font = Font.semiboldSystemFont(12);
  }
  else {
      const recoveredContent = recoveredCase.addText("Healed "+formatedNumber(recoveredCaseData));
      var arrowRecovered = getArrowTrend(Number(Math.abs(Number(caseDayBeforeYesterday.recovered) - Number(caseYesterday.recovered))), Number(recoveredCaseData));
      recoveredContent.font = Font.semiboldSystemFont(12);
  }
  
  arrowColorNumber = getArrowColor(arrowRecovered, "Recovered");
  arrowColor = calculateColor(arrowColorNumber);
  arrowstartColor = Color.dynamic(new Color(arrowColor.startColor), new Color(arrowColor.darkStartColor));
  arrowendColor = Color.dynamic(new Color(arrowColor.endColor), new Color(arrowColor.darkEndColor));
  arrowtextColor = Color.dynamic(new Color(arrowColor.textColor), new Color(arrowColor.darkTextColor));
  
  const trendRecovered = createSymbol(arrowRecovered);
  const recoveredTrend = recoveredCase.addImage(trendRecovered.image);
  recoveredTrend.resizable = false;
  recoveredTrend.tintColor = arrowtextColor;
  recoveredTrend.imageSize = new Size(30, 16);
  recoveredCase.centerAlignContent();
  

  listWidget.addSpacer();
  const locationText = listWidget.addText(location);
  locationText.textColor = textColor;
  locationText.font = Font.regularSystemFont(10);
  locationText.minimumScaleFactor = 0.5;
    
  listWidget.addSpacer(1);
  const updateAt = listWidget.addText(`Updated ${updatedAt}`);
  updateAt.textColor = textColor;
  updateAt.font = Font.regularSystemFont(9);
  updateAt.minimumScaleFactor = 0.6;
    
  return listWidget;
}

//Initilise the widget
let widget = await createWidget();
 
//Run the Widget
if (config.runsInWidget) {
  // Runs inside a widget so add it to the homescreen widget
  Script.setWidget(widget);
} else {
  // Show the medium widget inside the app
  widget.presentSmall();
}

Script.complete();
