//The search input
var search = document.getElementById('search_bar');
//Movies counter
var count;
//Timer for input
var timeout = null;
//Http requests for each movie - global for availability to all functions
var Http2;

//Every time the user presses a button on the keyboard this function will be activated
search.onkeyup = function (e) {
	//It has a counter which, when exceeds 1 sec, will activate the following function
    clearTimeout(timeout);
    timeout = setTimeout(function () {
		//Start a new GET request
		const Http = new XMLHttpRequest();
		Http.open("GET", "http://www.omdbapi.com/?s="+search.value+"&type=movie&apikey=382a12cc");
		Http.send();
		//When the data is ready
		Http.onreadystatechange = function() {
			//If at least 1 movie was returned
			if(this.readyState == this.DONE && JSON.parse(Http.responseText).Response==='True') {
				//Get the length of the returned json
				count = JSON.parse(Http.responseText).Search.length;
				//Clear the main div in html
				document.getElementById("main").innerHTML = "";
				console.clear();
				//We need this for individual requests for each movie (different links)
				Http2 = [];
				for(i=0;i<count;i++) {
					console.log(JSON.parse(Http.responseText).Search[i].Title);
				}
				console.log("----------------------------------------------");
				//For each movie returned
				for(i=0;i<count;i++) {
					(function(i) {
						//Start a new request on the link we were given from the first request for the specific movie
						Http2[i] = new XMLHttpRequest();
						Http2[i].open("GET", "http://www.omdbapi.com/?i="+JSON.parse(Http.responseText).Search[i].imdbID+"&apikey=382a12cc");
						Http2[i].send();
						//When the returned data is ready start the following function
						Http2[i].onreadystatechange = function() {
							if(this.readyState == this.DONE) {
								//This function is activated multiple times for each movie for some reason
								//Therefore we delete previously created similar objects
								if (Http2[i].readyState == 4 && Http2[i].status == 200) {
									console.log(JSON.parse(Http2[i].responseText).Title);
									//Start the createMovieFunction using are arguments the given movie data
									if(String(JSON.parse(Http2[i].responseText).Poster) != "N/A") {
										createMovieList(i,JSON.parse(Http2[i].responseText).Poster,JSON.parse(Http2[i].responseText).Title,JSON.parse(Http2[i].responseText).Year,JSON.parse(Http2[i].responseText).Runtime,JSON.parse(Http2[i].responseText).Genre,JSON.parse(Http2[i].responseText).Plot);
									} else {
										createMovieList(i,"image_not_found.jpg",JSON.parse(Http2[i].responseText).Title,JSON.parse(Http2[i].responseText).Year,JSON.parse(Http2[i].responseText).Runtime,JSON.parse(Http2[i].responseText).Genre,JSON.parse(Http2[i].responseText).Plot);
									}
									//Add listeners for the movie buttons (more+less)
									document.getElementById("more_button_"+i).addEventListener("click", button_more);
									document.getElementById("more_button_"+i).myParam = i;
									document.getElementById("less_button_"+i).addEventListener("click", button_less);
									document.getElementById("less_button_"+i).myParam = i;
								}
							}
						}
					})(i);
				}
			}
			else if(this.readyState == this.DONE && JSON.parse(Http.responseText).Response === 'False'){
				//Clear the main div
				document.getElementById("main").innerHTML = "";
				//Inform the user that no movies were found
				var outer_div = document.createElement("div");
				outer_div.id = "movie_div_"+0;
				outer_div.className = "movie_divs";
				var txt = document.createElement("span");
				txt.textContent = "No movies were found with that title. Please search again and make sure you have inserted the correct title.";
				txt.style.fontSize = "30px";
				txt.style.fontWeight = "bold";
				outer_div.appendChild(txt);
				document.getElementById("main").appendChild(outer_div);
			}
		}
    }, 1000);
};

