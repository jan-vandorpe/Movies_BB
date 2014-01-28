/* 
Movies module: movies.js
 */


define([
    'jquery',
    'underscore',
    'backbone',
    'app/films'
], function($, _, Backbone, films) {


//Model: Film
    var Film = Backbone.Model.extend({
        defaults: {
            filmNr: 0,
            titel: "",
            beschrijving: "",
            genre: "",
            duur: "",
            regisseur: "",
            release: "",
            foto: "noimage.jpg"
        },
        //parse toevogen om _id van Mongo om te zetten in id van BB
//        parse: function(response){
//            response.id = response._id;
//            return response;
//        }

        //beter is de _id gebruiken van Mongo
        idAttribute: "_id"
    })
//Collection: FilmCollectie
    var FilmCollectie = Backbone.Collection.extend({
        model: Film,
        url: "/api/films" // connect via de api
    })

//View: één film
    var FilmView = Backbone.View.extend({
        tagName: "div",
        className: "film",
        template: $("#filmTemplate").html(),
        render: function() {
            var tmpl = _.template(this.template);
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
        },
        events: {
            'click .delete': 'deleteFilm'
        },
        deleteFilm: function(e) {
            console.log('deleteFilm');
            //delete model
            this.model.destroy();
            //delete view
            this.remove()
        }
    })
//View: filmovericht
    var FilmoverzichtView = Backbone.View.extend({
        el: $("#films"), //bestaand element

        initialize: function(films) {
            //this.collection = new FilmCollectie(films); //data via JS variabele in eerst versie
            this.collection = new FilmCollectie();
            this.collection.fetch({reset: true}); //fetch data via url
            //this.render(); //mag weg met de 2d eventListener?
            this.listenTo(this.collection, 'add', this.renderFilm); //event listener voor add event Collection
            this.listenTo(this.collection, 'reset', this.render);
            //select toevoegen
            this.$el.find("#filter").append(this.createSelect());
        },
        render: function() {
            console.log("FilmoverzichtView.render")
            _.each(this.collection.models, function(item) {
                this.renderFilm(item);
            }, this); //this arg als context in _each
        },
        renderFilm: function(item) {
            var filmView = new FilmView({
                model: item
            });
            this.$el.append(filmView.render().el);
        },
        getGenres: function() {
            return _.uniq(this.collection.pluck("genre"), false, function(genre) {
                return genre.toLowerCase();
            });
        },
        createSelect: function() {
//            var filter = this.$el.find("#filter"),
//                    select = $("<select/>", {
//                html: "<option value='all'>All</option>"
//            });
            var select = $("<select><option value='all'>All</option></select>");
            console.log(this.getGenres())
            _.each(this.getGenres(), function(item) {
                var option = $("<option/>", {
                    value: item.toLowerCase(),
                    text: item.toLowerCase()
                }).appendTo(select);
            });
            return select;
        },
        events: {
            "change #filter select": "setFilter",
            "click #voegtoe": "addFilm"
        },
        setFilter: function(e) {
            console.log('custom filter eventhandler')
            this.filterType = e.currentTarget.value;
            this.trigger("change:filterType");

        },
        filterByType: function() {
            console.log('filterByType eventhandler')
            if (this.filterType === "all") {
                this.collection.reset(films);
            } else {
                this.collection.reset(films, {silent: true});

                var filterType = this.filterType,
                        filtered = _.filter(this.collection.models, function(item) {
                    return item.get("genre").toLowerCase() === filterType;
                });

                this.collection.reset(filtered);
                console.log(this.collection);
            }
        },
        addFilm: function(e) {
            console.log('addFilm');
            e.preventDefault();
            var formData = {};
            $velden = $('#frmFilm').find('input, textarea'); //gebruik find want children enkel één niveau
//            met jquery?
//            jqFormData = $('#frmFilm').serializeArray(); //gaat niet: array van objecten, we moeten één object krijgen
//            console.log(jqFormData)
           // console.log("aantal: " + $velden.length)
            $velden.each(function(i, el) {
                if ($(el).val() != '') {
                    formData[el.name] = $(el).val();
                }
            })
            //corrigeer filename die volledig pad bevat, we moeten enkel de filename hebben
            fullPath = formData.foto;
            //console.log(fullPath)
            formData.foto = /([^\\]+)$/.exec(fullPath)[1];
            //formData.release =  new Date(formData.release).getTime(); //niet nodi in Chrome dankzij kalenderwidget
            // split veld Cast in acteurs op basis van komma
            arrTemp = []
           _.each( formData.cast.split( ',' ), function( acteur ) {
                    arrTemp.push({ 'acteur': acteur });
                });
            formData.cast = arrTemp; 
            //console.log(formData)
            //this.collection.add(new Film(formData));  //eerste versie zonder API
            this.collection.create(formData);           //tweede versie met API
            //de method add triggert een add event
            console.log(formData)
        }

    });
    
    return {
        start: function() {
            // you can use $, _ or Backbone here
            console.log('Ladies at the Movies, Men at Home')
            console.log(arrFilms)
            var films = new FilmoverzichtView(arrFilms);
        }
    };
});

