mapboxgl.accessToken = 'pk.eyJ1Ijoic2thaXNlcmljcHJiIiwiYSI6ImNpa2U3cGN1dDAwMnl1cm0yMW94bWNxbDEifQ.pEG_X7fqCAowSN8Xr6rX8g';

var bound = new mapboxgl.LngLatBounds(
    new mapboxgl.LngLat(-81.457, 36.945),
	new mapboxgl.LngLat(-72.49, 41.17)
);
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/skaisericprb/citvqu6qb002p2jo1ig5hnvtk',
	center: [-77.975, 39.077],
	maxBounds: bound,
	zoom: 7.45,
	attributionControl: {
		position: 'bottom-right'
	},
	minZoom: [7.0],
});

map.on('style.load', function () {
	map.addSource('monitoring', {
		type: 'vector',
		url: 'mapbox://skaisericprb.ado930is'
	});
    map.addLayer({
	    id: 'monitoring',
	    type: 'circle',
	    source: 'monitoring',
		'source-layer': 'WQ_Sites-a2dz9s',
	    paint: {
		    'circle-radius': 6,
		    'circle-color': "#4169DB"
	    }
    });
	
	map.addSource('subwatershed', {
		type: 'vector',
		url: 'mapbox://skaisericprb.702zi5l0'
	});
	map.addLayer({
		id: 'subwatershed',
		type: 'line',
		source: 'subwatershed',
		'source-layer': 'huc8',
		paint: {
			'line-color': '#877b59',
			'line-width': 1
		}
	});
    
	map.setFilter('monitoring', ['all', ['in', 'Source'].concat(agencies), ['in', 'HUC_NAME'].concat(subregions)]);
      _.forEach(['agency', 'subregion'], function(category) {
	      setEventListeners(category);
      })
});


// ***ADD CHECKBOX TO HIDE SHOW LAYERS*** //

var agencies = ['Adams County Conservation District', 'Arlington County', 'Chesapeake Bay Program', 'City of Rockville', 'D.C. Dept of Environment', 'Friends of Accotink Creek', 'Friends of Silgo Creek', 'MD Dept of Natural Resources', 'Maryland Biological Stream Survey', 'National Park Service', 'National Water Quality Monitoring Council', 'NOAA', 'Renfrew Institute', 'USGS', 'VA Dept of Environmental Quality', 'WV Dept of Environmental Protection'];
var agency_container = document.getElementById('agencies');

var subregions = ['Conococheague-Opequon', 'Monocacy', 'Cacapon-Town', 'North Branch Potomac', 'Middle Potomac-Catoctin', 'South Branch Potomac', 'Shenandoah', 'Middle Potomac-Anacostia-Occoquan', 'North Fork Shenandoah', 'South Fork Shenandoah', 'Lower Potomac'];
var subregions_container = document.getElementById('subregions');

_.forEach([{
  collection: agencies,
  container: 'agencies',
  class: 'agency'
}, {
  collection: subregions,
  container: 'subregions',
  class: 'subregion'
}], function(category) {
  var container = document.getElementById(category.container);
  _.forEach(category.collection, function(item) {
    var item_str = item.split(' ').join('_');
    container.innerHTML += `<input class=${category.class} type='checkbox' id=${item_str} checked='checked'>
    <label for=${item_str} class='button space-bottom1 icon check quiet'>${item}</label>`
  })
})

// add functionality to tabs -- each one hides the other when it is selected
var info_tab = document.getElementById('info-tab');
var agency_tab = document.getElementById('agency-tab');
var subregion_tab = document.getElementById('subregion-tab');

//info_tab.addEventListener('click', function(e) {
//  if (info_tab.contains('hidden')) {
//    subregions_container.classList.toggle('hidden');
//	agency_container.classList.toggle('hidden');
//    info_tab.toggle('hidden');
//  }
//});

agency_tab.addEventListener('click', function(e) {
  if (agency_container.classList.contains('hidden')) {
    subregions_container.classList.toggle('hidden');
    agency_container.classList.toggle('hidden');
//	info_tab.toggle('hidden');
  }
});

subregion_tab.addEventListener('click', function(e) {
  if (subregions_container.classList.contains('hidden')) {
    subregions_container.classList.toggle('hidden');
    agency_container.classList.toggle('hidden');
//	info_tab.toggle('hidden');
  }
});

// ADD TOOLTIP //
	
//var district_template_string = "<% if (district.state) { %><p><strong>State: </strong><%= district.state %></p><% } %><% if (district.district) {%><p><strong>District: </strong><%= district.district %></p><% } %><% if (district.firstName) {%><p><strong>Representative: </strong><%= district.firstName %> <%= district.lastName %></p><% } %>";
//var district_template = _.template(district_template_string, {variable: 'district'});


// ***SET EVENT LISTENERS ON CHECKBOXES TO FILTER DATA*** //

function setEventListeners(type) {
var inputs = document.querySelectorAll("input." + type);
  _.forEach(inputs, function(box) {
    box.addEventListener('click', function() {
      var filterIndex = type === 'agency' ? 1 : 2;
      var filter = map.getFilter('monitoring');
      var currentFilter = filter[filterIndex];
      var id = box.id.split('_').join(' ');
      var newFilter;
      if (box.hasAttribute('checked')) {
        box.removeAttribute('checked');
        // remove unchecked item from the current filter
        newFilter = _.filter(currentFilter, function(d) {
          return d !== id;
        });
      } else {
        box.setAttribute('checked', 'checked');
        // add checked item to the current filter
        newFilter = currentFilter.concat([id])
      }
        // replace old filter with the newly updated filter
        filter[filterIndex] = newFilter;
        map.setFilter('monitoring', filter);
    });
  });
};

	
//  map.on('click', function (e) {
//    var features = map.queryRenderedFeatures(e.point, {
//	    layers: ['Fed-Leg-Dist-DC', 'Fed-Leg-Dist-MD', 'Fed-Leg-Dist-PA', 'Fed-Leg-Dist-VA', 'Fed-Leg-Dist-WV']
//    });
//  
//    if (!features.length) {
//      return;
//    }
//	  
//    var feature = features[0];
//    var ttip = new mapboxgl.Popup()
//	    .setLngLat(map.unproject(e.point))
//        .setHTML(district_template(features[0].properties))
//	    .addTo(map);
//  });


	
map.addControl(new mapboxgl.Geocoder({position: 'top-right'}));
map.addControl(new mapboxgl.Navigation({position: 'top-left'}));

