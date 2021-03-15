self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", "./css/gazetteer.css", "./css/leaflet.awesome-markers.css", "./js/countryBorders.geo.json", "./js/jquery-2.2.3.min.js", "./js/script.js", "./markerCluster/leaflet.markercluster.js", "./markerCluster/MarkerCluster.css", "./markerCluster/MarkerCluster.Default.css"]);
        })
    );
});

self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});
