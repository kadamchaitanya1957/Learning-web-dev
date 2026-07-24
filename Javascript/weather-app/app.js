let inp = document.querySelector("input");
let btn = document.querySelector("button");
btn.addEventListener("click",function(){
    let search = inp.value;
    getWeather(search);
})

function degToCompass(deg){
    if((0<=deg && deg<22.5)||(337.5<=deg && deg<=360)){
        return "N";
    }
    else if(22.5<=deg && deg<67.5){
        return"NE";
    }
   else if(67.5<=deg && deg<112.5){
        return"E";
    }   
    else if(112.5<=deg && deg<157.5){
        return"SE";
    }   
    else if(157.5<=deg && deg<202.5){
        return"S";
    }
    else if(202.5<=deg && deg<247.5){
        return"SW";
    } 
    else if(247.5<=deg && deg<292.5){
        return"W";
    }   
    else if(292.5<=deg && deg<337.5){
        return"NW";
    }                                                                                                                                                                                                                                                              
}

function getLocalTimeForCity(timezoneOffsetSeconds) {
  const utcMillis = Date.now(); 
  const localMillis = utcMillis + (timezoneOffsetSeconds * 1000); 
  const localTime = new Date(localMillis);

  
  const hours = localTime.getUTCHours().toString().padStart(2, "0");
  const minutes = localTime.getUTCMinutes().toString().padStart(2, "0");
 

  return `${hours}:${minutes}`;
}




async function getWeather(search){
  try{
   let url = `https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=eca5eed12c5411fb464d804c0a3847eb`;
let response = await axios.get(url);

let weather = response.data;

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
console.log("Country name:", regionNames.of(weather.sys.country)); 
console.log("city name: ",weather.name);
console.log("Main tempertature: ",weather.main.temp,"°C");
console.log("Feels like: ",weather.main.feels_like,"°C");
console.log("Minimum Temperature: ",weather.main.temp_min,"°C");
console.log("Maximum Temperatue: ",weather.main.temp_max,"°C");
console.log("Humidity: ",weather.main.humidity,"%");
console.log("Pressure: ",weather.main.pressure,"hPa");
console.log("Description:  ",weather.weather[0].description);
console.log("Main: ",weather.weather[0].main);

const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
console.log("Icon URL:", iconUrl);
console.log("Wind speed: ",weather.wind.speed,"m/s");

console.log("Wind direction: ", degToCompass(weather.wind.deg),`[${weather.wind.deg} degrees]`); 
console.log("Visibility: ",weather.visibility,"m");

console.log("Local time: ", getLocalTimeForCity(weather.timezone));
 }
  
    catch(e){
        console.log("error",e);
    }
}