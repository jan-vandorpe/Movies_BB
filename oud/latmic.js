// Ladies at the Movies, Men in Control

var FilmApp = function ($) {
 
    var films = [
        { filmId:1, titel: "Elysium", beschrijving: "We bevinden ons in het jaar 2159 en de mensheid is verdeeld in twee sociale klassen. De allerrijksten leiden een heerlijk zorgeloos leven op het ongerepte ruimtestation Elysium, terwijl de armen moeten zien te overleven op de overbevolkte en verwoeste Aarde.", genre:"Science Fiction", duur:"1u 20min", regisseur:"Neil Blomkamp", release:"14/08/2013", foto:"Elysium_FO.jpg" },
       { filmId:2, titel: "De Smurfen 2", beschrijving: "In 'De Smurfen 2', creëert de boze tovenaar Gargamel een paar ondeugende Smurfachtige wezens genaamd de Stouterds. Daarmee hoopt hij de almachtige, magische Smurfessentie te kunnen benutten. Maar wanneer hij ontdekt dat alleen een echte Smurf hem kan geven wat hij wil - en alleen Smurfin een geheime spreuk weet die de Stouterds kan omtoveren tot echte Smurfen - ontvoert Gargamel de Smurfin en brengt haar naar Parijs.", genre:"Jeugd", duur:"1u 45min", regisseur:"Raja Gosnell", release:"31/7/2013", foto:"DeSmurfen_BENLFO.jpg" },
	    { filmId:3, titel: "Pulp Fiction", beschrijving: "The lives of two mob hit men, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.", genre:"Crime", duur:"2u 34min", regisseur:"Quentin Tarantino", release:"9/11/1994", foto:"pulpfiction.jpg" } 
    ];

//Model: Film
var Film = Backbone.Model.extend({
	 	defaults:{						
					filmId:0,
					titel: "", 
					beschrijving: "", 
					genre:"", 
					duur:"", 
					regisseur:"", 
					release:"", 
					foto:"img/filmplaceholder.jpg"
				}
	})
//Collection: filmcollection
var FilmCollectie = Backbone.Collection.extend({
		model: Film,
		url: "http://localhost/Javascript_nieuw/projecten_advanced/json_films.php"
	})
	
//View: één film
var FilmView = Backbone.View.extend({
		
		tagName: "div",
    	className: "film",
    	template: $("#filmTemplate").html(),
 
    	render: function () {
        	var tmpl = _.template(this.template);
        	this.$el.html(tmpl(this.model.toJSON()));
        return this;
    	}
	})
//View: filmovericht
var FilmoverzichtView = Backbone.View.extend({
	
    el: $("#films"), //$el automatisch aangemaakt
 
    initialize: function () {
		var that = this;
        this.collection = new FilmCollectie(); //hier komt de data in, een object of een JSON
		//this.collection = new FilmCollectie();
		
		this.collection.fetch({ 
			/*reset: true,*/
			success : function(collection, response, options) {
      					//console.log('fetch success' + response);
      					that.$el.find("#filter").append(that.createSelect());
						that.render();	
						//console.log(that.collection);
						},
	   		error: function(collection, response, options) {
      					//console.log('fetch onerrorhandler' +response);
					 }
		});
		
		this.on("change:filterType", this.filterByType, this);
		
		this.collection.on("reset", this.render, this);
		
		//console.log(this.collection);  // this should be populated now
		//this.render();
	

		
    },
 
    render: function () {
       
        _.each(this.collection.models, function (item) {
            this.renderFilm(item);
        }, this); //this als context in _each
    },
 
    renderFilm: function (item) {
        var filmView = new FilmView({
            model: item
        });
        this.$el.append(filmView.render().el);
    },
	getGenres: function () {
		return _.uniq(this.collection.pluck("genre"), false, function (genre) {
			return genre.toLowerCase();
		});
	  },
	   
	  createSelect: function () {
		  var filter = this.$el.find("#filter"),
			  select = $("<select/>", {
				  html: "<option value='all'>All</option>"
			  });
	   
		  _.each(this.getGenres(), function (item) {
			  var option = $("<option/>", {
				  value: item.toLowerCase(),
				  text: item.toLowerCase()
			  }).appendTo(select);
		  });
		  return select;
	  },
	  events: {
		  "change #filter select": "setFilter"
	  },
	  setFilter: function (e) {
		  this.filterType = e.currentTarget.value;
		  this.trigger("change:filterType");
		  console.log('custom filter event')
	  },
	  
	  filterByType: function () {
		   console.log('filterByType')
			if (this.filterType === "all") {
				this.collection.reset(films);
			} else {
				this.collection.reset(films, { silent: true });
		 
				var filterType = this.filterType,
					filtered = _.filter(this.collection.models, function (item) {
								return item.get("genre").toLowerCase() === filterType;
							});
		 
				this.collection.reset(filtered);
				console.log(this.collection);
			}
		}
	  
});



var myApp = function(){
    
	this.start = function(){
		console.log("FilmApp start")
		var films = new FilmoverzichtView();
		console.log(films.collection)
		//films.render()
    };
  };

  return myApp;

// view uitvoeren

}(jQuery);