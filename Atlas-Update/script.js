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

map.on('load', function () {
	map.addSource('monitoring', {
		type: 'vector',
		url: 'mapbox://skaisericprb.4a3bqm34'
	});
    map.addLayer({
	    id: 'monitoring',
	    type: 'circle',
	    source: 'monitoring',
		'source-layer': 'WQ_Sites-7w5zir',
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
});

// build agency filter options //

var agencies = ['DDOE', 'MD DNR', 'ACCD', 'MBSS', 'RI', 'CBP', 'WQP', 'Arlington County, VA', 'COR', 'NPS', 'FOAC', 'NOAA', 'WV DEP', 'USGS', 'VA DEQ', 'FOSC'];
var agency_container = document.getElementById('agencies');

// build subregion filter options //

var subregions = ['Conococheague-Opequon', 'Monocacy', 'Cacapon-Town', 'North Branch Potomac', 'Middle Potomac-Catoctin', 'South Branch Potomac', 'Shenandoah', 'Middle Potomac-Anacostia-Occoquan', 'North Fork Shenandoah', 'South Fork Shenandoah', 'Lower Potomac'];
var subregions_container = document.getElementById('subregions');

// ***ADD CHECKBOX TO HIDE SHOW LAYERS*** //

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
var agency_tab = document.getElementById('agency-tab');
var subregion_tab = document.getElementById('subregion-tab');


agency_tab.addEventListener('click', function(e) {
  if (agency_container.classList.contains('hidden')) {
    subregions_container.classList.toggle('hidden');
    agency_container.classList.toggle('hidden');
  }
});

subregion_tab.addEventListener('click', function(e) {
  if (subregions_container.classList.contains('hidden')) {
    subregions_container.classList.toggle('hidden');
    agency_container.classList.toggle('hidden');
  }
});

// ADD TOOLTIP //
	
//var district_template_string = "<% if (district.state) { %><p><strong>State: </strong><%= district.state %></p><% } %><% if (district.district) {%><p><strong>District: </strong><%= district.district %></p><% } %><% if (district.firstName) {%><p><strong>Representative: </strong><%= district.firstName %> <%= district.lastName %></p><% } %>";
//var district_template = _.template(district_template_string, {variable: 'district'});

  map.on('style.load', function() {
    map.setFilter('WQ_Sites-7w5zir', ['all', ['in', 'Source'].concat(agencies), ['in', 'HUC_NAME'].concat(subregions)]);
    _.forEach['agency', 'subregion'], function(category) {
	    setEventListeners(category);
    }
  });
	
    function setEventListeners(type) {
    var inputs = document.querySelectorAll("input." + type);
    _.forEach(inputs, function(box) {
      box.addEventListener('click', function() {
        var filterIndex = type === 'agency' ? 1 : 2;
        var filter = map.getFilter('WQ_Sites-7w5zir');
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
        map.setFilter('WQ_Sites-7w5zir', filter);
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

