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

	function makeMapOverlay(){
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

		var def_pattern = svg.append("pattern")
			.attr("id", "diagonalHatch2")
			.attr("patternUnits", "userSpaceOnUse")
			.attr("width", 6)
			.attr("height", 6)
		  .append("path")
			.attr("d", 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
			.attr("stroke", "#cf3a00")
			.attr("stroke-width", 2);

		var def_triangle = svg.append("pattern")
			.attr("id", "triangle")
			.attr("patternUnits", "userSpaceOnUse")
			.attr("width", 6)
			.attr("height", 6)
		  .append("path")
			.attr("d", "M5,0 10,10 0,10 Z")
			.attr("fill", "#cf3a00")


		var map = svg.append("g").attr("id", "map"),
			places = svg.append("g").attr("id", "places");

		var map_under_house_ratio = map.append("g").attr("id", "UNDER_HOUSE_RATIO");
		var map_low_income_ratio = map.append("g").attr("id", "LOW_INCOME_RATIO");
		var map_old_ratio = map.append("g").attr("id", "OLD_RATIO");
		var map_single_parent_house_ratio = map.append("g").attr("id", "SINGLE_PARENT_RATIO");
		var map_basic_geo = map.append("g").attr("id", "GEO");
		var map_geo_label = map.append("g").attr("id", "GEO_LABEL");

		var projection = d3.geo.mercator()
			.center([126.9895, 37.5651])
			.scale(100000)
			.translate([width/2, height/2]);

		var path = d3.geo.path().projection(projection);
		 
		d3.json("js/seoul_municipalities_topo_simple.json", function(error, data) {
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

					//	console.log( features[m].properties.SIG_KOR_NM +"의 반지하 거주 가구비율은 "+features[m].properties["under_house_ratio"]+"%");
						break;
					}			
				}
			}
		
			/*
			var colorFn = d3.scaleSequential(d3.interpolateOrRd)
							.domain([2.2, 11.3]);*/
			
			var colorFn = d3.scale.category10();

			var color_under_house = d3.scale.linear().domain([2.2, 11.3])
						  .range(["rgba(255,130,38,0.05)", "rgba(255,130,38,0.8)"]);

			var color_old = d3.scale.linear().domain([0.2, 1.23])
						  .range(["rgba(255,62,38,0.05)", "rgba(255,62,38,0.4)"]);

			var color_single_parents = d3.scale.linear().domain([0.39, 1.72])
						  .range(["rgba(255,38,64,0.05)", "rgba(255,38,64,0.4)"]);
			
			var opacity_low_income =  d3.scale.linear().domain([2.32, 8.85]).range(["0.1", "1.0"]);
			var opacity_single_parents =  d3.scale.linear().domain([0.39, 1.72]).range(["0.1", "1.0"]);

			map_under_house_ratio.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-under-house c-" + d.properties.SIG_CD })
				.attr("d", path)
				.style("fill", function(d){
					var value = d.properties["under_house_ratio"];
					return color_under_house(value);
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
				 .style("fill", function(d){
					var value = d.properties["single_parent_house_ratio"];
					return color_single_parents(value);
				}).style("stroke-opacity", function(d){
					var value = d.properties["single_parent_house_ratio"];
					return color_single_parents(value);
				})
				 /*
				.style("fill", "url(#diagonalHatch)")
				.style("fill-opacity", function(d){
					var value = d.properties["single_parent_house_ratio"];
					return opacity_single_parents(value);
				})
				.style("stroke-opacity", function(d){
					var value = d.properties["single_parent_house_ratio"];
					return opacity_single_parents(value);
				})*/

			 map_old_ratio.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-old c-" + d.properties.SIG_CD })
				.attr("d", path)
				.style("fill", function(d){
					var value = d.properties["old_ratio"];
					return color_old(value);
				})

			var geoBorder = map_basic_geo.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-basic c-" + d.properties.SIG_CD })
				.attr("d", path)
			
			geoBorder.on("mouseover", function(d){
					d3.select(this)
						.style("stroke-opacity", "1")
						.style("stroke-width", 2)
						.style("stroke-dasharray", 0)
						.style("stroke-dashoffset", 0)
					}).on("mouseout", function(d){
						d3.select(this)
							.style("stroke-opacity", null)
							.style("stroke-width", null)
							.style("stroke-dasharray", null)
							.style("stroke-dashoffset", null)
						 
					})

			map_geo_label.selectAll("text")
				.data(features)
				.enter().append("text")
				.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })  // centroid 무게중심. path.centroid()는 path의 무게중심을 찾아주는 메소드 
				.attr("dy", ".35em")
				.attr("class", "geo-label")
				.text(function(d) { return d.properties.SIG_KOR_NM})
		});

	}
	makeMapOverlay();

	function setMapDefault(){
		$("#UNDER_HOUSE_RATIO").hide();
		$("#LOW_INCOME_RATIO").hide();
		$("#SINGLE_PARENT_RATIO").hide();
		$("#OLD_RATIO").hide();
	}
	setMapDefault();

	$(".seoul-map .btn-holder ul").find("li").on("click", function() {
		var button_index = $(this).index();
		var button_type = $(this).attr("data-map-type");
		var checkOn = $(this).hasClass("on");
		if (checkOn == true) {
		  $(this).removeClass("on");
			if(button_type =="under-house"){
				$("#UNDER_HOUSE_RATIO").hide();
			}else if(button_type =="low-income"){
				$("#LOW_INCOME_RATIO").hide();
			}else if(button_type =="single-parents"){
				$("#SINGLE_PARENT_RATIO").hide();
			}else if(button_type =="old-low-income"){
				$("#OLD_RATIO").hide();
			}
		} else {
		  $(this).addClass("on");
			if(button_type =="under-house"){
				$("#UNDER_HOUSE_RATIO").fadeIn();
			}else if(button_type =="low-income"){
				$("#LOW_INCOME_RATIO").fadeIn();
			}else if(button_type =="single-parents"){
				$("#SINGLE_PARENT_RATIO").fadeIn();
			}else if(button_type =="old-low-income"){
				$("#OLD_RATIO").fadeIn();
			}
		}
	});



	function makeStackedAreaChart(){
		var margin = {top: 50, right: 50, bottom: 50, left: 50},
			width = 600- margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		var svg = d3.select("#STACK_AREA_CHART")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
					.append("g")
						.attr("transform",
							  "translate(" + margin.left + "," + margin.top + ")");

		var mindate = new Date(2005,0),
			maxdate = new Date(2015,0),
			xTimeFormat = "%Y";

		var x = d3.scale.linear()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0]);


		var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom")
			.tickFormat(function(d,i){
				return String(d)+"년";
			})
			.ticks(3);

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left")

		var area = d3.svg.area()
			.x(function(d) { return x(d.year); })
			.y0(function(d) { return y(d.y0); })
			.y1(function(d) { return y(d.y0 + d.y); });

		var stack = d3.layout.stack()
			 .values(function(d) { return d.values; });

		/*var color = d3.scale.category10();*/
		var color = d3.scale.ordinal()
				.domain(["underground","top","upperground"])
				.range(["#ff7019","#ff1da1","#eae3e1"]);

		d3.csv("js/houseTypeByYear.csv", function(error, data) {

			var keys = Object.keys(data[1]).slice(1);
			//console.log(keys);

			color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

			var browsers = stack(color.domain().map(function(name) {
				return {
					name: name,
					values: data.map(function(d) {
						return {year: d.year, y: d[name] * 1};
					})
				};
			}))

			var maxDateVal = d3.max(data, function(d){
				var vals = d3.keys(d).map(function(key){ return key !== "year" ? d[key] : 0 });
				return d3.sum(vals);
			});
			x.domain(d3.extent(data, function(d) { return d.year; }));
			y.domain([0, maxDateVal])

			var browser = svg.selectAll(".browser")
			  .data(browsers)
			.enter().append("g")
			  .attr("class", "browser");

			var eachArea = browser.append("path")
			  .attr("class", "area")
			  .attr("d", function(d) { return area(d.values); })
			  .style("fill", function(d) { return color(d.name); });

			browser.append("text")
			  .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
			  .attr("x", -6)
			  .attr("class","g-label")
			  .attr("dy", "-0.882em")
			  .text(function(d) { 
					if(d.name == "upperground"){
						return "지상";
					}else if(d.name == "underground"){
						return "지하/반지하";
					}else if(d.name == "top"){
						return "옥탑";
					}
				}).attr("transform", function(d) { 
					if(d.name == "top"){
						return "translate("+(width+5)+"," + (y(d.value.y0 + d.value.y / 2)+15) + ")"; 
					}else{
						return "translate("+(width/2)+"," + (y(d.value.y0 + d.value.y / 2)+15) + ")"; 
					}
				}) 


			eachArea.on("mouseenter", function(d) {
				d3.selectAll("path.area")
					.style("fill-opacity", "0.3");

				d3.select(this)
					.style("fill-opacity", "1")
					.style("stroke","#111")
					.style("stroke-width","1")

			}).on("mouseleave", function(d){
				d3.selectAll("path.area")
					.style("fill-opacity", null)
					.style("stroke",null)
					.style("stroke-width",null)
			});


			svg.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0," + (height+10) + ")")
			  .call(xAxis);

			svg.append("g")
			  .attr("class", "y axis")
			  .attr("transform", "translate(" + (-10) + ",0)")
			  .call(yAxis);
			
			var size = 20
			svg.selectAll("myrect")
			  .data(keys)
			  .enter()
			  .append("rect")
				.attr("x", (width+40))
				.attr("y", function(d,i){ return (height/2-50) + i*(size+5)})
				.attr("width", size)
				.attr("height", size)
				.style("fill", function(d){ return color(d)})

			svg.selectAll("mylabels")
			  .data(keys)
			  .enter()
			  .append("text")
				.attr("x", (width+40) + size*1.2)
				.attr("y", function(d,i){ return  (height/2-50) + i*(size+5) + (size/2)})
				.attr("class", "labels")
				.style("fill", function(d){ return "#222";})
				.text(function(d) { 
					if(d == "upperground"){
						return "지상";
					}else if(d == "underground"){
						return "지하/반지하";
					}else if(d == "top"){
						return "옥탑";
					}
				})
				.attr("text-anchor", "left")
				.style("alignment-baseline", "middle")

		});
	}
	makeStackedAreaChart();

	var poleWidth, poleWidthC, poleHeight, poleMargin;

	function makePoleChart(){
		var width = (screenWidth<1300)? screenWidth: 1300,
			height= 400,
			margin= 10 ;
		var data = all_city_data;
		
		var values = data.map(function(v) {
		  return Number(v["under_house"]);
		});
		var maxValue = d3.max(values);
		var minValue = d3.min(values);

		var pole_chart_svg = d3.select("#ALL_CITY_HOUSE_POLE").select("svg")
			.attr("width", width +"px" )
			.attr("height", height +"px")

		var def_stripe = pole_chart_svg.append("pattern")
			.attr("id", "diagonalHatchArea")
			.attr("patternUnits", "userSpaceOnUse")
			.attr("width", 4)
			.attr("height", 4)
		  .append("path")
			.attr("d", 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
			//.attr("stroke", "#ff5200")
			.attr("stroke", "#333")
			.attr("stroke-width", 1);

		var chart_holder = pole_chart_svg.append("g")
			.attr("class","chart-holder");

		var x = d3.scale.linear()
			.range([0, width]);

		var y = d3.scale.linear()
			.range([height, 0])
			.domain([0, maxValue])

		var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left").ticks(5);

		var multipleKey = height / maxValue;
	  //  var multipleKey = 0.02;
		poleMargin = 2; 
		poleWidth = ((width-margin) / data.length)-poleMargin;


		var yAxis = chart_holder.append("g")
		  .attr("class", "y axis")
		  .attr("transform", "translate(-10,0)")
		  .call(yAxis);

		var centre_area = chart_holder.append("g")
			.attr("class","area-box centre-area");

		var centre_area_rect = centre_area.append("rect")
			.style("fill", function(d) {
				  return "url(#diagonalHatchArea)";
			})
			.attr("width", (poleWidth  + poleMargin)*66)
			.attr("height", height )
			.attr("class", "area-rect centre-area-rect")
			.style("fill-opacity", "0.15");
		centre_area.append("text")
			.text("수도권")
			.attr("class","area-label")
			.attr("transform", "translate("+(poleWidth  + poleMargin)*33+",20)")


		var seoul_area = chart_holder.append("g")
			.attr("class","area-box seoul-area");

		var seoul_area_rect = seoul_area.append("rect")
			.style("fill", function(d) {
				  return "rgb(255, 183, 183)";
			})
			.attr("width", (poleWidth  + poleMargin)*25)
			.attr("height", height*0.8 )
			.attr("x", "0")
			.attr("y", height*0.2 )
			.attr("class", "area-rect seoul-area-rect")
			.style("fill-opacity", "0");
		seoul_area.append("text")
			.text("서울")
			.attr("class","area-label")
			.attr("transform", "translate("+(poleWidth  + poleMargin)*12+","+ height*0.2+")")
			
		
		var pole_under_house_holder = chart_holder.append("g")
			.attr("class","pole-under-house-holder");

		var pole_under_house = pole_under_house_holder.selectAll("g")
				.data(data)
				.enter().append("g")
				.attr("class","pole-g")
				.attr("transform", function(d, i) { return "translate("+ ( i * (poleWidth  + poleMargin) ) +",0)";});
		
		pole_under_house.append("rect")
				.style("fill", function(d) {
				  return "#ffae12";
				})
				.attr("width", poleWidth)
				.attr("class", "pole pole-under-house")
				.attr("height", function(d) {
					var h = Number(d["under_house"]) * multipleKey;
					if(h<4){ h = 4;}
					return h;
				}).attr("x", function(d, i) {
				//	return i * (poleWidth  + poleMargin);
					return 0;
				}).attr("y", function(d) {
					var h = Number(d["under_house"]) * multipleKey;
					if(h<4){ h = 4;}
					return height-h;
					//return 0;
				});
		

		var pole_under_house_single = pole_under_house.append("rect")
				.style("fill", function(d) {
				  return "#ff432f";
				})
				.attr("width", poleWidth)
				.attr("class", "pole pole-under-single-house")
				.attr("height", function(d) {
					return Number(d["under_house_single"]) * multipleKey;
				}).attr("x", function(d, i) {
					//return i * (poleWidth  + poleMargin);
					return 0;
				}).attr("y", function(d) {
					return height-(Number(d["under_house_single"]) * multipleKey);
					//return 0;
				});

		pole_under_house.append("text")
			.attr("class","pole-label")
		//	.filter(function(d){ return Number(d.under_house_ratio) >= 7;})
			.text(function(d) { return d.under_house_ratio+"%"; })
			.attr("transform", function(d, i) { 
				return "translate(8," + (height-(Number(d["under_house"]) * multipleKey)-2) + ")";
			}).style("display", "none");
		
		var $tooltip = $(".all-city-household-chart .tooltip");
		$tooltip.css({"opacity":"0"})
		pole_under_house.on("mouseenter", function(d) {
				d3.selectAll(".pole").style("fill-opacity", "0.4")
				d3.select(this).selectAll(".pole")
					.style("fill-opacity", "1")
					.style("stroke", "#7b0000")
					.style("stroke-width", "1px")
				
				$tooltip.css({"opacity":"1"})
				$tooltip.find(".city-name").html(d["geoWide"]+" "+d.geo);
				$tooltip.find(".household .value").html(d.house);
				$tooltip.find(".under-household .value").html(d["under_house"]);
				$tooltip.find(".under-household-single .value").html(d["under_house_single"]);
				$tooltip.find(".under-household-ratio .value").html(d["under_house_ratio"]);
				$tooltip.css({"left":(d3.mouse(this.parentNode)[0])+"px"});
			//	$tooltip.css({"top": (d3.mouse(this.parentNode)[1]+20) +"px"});
				$tooltip.css({"bottom":"-50px"});

			}).on("mouseleave", function(d){
				d3.selectAll(".pole")
					.style("fill-opacity", null)
					.style("stroke", null)
					.style("stroke-width",  null)
				$tooltip.css({"opacity":"0"})
			});

	}

	makePoleChart();

	function swiftingPoleChart(t){
		var swiftType = t; 
		if(t=="all_city"){
			d3.selectAll(".pole").transition()
			  .duration(500).style("display",null).style("opacity","1").attr("width", poleWidth);
			d3.selectAll(".pole-g").transition()
			  .duration(500).attr("transform", function(d, i) { return "translate("+ ( i * (poleWidth  + poleMargin) ) +",0)";});
			d3.selectAll(".area-box").style("opacity","1");
			d3.selectAll(".pole-label").style("display", "none");

		}else if(t=="only_centre"){

			d3.selectAll(".pole").filter(function(d){ 
				return !( (d["geoWide"]=="서울시")||(d["geoWide"]=="경기도")||(d["geoWide"]=="인천시"));
			}).style("display","none").style("opacity","0");
			d3.selectAll(".area-box").style("opacity","0");

			var width = (screenWidth<1300)? screenWidth: 1300,
				margin= 10;
		
			poleMargin = 2; 
			poleWidthC = ((width-margin)/ 66)-poleMargin;
			
			d3.selectAll(".pole-g").filter(function(d){ 
				return ( (d["geoWide"]=="서울시")||(d["geoWide"]=="경기도")||(d["geoWide"]=="인천시"));
			}).transition()
			  .duration(500).attr("transform", function(d, i) { return "translate("+ ( i * (poleWidthC  + poleMargin) ) +", 0)";});

			d3.selectAll(".pole").filter(function(d){ 
				return ( (d["geoWide"]=="서울시")||(d["geoWide"]=="경기도")||(d["geoWide"]=="인천시"));
			}).transition()
			  .duration(500)
			  .attr("width", poleWidthC);
			
			d3.selectAll(".pole-label").filter(function(d){ 
				return ( (d["geoWide"]=="서울시")||(d["geoWide"]=="경기도")||(d["geoWide"]=="인천시"))&&(Number(d["under_house_ratio"])>1) ;
			}).style("display", "inline");
		
		}
	};

	$("#POLE_CHART_SWIFT ul").find("li").on("click", function() {
		$("#POLE_CHART_SWIFT ul li").removeClass("on");
		$(this).addClass("on");
		var type = $(this).attr("data-chart-type");
		swiftingPoleChart(type);
	});
	

	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};

	function drawIcon(){
		var width = 1000,
			height= 300,
			margin= 10;
		var data = seoul_basic[0];
		var dataNumb = Number(data["under_pop"])/50;
		var path = person_path;
		var icon_mg = 1,
			icon_width = 15,
			icon_height = 40,
			lineMaxNum = parseInt($("#ICON_SVG").width() / (icon_width + icon_mg));
	
		var icon_svg = d3.select("#ICON_SVG")
			.attr("width", width +"px" )
			.attr("height", height +"px")

		var icon_holder = icon_svg.append("g")
			.attr("class","icon_holder");

		var each_group = icon_holder.append("g")
			.attr("class", "each-g");

		for(i=0; i<dataNumb; i++){
			var g = each_group.append("g")
				.attr("class", "icon")
				.attr("transform", function() {
					var x = (i % lineMaxNum) * (icon_width + icon_mg);
					var y = parseInt(i / lineMaxNum) * (icon_height + icon_mg)
					return "translate(" + x + "," + y + ")";
				}).style("width", icon_width)
				.style("height", icon_height)

			g.append("rect")
				.attr("class", "iconBack")
				.style("width", icon_width)
				.style("height", icon_height)
				.attr("fill", "rgba(255,255,255,0.05)");

			g.append("path")
				.attr("d", function(i) {
					var n = randomRange(0, 17);
					return path[n].path;
				}).style("fill", "rgb(131, 138, 148)");
		}


	}
	//drawIcon();

	function spreadIcon(dataObj){
		removeIcon();
		var width = screenWidth,
			height= 300,
			margin= 10;
		var data = dataObj;
		var dataNumb = Number(data["pop"])/100;
		var underNumb =  (dataNumb*data["under_house_ratio"])/100;
		var path = person_path;
		var icon_width = 10,
			icon_height = 27;

		var icon_svg = d3.select("#ICON_SPREADING_HOLDER")
			.attr("width", width +"px" )
			.attr("height", height +"px")

		var icon_holder = icon_svg.append("g")
			.attr("class","icon_holder");

		var each_group = icon_holder.append("g")
			.attr("class", "each-g");
		
		if(dataNumb>2000){ 
			dataNumb = 2000;
			underNumb = (2000*data["under_house_ratio"])/100; 
		}
		console.log( dataNumb, underNumb);

		for(i=0; i<dataNumb; i++){
			var g = each_group.append("g")
				.attr("class", "icon")
				.attr("transform", function() {
					var x = randomRange(0, width);
					var y = randomRange(0, height);
					return "translate(" + x + "," + y + ")";
				}).style("width", icon_width)
				.style("height", icon_height)
				.style("opacity","0");
			var iconPath = g.append("path")
				.attr("class","icon-path")
				.attr("d", function(i) {
					var n = randomRange(0, 17);
					return path[n].path;
				})
				.style("fill", "url(#iconGrad1)")
				.style("fill-opacity", "0.7")
		}
		
		for(u=0;u<underNumb;u++){
			var un = randomRange(0, dataNumb);
			$(".icon-path").eq(un).addClass("iconUnder");
			d3.select(".icon:nth-child("+un+")").select("path").style("fill", "#ff5200")
									.style("fill-opacity", "1");
		}

		var gg = d3.selectAll(".icon");
		gg.transition()
		  .duration(function() {
			return Math.floor(Math.random() * 3000)
		  })
		  .style("opacity", "1");
	
	}
	
	function removeIcon(){
		d3.select("#ICON_SPREADING_HOLDER").select(".icon_holder").remove();
	}	

	var $S = $("#search-02"),
		$S_W = $("#search-01"),
		$S_D = $("#search-03"),
		Op_lt =  $S_W.find("option");
	
	Op_lt.sort(function(a, b){
		if (a.text > b.text) return 1;
		else if (a.text < b.text) return -1;
		else {
			if (a.value > b.value) return 1;
			else if (a.value < b.value) return -1;
			else return 0;
		}
	});

	$S_W.html(Op_lt);
	$S_W.prepend("<option value='선택'> 선택 </option>");
	$S_W.find("option").eq(0).attr("selected", "selected");


	var g_Srch = {};
	g_Srch.selectGeoWide;
	g_Srch.selectBase;
	g_Srch.selectDong;

	g_Srch.appendOpt = function(geo){
		$S.find("option").remove();
		var S_sido = geo;
		for (i=0; i<all_city_data.length;i++ ){
			if( all_city_data[i]["geoWide"] == S_sido ){
				$S.append("<option value='" +  all_city_data[i]["geo"] + "'>" +  all_city_data[i]["geo"] + "</option>");
			}					
		}
		$S.removeClass("search-btn-block");
		var Op_lt2 = $S.find("option");
		Op_lt2.sort(function(a, b){
			if (a.text > b.text) return 1;
			else if (a.text < b.text) return -1;
			else {
				if (a.value > b.value) return 1;
				else if (a.value < b.value) return -1;
				else return 0;
			}
		});
		$S.html(Op_lt2);
		$S.prepend("<option value='선택'> 선택 </option>");
		$S.find("option").eq(0).attr("selected", "selected");
	}

	g_Srch.appendOptDong = function(geo){
		$S_D.find("option").remove();
		var gu = geo;
		for (i=0; i<all_dong_data.length;i++ ){
			if( all_dong_data[i]["geoWide"] == this.selectGeoWide && all_dong_data[i]["geo"] == gu ){
				$S_D.append("<option value='" +  all_dong_data[i]["geoD"] + "'>" +  all_dong_data[i]["geoD"] + "</option>");
			}					
		}
		$S_D.removeClass("search-btn-block");
		var Op_lt3 = $S_D.find("option");
		Op_lt3.sort(function(a, b){
			if (a.text > b.text) return 1;
			else if (a.text < b.text) return -1;
			else {
				if (a.value > b.value) return 1;
				else if (a.value < b.value) return -1;
				else return 0;
			}
		});
		$S_D.html(Op_lt3);
		$S_D.prepend("<option value='선택'> 선택 </option>");
		$S_D.find("option").eq(0).attr("selected", "selected");
	}	

	g_Srch.fillResult = function (geo1, geo2, geo3){
		var userSelectG;
		for (i=0; i<all_city_data.length;i++ ){
			if( all_city_data[i]["geoWide"] == geo1 && all_city_data[i]["geo"] == geo2){
				userSelectG = all_city_data[i];
				break;
			}					
		}
		if(geo1 == "세종시"){
			$("#SELECT_CITY_NAME").html("세종특별시");
		}else{
			$("#SELECT_CITY_NAME").html(userSelectG["geoWide"]+" "+userSelectG["geo"]);
		}
		$("#SELECT_HOUSE_NUMBER").html(userSelectG["house"]+" 가구");
		$("#SELECT_POP").html(userSelectG["pop"]+" 명");
		$("#SELECT_UNDERHOUSE_NUMBER").html(userSelectG["under_house"]+" 가구");
		$("#SELECT_UNDER_POP").html("("+userSelectG["under_pop"]+"명)");
		$("#SELECT_UNDERHOUSE_RATIO").html(userSelectG["under_house_ratio"]+"%");
		$(".result-text-before").hide();
		$(".result-text").slideDown();

		spreadIcon(userSelectG);
	};

	$S_W.on("change", function(){
		g_Srch.selectBase = null;
		g_Srch.selectGeoWide = null;
		g_Srch.selectDong = null;
		if ( $(this).children("option:selected").index() == 0 ){ 
			$S.addClass("search-btn-block");
			$("#search-02 option").remove();
			$S.append("<option value='선택'> 선택 </option>");
			return;
		}else {
			g_Srch.appendOpt($(this).val());
			g_Srch.selectGeoWide = $(this).val(); 
		}				
	});

	$S.on("change", function(){
		g_Srch.selectBase = null;
		g_Srch.selectDong = null;
		if ($(this).children("option:selected").index() == 0){ 
			$S_D.addClass("search-btn-block");
			$("#search-03 option").remove();
			$S_D.append("<option value='선택'> 선택 </option>");
			return;
		}else {
			g_Srch.selectBase = $(this).val();
			g_Srch.appendOptDong($(this).val());
		}					
		//g_Srch.fillResult(g_Srch.selectGeoWide, g_Srch.selectBase);
	});

	$S_D.on("change", function(){
		g_Srch.selectDong = null;
		if ($(this).children("option:selected").index() == 0){ 
			return;
		}else {
			g_Srch.selectDong = $(this).val();
		}					
		g_Srch.fillResult(g_Srch.selectGeoWide, g_Srch.selectBase, g_Srch.selectDong);
	});


	$(".loading-page").fadeOut(200, function(){
		$introItem = $(".intro-fadeTo");
		for(o=0; o<$introItem.length;o++){
			$introItem.eq(o).delay(o*700).animate({"opacity":"1"}, 1500);
		};
		
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
