(function() {
  'use strict';

  function sequoiaSearchDirective(){

    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'sequoia-search.html',
      scope: {
        'tree': '=',
        'isSearching': '=',
        'buttons': '=',
        'isEditing': '='
      },
      link: function(scope) {
        scope.search = function() {
          if(scope.query.length) {
            scope.isSearching = scope.query ? true : false;
            scope.tree.setNodesInPath(scope.tree.nodes);
            scope.tree.setCurrentNodes(scope.tree.find(scope.tree.template.title, scope.query));
            scope.tree.paginate();
          } else {
            scope.clear();
          }
        };

        scope.clear = function() {
          scope.query = '';
          scope.isSearching = false;
          scope.tree.setCurrentNodes(scope.tree.getNodesInPath());
          scope.tree.paginate();
        };
      }
    };

  }

  angular.module('ngSequoia')
    .directive('sequoiaSearch', sequoiaSearchDirective);

})();