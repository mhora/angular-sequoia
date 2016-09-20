'use strict';

module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-lodash/angular-lodash.js',
      'bower_components/Sortable/Sortable.js',
      'bower_components/Sortable/ng-sortable.js',
      'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.js',
      'bower_components/angular-animate/angular-animate.js',
      'src/**/*.js',
      'tests/**/*.js'
    ],
    plugins : ['karma-jasmine', 'karma-phantomjs-launcher', 'karma-chrome-launcher'],
    reporters: ['progress']
  });
};
