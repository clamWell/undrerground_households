$(function(){
	var ieTest = false,
		screenWidth = $(window).width(),
		screenHeight = $(window).height(),
		imgURL = "http://img.khan.co.kr/spko/storytelling/2020/underground/",
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
	function numberWithCommas(x) {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	$(".close-ie-block").on("click", function(){
		$(".ie-block-9").hide();
	})



	/******** 전국 지자체 반지하 현황 막대그래프 ********/
	var poleWidth, poleWidthC, poleHeight, poleMargin;

	function makePoleChart(){
		var data = all_city_data;
		var values = data.map(function(v) {
			  return Number(v["under_house"]);
			});
		var maxValue = d3.max(values);
		var minValue = d3.min(values);

		var pole_chart_svg = d3.select("#ALL_CITY_HOUSE_POLE").select("svg");
		var def_stripe = pole_chart_svg.append("pattern")
				.attr("id", "diagonalHatchArea")
				.attr("patternUnits", "userSpaceOnUse")
				.attr("width", 4)
				.attr("height", 4)
			  .append("path")
				.attr("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2")
				.attr("stroke", "#333")
				.attr("stroke-width", 1);

		if(isMobile==true){ // Mobile vertical Pole Graph
			poleMargin = 3; 
			poleHeight = 15;
			var width = screenWidth-70; 
				height= ((poleHeight+poleMargin)*data.length);
			var multipleKey = width / maxValue;

			pole_chart_svg.attr("width", width +"px" )
				.attr("height", height +"px")
				.attr("transform", "translate(10, 0)");

			var chart_holder = pole_chart_svg.append("g")
				.attr("class","chart-holder");

			var x = d3.scale.linear()
				.range([0, width])
				.domain([0, maxValue]);

			var y = d3.scale.linear()
				.range([0, height]);

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("top").ticks(5);

			chart_holder.append("g")
			  .attr("class", "x axis")
			  .attr("transform", "translate(0,-10)")
			  .call(xAxis);

			var centre_area = chart_holder.append("g")
				.attr("class","area-box centre-area");

			var centre_area_rect = centre_area.append("rect")
				.style("fill", function(d) {
					  return "url(#diagonalHatchArea)";
				})
				.attr("height", (poleHeight+poleMargin)*66)
				.attr("width", width)
				.attr("class", "area-rect centre-area-rect")
				.style("fill-opacity", "0.15");
			centre_area.append("text")
				.text("수도권")
				.attr("class","area-label")
				.attr("transform", "translate("+width+",10)");

			var seoul_area = chart_holder.append("g")
				.attr("class","area-box seoul-area");

			var seoul_area_rect = seoul_area.append("rect")
				.style("fill", function(d) {
					  return "rgb(187, 187, 187)";
				})
				.attr("width",width*0.8)
				.attr("height",(poleHeight+poleMargin)*25 )
				.attr("x", "0")
				.attr("y", "0")
				.attr("class", "area-rect seoul-area-rect")
				.style("fill-opacity", "0.2");
			seoul_area.append("text")
				.text("서울")
				.attr("class","area-label")
				.attr("transform", "translate("+width*0.75+",10)");

			var pole_under_house_holder = chart_holder.append("g")
				.attr("class","pole-under-house-holder");

			var pole_under_house = pole_under_house_holder.selectAll("g")
					.data(data)
					.enter().append("g")
					.attr("class","pole-g")
					.attr("transform", function(d, i) { return "translate(0,"+ ( i * (poleHeight + poleMargin) ) +")";});
			
			pole_under_house.append("rect")
					.style("fill", function(d) {
					  return "#ffae12";
					})
					.attr("height", poleHeight)
					.attr("class", "pole pole-under-house")
					.attr("width", function(d) {
						var w = Number(d["under_house"]) * multipleKey;
						if(w<4){ w = 4;}
						return w;
					}).attr("x", "0").attr("y", "0");

			var pole_under_house_single = pole_under_house.append("rect")
					.style("fill", function(d) {
					  return "#ff432f";
					})
					.attr("height", poleHeight)
					.attr("class", "pole pole-under-single-house")
					.attr("width", function(d) {
						return Number(d["under_house_single"]) * multipleKey;
					}).attr("x", "0").attr("y", "0");

			pole_under_house.append("text")
				.attr("class","pole-label")
				.text(function(d) { return d.under_house+"가구("+d.under_house_ratio+"%)"; })
				.attr("transform", function(d, i) { 
					var xValue = Number(d["under_house"]) * multipleKey;
					if(xValue >= (width-60)){xValue =width-60 }
					return "translate("+xValue+","+(poleHeight-4)+")";
				})

			var labelHolder = chart_holder.append("g")
				.attr("class","label-holder")
				.attr("transform", "translate(0, 10)");

			var Xaxis = labelHolder.selectAll("g")
				.data(data)
				.enter()
				.append("g")
				.attr("transform", function(d, i) {	
					return "translate(-35,"+ ( i * (poleHeight+poleMargin) ) +")";
				});

			var Xaxis_label = Xaxis.append("text")
				.attr("width", "30")
				.attr("fill", "#111")
				.attr("font-size", "10px")
				.attr("class", "graph-Xaxis")
				.attr("text-anchor", "start")
				.text(function(d) {
				  return d.geo;
				});

			var $tooltip = $(".all-city-household-chart .tooltip");
			$tooltip.css({"opacity":"0"})
			pole_under_house.on("click", function(d) {
					d3.selectAll("#ALL_CITY_HOUSE_POLE .pole").style("fill-opacity", "0.4")
					d3.select(this).selectAll(".pole")
						.style("fill-opacity", "1")
						.style("stroke", "#7b0000")
						.style("stroke-width", "1px");
					
					$tooltip.css({"opacity":"1"});
					$tooltip.css({"display":"block"});
					$tooltip.find(".city-name").html(d["geoWide"]+" "+d.geo);
					$tooltip.find(".household .value").html(numberWithCommas(d.house));
					$tooltip.find(".under-household .value").html( numberWithCommas(d["under_house"]) );
					$tooltip.find(".under-household-single .value").html( numberWithCommas(d["under_house_single"]));
					$tooltip.find(".under-household-ratio .value").html(d["under_house_ratio"]);
					d3.select(this).selectAll(".pole-label")
						.style("opacity", "1");

				}).on("mouseleave", function(d){
					d3.selectAll("#ALL_CITY_HOUSE_POLE  .pole")
						.style("fill-opacity", null)
						.style("stroke", null)
						.style("stroke-width",  null)
					$tooltip.css({"opacity":"0"})
					$tooltip.css({"display":"none"});
					d3.selectAll(".pole-label")
						.style("opacity", null);
				});		

			$(".story-body:not(#ALL_CITY_HOUSE_POLE)").on("touchstart",function(){
				d3.selectAll("#ALL_CITY_HOUSE_POLE  .pole")
					.style("fill-opacity", null)
					.style("stroke", null)
					.style("stroke-width",  null)
				$tooltip.css({"opacity":"0"})
				$tooltip.css({"display":"none"});
				d3.selectAll(".pole-label")
					.style("opacity", null);
			});

		}else{ // PC horizontal Pole Graph
			var width = (screenWidth<1300)? (screenWidth-80): 1300,
				height= 400,
				margin= 10 ;
			

			pole_chart_svg.attr("width", width +"px" )
				.attr("height", height +"px");

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
			poleMargin = 2; 
			poleWidth = ((width-margin) / data.length)-poleMargin;

			chart_holder.append("g")
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
				
			$(".item.one").insertAfter(".item.three");
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
						return 0;
					}).attr("y", function(d) {
						var h = Number(d["under_house"]) * multipleKey;
						if(h<4){ h = 4;}
						return height-h;
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
						return 0;
					}).attr("y", function(d) {
						return height-(Number(d["under_house_single"]) * multipleKey);
					});

			pole_under_house.append("text")
				.attr("class","pole-label")
				.text(function(d) { return d.under_house_ratio+"%"; })
				.attr("transform", function(d, i) { 
					return "translate(8," + (height-(Number(d["under_house"]) * multipleKey)-2) + ")";
				}).style("display", "none");
			
			var $tooltip = $(".all-city-household-chart .tooltip");
			$tooltip.css({"opacity":"0"})
			pole_under_house.on("mouseenter", function(d) {
					d3.selectAll("#ALL_CITY_HOUSE_POLE .pole").style("fill-opacity", "0.4")
					d3.select(this).selectAll(".pole")
						.style("fill-opacity", "1")
						.style("stroke", "#7b0000")
						.style("stroke-width", "1px")
					
					$tooltip.css({"opacity":"1"})
					$tooltip.find(".city-name").html(d["geoWide"]+" "+d.geo);
					$tooltip.find(".household .value").html(numberWithCommas(d.house));
					$tooltip.find(".under-household .value").html( numberWithCommas(d["under_house"]) );
					$tooltip.find(".under-household-single .value").html( numberWithCommas(d["under_house_single"]));
					$tooltip.find(".under-household-ratio .value").html(d["under_house_ratio"]);
					$tooltip.css({"left":(d3.mouse(this.parentNode)[0])+"px"});
					$tooltip.css({"bottom":"-70px"});

				}).on("mouseleave", function(d){
					d3.selectAll("#ALL_CITY_HOUSE_POLE  .pole")
						.style("fill-opacity", null)
						.style("stroke", null)
						.style("stroke-width",  null)
					$tooltip.css({"opacity":"0"})
				});		
		}
		
		$(".all-city-household-chart .tooltip .close-btn").on("click", function(){
			d3.selectAll("#ALL_CITY_HOUSE_POLE  .pole")
				.style("fill-opacity", null)
				.style("stroke", null)
				.style("stroke-width",  null)
			$tooltip.css({"opacity":"0"})
			$tooltip.css({"display":"none"})

			d3.selectAll(".pole-label")
					.style("opacity", null);
		});

	}

	function swiftingPoleChart(t){
		var swiftType = t; 
		if(t=="all_city"){
			$("#POLE_CHART_SWIFT .click-animation").hide();
			d3.selectAll("#ALL_CITY_HOUSE_POLE .pole").transition()
			  .duration(500).style("display",null).style("opacity","1").attr("width", poleWidth);
			d3.selectAll("#ALL_CITY_HOUSE_POLE .pole-g").transition()
			  .duration(500).attr("transform", function(d, i) { return "translate("+ ( i * (poleWidth  + poleMargin) ) +",0)";});
			d3.selectAll(".area-box").style("opacity","1");
			d3.selectAll(".pole-label").style("display", "none");

		}else if(t=="only_centre"){
			$("#POLE_CHART_SWIFT .click-animation").fadeIn();

			d3.selectAll("#ALL_CITY_HOUSE_POLE .pole").filter(function(d){ 
				return !( (d["geoWide"]=="서울시")||(d["geoWide"]=="경기도")||(d["geoWide"]=="인천시"));
			}).style("display","none").style("opacity","0");
			d3.selectAll(".area-box").style("opacity","0");

			var width = (screenWidth<1300)? (screenWidth-80): 1300,
				margin= 10;
		
			poleMargin = 2; 
			poleWidthC = ((width-margin)/ 66)-poleMargin;
			
			d3.selectAll("#ALL_CITY_HOUSE_POLE .pole-g").filter(function(d){ 
				return ( (d["geoWide"]=="서울시")||(d["geoWide"]=="경기도")||(d["geoWide"]=="인천시"));
			}).transition()
			  .duration(500).attr("transform", function(d, i) { return "translate("+ ( i * (poleWidthC  + poleMargin) ) +", 0)";});

			d3.selectAll("#ALL_CITY_HOUSE_POLE .pole").filter(function(d){ 
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
	
	/******** 막대그래프 ********/


	/******** 검색영역 아이콘  ********/
	var randomRange = function(n1, n2) {
		return Math.floor((Math.random() * (n2 - n1 + 1)) + n1);
	};
	function spreadIcon(dataObj){
		removeIcon();
		var width = screenWidth,
			height= 300,
			margin= 10;
		var data = dataObj;
		var dataNumb = Number(data["house"])/20;
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
		
		var dataNumbMax = (isMobile==true)? 500 :1000; 
		if(dataNumb> dataNumbMax){ 
			dataNumb =  dataNumbMax;
			underNumb = ( dataNumbMax*data["under_house_ratio"])/100; 
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
	/******** 검색영역 아이콘  ********/

	/******** 검색영역 검색기  ********/
	var $S = $("#search-02"),
		$S_W = $("#search-01"),
		$S_D = $("#search-03"),
		$S_V = $("#search-05"),
		$S_W_V = $("#search-04"),
		Op_lt =  $S_W.find("option"),
		Op_lt_v =  $S_W_V.find("option");
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
	g_Srch.selectGeoVote;
	g_Srch.selectVote;

	g_Srch.appendOpt = function(geo){
		$S.find("option").remove();
		var S_sido = geo;
		var temp;
		for (i=0; i<all_dong_data.length;i++ ){
			if( all_dong_data[i]["geoWide"] == S_sido ){
				if(i!==0){
					if(temp == all_dong_data[i]["geo"]){

					}else if(temp !== all_dong_data[i]["geo"]){
						$S.append("<option value='" +  all_dong_data[i]["geo"] + "'>" +  all_dong_data[i]["geo"] + "</option>");
						temp = all_dong_data[i]["geo"];
					}
				}else if(i==0){
					$S.append("<option value='" +  all_dong_data[i]["geo"] + "'>" +  all_dong_data[i]["geo"] + "</option>");
					temp = all_dong_data[i]["geo"];
				}
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
		for (i=0; i<all_dong_data.length;i++ ){
			if( all_dong_data[i]["geoWide"] == geo1 && all_dong_data[i]["geo"] == geo2 && all_dong_data[i]["geoD"] == geo3 ){
				userSelectG = all_dong_data[i];
				break;
			}					
		}
		$(".geo-exp").html("지역");
		$("#SELECT_CITY_NAME").html(userSelectG["geoWide"]+" "+userSelectG["geo"]+" "+userSelectG["geoD"]);
		$("#SELECT_HOUSE_NUMBER").html(userSelectG["house"]+" 가구");
		$("#SELECT_UNDERHOUSE_NUMBER").html(userSelectG["under_house"]+" 가구");
		$("#SELECT_UNDERHOUSE_RATIO").html(userSelectG["under_house_ratio"]+"%");
		g_Srch.showResult(userSelectG);
	};

	g_Srch.showResult = function (u){
		var data = u;
		$(".result-text-before").hide();
		$(".result-text").slideDown( function(){
			var movePosAdKey = (isMobile==true)? 100: 200;
			var movePos = $(".search-result-box").offset().top-movePosAdKey;
			$("html, body").animate({scrollTop: movePos},1200, "easeOutCubic");
			spreadIcon(data);
		});	

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
	});

	$S_D.on("change", function(){
		g_Srch.selectDong = null;
		if ($(this).children("option:selected").index() == 0){ 
			return;
		}else {
			g_Srch.selectDong = $(this).val();
		}
		console.log(g_Srch.selectGeoWide, g_Srch.selectBase, g_Srch.selectDong);
		g_Srch.fillResult(g_Srch.selectGeoWide, g_Srch.selectBase, g_Srch.selectDong);
	});

	function resetAllOpt(){   /// 지역 검색 단위 변경시 
		g_Srch.selectGeoVote = null;
		g_Srch.selectVote = null;
		g_Srch.selectGeoWide = null;
		g_Srch.selectBase = null;
		g_Srch.selectDong = null;
		$S_V.addClass("search-btn-block");
		$("#search-05 option").remove();
		$S_V.append("<option value='선택'> 선택 </option>");
		$S.addClass("search-btn-block");
		$("#search-02 option").remove();
		$S.append("<option value='선택'> 선택 </option>");
		$S_D.addClass("search-btn-block");
		$("#search-03 option").remove();
		$S_D.append("<option value='선택'> 선택 </option>");
		$S_W.find("option").eq(0).attr("selected", "selected");
		$S_W_V.find("option").eq(0).attr("selected", "selected");
	}

	$("#SEARCHER_SWIFT ul li").on("click", function(e){
		e.preventDefault();
		$("#SEARCHER_SWIFT ul li").removeClass("on");
		$(this).addClass("on");
		var swiftType = $(this).attr("data-search-type");

		removeIcon();
		$(".result-text").hide();
		$(".result-text-before").slideDown();
		resetAllOpt();

		if(swiftType == "ver_dong"){
			$(".searcher-holder-ver-geo").show();
			$(".searcher-holder-ver-vote").hide();
			$("#SEARCHER_SWIFT .click-animation").fadeIn();
		}else if(swiftType == "ver_vote"){
			$(".searcher-holder-ver-geo").hide();
			$(".searcher-holder-ver-vote").show();
			$("#SEARCHER_SWIFT .click-animation").hide();
		}
	});

	Op_lt_v.sort(function(a, b){
		if (a.text > b.text) return 1;
		else if (a.text < b.text) return -1;
		else {
			if (a.value > b.value) return 1;
			else if (a.value < b.value) return -1;
			else return 0;
		}
	});
	$S_W_V.html(Op_lt_v);
	$S_W_V.prepend("<option value='선택'> 선택 </option>");
	$S_W_V.find("option").eq(0).attr("selected", "selected");


	g_Srch.appendOptVote = function(geo){
		$S_V.find("option").remove();
		var S_sido = geo;
		for (i=0; i<full_city_vote.length;i++ ){
			if( full_city_vote[i]["geo1"] == S_sido ){
				$S_V.append("<option value='" +  full_city_vote[i]["geo2"] + "'>" +  full_city_vote[i]["geo2"] + "</option>");
			}					
		}
		$S_V.removeClass("search-btn-block");
		var Op_lt_v = $S_V.find("option");
		Op_lt_v.sort(function(a, b){
			if (a.text > b.text) return 1;
			else if (a.text < b.text) return -1;
			else {
				if (a.value > b.value) return 1;
				else if (a.value < b.value) return -1;
				else return 0;
			}
		});
		$S_V.html(Op_lt_v);
		$S_V.prepend("<option value='선택'> 선택 </option>");
		$S_V.find("option").eq(0).attr("selected", "selected");
	};
	g_Srch.fillResultVote = function (geo1, geo2){
		var userSelectG;
		for (i=0; i<full_city_vote.length;i++ ){
			if( full_city_vote[i]["geo1"] == geo1 && full_city_vote[i]["geo2"] == geo2 ){
				userSelectG = full_city_vote[i];
				break;
			}					
		}
		$(".geo-exp").html("지역구");
		$("#SELECT_CITY_NAME").html(userSelectG["geoFull"]);

		$("#SELECT_HOUSE_NUMBER").html(userSelectG["house"]+" 가구");
		$("#SELECT_UNDERHOUSE_NUMBER").html(userSelectG["under_house"]+" 가구");
		$("#SELECT_UNDERHOUSE_RATIO").html(userSelectG["under_house_ratio"]+"%");

		g_Srch.showResult(userSelectG);
	};
	$S_W_V.on("change", function(){
		g_Srch.selectGeoVote = null;
		g_Srch.selectVote = null;
		if ( $(this).children("option:selected").index() == 0 ){ 
			$S_V.addClass("search-btn-block");
			$("#search-05 option").remove();
			$S_V.append("<option value='선택'> 선택 </option>");
			return;
		}else {
			g_Srch.appendOptVote($(this).val());
			g_Srch.selectGeoVote = $(this).val(); 
		}				
	});
	$S_V.on("change", function(){
		g_Srch.selectVote = null;
		if ($(this).children("option:selected").index() == 0){ 
			return;
		}else {
			g_Srch.selectVote = $(this).val();
		}
		console.log(g_Srch.selectGeoVote, g_Srch.selectVote);
		g_Srch.fillResultVote(g_Srch.selectGeoVote, g_Srch.selectVote);
	});
	/******** 검색영역 검색기  ********/

	/***** 서울시 지도 ******/
	var map_geo_label;
	function makeMapOverlay(){
		var width = 1000,
			height = 700;

		var svg = d3.select(".map-holder").select("svg")
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
			.attr("stroke-width", 2);

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

		var map_under_house_ratio = map.append("g").attr("id", "UNDER_HOUSE_RATIO").attr("class","map--layer");
		var map_low_income_ratio = map.append("g").attr("id", "LOW_INCOME_RATIO").attr("class","map--layer");
		var map_old_ratio = map.append("g").attr("id", "OLD_RATIO").attr("class","map--layer");
		var map_single_parent_house_ratio = map.append("g").attr("id", "SINGLE_PARENT_RATIO").attr("class","map--layer");
		var map_basic_geo = map.append("g").attr("id", "GEO");
		map_geo_label = map.append("g").attr("id", "GEO_LABEL");

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
						break;
					}			
				}
			}
			
			var colorFn = d3.scale.category10();
			var color_under_house = d3.scale.linear().domain([2.2, 11.3])
					  .range(["rgba(255,130,38,0.05)", "rgba(255,130,38,0.5)"]);
			function color_under_house_ratio(v){
				if(v<=6){
					if(2<v&&v<=3){
						return "rgba(255,130,38,0.05)";
					}else if(3<v&&v<=4){
						return "rgba(255,130,38,0.1)";
					}else if(4<v&&v<=6){
						return "rgba(255,130,38,0.15)";
					}
				}else if(v>6){
					if(6<v&&v<=8){
						return "rgba(255,130,38,0.3)";
					}else if(8<v&&v<=10){
						return "rgba(255,130,38,0.5)";
					}else if(10<v){
						return "rgba(255,130,38,0.7)";
					}
				}
			}
			var color_old = d3.scale.linear().domain([8.53, 29.28])
						  .range(["rgba(255,62,38,0.01)", "rgba(255,62,38,0.5)"]);
			function color_old_ratio(v){
				if(v<=18.5){
					if(v<=12){
						return "rgba(255,62,38,0.01)";
					}else if(12<v&&v<=15){
						return "rgba(255,62,38,0.05)";
					}else if(15<v&&v<=18.5){
						return "rgba(255,62,38,0.1)";
					}
				}else if(v>18.5){
					if(18.5<v&&v<=22){
						return "rgba(255,62,38,0.4)";
					}else if(22<v&&v<=25){
						return "rgba(255,62,38,0.5)";
					}else if(25<v){
						return "rgba(255,62,38,0.6)";
					}
				}
			}

			var color_single_parents = d3.scale.linear().domain([0.39, 1.72])
						  .range(["rgba(255,38,64,0.05)", "rgba(255,38,64,0.4)"]);
			var opacity_low_income =  d3.scale.linear().domain([2.32, 8.85]).range(["0.1", "1.0"]);
			var opacity_single_parents =  d3.scale.linear().domain([0.39, 1.72]).range(["0.1", "0.7"]);

			map_under_house_ratio.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-under-house c-" + d.properties.SIG_CD })
				.attr("d", path)
				.style("fill", function(d){
					var value = d.properties["under_house_ratio"];
					return color_under_house_ratio(value);
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
					if(value<5.3){
						return "0.2";
					}else if(value>=5.3){
						return "1";
					}
				}).style("stroke-width","2");

			 map_single_parent_house_ratio.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-single-parent c-" + d.properties.SIG_CD })
				.attr("d", path)
				.style("fill", "url(#diagonalHatch)")
				.style("fill-opacity", function(d){
					var value = d.properties["single_parent_house_ratio"];
					return opacity_single_parents(value);
				})
				.style("stroke-opacity", function(d){
					var value = d.properties["single_parent_house_ratio"];
					if(value<0.9){
						return "0.1";
					}else if(value>=0.9){
						return "1";
					}
				}).style("stroke-width","2").style("stroke","#cf3a00")

			 map_old_ratio.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-old c-" + d.properties.SIG_CD })
				.attr("d", path)
				.style("fill", function(d){
					var value = d.properties["old_ratio"];
					return color_old_ratio(value);
				})

			var geoBorder = map_basic_geo.selectAll("path")
				.data(features)
				.enter().append("path")
				.attr("class", function(d) { console.log(); return "geo geo-basic c-" + d.properties.SIG_CD })
				.attr("d", path)

			var $map_tooltip = $(".map-holder .tooltip");
			
			geoBorder.on("mouseover", function(d){
					d3.select(this)
						.style("stroke-opacity", "1")
						.style("stroke-width", 2)
						.style("stroke-dasharray", 0)
						.style("stroke-dashoffset", 0)
					$map_tooltip.css("display","block");
					$map_tooltip.find(".tooltip-con .city-name").html(d.properties.SIG_KOR_NM);
					$map_tooltip.find(".tooltip-con .under-household-ratio .value").html(d.properties["under_house_ratio"]+"%");
					$map_tooltip.css({"left":(d3.mouse(this)[0])+"px"});
					$map_tooltip.css({"top": (d3.mouse(this)[1]+10) +"px"});

					}).on("mouseout", function(d){
						d3.select(this)
							.style("stroke-opacity", null)
							.style("stroke-width", null)
							.style("stroke-dasharray", null)
							.style("stroke-dashoffset", null)
						
						$map_tooltip.css("display","none");
						 
					})

			map_geo_label.selectAll("text")
				.data(features)
				.enter().append("text")
				.attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
				.attr("dy", ".35em")
				.attr("class", "geo-label")
				.text(function(d) { return d.properties.SIG_KOR_NM})
		});

	}

	function setMapDefault(){
		$("#UNDER_HOUSE_RATIO").hide();
		$("#LOW_INCOME_RATIO").hide();
		$("#SINGLE_PARENT_RATIO").hide();
		$("#OLD_RATIO").hide();
	}

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
	/***** 서울시 지도 ******/


	/****** 구별 임대주택 막대 그래프 ******/
	var dataRent = [];
	seoul_basic.map(function(v,i,a){
		var tempObj = {};
		tempObj.geo = a[i].geo;
		tempObj["rent_apart"] = a[i]["rent_apart"];
		dataRent.push(tempObj);
	});

	function makePoleChartRent(){
		var width = (screenWidth<700)? (screenWidth-50): 700,
			height= 300,
			margin= 10;
		var data = seoul_basic;
		
		var values = data.map(function(v) {
		  return Number(v["rent_apart"]);
		});
		var maxValue = d3.max(values);
		var minValue = d3.min(values);
		var multipleKey = height / maxValue;
		var poleMarginRent = 2; 
		var poleWidthRent = ((width-margin) / data.length)-poleMarginRent;

		var pole_chart_svg = d3.select("#SEOUL_RENT_APART_POLE").select("svg")
			.attr("width", width +"px" )
			.attr("height", height +"px")

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
		chart_holder.append("g")
		  .attr("class", "y axis")
		  .attr("transform", "translate(-10,0)")
		  .call(yAxis);

		var labelHolder = pole_chart_svg.append("g")
			.attr("transform", "translate(" + 0 + ","+ height +")")

		var Xaxis = labelHolder.selectAll("g")
			.data(data)
			.enter()
			.append("g")
			.attr("transform", function(d, i) {	
				return "translate("+ ( i * (poleWidthRent  + poleMarginRent) ) +","+( (isMobile==true)? 15 : 30)+")";
			});

		var Xaxis_label = Xaxis.append("text")
			.attr("width", "50")	
			.attr("fill", "#111")
			.attr("font-size", "10px")
			.attr("class", "graph-Xaxis")
			.text(function(d) {
			  return d.geo;
			})

		if(isMobile==true){
			Xaxis_label.style("opacity", function(d){
				if(d["geo"]=="강서구"||d["geo"]=="노원구"){
					return "1";
				}else{
					return "0";
				}
			}).attr("text-anchor", "middle")
		}else{
			Xaxis_label.attr("transform","rotate(-45)").attr("text-anchor", "start")
		}
		
		var halfLineHolder = chart_holder.append("g")
			.attr("class", "half-line-holder")
			.attr("transform", "translate(0,"+ (height-(multipleKey*10351)) +")");

		var halfLine = halfLineHolder.append("line")
			.attr("class", "half-line")
			.attr("x1", 0)
			.attr("y1", 0)
			.attr("x2", width)
			.attr("y2", 0)
			.attr("stroke-width", "0.5")
			.attr("stroke", "#111");
		
		var avrLineText = (isMobile==true)? "평균":"평균 10,351호";
		halfLineHolder.append("text")
			.attr("transform", "translate("+(width-5)+",0)")
			.text(avrLineText);

		var pole_rent_apart_holder = chart_holder.append("g")
			.attr("class","pole-rent-holder");

		var pole_rent_apart = pole_rent_apart_holder.selectAll("g")
				.data(data)
				.enter().append("g")
				.attr("class","pole-g")
				.attr("transform", function(d, i) { return "translate("+ ( i * (poleWidthRent  + poleMarginRent) ) +",0)"});

		pole_rent_apart.append("rect")
				.style("fill", function(d) {
					if(d["geo"]=="강서구"||d["geo"]=="노원구"){
						return "#ff5200";
					}else{
						return "#ff9c34";	
					}
				})
				.attr("width", poleWidthRent)
				.attr("class", "pole")
				.attr("height", function(d) {
					var h = Number(d["rent_apart"]) * multipleKey;
					if(h<4){ h = 4;}
					return h;
				}).attr("x", function(d, i) {
					return 0;
				}).attr("y", function(d) {
					var h = Number(d["rent_apart"]) * multipleKey;
					if(h<4){ h = 4;}
					return height-h;
				});

		pole_rent_apart.append("text")
			.filter(function(d){ return (d["geo"]=="강서구"||d["geo"]=="노원구"); })
			.attr("class","pole-label")
			.attr("transform", function(d, i) { 
				return "translate("+ (poleWidthRent/2)+","+(height-(Number(d["rent_apart"]) * multipleKey)-5) + ")";
			})
			.text(function(d) { return numberWithCommas(d["rent_apart"])+"호";});

		var $tooltip = $(".seoul-rent-apart-chart .tooltip");
		$tooltip.css({"opacity":"0"})

		if(isMobile==true){
			pole_rent_apart.on("click", function(d) {
				d3.selectAll("#SEOUL_RENT_APART_POLE .pole").style("fill-opacity", "0.4")
				d3.select(this).selectAll(".pole")
					.style("fill-opacity", "1")
					.style("stroke", "#7b0000")
					.style("stroke-width", "1px")
				$tooltip.css({"opacity":"1"})
				$tooltip.find(".city-name").html(d["geo"]);
				$tooltip.find(".rent-apart .value").html( numberWithCommas(d["rent_apart"]));
				if(isMobile==true){
				
				}else{
					$tooltip.css({"left":((d3.mouse(this.parentNode)[0])+150)+"px"});
					$tooltip.css({"bottom":"-30px"});
				}
				var g = d["geo"];
				d3.selectAll(".graph-Xaxis")
					.filter(function(d){ return d.geo == g;})
					.style("fill-opacity","1")
					.style("fill","#ff5200");

			}).on("mouseleave", function(d){
				d3.selectAll("#SEOUL_RENT_APART_POLE  .pole")
					.style("fill-opacity", null)
					.style("stroke", null)
					.style("stroke-width",  null)
				$tooltip.css({"opacity":"0"});

				d3.selectAll(".graph-Xaxis")
					.style("fill-opacity",null)
					.style("fill",null);

			});

			$(".story-body:not(#SEOUL_RENT_APART_POLE)").on("touchstart",function(){
				d3.selectAll("#SEOUL_RENT_APART_POLE  .pole")
					.style("fill-opacity", null)
					.style("stroke", null)
					.style("stroke-width",  null)
				$tooltip.css({"opacity":"0"});

				d3.selectAll(".graph-Xaxis")
					.style("fill-opacity",null)
					.style("fill",null);

			});

		
		}else{
			pole_rent_apart.on("mouseenter", function(d) {
				d3.selectAll("#SEOUL_RENT_APART_POLE .pole").style("fill-opacity", "0.4")
				d3.select(this).selectAll(".pole")
					.style("fill-opacity", "1")
					.style("stroke", "#7b0000")
					.style("stroke-width", "1px")
				$tooltip.css({"opacity":"1"})
				$tooltip.find(".city-name").html(d["geo"]);
				$tooltip.find(".rent-apart .value").html( numberWithCommas(d["rent_apart"]));
				if(isMobile==true){
				
				}else{
					$tooltip.css({"left":((d3.mouse(this.parentNode)[0])+150)+"px"});
					$tooltip.css({"bottom":"-30px"});
				}
				var g = d["geo"];
				d3.selectAll(".graph-Xaxis")
					.filter(function(d){ return d.geo == g;})
					.style("fill-opacity","1")
					.style("fill","#ff5200");

			}).on("mouseleave", function(d){
				d3.selectAll("#SEOUL_RENT_APART_POLE  .pole")
					.style("fill-opacity", null)
					.style("stroke", null)
					.style("stroke-width",  null)
				$tooltip.css({"opacity":"0"});

				d3.selectAll(".graph-Xaxis")
					.style("fill-opacity",null)
					.style("fill",null);

			});
		}
		
		$(".seoul-rent-apart-chart .tooltip .close-btn").on("click", function(){
			d3.selectAll("#SEOUL_RENT_APART_POLE  .pole")
				.style("fill-opacity", null)
				.style("stroke", null)
				.style("stroke-width",  null)
			$tooltip.css({"opacity":"0"});

			d3.selectAll(".graph-Xaxis")
				.style("fill-opacity",null)
				.style("fill",null);
		});
	};	
	/****** 구별 임대주택 막대 그래프 ******/

	function drawAllGraphAndChart(){
		makePoleChart();
		makeMapOverlay();
		setMapDefault();
		makePoleChartRent();
		if(!isMobile){
			swiftingPoleChart("only_centre");
		}
	};

	var textBoxLeftMove = ((screenWidth - $(".text-box").width())/2-50); 
	if(textBoxLeftMove >=450){textBoxLeftMove = 450; }
	$(".text-box").css("left", textBoxLeftMove+"px");

	/******** 모바일 전용 조정 ********/
	if(isMobile==true){
		$(".text-box").css("left", "0px");
		$(".page-title").find("img").attr("src", imgURL+"page-title-m-2.png");
		$(".all-city-household-chart .pole-legend").insertAfter("#POLE_CHART_SWIFT");
		$("#POLE_CHART_SWIFT").hide();
		$(".wage_avr").attr("src",  imgURL+"graph_wage_avr_m.png");
		$(".underhouse-wage").attr("src",  imgURL+"graph_underhouse_wage_m.png");
		var mapScaleKey = Number((screenWidth/1000).toFixed(4))+0.13;
		var mapTransValue = (screenWidth*4/15).toFixed(4);
		$(".seoul-map .map-holder").css({"transform":"scale("+mapScaleKey+") translate("+(mapTransValue*-1)+"px, 0px)", "transform-origin":"left center"});
		$(".all-city-household-chart .graph-des").html("막대그래프를 클릭하시면 <b>지자체별 상세정보</b>를 보실 수 있습니다.");
		$(".seoul-rent-apart-chart .graph-des").html("막대그래프를 클릭하시면 <b>구별 상세정보</b>를 보실 수 있습니다.");
	}
	/******** 모바일 전용 조정 ********/

	/******** Gallery Slider ********/
	var Slider = {},
		baseWidth = null,
		$Base = $(".slider-body ul li");
 	Slider.itemNumb = $Base.length;
	Slider.setSlider = function(){
		if(isMobile==true){
			$(".gallery-slider .slider-wrapper").css({"height": (screenWidth*3/4)+"px"});
			$Base.css({"width": $(".slider-body").width(), "height": (screenWidth*3/4)+"px"});
			baseWidth = $(".slider-body").width();
		}else{
			baseWidth = $Base.width();
		}	
		$(".slider-body ul").css({"width":Slider.itemNumb*baseWidth });
		$Base.eq(0).addClass("slider-item-on");
	};

	Slider.index = 0;
	Slider.moveSlide = function(drct){
		if(drct=="prev"){ // 이전
			if(Slider.index==0){}
			else if(Slider.index>0){
				Slider.index -=1;
				var moving = baseWidth*Slider.index;
				$(".slider-body ul").stop().animate({"left":-moving}, 500,"easeOutCubic");
				$Base.removeClass("slider-item-on");
				$Base.eq(Slider.index).addClass("slider-item-on");
			}

		}else if(drct=="next"){ // 다음
			if(Slider.index==Slider.itemNumb-1 ){}
			else if(Slider.index<Slider.itemNumb-1 ){
				Slider.index +=1;
				var moving = baseWidth*Slider.index;
				$(".slider-body ul").stop().animate({"left":-moving}, 500,"easeOutCubic");
				$Base.removeClass("slider-item-on");
				$Base.eq(Slider.index).addClass("slider-item-on");
			}

		}
		$(".arrow").removeClass("arrow-block");
	}
	Slider.setSlider();

	$(".arrow").on("click", function(e){
		$(".arrow").addClass("arrow-block");
		e.preventDefault();
		var drct = $(this).attr("id");
		Slider.moveSlide(drct);
	});
	/******** Gallery Slider ********/


	/******** init page ********/
	function init(){
		resetAllOpt();
		drawAllGraphAndChart();
		$introItem = $(".intro-fadeTo");
		for(o=0; o<$introItem.length;o++){
			$introItem.eq(o).delay(o*700).animate({"opacity":"1"}, 1500);
		};
		if(isMobile==false){ $(".fixed-navi").animate({"right":"10px"},1000); }
	}

	$(".loading-page").fadeOut(200, function(){
		init();
	});
	/******** init page ********/

	/******** Scroll event listener ********/
	var nowScroll;
	var mapPos = "before";
	$(".map-fixed-slider .fixed-el").css({"padding-top": ((screenHeight-$(".map-holder").height())/2) +"px"});
	$(".map-fixed-slider").css({"height": ($(".map-fixed-slider").height()+screenHeight)+"px"});
	$(window).scroll(function(){
		var nowScroll = $(window).scrollTop();
		var nowScrollWithCon = nowScroll+screenHeight*0.6;
		var endPoint = $(".map-fixed-slider").offset().top + $(".map-fixed-slider").height()-screenHeight;

		if( nowScroll >= $(".map-fixed-slider").offset().top && nowScroll < endPoint ){
			if(mapPos !== "on"){
				mapPos = "on";
				$(".fixed-el").addClass("fixed-el-fixed");
				$(".fixed-el").removeClass("fixed-el-bottom");
			}

		}else if( nowScroll < $(".map-fixed-slider").offset().top ){
			if(mapPos !== "before"){
				mapPos = "before";
				$(".fixed-el").removeClass("fixed-el-fixed");
				$(".fixed-el").removeClass("fixed-el-bottom");
				$(".map--layer").hide();

			}
		}else if( nowScroll >= endPoint){
			if(mapPos !== "after"){
				mapPos = "after";
				$(".fixed-el").removeClass("fixed-el-fixed");
				$(".fixed-el").addClass("fixed-el-bottom");
			}
		}
		mScEv.checkMapStage(nowScroll);

		var fullScroll = $(document).height()-$(window).height()-( $(".footer-area").height()+$(".digital-list").height() +$(".common-footer").height());			
		var ScrollPer = (nowScroll/fullScroll)*100;
		if(isMobile==true){
			$(".progress").css({"width":ScrollPer+"%"});
		}else {
			$(".progress").css({"height":ScrollPer+"%"});
		}
	});

	var mScEv = {};
	mScEv.mapStage = null;
	mScEv.adjustStage = function(g){
		if( mScEv.mapStage == g){
		}else if( mScEv.mapStage !==g ){
			mScEv.mapStage = g;
			mScEv.drawMapByStage(mScEv.mapStage);
		}
	};
	
	mScEv.drawMapByStage = function(n){
		switch(n){
			case 0:
				$(".map--layer").fadeOut();
				map_geo_label.selectAll("text").style("opacity","1");
				break;
			case 1:
				$(".map--layer").hide();
				$("#OLD_RATIO").fadeIn();
				map_geo_label.selectAll("text").style("opacity","1");
				break;
			case 2:
				$(".map--layer").hide();
				$("#SINGLE_PARENT_RATIO").fadeIn();
				map_geo_label.selectAll("text").style("opacity","1");
				break;
			case 3:
				$(".map--layer").hide();
				$("#SINGLE_PARENT_RATIO").show();
				$("#OLD_RATIO").fadeIn();
				map_geo_label.selectAll("text").style("opacity","0");
				map_geo_label.selectAll("text")
					.filter(function(d){ 
						var k = d.properties.SIG_KOR_NM;
						return (k =="강북구"||k =="중랑구"||k =="금천구"||k =="노원구"||k =="은평구"||k =="강서구"||k =="양천구"||k =="광진구");
					}).style("opacity", "1");
	
				break;

			case 4:
				map_geo_label.selectAll("text").style("opacity","0");
				map_geo_label.selectAll("text")
					.filter(function(d){ 
						var k = d.properties.SIG_KOR_NM;
						return (k =="강북구"||k =="중랑구"||k =="광진구");
					}).style("opacity", "1");
				map_geo_label.selectAll("text")
					.filter(function(d){ 
						var k = d.properties.SIG_KOR_NM;
						return (k =="강동구"||k =="관악구"||k =="금천구"||k =="은평구"||k =="양천구");
					}).style("opacity", "0.8");
				map_geo_label.selectAll("text")
					.filter(function(d){ 
						var k = d.properties.SIG_KOR_NM;
						return (k =="노원구"||k =="강서구");
					}).style("opacity", "0.3");
				$(".map--layer").hide();
				$("#UNDER_HOUSE_RATIO").fadeIn();
				break;
			case 5:
				map_geo_label.selectAll("text").style("opacity","1");
				$(".map--layer").hide();
				$("#UNDER_HOUSE_RATIO").show();
				break;
		}	
	}

	mScEv.checkMapStage = function(n){
		var $StagePoint = $(".map-stage");
		var n = n+screenHeight*0.7;
		if( n < $StagePoint.eq(0).offset().top){ 
			mScEv.adjustStage(0);
		}else if( n >= $StagePoint.eq($StagePoint.length-1).offset().top ){
			mScEv.adjustStage($StagePoint.length);
		}else if( n >= $StagePoint.eq(0).offset().top && n < $StagePoint.eq($StagePoint.length-1).offset().top){
			for(s=0;s<$StagePoint.length-1;s++){
				if( n >= $StagePoint.eq(s).offset().top && n <$StagePoint.eq(s+1).offset().top){
					mScEv.adjustStage(s+1);
				}
			}
		}
	}
	/******** Scroll event listener ********/


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
