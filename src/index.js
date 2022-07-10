function displayHTML(data) {
	// Before displaying the weather for the requested city, we first clear out the old display
	document.querySelector("section").innerHTML = "";

	displayWeather(Object.assign(data.city, data.list[0]));
	for (let i = 1; i < 5; i++) forecastWeather(data.list[i * 8]);
}

function displayWeather(data) {
	let displayWeather = document.createElement("div");
	let cityName = document.createElement("p");
	let day = document.createElement("p");
	let weatherIcon = document.createElement("figure");
	let weatherIconImg = document.createElement("img");
	let temp = document.createElement("p");
	let weather = document.createElement("p");
	let etc = document.createElement("div");
	let etcDiv1 = document.createElement("div");
	let etcDiv2 = document.createElement("div");
	let wind = document.createElement("p");
	let humidity = document.createElement("p");
	let pressure = document.createElement("p");
	let cloudiness = document.createElement("p");

	document.querySelector("section").appendChild(displayWeather);
	displayWeather.appendChild(cityName);
	displayWeather.appendChild(day);
	displayWeather.appendChild(weatherIcon);
	weatherIcon.appendChild(weatherIconImg);
	displayWeather.appendChild(temp);
	displayWeather.appendChild(weather);
	displayWeather.appendChild(etc);
	etc.appendChild(etcDiv1);
	etc.appendChild(etcDiv2);
	etcDiv1.appendChild(wind);
	etcDiv1.appendChild(humidity);
	etcDiv2.appendChild(pressure);
	etcDiv2.appendChild(cloudiness);

	displayWeather.id = "displayWeather";
	cityName.className = "cityName";
	day.className = "day";
	weatherIcon.className = "weatherIcon";
	weatherIconImg.setAttribute(
		"src",
		"http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
	);
	weatherIconImg.setAttribute("alt", "weather icon");
	temp.className = "temp";
	weather.className = "weather";
	etc.className = "etc";
	wind.className = "wind";
	humidity.className = "humidity";
	pressure.className = "pressure";
	cloudiness.className = "cloudiness";

	cityName.textContent = data.name;
	day.textContent = new Date(data.dt_txt).toLocaleString("en-us", {
		weekday: "long",
	});
	temp.textContent = data.main.temp + "°C";
	weather.textContent = data.weather[0].description;
	wind.textContent = `wind: ${data.wind.speed}m/s`;
	humidity.textContent = `humidity: ${data.main.humidity}%`;
	pressure.textContent = `pressure: ${data.main.pressure}hPa`;
	cloudiness.textContent = `cloudiness: ${data.clouds.all}%`;
}

function forecastWeather(data) {
	let forecastWeather;
	if (!document.querySelector("#forecastWeather")) {
		forecastWeather = document.createElement("div");
		document.querySelector("section").appendChild(forecastWeather);
		forecastWeather.setAttribute("id", "forecastWeather");
	} else {
		forecastWeather = document.querySelector("#forecastWeather");
	}
	let div = document.createElement("div");
	let day = document.createElement("p");
	let weatherIcon = document.createElement("figure");
	let weatherIconImg = document.createElement("img");
	let temp = document.createElement("p");
	let weather = document.createElement("p");

	forecastWeather.appendChild(div);
	div.appendChild(day);
	div.appendChild(weatherIcon);
	weatherIcon.appendChild(weatherIconImg);
	div.appendChild(temp);
	div.appendChild(weather);

	day.className = "day";
	weatherIcon.className = "weatherIcon";
	weatherIconImg.setAttribute(
		"src",
		"http://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
	);
	weatherIconImg.setAttribute("alt", "weather icon");
	temp.className = "temp";
	weather.className = "weather";

	day.textContent = new Date(data.dt_txt).toLocaleString("en-us", {
		weekday: "long",
	});
	temp.textContent = data.main.temp + "°C";
	weather.textContent = data.weather[0].description;
}

var inputCity = document.querySelector("input#city");
var matches = [];
var matchesCountry = [];
var matchesID = [];
var list = [];

