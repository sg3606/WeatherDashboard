var cities = document.querySelector('#city');
var search = document.querySelector('#submitbtn');
var now = document.querySelector('#weatherNow')

function getWeather(event) {
    event.preventDefault();
    weathertoday();
}

function weathertoday(){
    var api_key = 'be617f0a2a928440246df40a1f51db8c';
    var inputcity = cities.value;
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + inputcity +'&units=imperial&appid=' + api_key;
    now.classList.add("list-group")

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

function unixtodate(unix){
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var findDate = new Date(unix * 1000);
    var year = findDate.getFullYear();
    var date = findDate.getDate();
    var month = months[findDate.getMonth()];
    var unixtoDate = date + '-' + month + '-' + year;
    return unixtoDate;
}

console.log(unixtodate(1615924800))
// function forecastWeather() {
//     api.openweathermap.org/data/2.5/forecast/daily?q=seattle&cnt=5&appid=be617f0a2a928440246df40a1f51db8c
// }

search.addEventListener('click',getWeather);