//This function creates the initial movie list from each search the user does
function createMovieList(id, poster, title, year, runtime, genre, plot) {
	//Creates an outer div which will include all the objects about the movie
	var outer_div=document.createElement("div");
	outer_div.id="movie_div_"+id;
	outer_div.className="movie_divs";
	
	//Creates the image/poster
	var img = document.createElement("img");
	img.id="poster_"+id;
	img.className="posters";
	img.alt="poster";
	img.src=poster;
	
	//Creates the label
	var lab = document.createElement("label");
	lab.id="info_label_"+id;
	lab.className="info_labels";
	
	//Creates the title inside the label
	var title1 = document.createElement("span");
	title1.textContent="Title: ";
	title1.style.fontWeight="bold";
	var title2 = document.createElement("span");
	title2.textContent=title;
	title1.id = "title1_"+id;
	title2.id = "title2_"+id;
	
	//Creates the year inside the label
	var year1 = document.createElement("span");
	year1.textContent="Year: ";
	year1.style.fontWeight="bold";
	var year2 = document.createElement("span");
	year2.textContent=year;
	year1.id = "year1_"+id;
	year2.id = "year2_"+id;
	
	//Creates the runtime inside the label
	var runtime1 = document.createElement("span");
	runtime1.textContent="Runtime: ";
	runtime1.style.fontWeight="bold";
	var runtime2 = document.createElement("span");
	runtime2.textContent=runtime;
	runtime1.id = "runtime1_"+id;
	runtime2.id = "runtime2_"+id;
	
	//Creates the genre inside the label
	var genre1 = document.createElement("span");
	genre1.textContent="Genre: ";
	genre1.style.fontWeight="bold";
	var genre2 = document.createElement("span");
	genre2.textContent=genre;
	genre1.id = "genre1_"+id;
	genre2.id = "genre2_"+id;	
	
	//Creates the plot inside the element
	var plot1 = document.createElement("span");
	plot1.textContent="Plot: ";
	plot1.style.fontWeight="bold";
	var plot2 = document.createElement("span");
	plot2.textContent=plot;
	plot1.id = "plot1_"+id;
	plot2.id = "plot2_"+id;
	
	//Adds all the above objects inside the label with gaps between them
	lab.appendChild(title1);
	lab.appendChild(title2);
	lab.appendChild(document.createElement("br"));
	lab.appendChild(year1);
	lab.appendChild(year2);
	lab.appendChild(document.createElement("br"));
	lab.appendChild(runtime1);
	lab.appendChild(runtime2);
	lab.appendChild(document.createElement("br"));
	lab.appendChild(genre1);
	lab.appendChild(genre2);
	lab.appendChild(document.createElement("br"));
	var br = document.createElement("br");
	br.className = "brs_"+id;
	lab.appendChild(plot1);
	lab.appendChild(plot2);
	lab.appendChild(br);
	
	//Creates the more button
	var m_but=document.createElement("button");
	m_but.type="button";
	m_but.id="more_button_"+id;
	m_but.className="more_buttons";
	m_but.textContent="More";
	
	//Creates the less button
	var l_but=document.createElement("button");
	l_but.type="button";
	l_but.id="less_button_"+id;
	l_but.className="less_buttons";
	l_but.textContent="Less";
	
	//Adds all the objects inside the outer div
	outer_div.appendChild(img);
	outer_div.appendChild(document.createElement("br"));
	outer_div.appendChild(lab);
	outer_div.appendChild(m_but);
	outer_div.appendChild(l_but);
	
	//Adds the outer div inside the main div
	document.getElementById("main").appendChild(outer_div);
	//Gap between the movies
	var br_=document.createElement("br");
	br_.id="br_"+id;
	document.getElementById("main").appendChild(br_);
	
}

