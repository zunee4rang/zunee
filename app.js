const formTodo = document.getElementById("todo-form");
const inputTodo = document.querySelector("#todo-form input");
const listTodo = document.getElementById("todo-list");

let todolist = [];

const bgimgs = ["IMG_6377.jpeg","IMG_6381.jpeg","IMG_6382.jpeg","IMG_6387.jpeg"];

function getDateClock() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth()+1).padStart(2,'0');
    const day = String(now.getDate()).padStart(2,'0');
    let hour = now.getHours();
    var ampm = hour >= 12 ? 'pm' : 'am';
    hour = hour % 12;
    hour = hour ? hour : 12;
    hour = String(hour).padStart(2,"0");
    const min = String(now.getMinutes()).padStart(2,"0");
    const sec = String(now.getSeconds()).padStart(2,"0");

    document.getElementById("dateView").innerHTML = `${year}.${month}.${day}`;
    document.getElementById("clockView").innerHTML = `${hour}:${min}:${sec} ${ampm}`;
}

function removeElementByTagName(tagName)
{
    var element = document.getElementsByTagName(tagName);
    for (index = element.length - 1; index >= 0; index--)
    {
        element[index].parentNode.removeChild(element[index]);
    }
}

function getBgImage() {
    removeElementByTagName("img")

    const bgNum = String(Math.floor(Math.random() * bgimgs.length));
    var imagesUrl = bgimgs[bgNum];

    const bgImage = document.createElement("img");
    bgImage.src = `imgs/${imagesUrl}`;

    bgImage.style.width = "100%";
    document.body.appendChild(bgImage);
}
getBgImage();



function deleteToDo(e) {
    const btn = e.target;
    const li = btn.parentNode;
    listTodo.removeChild(li);

    var storagedb = JSON.parse(localStorage.getItem("todoStorage"));
    storagedb = storagedb.filter(function(elem) {
        return elem.id !== parseInt(li.id);
    });
    localStorage.setItem("todoStorage",JSON.stringify(storagedb));

}

function savetodo(todo) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const newId = todolist.length + 1;

    li.appendChild(span);
    const button = document.createElement("button");
    button.innerText = "🗑";
    button.addEventListener("click", deleteToDo);
    li.appendChild(span);
    li.appendChild(button);
    li.id = newId;
    span.innerText = todo;
    listTodo.appendChild(li);

    const obj = {
        text : todo,
        id: newId
    };


    todolist.push(obj)
    localStorage.setItem("todoStorage", JSON.stringify(todolist));  
}

function viewTodo() {
    var todolist = localStorage.getItem("todoStorage");

    if (todolist !== null) {
        const parseTodo = JSON.parse(todolist);
        parseTodo.forEach(function(todo) {
            savetodo(todo.text);
        });
    }
}


function handleToDo(event) {
  event.preventDefault();
  const text = inputTodo.value;
  inputTodo.value = "";
  savetodo(text);
}

viewTodo();

setInterval(getBgImage, 3000);

getDateClock();
setInterval(getDateClock, 1000);

formTodo.addEventListener("submit", handleToDo);

const weather = document.querySelector("#weatherView");

const apiKey = "62725028809ed691d20b1768c57e7fbb";
const coords = 'coords';

function getWeather(lat, lon) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(function(response) {
        return response.json();
    })
    .then(function(json){
        const temp = json.main.temp;
        const place = json.name;
        weather.innerText = `온도: ${temp}, 위치: ${place}`;

    })
}

function saveCoords(obj) {
    localStorage.setItem("coords", JSON.stringify(obj)); 
}

function handleGeoSuccess(posi) {
    const latitude = posi.coords.latitude;
    const longitude = posi.coords.longitude;
    const obj =  {
        latitude,
        longitude
    }

    saveCoords(obj);
    getWeather(latitude, longitude);

}

function handleGeoError() {
    console.log("Error geo location")
}

function reqCoords() {
    navigator.geolocation.getCurrentPosition(handleGeoSuccess, handleGeoError);
}

function loadCoords() {
    const loadedCoords = localStorage.getItem("coords");
    if (loadedCoords === null ){
        reqCoords();
    } else {
        const parseCoords = JSON.parse(loadedCoords);
        getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}

loadCoords();

const formUser = document.querySelector("#login-form");
const inputName = formUser.querySelector("#user");
const loginBtn = formUser.querySelector("#btnLogin");
const h1tag = formUser.querySelector("h1");


function saveUser(text) {
    localStorage.setItem("user", text);
}

function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target;
    const btn1 = btn.value;

    const val = inputName.value;
    
    viewUser(val);
    saveUser(val);
}


function reqUser() {    
    h1tag.innerText = "";
    h1tag.classList.remove("hidden");

    inputName.classList.remove("hidden");
    loginBtn.classList.remove("hidden");
    inputName.value = "";
    formUser.addEventListener("submit", handleSubmit);
}

function viewUser(text) {
    h1tag.innerText = `Hi!!! ${text}`;
    h1tag.classList.remove("hidden");
    inputName.classList.add("hidden");
    loginBtn.classList.add("hidden");

}

function loginUser() {
    const loginUser = localStorage.getItem("user");

    if (loginUser === null ){
        reqUser();
    } else {
        viewUser(loginUser);
    }
}

loginUser();


