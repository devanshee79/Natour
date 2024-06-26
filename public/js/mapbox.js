export const initMap1 = tour => {
  var map;
  map = new mappls.Map("map", {
    center: [tour.locations[0].coordinates[1], tour.locations[0].coordinates[0]], // Ensure correct order: [latitude, longitude]
    zoomControl: false,
    zoom: 5,
    location: true,
  });

  const locations = tour.locations;

  // Loop through the locations and add markers for each location
  locations.forEach((location) => {
    new mappls.Marker({
      map: map,
      position: { lat: location.coordinates[1], lng: location.coordinates[0] }, // Correct the coordinates format
      icon_url: "/img/pin.png", // Adjust as per your image URL
      clusters: true,
      fitbounds: true,
      fitboundOptions: { padding: 120, duration: 1000 },
      popupOptions: { offset: { bottom: [0, -20] } },
    });
    new mappls.InfoWindow({
      map: map,
      content: `day: ${location.day} ${location.description}`, // Correct the access to location description
      position: {
        lat: location.coordinates[1],
        lng: location.coordinates[0],
      },
      closeButton: false,
    });
  });
}