//Action for the less_button of each movie
function button_less(num) {
	num = num.target.myParam;
	//Removes the less_button and adds the more_button
	document.getElementById("less_button_"+num).style.display = "none";
	document.getElementById("more_button_"+num).style.display = "inline";
	
	//Removes all the elements that are not needed in the short view
	var lab = document.getElementById("info_label_"+num);
	lab.removeChild(document.getElementById("plot1_"+num));
	lab.removeChild(document.getElementById("plot2_"+num));
	lab.removeChild(document.getElementById("dir1_"+num));
	lab.removeChild(document.getElementById("dir2_"+num));
	lab.removeChild(document.getElementById("writ1_"+num));
	lab.removeChild(document.getElementById("writ2_"+num));
	lab.removeChild(document.getElementById("act1_"+num));
	lab.removeChild(document.getElementById("act2_"+num));
	lab.removeChild(document.getElementById("rated1_"+num));
	lab.removeChild(document.getElementById("rated2_"+num));
	lab.removeChild(document.getElementById("released1_"+num));
	lab.removeChild(document.getElementById("released2_"+num));
	lab.removeChild(document.getElementById("lang1_"+num));
	lab.removeChild(document.getElementById("lang2_"+num));
	lab.removeChild(document.getElementById("country1_"+num));
	lab.removeChild(document.getElementById("country2_"+num));
	lab.removeChild(document.getElementById("awards1_"+num));
	lab.removeChild(document.getElementById("awards2_"+num));
	lab.removeChild(document.getElementById("prod1_"+num));
	lab.removeChild(document.getElementById("prod2_"+num));
	lab.removeChild(document.getElementById("web1_"+num));
	lab.removeChild(document.getElementById("web2_"+num));
	for(i=0;i<JSON.parse(Http2[num].responseText).Ratings.length;i++) {
		lab.removeChild(document.getElementById("ratings1_"+i+"_"+num));
		lab.removeChild(document.getElementById("ratings2_"+i+"_"+num));
	}
	lab.removeChild(document.getElementById("meta1_"+num));
	lab.removeChild(document.getElementById("meta2_"+num));
	lab.removeChild(document.getElementById("imdbr1_"+num));
	lab.removeChild(document.getElementById("imdbr2_"+num));
	lab.removeChild(document.getElementById("imdbv1_"+num));
	lab.removeChild(document.getElementById("imdbv2_"+num));
	lab.removeChild(document.getElementById("imdbid1_"+num));
	lab.removeChild(document.getElementById("imdbid2_"+num));
	lab.removeChild(document.getElementById("dvd1_"+num));
	lab.removeChild(document.getElementById("dvd2_"+num));
	lab.removeChild(document.getElementById("box1_"+num));
	lab.removeChild(document.getElementById("box2_"+num));
	var paras = document.getElementsByClassName('brs_'+num);
	while(paras[0]) {
		paras[0].parentNode.removeChild(paras[0]);
	}
	
	//Retrieves the short plot
	var plot = JSON.parse(Http2[num].responseText).Plot;
	
	//Creates the plot inside the element
	var plot1 = document.createElement("span");
	plot1.textContent="Plot: ";
	plot1.style.fontWeight="bold";
	var plot2 = document.createElement("span");
	plot2.textContent=plot;
	plot1.id = "plot1_"+num;
	plot2.id = "plot2_"+num;
	
	//Adds all the above objects inside the label with gaps between them
	lab.appendChild(plot1);
	lab.appendChild(plot2);
	var br = document.createElement("br");
	br.className = "brs_"+num;
	lab.appendChild(br);
}

