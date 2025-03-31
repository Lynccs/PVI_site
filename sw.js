// Ім'я кешу
const CACHE_NAME = "pwa-cache-v1";

// Файли для кешування
const ASSETS = [
    "./Student/student.html",
    "./Student/student.css",
    "./Student/student.js",
    "./Student/common.css",
    "./Student/common.js",
    "./Dashboard/dashboard.html",
    "./Tasks/tasks.html",
    /*"/Icon",*/
    "/Icon/LogoNewRes.png",
    "/Icon/icon128.png",
    "/Icon/icon192.png",
    "/Icon/icon256.png",
    "/Icon/icon512.png",
    "/Icon/screenshot1.png"
];
/*
// Встановлення Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log("Кешування ресурсів...");

            // Кешуємо кожен файл окремо, пропускаючи помилки
            for (let asset of ASSETS) {
                try {
                    const response = await fetch(asset);
                    if (response.ok) {
                        await cache.put(asset, response);
                    } else {
                        console.warn(`❌ Не вдалося кешувати ${asset}: ${response.statusText}`);
                    }
                } catch (error) {
                    console.warn(`❌ Помилка кешування ${asset}:`, error);
                }
            }
        }).catch((error) => console.error("Помилка кешування:", error))
    );
})

// Активація Service Worker
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => {
            console.log("Новий Service Worker активовано.");
            return self.clients.claim();
        })
    );
});

// Обробка запитів
self.addEventListener("fetch", (event) => {
    const requestUrl = event.request.url;

    // Ігноруємо не HTTP-запити (наприклад, Chrome Extensions)
    if (!requestUrl.startsWith("http") || requestUrl.includes("chrome-extension")) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;

            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || !networkResponse.ok) return networkResponse;

                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => new Response("Помилка мережі", { status: 408, statusText: "Network Error" }));
        })
    );
});*/

    // Подія встановлення Service Worker
    // Відбувається при першому запуску або коли SW оновлюється
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Кешування ресурсів...");
            return Promise.all(
                ASSETS.map((asset) =>
                    cache.add(asset).catch((err) => console.error("Помилка кешування:", asset, err))
                )
            );
        })
    );
});


// Подія обробки запитів від клієнта (браузера)
    // Якщо файл є в кеші – повертаємо його, інакше робимо запит до мережі
self.addEventListener("fetch", (event) => {
    // Якщо URL починається з "chrome-extension", пропускаємо кешування
    if (event.request.url.startsWith("chrome-extension")) {
        return;
    }

    event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const networkFetch = fetch(event.request).then((networkResponse) => {
                    cache.put(event.request, networkResponse.clone()).catch(console.error);
                    return networkResponse;
                });

                return cachedResponse || networkFetch;
            });
        })
    );
});


    // Подія активації Service Worker
    // Видаляє старі кеші, які більше не використовуються
    self.addEventListener("activate", (event) => {
        event.waitUntil(
            caches.keys().then((keys) => {
                return Promise.all(
                    keys
                        .filter((key) => key !== CACHE_NAME) // Знаходимо старі кеші
                        .map((key) => caches.delete(key))   // Видаляємо їх
                );
            }).then(() => {
                console.log("Новий Service Worker активовано.");
                return self.clients.claim(); // Переключаємо новий SW для всіх вкладок
            })
        );
    });