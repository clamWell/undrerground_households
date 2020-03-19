$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2019/running/",
		isMobile = screenWidth <= 800 && true || false,
		isNotebook = (screenWidth <= 1300 && screenHeight < 750) && true || false,
		isMobileLandscape = ( screenWidth > 400 && screenWidth <= 800 && screenHeight < 450 ) && true || false;
	window.onbeforeunload = function(){ window.scrollTo(0, 0) ;}
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};
	$(window).resize(function() {
		screenWidth = $(window).width();
		screenHeight = $(window).height();
    });
	$(window).scroll(function(){
		var nowScroll = $(window).scrollTop();

	});

	var width = 1000,
		height = 700;

	var svg = d3.select("#chart").select("svg")
				.attr("width", width)
				.attr("height", height);

	var def_stripe = svg.append("pattern")
		.attr("id", "diagonalHatch")
		.attr("patternUnits", "userSpaceOnUse")
		.attr("width", 4)
		.attr("height", 4)
	  .append("path")
		.attr("d", 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
		.attr("stroke", "#cf3a00")
		.attr("stroke-width", 1);


	var map = svg.append("g").attr("id", "map"),
		places = svg.append("g").attr("id", "places");

	var map_under_house_ratio = map.append("g").attr("id", "UNDER_HOUSE_RATIO");
	var map_low_income_ratio = map.append("g").attr("id", "LOW_INCOME_RATIO");
	var map_old_ratio = map.append("g").attr("id", "OLD_RATIO");
	var map_single_parent_house_ratio = map.append("g").attr("id", "SINGLE_PARENT_RATIO");
	var map_geo_label = map.append("g").attr("id", "GEO_LABEL");

	var projection = d3.geo.mercator()
		.center([126.9895, 37.5651])
		.scale(100000)
		.translate([width/2, height/2]);

	var path = d3.geo.path().projection(projection);
	 
	d3.json("seoul_municipalities_topo_simple.json", function(error, data) {
		var features = topojson.feature(data, data.objects.seoul_municipalities_geo).features;
		var data = data;
		
		for(var i=0 ; i< seoul_basic.length; i++) { 
			for(var m=0 ; m< features.length; m++) { 
				if( seoul_basic[i]["geo_code"]==features[m].properties.SIG_CD) {
					features[m].properties["real_price"] = seoul_basic[i]["real_price"];
					features[m].properties["pop"] = seoul_basic[i]["pop"];
					features[m].properties["house"] = seoul_basic[i]["house"];
					features[m].properties["under_house"] = seoul_basic[i]["under_house"];
					features[m].properties["under_house_ratio"] = seoul_basic[i]["under_house_ratio"];
					features[m].properties["under_house_single_ratio"] = seoul_basic[i]["under_house_single_ratio"];
					features[m].properties["old_ratio"] = seoul_basic[i]["old_ratio"];
					features[m].properties["single_parent_house_ratio"] = seoul_basic[i]["single_parent_house_ratio"];
					features[m].properties["low_income_house_ratio"] = seoul_basic[i]["low_income_house_ratio"];

					console.log( features[m].properties.SIG_KOR_NM, features[m].properties["under_house_ratio"]);
					break;
				}			
			}
		}
	
		/*
		var colorFn = d3.scaleSequential(d3.interpolateOrRd)
						.domain([2.2, 11.3]);*/
		
		var colorFn = d3.scale.category10();

		var color = d3.scale.linear().domain([2.2, 11.3])
					  //.interpolate(d3.interpolateHcl)
					  //.range([d3.rgb("#ebd6c7"), d3.rgb("#ff9126")]);
					  .range(["rgba(255,130,38,0.2)", "rgba(255,130,38,1)"]);

		var opacity_low_income =  d3.scale.linear().domain([2.32, 8.85]).range(["0.1", "1.0"]);
		var opacity_single_parents =  d3.scale.linear().domain([0.39, 1.72]).range(["0.1", "1.0"]);


		map_under_house_ratio.selectAll("path")
			.data(features)
			.enter().append("path")
			.attr("class", function(d) { console.log(); return "geo geo-under-house c-" + d.properties.SIG_CD })
			.attr("d", path)
			.style("fill", function(d){
				var value = d.properties["under_house_ratio"];
				return color(value);
			})

		 map_low_income_ratio.selectAll("path")
			.data(features)
			.enter().append("path")
			.attr("class", function(d) { console.log(); return "geo geo-low-income c-" + d.properties.SIG_CD })
			.attr("d", path)
			.style("fill", "url(#diagonalHatch)")
			.style("fill-opacity", function(d){
				var value = d.properties["low_income_house_ratio"];
				return opacity_low_income(value);
			})
			.style("stroke-opacity", function(d){
				var value = d.properties["low_income_house_ratio"];
				return opacity_low_income(value);
			})

		 map_single_parent_house_ratio.selectAll("path")
			.data(features)
			.enter().append("path")
			.attr("class", function(d) { console.log(); return "geo geo-single-parent c-" + d.properties.SIG_CD })
			.attr("d", path)
			.style("fill", "url(#circles-3)")
			.style("fill-opacity", function(d){
				var value = d.properties["single_parent_house_ratio"];
				return opacity_single_parents(value);
			})
			.style("stroke-opacity", function(d){
				var value = d.properties["single_parent_house_ratio"];
				return opacity_single_parents(value);
			})

		map_geo_label.selectAll("text")
			.data(features)
			.enter().append("text")
			.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })  // centroid 무게중심. path.centroid()는 path의 무게중심을 찾아주는 메소드 
			.attr("dy", ".35em")
			.attr("class", "geo-label")
			.text(function(d) { return d.properties.SIG_KOR_NM})
	});

	$("#LOW_INCOME_RATIO").hide();
	$("#SINGLE_PARENT_RATIO").hide();
	$("#OLD_RATIO").hide();

	$(".btn-holder ul").find("li").on("click", function() {
		var button_index = $(this).index();
		var button_type = $(this).attr("data-map-type");
		var checkOn = $(this).hasClass("on");
		if (checkOn == true) {
		  $(this).removeClass("on");
			if(button_type =="low-income"){
				$("#LOW_INCOME_RATIO").hide();
			}else if(button_type =="single-parents"){
				$("#SINGLE_PARENT_RATIO").hide();
			}else if(button_type =="old-low-income"){
				("#OLD_RATIO").hide();
			}
		} else {
		  $(this).addClass("on");
			if(button_type =="low-income"){
				$("#LOW_INCOME_RATIO").fadeIn();
			}else if(button_type =="single-parents"){
				$("#SINGLE_PARENT_RATIO").fadeIn();
			}else if(button_type =="old-low-income"){
				("#OLD_RATIO").fadeIn();
			}
		}
		//checkBtnAttr(tab_index, button_index, checkOn);
	});



});

function sendSns(s) {
  var url = encodeURIComponent(location.href),
	  txt = encodeURIComponent($("title").html());
  switch (s) {
    case 'facebook':
      window.open('http://www.facebook.com/sharer/sharer.php?u=' + url);
      break;
    case 'twitter':
      window.open('http://twitter.com/intent/tweet?text=' + txt + '&url=' + url);
      break;
  }
}
