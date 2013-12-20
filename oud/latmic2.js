// Ladies at the Movies, Men in Control

var FilmApp = function ($) {
 

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
		model: Film
	})
	
//var dezeFilms = new FilmCollectie();
	
	
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
	
    el: $("#films"),
 
    initialize: function () {
		//var that = this;
        //this.collection = new FilmCollectie(); //hier komt de data in, een object of een JSON
		//console.log(this.collection);  // this should be populated now
		this.collection.bind("reset", this.render, this);
		
    },
 
    render: function () {
        _.each(this.collection.models, function (item) {
            this.renderFilm(item);
        }, this);
    },
 
    renderFilm: function (item) {
        var filmView = new FilmView({
            model: item
        });
        this.$el.append(filmView.render().el);
    }
});

var myApp = function(initialModels){
    
	this.start = function(){
		console.log("Filmapp start, initialModels" + initialModels)
      	this.collectie = new FilmCollectie();
      	this.myView = new FilmoverzichtView({collection: this.collectie});
      	this.collectie.reset(initialModels);  
    };
  };

  return myApp;


}(jQuery);