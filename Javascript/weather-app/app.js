let inp = document.querySelector("input");  //search input
let btn = document.querySelector("button"); //search button
const originalText = btn.innerText;         
btn.addEventListener("click", function () {
    let search = inp.value;
    getWeather(search);
});
inp.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        let search = inp.value;
        getWeather(search);
    }
});

//function to pass a direction based on the degree input by the api

function degToCompass(deg) {
    if ((0 <= deg && deg < 22.5) || (337.5 <= deg && deg <= 360)) {
        return "N";
    }
    else if (22.5 <= deg && deg < 67.5) {
        return "NE";
    }
    else if (67.5 <= deg && deg < 112.5) {
        return "E"; 
    }
    else if (112.5 <= deg && deg < 157.5) {
        return "SE";
    }
    else if (157.5 <= deg && deg < 202.5) {
        return "S";
    }
    else if (202.5 <= deg && deg < 247.5) {
        return "SW";
    }
    else if (247.5 <= deg && deg < 292.5) {
        return "W";
    }
    else if (292.5 <= deg && deg < 337.5) {
        return "NW";
    }
}

//function to get local time of that city as  the api returns only in how many seconds ahead it is of the gmt.
// Date.now gives the number of milliseconds from 1 january 1970 called the (Unix epoch)

function getLocalTimeForCity(timezoneOffsetSeconds) {
    const utcMillis = Date.now();                        
    const localMillis = utcMillis + (timezoneOffsetSeconds * 1000); //converts seconds into milliseconds and gives number of milliseconds for target city
    const localTime = new Date(localMillis);    // this gives an object which understands the milliseconds as a date

    const hours = localTime.getUTCHours().toString().padStart(2, "0");   // this gives 2 digits for hours it its one it adds 0 in front
    const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");  //  this gives 2 digits for minutes it its one it adds 0 in front
    const date = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "short",
    hour12: true,
   });

    
    return `${hours}:${minutes} , ${date.format(localTime)}`;
}

// this function format time converts the milliseonds input from api to local time for sunrise and sunset

function formatTime(unixTime, timezoneOffsetSeconds) { 
    // Unix time is in UTC
    const utcMillis = unixTime * 1000;
    // Shift to the city's local time
    const localMillis = utcMillis + (timezoneOffsetSeconds * 1000);
    const date = new Date(localMillis);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC"  
    });
}

// A function that gives the forecast for next 24 hours this data is given by api in a 3hr timestamp manner
// in these 3 hr intervals 8 stamps conclude to be 24 hours of data 

function next24hr(list){
    for(let i =0 ; i<=7; i++){    // as the api returns a 3 hr timestamp and hence with 8 array indexes we get 24 hrs a day
        let dateandtime = new Date(list[i].dt_txt);
        let hrs = dateandtime.getHours().toString().padStart(2, "0");
        let mins = dateandtime.getMinutes().toString().padStart(2, "0");
        console.log(`${hrs}:${mins}`);
        console.log(`${list[i].main.temp}°C` );
        console.log(list[i].weather[0].description);
        const icon = `https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`;
        console.log(icon);
        console.log(`${list[i].wind.speed} m/s`);
        console.log(` ${degToCompass(list[i].wind.deg)} (${list[i].wind.deg}°)`);
    }
}

//function for forecatsing next  4 days of data this data is same as for the 24 hr  function
// the only differnece being here we mostly use the indexes after first 8 skipping the first 24 hours

function next4days(list){
    console.log(list);
    let lowtemp =[];     //storing  the lowest temperature at each timestamp
    let hightemp = [];   //storing  the highest temperature at each timestamp
    let dates = [];      //storing the dates for next 4 days 
    let icons = [];      //storing icons describing the weather 
    let windspeed = [];  //windspeed for the next 4 days
    let day =[];         //day of the week
    let max=[];          //stores max temperature of the 8 timestamps
    let min=[];          //stores min temperature of the 8 timestamps
    const days =[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let count = 1;
    
    for(let i=8;i<=39;i++){
        lowtemp.push(list[i].main.temp_min);
        hightemp.push(list[i].main.temp_max);
         if(count>8 || i==39){ 
            max.push(Math.max(...hightemp));
            min.push(Math.min(...lowtemp));
            hightemp=[];
            lowtemp=[];
            count=1;
         }
         if(count === 4){
            let x = new Date(list[i].dt_txt);
            day.push(x.getDay());
            dates.push(`${x.getDate()}/${x.getMonth()+1}`);
            
            const icon = `https://openweathermap.org/img/wn/${list[i].weather[0].icon}@2x.png`;
            icons.push(icon);
            windspeed.push(list[i].wind.speed);
         }        
        count++;
    }
      
        for(let i=0; i<=3; i++){
        console.log("Day",i);
        console.log(dates[i]);
        console.log(days[day[i]]);
        console.log(max[i],"°C");
        console.log(min[i],"°C");
        console.log(icons[i]);
        console.log(windspeed[i],"m/s");
      }
    
}
function checkAirQuality(pollution){
   const aqi = {
    1:"Good",
    2:"Fair",
    3:"Moderate", 
    4:"Poor",
    5:"Very Poor"
   };
   return aqi[pollution.data.list[0].main.aqi];
}

async function getWeather(search) {
    btn.disabled = true;
    btn.innerText ="Loading";
    try {

        let url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=eca5eed12c5411fb464d804c0a3847eb`;
        let response = await axios.get(url);
        console.log(response);

        let weather = response.data;

        const regionNames = new Intl.DisplayNames(['en'], { type: 'region' }); // displays full name of initials 
        console.log("Country name:", regionNames.of(weather.sys.country));
        console.log("city name: ", weather.name);
        console.log("Main tempertature: ", weather.main.temp, "°C");
        console.log("Feels like: ", weather.main.feels_like, "°C");
        console.log("Minimum Temperature: ", weather.main.temp_min, "°C");
        console.log("Maximum Temperatue: ", weather.main.temp_max, "°C");
        console.log("Humidity: ", weather.main.humidity, "%");
        console.log("Pressure: ", weather.main.pressure, "hPa");
        console.log("Description:  ", weather.weather[0].description);
        console.log("Main: ", weather.weather[0].main);

        const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;   //this api call returns the image link
        console.log("Icon URL:", iconUrl);
        console.log("Wind speed: ", weather.wind.speed, "m/s");

        console.log(`Wind direction: ${degToCompass(weather.wind.deg)} (${weather.wind.deg}°)`);
        console.log("Visibility: ", weather.visibility/1000, "km");

        console.log("Local time: ", getLocalTimeForCity(weather.timezone));
        console.log("Clouds: ",weather.clouds.all,"%");
        console.log("Sunrise: ",formatTime(weather.sys.sunrise,weather.timezone));
        console.log("Susnset :",formatTime(weather.sys.sunset,weather.timezone));
        let url1 = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weather.coord.lat}&lon=${weather.coord.lon}&appid=eca5eed12c5411fb464d804c0a3847eb` //aqi api call
        let pollution = await axios.get(url1);
        console.log(checkAirQuality(pollution));

        console.log("the api data of the forecast is :");
        let url2 =`https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&appid=eca5eed12c5411fb464d804c0a3847eb`; //forecast api call
        let forecast = await axios.get(url2);
        console.log("The 24 hour forecast data: ");
        next24hr(forecast.data.list);

        console.log("The 4 day forecast:");
        next4days(forecast.data.list);
    }

    catch (e) {
        console.log("error:", e);
        console.log("This city is not found");
    }
    finally{
          btn.disabled = false;
          btn.innerText = originalText;
    }
} 