/* Template	:	Covid | Version 1.0.0 */
console.log('helloo')
show_case = async () => {
    console.log('in show')
    axios.get('http://api.rootnet.in/covid19-in/stats/latest')
    .then(res => {
        console.log(res,'hello')
        let {total, deaths, discharged} = res.data.data.summary;
        document.getElementById('confirmed_cases').textContent = total;         //  Confirmed cases.
        document.getElementById('active_cases').textContent = total - discharged - deaths;        //  Active cases.
        document.getElementById('recovered_cases').textContent = discharged;     //  Recovered cases.
        document.getElementById('death_cases').textContent = deaths;     //  Death cases.
        console.log(res.data.lastOriginUpdate,'lastOriginUpdate')
        document.getElementsByClassName('counter-date').textContent = res.data.lastOriginUpdate;
    })
}

show_chart = async () => {
    let state_list = []
    let death_cases = [];
    let recovered_cases = [];
    let active_cases = [];
    let confirmed_cases = [];
    let state_data = [];
    axios.get('https://api.covid19india.org/raw_data.json')
    .then(async (res) => {
        let {raw_data} = res.data;
        raw_data.forEach(data => {
            if(data.nationality === 'India'){
                state_list.push(data.detectedstate)     //create all state list.
            }
        })
        state_list = [...new Set(state_list)]       // combined all repeated state list to unique list.
        state_list.forEach(state => {
            state_data.push({
                state: state,
                value: { death: 0, recovered: 0, active: 0, confirmed: 0 }
            })
        })
        raw_data.forEach(data => {
            state_list.forEach(state => {
                if(data.detectedstate === state && data.nationality === 'India'){
                    state_data.forEach(x => {
                        if(x.state === state){
                            x.value.confirmed++
                            switch (data.currentstatus) {
                                case "Hospitalized" :
                                    x.value.active++
                                    break;
                                
                                case "Recovered" :
                                    x.value.recovered++;
                                    break;
            
                                case "Deceased" :
                                    x.value.death++;
                                    break;
                            }
                        }
                    })
                }
            })
        })

        //      prepeared data for Chart.
        state_data.forEach(data => {
            if(data.state === ''){ data.state = 'Unknown' }
            death_cases.push({ label: data.state, y: data.value.death })
            recovered_cases.push({ label: data.state, y: data.value.recovered })
            active_cases.push({ label: data.state, y: data.value.active })
            confirmed_cases.push({ label: data.state, y: data.value.confirmed })
        })
    })
    
    window.onload = function () {

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            animationDuration: 3000,
            title:{ text: "Covid Data", fontSize: '30' },
            axisX: { title: "States & UT's", titleFontSize: '25', labelFontSize: '15', interval: 1 },
            axisY: { titleFontSize: '20', title: 'People count', labelFontSize: '15' },
            toolTip: { shared: true },
            legend:{ cursor: "pointer", itemclick: toggleDataSeries },
            data: [
                { type: "stackedBar", name: "Death", color: 'yellow', showInLegend: "true", dataPoints: death_cases },
                { type: "stackedBar", name: "Recovered", color: 'blue', showInLegend: "true", dataPoints: recovered_cases },
                { type: "stackedBar", name: "Active", color: 'gray', showInLegend: "true", dataPoints: active_cases }
            ]
        });
        chart.render();
        
        function toggleDataSeries(e) {
            if(typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                e.dataSeries.visible = false;
            }
            else {
                e.dataSeries.visible = true;
            }
            chart.render();
        }
    }  
}

// console.log('developed by Ghalib Ansari url:https://www.linkedin.com/in/ghalibansari/')
// let datax = 'developed by Ghalib Ansari url:https://www.linkedin.com/in/ghalibansari/';
let data = '';
let dataz = ["d", "e", "v", "e", "l", "o", "p", "e", "d", " ", "b", "y", " ", "G", "h", "a", "l", "i", "b", " ", "A", "n", "s", "a", "r", "i", " ", "u", "r", "l", ":", "h", "t", "t", "p", "s", ":", "/", "/", "w", "w", "w", ".", "l", "i", "n", "k", "e", "d", "i", "n", ".", "c", "o", "m", "/", "i", "n", "/", "g", "h", "a", "l", "i", "b", "a", "n", "s", "a", "r", "i", "/"];
dataz.forEach(x => {
    data += x
})
console.log(data)
// datax.forEach(x => {
//     dataz.push('x')
// })
// for(let x=0; x<datax.length; x++){
//     dataz.push(datax[x])
// }
// console.log()
// console.log(dataz)

$(document).ready( function () {
    axios.get('https://api.covid19india.org/data.json')
    .then(async (res) => {
        // console.log(res.data,'res')
        let {statewise} = res.data;
        // console.log(statewise,'statewise')
        let tableTree = '';
        statewise.forEach(data => {
            // console.log(data)
            if(data.state === 'Total'){
                changeValue (data);
            }
            str = JSON.stringify(data)
            // console.log(str,'str')
            tableTree += `<tr onmouseover='changeValue(${str})'><td>${data.state}</td><td>${data.active}</td></tr>`
        })
        $('#myTableData').html(tableTree);
        $('#myTable').DataTable({
            "order": [[ 1, "desc" ]],
            // "bPaginate": false
            "bFilter": false,
            "scrollY": "400px",
            "scrollCollapse": true,
            "paging": false
        });
    })
} );