/* We call the citylist JSON file and find & display the matches for autocomplete */
inputCity.addEventListener("input", function (e) {
	let userInput = e.target.value;
	let results = document.querySelector("#results");

	if (!userInput) {
		results.innerHTML = "";
		return;
	} else {
		let xhr = new XMLHttpRequest();
		xhr.open("GET", "city.list.min.json");
		xhr.addEventListener("load", function (e) {
			if (xhr.status == 200) {
				/* We empty and recycle these arrays below for every new user input in the searchfield */
				matches = [];
				matchesCountry = [];
				matchesID = [];
				list = [];

				/* We create three arrays for the matching city's name, country code, and ID */
				let cityList = JSON.parse(xhr.responseText);
				for (
					let i = 0, c = cityList.length, countMatch = 0;
					i < c;
					i++
				) {
					if (countMatch === 10) break;
					if (
						cityList[i].name
							.toLowerCase()
							.startsWith(userInput.toLowerCase())
					) {
						matches.push(cityList[i].name);
						matchesCountry.push(cityList[i].country);
						matchesID.push(cityList[i].id);
						countMatch++;
					}
				}

				/* some sorting going on here */
				for (let k = 0; k < matches.length; k++)
					list.push({
						name: matches[k],
						country: matchesCountry[k],
						ID: matchesID[k],
					});
				list.sort(function (a, b) {
					return a.name < b.name ? -1 : a.name == b.name ? 0 : 1;
				});
				for (let l = 0; l < list.length; l++) {
					matches[l] = list[l].name;
					matchesCountry[l] = list[l].country;
					matchesID[l] = list[l].ID;
				}

				results.innerHTML = "";
				for (let j = 0, c = matches.length; j < c; j++) {
					/* First, we create each match in the results div ! */
					let match = document.createElement("div");
					match.innerHTML =
						matches[j] +
						"<span> - - " +
						matchesCountry[j] +
						"</span>";
					results.appendChild(match);

					/* Then, we add the mouse event to each match ! */
					match.addEventListener("mouseover", function (e) {
						e.target.className = "targetedByMouse";
					});
					match.addEventListener("mouseout", function (e) {
						e.target.classList.remove("targetedByMouse");
					});
					match.addEventListener("click", function (e) {
						inputCity.value = matches[j];
						results.innerHTML = "";
						inputCity.focus();
					});
				}
				/* my autocomplet gives focus to the first match, like Google */
				results.firstElementChild.className = "targetedByArrow";
			} else {
				alert(xhr.statusText);
			}
		});
		xhr.send(null);
	}
});

/* We call the weather API to retrieve the weather data and call my function to display the relevant info */
inputCity.addEventListener("keyup", function (e) {
	if (e.key === "Enter" && !results.innerHTML) {
		let cityName = e.target.value;
		let city = matchesID[matches.indexOf(cityName)];
		let units = "metric";
		fetch(
			`/.netlify/functions/fetch-weather?id=${city}&units=${units}`
		).then((res) => {
			displayHTML(JSON.parse(res));
		});
	}
});

/* We set arrow key events for browsing through the autocomplete matches */
inputCity.addEventListener("keyup", function (e) {
	if (e.key === "Enter" && document.querySelector(".targetedByArrow")) {
		let span = document.querySelector(".targetedByArrow span");
		document.querySelector(".targetedByArrow").removeChild(span);
		e.target.value = document.querySelector(".targetedByArrow").textContent;
		// I'm sure there's a better way out there, but I had to rush !!!
		results.innerHTML = "";
	} else if (e.key === "ArrowUp" && results.innerHTML) {
		if (!document.querySelector(".targetedByArrow")) {
			results.lastElementChild.setAttribute("class", "targetedByArrow");
		} else {
			let targetedByArrow = document.querySelector(".targetedByArrow");
			if (targetedByArrow.previousElementSibling) {
				targetedByArrow.previousElementSibling.setAttribute(
					"class",
					"targetedByArrow"
				);
				targetedByArrow.classList.remove("targetedByArrow");
			} else {
				targetedByArrow.parentNode.lastElementChild.setAttribute(
					"class",
					"targetedByArrow"
				);
				targetedByArrow.classList.remove("targetedByArrow");
			}
		}
	} else if (e.key === "ArrowDown" && results.innerHTML) {
		if (!document.querySelector(".targetedByArrow")) {
			results.firstElementChild.setAttribute("class", "targetedByArrow");
		} else {
			let targetedByArrow = document.querySelector(".targetedByArrow");
			if (targetedByArrow.nextElementSibling) {
				targetedByArrow.nextElementSibling.setAttribute(
					"class",
					"targetedByArrow"
				);
				targetedByArrow.classList.remove("targetedByArrow");
			} else {
				targetedByArrow.parentNode.firstElementChild.setAttribute(
					"class",
					"targetedByArrow"
				);
				targetedByArrow.classList.remove("targetedByArrow");
			}
		}
	} else if (e.key === "Escape") {
		results.innerHTML = "";
	} else return;
});

/* Just adding a fun extra feature to let the user change the background color */
let spanColor = document.querySelector("#color");
spanColor.addEventListener("click", function (e) {
	if (document.querySelector("#displayWeather")) {
		let inputColor = document.createElement("input");
		inputColor.setAttribute("type", "text");
		inputColor.setAttribute("name", "color");
		inputColor.setAttribute("id", "color");
		inputColor.setAttribute("value", "hotpink");
		inputColor.setAttribute("size", "6");
		spanColor.parentNode.replaceChild(inputColor, spanColor);
		inputColor.addEventListener("keyup", function (e) {
			if (e.key === "Enter") {
				document.querySelector("#displayWeather").style.background =
					e.target.value;
				let forecastWeatherDivs = Array.from(
					document.querySelectorAll("#forecastWeather>div")
				);
				for (let i = 0, c = forecastWeatherDivs.length; i < c; i++) {
					forecastWeatherDivs[i].style.background = e.target.value;
				}
				if (
					document.querySelector("#displayWeather").style.background
				) {
					let spanColor = document.createElement("span");
					spanColor.setAttribute("id", "color");
					spanColor.textContent = e.target.value + " ";
					e.target.parentNode.replaceChild(spanColor, e.target);
				}
			}
		});
	}
});
