function findPost(reg)      //takes a Regular Expression and finds it (and "trips" and "quads" of it) among the post ID's
{
	var posts = document.getElementsByClassName("postContainer replyContainer");    //gets all posts
	var dubs = [];                           //contains all dubs or more
	var trips = [];                          //contains the index of a trip in the dubs array
	var quads = [];                          //contains the index of a quad in the dubs arrayx
	var j = 0;
	for (var i = 0; i < posts.length; i++)        //Go through all posts and find dubs, trips and quints
	{
		var a = posts[i].getAttribute("id");
		if (reg.test(a))
		{
			if (reg.test(a.slice(0, -1)))       //check trips
			{

				if (reg.test(a.slice(0, -2)))   //check quad
				{
					quads.push(j);
				} else
				{
					trips.push(j);
				}
			}
			dubs.push(a);
			j++;
		}
	}
	return [dubs, trips, quads];
}

$(document).ready(function ()
{
	var patt = new RegExp(/(\d)\1+$/);              //check dub
	var scrollFlag = true;                          //flag to reduce css modification when scrolling
	var visible = true;                             //flag if minimized or not
	var topLimit = parseInt($("#boardNavDesktop").css("height").slice(0,-2),10);    //limit to not obstruct boardNav element
	var margin = 6;
	var url = chrome.extension.getURL("resources");     //URL to resources map
	var $ext, $dubs, $contain, $UI, $search;            // all elements needing a variable
	var $window = $(window);                            //window element (duh)
	var oneHeight, twoHeight, threeHeight;              //height of pillars
	var res = findPost(patt);
	var dub = res[0];                                   //list of dubs
	var trip = res[1];                                  //list of indexes of trips in dubs list
	var quad = res[2];                                  //list of indexes of quads in dubs list

	if (quad.length <= 2)                               // setting height of all pillars depending on amount of dubs
	{
		oneHeight = 15*quad.length;
	}
	else
	{
		oneHeight = 30;
	}
	if (trip.length<= 6)
	{
		twoHeight = 5*(trip.length);
	}
	else
	{
		twoHeight = 30;
	}
	if (dub.length - (trip.length + quad.length)<= 30)
	{
		threeHeight = dub.length - (trip.length + quad.length);
	}
	else
	{
		threeHeight = 30;
	}

	$.get(url+"/test.html", function(data)  //Get the extension HTML elements (and CSS?) and add dynamic JS things
	{
		$ext = $(data);                         //Entire extension, all elements, style part and all
		$dubs = $($ext[3]);                     //the specific extension HTML
		$UI = $dubs.find("#UIContainer");           //Upper part of extension, UI is a bit dumb name but hey
		$contain = $dubs.find("#resultContainer");  //where the result is shown, all the links
		$search = $dubs.find("#searchContainer");   //where specific search is shown.
		var backgroundColor= $(".reply").css("background-color");   //the background colour. Need a reply to be given a value (issue!)

		$dubs
			.css(
			{
				"top": topLimit+margin
			});
		$UI
			.css("background-color",backgroundColor);
		$contain
			.css("background-color",backgroundColor)
			.click(function()
			{
				var $eventTarget = $(event.target);
				if($eventTarget.attr("id") != "resultContainer")
				{
					$("#pc"+$eventTarget.attr("id"))[0].scrollIntoView();
				}
				return false;
			});

		$dubs.find("#minimize")
			.attr("src", url+"/min.png")
			.click(function()
			{
				if(visible)
				{
					$(this)
						.attr("src", url + "/plus.png")
						.css("left", 189);
					$UI.hide();
					$contain.hide();
					$search.hide();
					visible = false;
				}else
				{
					$(this)
						.attr("src", url + "/min.png")
						.css("left", 4);
					$UI.show();
					$contain.show();
					$search.show();
					visible = true;
				}
				return false;
			});
		$dubs.find("#butt")
			.click(function()
			{
				$search.html("");
				var regInput = $dubs.find("#searchField").val();
				regInput = +regInput+"$";
				regInput = new RegExp(regInput);
				var found = findPost(regInput)[0];
				if (found.length > 0)
				{
					$search.css(
					{
						"border": "solid 1px",
						"border-top-color": "transparent",
						"padding": "4px"
					});
					for (var i = 0; i < found.length; i++)
					{
						$search.append("<a style='color:blue' id='search" + found[i].slice(2) + "' href=''>" + found[i].slice(2) + "</a><br>")
					}
				}
				else
				{
					$search.css("padding", "0px");
				}
			});
		$search
			.css("background-color", backgroundColor)
			.click(function()
			{
				var $eventTarget = $(event.target);
				if($eventTarget.attr("id") != "searchContainer")
				{
					$("#pc"+$eventTarget.attr("id").slice(6))[0].scrollIntoView();
				}
				return false;
			});

		$dubs.find("#one")
			.css("height", 18+oneHeight)
			.text(quad.length);
		$dubs.find("#two")
			.css("height", 18+twoHeight)
			.text(trip.length);
		$dubs.find("#three")
			.css("height", 18+threeHeight)
			.text(dub.length - (trip.length + quad.length));

		if (dub.length > 0)
		{
			$contain.css("padding", "4px");
			for (var i = 0; i < dub.length; i++)
			{
				$contain.append("<a class='dubLink' style='color:blue' id='" + dub[i].slice(2) + "' href=''>" + dub[i].slice(2) + "</a><br>")
			}
		}else
		{
			$contain.css("padding", "0px");
		}


		var links = $contain.find(".dubLink");      //Colour trips and quads!
		for (var i = 0; i < trip.length; i++)
		{
			$(links[trip[i]]).css("color", "forestgreen");
		}
		for (var i = 0; i < quad.length; i++)
		{
			$(links[quad[i]]).css("color", "red");
		}


		if ($window.scrollTop() >= topLimit+margin)     //Make box positioned correctly even if loaded mid page
		{
			$dubs.css(
				{
					"position": "fixed",
					"top": margin
				});
		}
		$("body").append($ext);
	});


	$window
		.scroll(function ()           //if scrolled too high box must stop so that it won't overlap boardNav element
	{
		if (($window.scrollTop() >= topLimit+margin)|| (Math.abs($window.scrollTop() - $dubs.position().top) < margin))
		{
			if (scrollFlag)
			{
				$dubs.css(
					{
						"position": "fixed",
						"top": margin
					});
				scrollFlag = false;
			}
		}else
		{
			if(!scrollFlag)
			{
				$dubs.css(
					{
						"position": "absolute",
						"top": topLimit+margin
					});
				scrollFlag = true;
			}
		}
	});
});
