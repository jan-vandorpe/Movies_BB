/* 
 hèt eigenlijke programma: movies.js
 */
// movies.js

define([
    'jquery',
    'underscore',
    'backbone',
    'app/films'
], function($, _, Backbone, films) {


//Model: Film
    var Film = Backbone.Model.extend({
        defaults: {
            filmId: 0,
            titel: "",
            beschrijving: "",
            genre: "",
            duur: "",
            regisseur: "",
            release: "",
            foto: "noimage.jpg"
        }
    })
//Collection: filmcollection
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
            var filter = this.$el.find("#filter"),
                    select = $("<select/>", {
                html: "<option value='all'>All</option>"
            });

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

            this.collection.add(new Film(formData));
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

