# covid-case-india
## iOS Scriptable Widget to show Total, Daily Active and Recovered cases

## Changes needed 
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

# How to setup
- Install scriptable app ( https://apps.apple.com/us/app/scriptable/id1405459188 )
- Copy the code : covid_data_india.js
- Createt a new script and pase the code 
- In iOS add a new Scriptable Widget and choose the created script.

# Widget ScreenShots

<img src="https://raw.githubusercontent.com/Chittprakash/covid-case-india/main/Screen%20Shot%202021-04-29%20at%2010.04.37%20PM.png">
<img src="https://github.com/Chittprakash/covid-case-india/blob/main/IMG_1890.PNG?raw=true">

## Contact
- Chittprakash Agnihotri
- chittprakash@gmail.com