//Action for the more_button of each movie
function button_more(num) {
	num = num.target.myParam;
	//Removes the more_button and adds the less_button
	document.getElementById("more_button_"+num).style.display = "none";
	document.getElementById("less_button_"+num).style.display = "inline";
	
	//Removes the previous plot element
	lab = document.getElementById("info_label_"+num);
	lab.removeChild(document.getElementById("plot1_"+num));
	lab.removeChild(document.getElementById("plot2_"+num));
	var paras = document.getElementsByClassName('brs_'+num);
	while(paras[0]) {
		paras[0].parentNode.removeChild(paras[0]);
	}
	
	const Http = new XMLHttpRequest();
	Http.open("GET", "http://www.omdbapi.com/?i="+JSON.parse(Http2[num].responseText).imdbID+"&type=movie&plot=full&apikey=382a12cc");
	Http.send();
	Http.onreadystatechange = function() {
		if(this.readyState == this.DONE) {
			//Retrieved the full plot from the new http request
			var plot = JSON.parse(Http.responseText).Plot;
			//Retrieves all the data from http2 request and saves them in variables in order to add them in the label
			var released = JSON.parse(Http2[num].responseText).Released;
			var rated = JSON.parse(Http2[num].responseText).Rated;
			var director = JSON.parse(Http2[num].responseText).Director;
			var writer = JSON.parse(Http2[num].responseText).Writer;
			var actors = JSON.parse(Http2[num].responseText).Actors;
			var language = JSON.parse(Http2[num].responseText).Language;
			var country = JSON.parse(Http2[num].responseText).Country;
			var awards = JSON.parse(Http2[num].responseText).Awards;
			var production = JSON.parse(Http2[num].responseText).Production;
			var website = JSON.parse(Http2[num].responseText).Website;
			var metascore = JSON.parse(Http2[num].responseText).Metascore;
			var imdbrating = JSON.parse(Http2[num].responseText).imdbRating;
			var imdbvotes = JSON.parse(Http2[num].responseText).imdbVotes;
			var imdbid = JSON.parse(Http2[num].responseText).imdbID;
			var dvd = JSON.parse(Http2[num].responseText).DVD;
			var boxoffice = JSON.parse(Http2[num].responseText).BoxOffice;
			var ratingssource = [];
			var ratingsvalue = [];
			for(i=0;i<JSON.parse(Http2[num].responseText).Ratings.length;i++) {
				ratingssource[i] = JSON.parse(Http2[num].responseText).Ratings[i].Source;
				ratingsvalue[i] = JSON.parse(Http2[num].responseText).Ratings[i].Value;
			}
			
			//Creates the plot (full) inside the element
			var plot1 = document.createElement("span");
			plot1.textContent="Plot: ";
			plot1.style.fontWeight="bold";
			var plot2 = document.createElement("span");
			plot2.textContent=plot;
			plot1.id = "plot1_"+num;
			plot2.id = "plot2_"+num;
			
			//Creates the director inside the element
			var dir1 = document.createElement("span");
			dir1.textContent="Director: ";
			dir1.style.fontWeight="bold";
			var dir2 = document.createElement("span");
			dir2.textContent=director;
			dir1.id = "dir1_"+num;
			dir2.id = "dir2_"+num;			
			
			//Creates the writer inside the element
			var writ1 = document.createElement("span");
			writ1.textContent="Writer: ";
			writ1.style.fontWeight="bold";
			var writ2 = document.createElement("span");
			writ2.textContent=writer;
			writ1.id = "writ1_"+num;
			writ2.id = "writ2_"+num;
			
			//Creates the actor inside the element
			var act1 = document.createElement("span");
			act1.textContent="Actors: ";
			act1.style.fontWeight="bold";
			var act2 = document.createElement("span");
			act2.textContent=actors;
			act1.id = "act1_"+num;
			act2.id = "act2_"+num;
			
			//Creates the rated inside the element
			var rated1 = document.createElement("span");
			rated1.textContent="Rated: ";
			rated1.style.fontWeight="bold";
			var rated2 = document.createElement("span");
			rated2.textContent=rated;
			rated1.id = "rated1_"+num;
			rated2.id = "rated2_"+num;
			
			//Creates the released inside the element
			var released1 = document.createElement("span");
			released1.textContent="Released: ";
			released1.style.fontWeight="bold";
			var released2 = document.createElement("span");
			released2.textContent=released;
			released1.id = "released1_"+num;
			released2.id = "released2_"+num;
			
			//Creates the language inside the element
			var lang1 = document.createElement("span");
			lang1.textContent="Language: ";
			lang1.style.fontWeight="bold";
			var lang2 = document.createElement("span");
			lang2.textContent=language;
			lang1.id = "lang1_"+num;
			lang2.id = "lang2_"+num;
			
			//Creates the country inside the element
			var country1 = document.createElement("span");
			country1.textContent="Country: ";
			country1.style.fontWeight="bold";
			var country2 = document.createElement("span");
			country2.textContent=country;
			country1.id = "country1_"+num;
			country2.id = "country2_"+num;
			
			//Creates the awards inside the element
			var awards1 = document.createElement("span");
			awards1.textContent="Awards: ";
			awards1.style.fontWeight="bold";
			var awards2 = document.createElement("span");
			awards2.textContent=awards;
			awards1.id = "awards1_"+num;
			awards2.id = "awards2_"+num;
			
			//Creates the production inside the element
			var prod1 = document.createElement("span");
			prod1.textContent="Production: ";
			prod1.style.fontWeight="bold";
			var prod2 = document.createElement("span");
			prod2.textContent=production;
			prod1.id = "prod1_"+num;
			prod2.id = "prod2_"+num;
			
			//Creates the website inside the element
			var web1 = document.createElement("span");
			web1.textContent="Website: ";
			web1.style.fontWeight="bold";
			var web2 = document.createElement("a");
			web2.setAttribute("href", JSON.parse(Http2[num].responseText).Website);
			web2.textContent=website;
			web1.id = "web1_"+num;
			web2.id = "web2_"+num;
			
			//Creates the ratings inside the element
			var ratings1 = [];
			var ratings2 = [];
			for(i=0;i<JSON.parse(Http2[num].responseText).Ratings.length;i++) {
				ratings1[i] = document.createElement("span");
				ratings1[i].textContent = ratingssource[i]+": ";
				ratings1[i].style.fontWeight = "bold";
				ratings2[i] = document.createElement("span");
				ratings2[i].textContent = ratingsvalue[i];
				ratings1[i].id = "ratings1_"+i+"_"+num;
				ratings2[i].id = "ratings2_"+i+"_"+num;
			}
			
			//Creates the metascore inside the element
			var meta1 = document.createElement("span");
			meta1.textContent="Metascore: ";
			meta1.style.fontWeight="bold";
			var meta2 = document.createElement("span");
			meta2.textContent=metascore;
			meta1.id = "meta1_"+num;
			meta2.id = "meta2_"+num;
			
			//Creates the imdbrating inside the element
			var imdbr1 = document.createElement("span");
			imdbr1.textContent="IMDB Rating: ";
			imdbr1.style.fontWeight="bold";
			var imdbr2 = document.createElement("span");
			imdbr2.textContent=imdbrating;
			imdbr1.id = "imdbr1_"+num;
			imdbr2.id = "imdbr2_"+num;
			
			//Creates the imdbvotes inside the element
			var imdbv1 = document.createElement("span");
			imdbv1.textContent="IMDB Votes: ";
			imdbv1.style.fontWeight="bold";
			var imdbv2 = document.createElement("span");
			imdbv2.textContent=imdbvotes;
			imdbv1.id = "imdbv1_"+num;
			imdbv2.id = "imdbv2_"+num;
			
			//Creates the imdbid inside the element
			var imdbid1 = document.createElement("span");
			imdbid1.textContent="IMDB Id: ";
			imdbid1.style.fontWeight="bold";
			var imdbid2 = document.createElement("span");
			imdbid2.textContent=imdbid;
			imdbid1.id = "imdbid1_"+num;
			imdbid2.id = "imdbid2_"+num;
			
			//Creates the dvd inside the element
			var dvd1 = document.createElement("span");
			dvd1.textContent="DVD: ";
			dvd1.style.fontWeight="bold";
			var dvd2 = document.createElement("span");
			dvd2.textContent=dvd;
			dvd1.id = "dvd1_"+num;
			dvd2.id = "dvd2_"+num;
			
			//Creates the boxoffice inside the element
			var box1 = document.createElement("span");
			box1.textContent="Box Office: ";
			box1.style.fontWeight="bold";
			var box2 = document.createElement("span");
			box2.textContent=boxoffice;
			box1.id = "box1_"+num;
			box2.id = "box2_"+num;
			
			//Adds all the above objects inside the label with gaps between them
			lab.appendChild(plot1);
			lab.appendChild(plot2);
			var br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(dir1);
			lab.appendChild(dir2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(writ1);
			lab.appendChild(writ2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(act1);
			lab.appendChild(act2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(rated1);
			lab.appendChild(rated2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(released1);
			lab.appendChild(released2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(lang1);
			lab.appendChild(lang2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(country1);
			lab.appendChild(country2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(awards1);
			lab.appendChild(awards2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(prod1);
			lab.appendChild(prod2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(web1);
			lab.appendChild(web2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			for(i=0;i<JSON.parse(Http2[num].responseText).Ratings.length;i++) {
				lab.appendChild(ratings1[i]);
				lab.appendChild(ratings2[i]);
				br = document.createElement("br");
	            br.className = "brs_"+num;
				lab.appendChild(br);
			}
			
			lab.appendChild(meta1);
			lab.appendChild(meta2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(imdbr1);
			lab.appendChild(imdbr2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(imdbv1);
			lab.appendChild(imdbv2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(imdbid1);
			lab.appendChild(imdbid2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(dvd1);
			lab.appendChild(dvd2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
			
			lab.appendChild(box1);
			lab.appendChild(box2);
			br = document.createElement("br");
	        br.className = "brs_"+num;
			lab.appendChild(br);
		}
	}
}