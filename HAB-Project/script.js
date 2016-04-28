mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';
var linkGroup = document.getElementById('link-group');
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/skaisericprb/cim6j0i0e00mu9jm0vuivuzbl',
  center: [-78.213233, 38.953640],
  maxBounds: [
    [-81.309814453125, 41.40153558289846],
      [-72.57568359375, 35.8356283888737]
    ],
  zoom: 7.6,
  attributionControl: {
  position: 'bottom-right'
}

});

addLayer ('HAB-1', 'hab-1');
addLayer ('HAB-2', 'hab-2');
 
function addLayer(name, id) {
 var link = document.createElement('input');
 link.type = 'checkbox';
 link.checked = true;
 link.className = 'link-group';
 link.textContent = name;
 linkGroup.appendChild(link);

 var label = document.createElement('label');
 label.setAttribute('for', id);
 label.textContent = name;
 linkGroup.appendChild(label);

 link.addEventListener('click', function(e) {
   map.setLayoutProperty(id, 'visibility',
   e.target.checked ? 'visible' : 'none');
 });

 var layer = document.getElementById('link-group');
 layer.appendChild(link);

};
 