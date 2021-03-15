var cities = document.querySelector('#city');
var search = document.querySelector('#submitbtn');
var now = document.querySelector('#weatherNow')

function getWeather(event) {
    event.preventDefault();
    var forecastlist = document.querySelector('#Forecast');
    forecastlist.textContent = '';
    weathertoday();
    getforecast();
}

function weathertoday(){
    var api_key = 'be617f0a2a928440246df40a1f51db8c';
    var inputcity = cities.value;
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + inputcity +'&units=imperial&appid=' + api_key;
    now.setAttribute("class","list-group");

    fetch(url)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var getname = document.querySelector('#cityname');
            var gettemp = document.querySelector('#temperature');
            var gethumidity = document.querySelector('#humidity');
            var getwind = document.querySelector('#wind');
            var getdate = data.dt;
            var showdate = unixtodate(getdate)

            getname.textContent = data.name + ' ' + showdate;
            gettemp.textContent = 'Temperature: '+ data.main.temp + ' ℉';
            gethumidity.textContent = 'Humidity: '+ data.main.humidity +' %';
            getwind.textContent = 'Wind Speed: '+ data.wind.speed + 'MPH'

            var lon_city = data.coord.lon;
            var lat_city = data.coord.lat;

            var uv_url = 'http://api.openweathermap.org/data/2.5/uvi?lat='+ lat_city +'&lon=' +lon_city+ '&appid=' + api_key;
            fetch(uv_url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var getuv = document.querySelector('#uv');
                getuv.textContent = 'UV Index: '+ data.value;
            });
        });
}

function getforecast(){
    var api_key = 'be617f0a2a928440246df40a1f51db8c';
    var inputcity = cities.value;
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + inputcity +'&units=imperial&appid=' + api_key;

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
                    var li_temp = document.createElement('li');
                    var li_humidity = document.createElement('li');

                    forecast5day.setAttribute("id","day");
                    listul.setAttribute("id","forecastday");

                    li_date.textContent = unixtodate(data.daily[i+1].dt);
                    li_temp.textContent = 'Temp: '+ data.daily[i+1].temp.day;
                    li_humidity.textContent = 'Humidity: '+ data.daily[i+1].humidity;
                    
                    forecastlist.appendChild(forecast5day);
                    forecast5day.appendChild(listul);
                    listul.appendChild(li_date);
                    listul.appendChild(li_temp);
                    listul.appendChild(li_humidity);
                }

            });

        });
}

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
