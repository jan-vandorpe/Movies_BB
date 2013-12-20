/* 
 main.js entry point voor Movies app
 */
requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app             : '../app',
        text            : 'text', //text is required
        json            : 'json', //alias to plugin
        jquery          : 'jquery-2.0.3.min',
        'underscore'    : 'underscore-amd/underscore-min', // AMD support
        'backbone'      : 'backbone-amd/backbone-min' // AMD support,
       }
});
console.log('main.js')

require(['app/movies'],
    function   (movies) {
        movies.start();         //start de movies app
 });

