var cities = document.querySelector('#city');
var search = document.querySelector('#submitbtn');
var clear = document.querySelector('#clearbtn');
var now = document.querySelector('#weatherNow');
var searchfromhistory = document.querySelector('#historyBtn');

// show weather by search
function getWeather(event) {
    event.preventDefault();
    var forecastlist = document.querySelector('#Forecast');
    forecastlist.textContent = '';
    var inputcity = cities.value;
    weathertoday(inputcity);
    getforecast(inputcity);
}

// remove all history
function removehistory(event) {
    event.preventDefault();
    localStorage.clear();
    var historysearch = document.querySelector('#historyBtn');
    historysearch.textContent = '';
}

// show weather by click history search
function gethistoryWeather(event) {
    event.preventDefault();
    var forecastlist = document.querySelector('#Forecast');
    forecastlist.textContent = '';
    var input_history = event.target.textContent;
    weathertoday(input_history);
    getforecast(input_history);
}

//get today weather data
function weathertoday(myinput){
    var api_key = 'be617f0a2a928440246df40a1f51db8c';
    // var inputcity = cities.value;
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + myinput +'&units=imperial&appid=' + api_key;
    now.setAttribute("class","list-group");
    fetch(url)
        .then(function (response) {
            if (response.status === 400 || response.status === 404) {
                alert('City Not Found')
                window.location.reload();
              } else {
                return response.json();
              }
        })
        .then(function (data) {
            var getname = document.querySelector('#cityname');
            var gettemp = document.querySelector('#temperature');
            var gethumidity = document.querySelector('#humidity');
            var getwind = document.querySelector('#wind');
            var getdate = data.dt;
            var showdate = unixtodate(getdate);

            if (localStorage.getItem("inputCity") == null){
                localStorage.setItem("inputCity",data.name);

                var historysearch = document.querySelector('#historyBtn');
                var HistoryBtnEl = document.createElement('button');
                HistoryBtnEl.setAttribute("class","btn");
                HistoryBtnEl.setAttribute("id","thisbtn");
                HistoryBtnEl.textContent = data.name;
                historysearch.appendChild(HistoryBtnEl);
            } else {
                var inputcitylist = localStorage.getItem("inputCity")
                localStorage.setItem("inputCity",inputcitylist+'-'+data.name);

                var arrayCity = inputcitylist.split("-");
                if (arrayCity.includes(data.name)) {
                    getname.textContent = data.name + ' ' + showdate;
                    gettemp.textContent = 'Temperature: '+ data.main.temp + ' ℉';
                    gethumidity.textContent = 'Humidity: '+ data.main.humidity +' %';
                    getwind.textContent = 'Wind Speed: '+ data.wind.speed + 'MPH'
                } else {
                    var historysearch = document.querySelector('#historyBtn');
                    var HistoryBtnEl = document.createElement('button');
                    HistoryBtnEl.setAttribute("class","btn");
                    HistoryBtnEl.setAttribute("id","thisbtn");
                    HistoryBtnEl.textContent = data.name;
                    historysearch.appendChild(HistoryBtnEl);
                }
            }

            var icon_url = 'http://openweathermap.org/img/wn/'+data.weather[0].icon+'@2x.png';
            getname.innerHTML = data.name + ' ' + showdate + '<img src="'+ icon_url +'" width="40" height="40">';
            gettemp.textContent = 'Temperature: '+ data.main.temp + ' ℉';
            gethumidity.textContent = 'Humidity: '+ data.main.humidity +' %';
            getwind.textContent = 'Wind Speed: '+ data.wind.speed + 'MPH'

            var lon_city = data.coord.lon;
            var lat_city = data.coord.lat;

            var uv_url = 'https://api.openweathermap.org/data/2.5/uvi?lat='+ lat_city +'&lon=' +lon_city+ '&appid=' + api_key;
            fetch(uv_url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var getuv = document.querySelector('#uv');
                if(data.value < 3){
                    getuv.setAttribute("class","lowuv")
                }else if (data.value > 3 && data.value < 6) {
                    getuv.setAttribute("class","moderateuv")
                }else if (data.value > 6 && data.value < 8) {
                    getuv.setAttribute("class","highuv")
                }else if (data.value > 8 && data.value < 11) {
                    getuv.setAttribute("class","veryhighuv")
                }else{
                    getuv.setAttribute("class","extremeuv")
                }
                getuv.textContent = 'UV Index: '+ data.value;
            });
        });
}

//get forecast weather data
function getforecast(myforecast){
    var api_key = 'be617f0a2a928440246df40a1f51db8c';
    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + myforecast +'&units=imperial&appid=' + api_key;

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var lon_city = data.coord.lon;
            var lat_city = data.coord.lat;

            var forecast_url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' +lat_city+ '&lon=' +lon_city+ '&units=imperial&exclude=minutely,hourly&appid=' + api_key
            fetch(forecast_url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var forecastlist = document.querySelector('#Forecast');
                var titleEl = document.querySelector('h3');
                titleEl.textContent = '5-Day Forecast';
                for (let i = 0; i < 5; i++) {
                    var forecast5day = document.createElement('div');
                    var listul = document.createElement('ul');
                    var li_date = document.createElement('li');
                    var li_icon = document.createElement('li');
                    var li_temp = document.createElement('li');
                    var li_humidity = document.createElement('li');
                    var forecasticon = data.daily[i+1].weather[0].icon;
                    var forecast_url = 'http://openweathermap.org/img/wn/'+forecasticon+'@2x.png';
                    forecast5day.setAttribute("id","day");
                    listul.setAttribute("id","forecastday");

                    li_date.textContent = unixtodate(data.daily[i+1].dt);
                    li_icon.innerHTML = '<img src="'+ forecast_url +'" width="40" height="40">'
                    li_temp.textContent = 'Temp: '+ data.daily[i+1].temp.day;
                    li_humidity.textContent = 'Humidity: '+ data.daily[i+1].humidity;
                    
                    forecastlist.appendChild(forecast5day);
                    forecast5day.appendChild(listul);
                    listul.appendChild(li_date);
                    listul.appendChild(li_icon);
                    listul.appendChild(li_temp);
                    listul.appendChild(li_humidity);
                }

            });

        });
}

// save search input into search history
function history(){
    var allcities = localStorage.getItem("inputCity")
    if (allcities == null){
        return allcities;
    } else {
    var cityarray = allcities.split("-");
    var checkrepeat = new Set(cityarray);
    var backtoarry = [...checkrepeat]

    for (let i = 0; i < backtoarry.length; i++) {
        var historysearch = document.querySelector('#historyBtn');
        var HistoryBtnEl = document.createElement('button');
        HistoryBtnEl.setAttribute("class","btn");
        HistoryBtnEl.setAttribute("id","thisbtn");
        HistoryBtnEl.textContent = backtoarry[i];
        historysearch.appendChild(HistoryBtnEl);
    }
    }
}

// convert unix date to regular data
function unixtodate(unix){
    var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
    var findDate = new Date(unix * 1000);
    var year = findDate.getFullYear();
    var date = findDate.getDate();
    var month = months[findDate.getMonth()];
    var unixtoDate = month  + '/' + date + '/' + year;
    return unixtoDate;
}


search.addEventListener('click',getWeather);
clear.addEventListener('click',removehistory);
if(searchfromhistory){
    searchfromhistory.addEventListener('click',gethistoryWeather);
}

history();