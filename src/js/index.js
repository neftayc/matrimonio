import './materialize/js/bin/materialize.js'

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var options = '';
    var instances = M.Sidenav.init(elems, options);

    var elems = document.querySelectorAll('.parallax');
    var instances = M.Parallax.init(elems, options);

    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
      fullWidth: true
    });

    var principios_elem = document.querySelectorAll('.carousel-slider-principios');
    var instances = M.Carousel.init(principios_elem, {
      fullWidth: true,
      indicators: true
    });
    
    var el = document.querySelectorAll('.tabs');
    var instance = M.Tabs.init(el, options);

    var elems = document.querySelectorAll('.materialboxed');
    var instances = M.Materialbox.init(elems, options);

    var ele_event = document.querySelectorAll('.carousel-event-org');
    var instances = M.Carousel.init(ele_event, {
			dist: 0,
			padding: 40,
			indicators: true,
      numVisible: 5,
      height: 400  
    });
    

    var select_elem = document.querySelectorAll('select');
    var instances = M.FormSelect.init(select_elem, options);
    
    var tabs_evento = document.querySelectorAll('.tabs_eventos');
    var instance = M.Tabs.init(tabs_evento, options);
    
  });