const params = new URLSearchParams(window.location.search);
const target = params.get("target");
let ipData = null;

async function loadDetails() {
    if (!target) {
        document.getElementById('info').textContent = "IP Не найден/не передан.";
        return;
    }

    let url = `http://ip-api.com/json/${encodeURIComponent(target)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Ошибка загрузки данных");

        const data = await response.json();
        if (data.status !== "success") throw new Error("IP Не найден!");

        ipData = {
            "IP-Адрес": data.query,
            "Страна": data.country || "Неизвестно",
            "Регион": data.regionName || "Неизвестно",
            "Город": data.city || "Неизвестно",
            "ZIP-Код": data.zip || "Неизвестно",
            "Часовой пояс": data.timezone || "Неизвестно",
            "AS": data.as || "Неизвестно",
            "Провайдер": data.isp || "Неизвестно",
            "Организация": data.org || "Неизвестно",
            "Прокси": data.proxy ? "Да" : "Нет"
        };

        const table = document.querySelector('#ip-table tbody');
        table.innerHTML = "";
        const rows = [
            ["IP", data.query],
            ["Страна", data.country],
            ["Регион", data.regionName],
            ["Город", data.city],
            ["ZIP-Код", data.zip],
            ["Часовой пояс", data.timezone],
            ["Мобильный", data.mobile ? "Да" : "Нет"],
            ["Прокси", data.proxy ? "Да" : "Нет"],
            ["Хостинг", data.hosting ? "Да" : "Нет"],
            ["Провайдер", data.isp],
            ["Организация", data.org],
            ["AS", data.as]
        ];

        rows.forEach(([label, value]) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td><strong>${label}</strong></td><td>${value}</td>`;
            table.appendChild(row);
        });
    } catch (e) {
        document.getElementById("ip-table tbody").textContent = "Ошибка: " + e.message;
    }
}

document.getElementById('save-json').addEventListener("click", () => {
    if (!ipData) {
        alert("Нет данных для сохранения!");
        return;
    }

    const json = JSON.stringify(ipData, null, 2);
    const blob = new Blob([json], {type: "application/json"});

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${ipData["IP-Адрес"] || "ip-info"}.json`;
    a.click();
});

setTimeout(loadDetails, 1000);