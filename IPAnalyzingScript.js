const resultList = document.getElementById('results-list');
let dataArray = [];

document.getElementById('search-form').addEventListener("submit", async function(e) {
    e.preventDefault();

    const IP = document.getElementById('ip-input').value;

    resultList.innerHTML = "";

    if (!IP)
    {
        resultList.innerHTML = "<li>Нужно ввести IP адрес для поиска!</li>";
        return;
    }

    try {
        const data = await fetchIPInfo(IP);
        dataArray = [data];
        renderIPResults(dataArray);
    } catch (e) {
        resultList.innerHTML = `<li>Ошибка запроса: ${e.message}</li>`;
    }
})

async function fetchIPInfo(ip) {
    const url = `http://ip-api.com/json/${encodeURIComponent(ip)}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.status !== "success") {
        throw new Error("Ответ API: " + (data.message || "Неудача"));
    }

    return data;
}

function renderIPResults(dataArray) {
    resultList.innerHTML = "";

    dataArray.forEach(item => {
        const li = document.createElement('li');

        const info = document.createElement('div');
        const typeInfo = getIPType(item.query);
        info.innerHTML = `<strong>${item.query}</strong> - ${item.country || "Неизвестно"} (${item.org || "-"})<br/>
        <small>Тип запроса: <em>${typeInfo}</em></small>`;

        const map = document.createElement('img');

        if (item.lat && item.lon) {
            map.src = `https://staticmap.openstreetmap.de/staticmap.php?center=${item.lat},${item.lon}&zoom=10&size=200x120&markers=${item.lat},${item.lon},red-pushpin`;
        }
        else
        {
            map.src = "no-image_placeholder.webp";
        }

        map.alt = "Карта Мира";
        map.className = "geo-map";
        map.referrerPolicy = "no-referrer";

        li.appendChild(info);
        li.appendChild(map);

        li.addEventListener("click", () => {
            window.open(`details.html?target=${encodeURIComponent(item.query)}`, "_blank");
        });

        resultList.appendChild(li);
    });
}

function getIPType(query) {
    const ipv4 = /^\d{1,3}(\.\d{1,3}){3}$/;
    const ipv6 = /^([a-f0-9:]+:+)+[a-f0-9]+$/i;

    if (ipv4.test(query)) return "IPv4";
    if (ipv6.test(query)) return "IPv6";
    return "Домен";
}

document.getElementById('about-page').addEventListener("click", () => {
    alert("Этот сайт - IP-Геолокатор, использующий открытый API с ip-api.com для возможности определения геопозиции по введенному IP адресу");
});