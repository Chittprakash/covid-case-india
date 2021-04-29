# covid-case-india
iOS Scriptable Widget to show Total, Daily Active and Recovered cases

<img src="https://raw.githubusercontent.com/Chittprakash/covid-case-india/main/Screen%20Shot%202021-04-29%20at%2010.04.37%20PM.png">

I have not been able to add the complete list of all the State details for India. 
Please update the STATE_DATE for stateCode, stateName and state , if the Widget does not pull stats for your city

Source
https://api.covid19india.org/states_daily.json

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