function changeValue (data){
    // data = JSON.parse(data)
    // console.log(data,"changeValue")
    let {confirmed, active, recovered, deaths} = data;
    // console.log(confirmed, active, recovered, deaths);
    $('#name_box').html(data.state);
    $('#total_cases_box').html(`Total Cases <br>${confirmed}`);
    $('#active_cases_box').html(`Active Cases <br>${active}`);
    $('#recovered_cases_box').html(`Recovered Cases <br>${recovered}`);
    $('#death_cases_box').html(`Death Cases <br>${deaths}`);
}

show_case();
// show_chart();


(function($){
	'use strict';
	var $win = $(window), $body = $('body'), $doc = $(document);

	// Touch Class
	if (!("ontouchstart" in document.documentElement)) {
		$body.addClass("no-touch");
	}
    
	// Get Window Width
	function winwidth () {
		return $win.width();
	}
	var wwCurrent = winwidth();
	$win.on('resize', function() { 
		wwCurrent = winwidth();
	});
    
        // STICKY ACTIVE
        var activeSticky = $('#active-sticky'),
        winD = $(window);
        winD.on('scroll',function() {
          var scroll = $(window).scrollTop(),
                isSticky = activeSticky;
          if (scroll < 2) {
                isSticky.removeClass("is-sticky");
          }
          else{
            isSticky.addClass("is-sticky");
          }
       });
    
		setTimeout(function() {
			$('body').addClass('loaded');
		}, 3500);
	// OnePage Scrolling
    $('a.menu-link[href*="#"]:not([href="#"])').on("click", function() {
		if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
		  var toHash = $(this.hash), toHashN = (this.hash.slice(1)) ? $('[name=' + this.hash.slice(1) + ']') : false;
		  toHash = toHash.length ? toHash : toHashN;
		  if (toHash.length) {
			$('html, body').animate({
			  scrollTop: (toHash.offset().top )
			}, 1000);
            return false;
		  }
		}
	});
    
    //Navigation
    var $dropdown_trigger = $('.dropdown-trigger');
	if ($dropdown_trigger.length > 0 ) {
		$dropdown_trigger.on("click",function(e){
			if ($win.width() < 1920) {
				$(this).parent().children('.dropdown-content').slideToggle(400);
				$(this).parent().siblings().children('.dropdown-content').slideUp(400);
				$(this).parent().toggleClass('current');
				$(this).parent().siblings().removeClass('current');
				e.preventDefault();
			}
		});
	}
    
	//Caregory
    var $header_cat_head = $('.header-cat-head'), $header_cat_list = $('.header-cat-list');
	if ($header_cat_head.length > 0 ) {
		$header_cat_head.on("click",function(e){
			if ($win.width() < 991) {
				$header_cat_list.slideToggle(400);
				e.preventDefault();
			}
		});
	}
    
    // Toggle section On click
    var _trigger = '.drop-trigger', _toggle = '.drop-content';
    
    if ($(_trigger).length > 0 ) {
		$doc.on('click', _trigger, function(e){
            var $self = $(this);
            $(_trigger).not($self).removeClass('active');
            $(_toggle).not($self.parent().children()).removeClass('active');
            $self.toggleClass('active').parent().find(_toggle).toggleClass('active');
            e.preventDefault();
        });
	}
    
    $doc.on('click', 'body', function(e){
        var $elm_tig = $(_trigger), $elm_tog = $(_toggle);
		if (!$elm_tog.is(e.target) && $elm_tog.has(e.target).length===0 && 
            !$elm_tig.is(e.target) && $elm_tig.has(e.target).length===0) {
                $elm_tog.removeClass('active');
                $elm_tig.removeClass('active');
		}
	});
    
    $(window).on('resize', function(){
        $(_trigger).removeClass('active');
        $(_toggle).removeClass('active');
    });
    
    var $nav_toggle = $('.navbar-toggle'),  $nav_content = $('.navbar-toggle-content');
    if($nav_toggle.length > 0) {
        $nav_toggle.on('click', function(e){
            $nav_toggle.toggleClass('active');
            $nav_content.toggleClass('active');
            e.preventDefault();
        });
    }
    $(window).on('resize', function(){
        if(wwCurrent > 991){
            $nav_toggle.removeClass('active');
            $nav_content.removeClass('active');
        }
    });
    
    $doc.on('click', 'body', function(e){
		if (!$nav_content.is(e.target) && $nav_content.has(e.target).length===0 && 
            !$nav_toggle.is(e.target) && $nav_toggle.has(e.target).length===0) {
                $nav_toggle.removeClass('active');
                $nav_content.removeClass('active');
		}
	});
    
    function activeNav(navbar){
        if($win.width() < 992){
            navbar.delay(500).addClass('navbar-mobile');
        }else{
            navbar.delay(500).removeClass('navbar-mobile');
        }
    }
    activeNav($nav_content);
    $(window).on('resize', function(){
        activeNav($nav_content);
    });
    
	// Active page menu when click
	var CurURL = window.location.href, urlSplit = CurURL.split("#");
	var $nav_link = $("a");
	if ($nav_link.length > 0) {
		$nav_link.each(function() {
			if (CurURL === (this.href) && (urlSplit[1]!=="")) {
				$(this).closest("li").addClass("active").parent().closest("li").addClass("active");
			}
		});
	}
    
    // CountDown
    var $data_countdown = $('[data-countdown]');
	if ($data_countdown.length > 0 ) {
		$data_countdown.each(function() {
            var $this = $(this), finalDate = $(this).data('countdown');
            $this.countdown(finalDate, function(event) {
                $this.html(event.strftime('<div class="countdown-item"><div class="countdown-time">%D</div><div class="countdown-text">Days</div></div><div class="countdown-item"><div class="countdown-time">%H</div><div class="countdown-text">Hours</div></div><div class="countdown-item"><div class="countdown-time">%M</div><div class="countdown-text">Min</div></div><div class="countdown-item"><div class="countdown-time">%S</div><div class="countdown-text">Sec</div></div>'));
            });
        });
	}
    
    //Animation initial

    new WOW().init();
    
    // Slider
    var $project_slider = $('.banner-slider'), $project_sd = $('.banner-slider-dots').find('.owl-dot');
	if ($project_slider.length > 0 ) {
		$project_slider.each(function() {
            $project_slider.addClass('owl-carousel').owlCarousel({
                loop:true,
                margin:0,
                nav:false,
                items: 1,
                autoplay: false,
                dotsEach: 1,
                slideBy: 2,
            });
        });
	}
    if ($project_sd.length > 0){
        $project_sd.on('click',function () {
            $project_slider.trigger('to.owl.carousel', [$(this).index(), 300]);
        });
    }
    
    $project_sd.on('click',function () {
        $project_slider.trigger('to.owl.carousel', [$(this).index(), 300]);
    });
    
    // Slider Testimonial
    var $testimonial_ds = $('.testimonial-slider'), $testimonial_dt=$('.testimonial-thumb').find('.owl-dot');
	if ($testimonial_ds.length > 0 ) {
		$testimonial_ds.each(function() {
            $testimonial_ds.addClass('owl-carousel').owlCarousel({
                loop:true,
                margin:0,
                nav:false,
                items: 1,
            });
        });
	}
    if ($testimonial_dt.length > 0){
        $testimonial_dt.on('click',function () {
            $testimonial_ds.trigger('to.owl.carousel', [$(this).index(), 300]);
        });
    }
    
    // Select
    var $select = $('select');
	if ($select.length > 0) {
        $select.each(function() {
			var $this = $(this);
            $this.select2();
		});
	}
    var $select_bdr = $('.select-bordered');
	if ($select_bdr.length > 0) {
        $select_bdr.each(function() {
			var $this = $(this);
            $this.select2({
                theme: "default bordered"
            });
		});
	}
    
    // Range Slider
    var $slider_range = $('#slider-range'), $slider_amount = $('#slider-amount');
	if ($slider_range.length > 0) {
        $slider_range.slider({
            range: true,
            min: 0,
            max: 8000,
            values: [ 50, 5000 ],
            slide: function( event, ui ) {
                $slider_amount.val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
            }
        });
        $slider_amount.val( "$" + $( "#slider-range" ).slider( "values", 0 ) + " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	}
    
    
    // Cart Counter
    var $cart_value = $(".cart-value"), $cart_minus = $(".cart-minus"), $cart_plus = $(".cart-plus");
    if ($cart_value.length > 0) {
        $cart_minus.on('click', function() {
            var $input = $(this).parent().find($cart_value);
            var count = parseInt($input.val(), 10) - 1;
            count = count < 1 ? 1 : count;
            $input.val(count);
            $input.change();
            return false;
        });
        $cart_plus.on('click', function() {
            var $input = $(this).parent().find($cart_value);
            $input.val(parseInt($input.val(), 10) + 1);
            $input.change();
            return false;
        });
    }
    
    // Image Pop up
    var $popup_image = $(".popup-image"), $popup_embed = $(".popup-embed"), $popup_ajax = $(".popup-ajax");
    if ($popup_image.length > 0) {
        $popup_image.magnificPopup({
            type: 'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
        });	
    }
    // Embeded Pop up
    if ($popup_embed.length > 0) {
        $popup_embed.magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }
    // Embeded Pop up
    if ($popup_ajax.length > 0) {
        $popup_ajax.magnificPopup({
            type: 'ajax',
            modal: true,
            overflowY: 'scroll',
            showCloseBtn: true,
            closeBtnInside: true,
        });
    }
 
    
    // Mas layout
    var $header_mas = $('.header-mas');
    $(window).on('load', function(){
        if ($header_mas.length > 0) {
            $header_mas.masonry({
                itemSelector: '.header-mas-item'
            });
        }
    });

	
})(jQuery);