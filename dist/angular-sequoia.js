(function() {
  'use strict';

  angular.module('ngSequoia', ['angular-lodash']);

})();

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
        'buttons': '='
      },
      link: function(scope) {
        scope.search = function() {
          if(scope.query.length) {
            scope.isSearching = scope.query ? true : false;
            scope.tree.setNodesInPath(scope.tree.nodes);
            scope.tree.setCurrentNodes(scope.tree.find(scope.tree.template.title, scope.query));
          } else {
            scope.clear();
          }
        };

        scope.clear = function() {
          scope.query = '';
          scope.isSearching = false;
          scope.tree.setCurrentNodes(scope.tree.getNodesInPath());
        };
      }
    };

  }

  angular.module('ngSequoia')
    .directive('sequoiaSearch', sequoiaSearchDirective);

})();
(function() {
  'use strict';

  var buttons = {
    edit: 'Edit',
    select: 'Select',
    deselect: 'Deselect',
    goToSubitems: 'Go to subitems',
    addSubitems: 'Add subitems',
    addNode: 'Add node',
    remove: 'Delete',
    done: 'Done',
    searchClear: '&times;',
    showSelected: 'Show selected',
    hideSelected: 'Hide selected',
    backToList: 'Back to list'
  };

  var nodeTemplate = {
    id: '_id',
    nodes: 'nodes',
    title: 'title'
  };

  angular.module('ngSequoia')
    .constant('BUTTONS', buttons)
    .constant('NODE_TEMPLATE', nodeTemplate);

})();

(function() {
  'use strict';

  function sequoiaTreeDirective(Tree, BUTTONS){

    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'angular-sequoia.html',
      scope: {
        'treeNodes': '=sequoiaTree',
        'model': '=ngModel',
        'template': '=nodeTemplate',
        'options': '='
      },
      link: function(scope) {
        function init() {
          scope.options = scope.options ? scope.options : {canEdit: false, buttons: {}};
          scope.canEdit = scope.options.canEdit ? true : false;
          scope.allowSelect = scope.model ? true : false;
          scope.model = _.isArray(scope.model) ? scope.model : [];
          scope.breadcrumbs = [];
          scope.tree = new Tree(scope.treeNodes, scope.template);
          scope.buttons = {
            edit: scope.options.buttons.edit ? scope.options.buttons.edit : BUTTONS.edit,
            select: scope.options.buttons.select ? scope.options.buttons.select : BUTTONS.select,
            deselect: scope.options.buttons.deselect ? scope.options.buttons.deselect : BUTTONS.deselect,
            goToSubitems: scope.options.buttons.goToSubitems ? scope.options.buttons.goToSubitems : BUTTONS.goToSubitems,
            addSubitems: scope.options.buttons.addSubitems ? scope.options.buttons.addSubitems : BUTTONS.addSubitems,
            addNode: scope.options.buttons.addNode ? scope.options.buttons.addNode : BUTTONS.addNode,
            remove: scope.options.buttons.remove ? scope.options.buttons.remove : BUTTONS.remove,
            done: scope.options.buttons.done ? scope.options.buttons.done : BUTTONS.done,
            searchClear: scope.options.buttons.searchClear ? scope.options.buttons.searchClear : BUTTONS.searchClear,
            showSelected: scope.options.buttons.showSelected ? scope.options.buttons.showSelected : BUTTONS.showSelected,
            hideSelected: scope.options.buttons.hideSelected ? scope.options.buttons.hideSelected : BUTTONS.hideSelected,
            backToList: scope.options.buttons.backToList ? scope.options.buttons.backToList : BUTTONS.backToList
          };
        }

        scope.load = function(node) {
          scope.onlySelected = false;
          if(scope.tree.isValidNode(node)) {
            scope.tree.setCurrentNodes(node[scope.tree.template.nodes]);
            scope.breadcrumbs = scope.tree.breadcrumbs(node[scope.tree.template.id]);
          } else {
            scope.tree.setCurrentNodes();
            scope.breadcrumbs = [];
          }
        };

        scope.select = function(node) {
          if(node[scope.tree.template.id]) {
            scope.model.push(node[scope.tree.template.id]);
          }
        };

        scope.deselect = function(node) {
          var index = node[scope.tree.template.id] ? _.indexOf(scope.model,node[scope.tree.template.id]) : -1;
          if(index !== -1) {
            scope.model.splice(index, 1);
          }
        };

        scope.isSelected = function(node) {
          return _.indexOf(scope.model, node[scope.tree.template.id]) !== -1 ? true : false;
        };

        scope.toggleSelected = function() {
          if(scope.onlySelected) {
            scope.onlySelected = false;
            scope.tree.setCurrentNodes(scope.tree.getNodesInPath());
          } else {
            scope.onlySelected = true;
            var selected = scope.tree.findSelected(scope.model);
            scope.tree.setNodesInPath(scope.tree.nodes);
            scope.tree.setCurrentNodes(selected);
          }
        };

        init();
        scope.load();

        /* Handle adding and editing nodes */
        scope.toggleEditing = function() {
          scope.isEditing = !scope.isEditing;
          scope.allowSelect = !scope.allowSelect;
        };

        scope.addNode = function(node) {
          if(scope.tree.isValidNode(node)) {
            scope.load(node);
          }
          scope.options.addNode.call(scope,scope.tree.nodes);
          scope.allowSelect = false;
        };

        scope.remove = function(node) {
          var index = node ? _.indexOf(scope.tree.nodes, node) : -1;
          if(index !== -1) {
            scope.tree.nodes.splice(index, 1);
          }
        };
      }
    };

  }

  sequoiaTreeDirective.$inject = ['SequoiaTree', 'BUTTONS'];

  angular.module('ngSequoia')
    .directive('sequoiaTree', sequoiaTreeDirective);

})();
(function() {
  'use strict';

  function SequoiaTreeFactory($log, NODE_TEMPLATE) {

    var _checkNodeStructure, _exists, _contains, _buildBreadCrumbs, _buildPath, _selected, _createNodeWithFullPathAsTitle;

    var SequoiaTree = function(tree, template) {
      this.template = template || NODE_TEMPLATE;
      this.tree = _checkNodeStructure(_.isArray(tree) ? tree[0] : {}, this.template) ? tree : [];
    };

    _checkNodeStructure = function(node, template) {
      if(!node) {
        return false;
      }

      var keys = _.values(template);
      for(var i=0;i<keys.length;i++) {
        if (!_.has(node, keys[i])) {
          $log.warn('The node structure is not valid!');
          return false;
        }
      }

      return true;
    };

    _exists = function (nodes, key, value, template) {
      if (_.isArray(nodes)) {
        return _.some(nodes, function(node){
          return node[key] === value ? true : _exists(node[template.nodes], key, value, template);
        });
      } else {
        return false;
      }
    };

    _contains = function (nodes, key, value, results, template) {
      if (_.isArray(nodes)) {
        for(var i=0;i<nodes.length;i++) {
          if(nodes[i][key].toLowerCase().indexOf(value.toLowerCase()) > -1) {
            results.push(nodes[i]);
          }
          _contains(nodes[i][template.nodes], key, value, results, template);
        }
      }

      return results;
    };

    _buildBreadCrumbs = function(id, nodes, breadcrumbs, template) {
      nodes = nodes || [];
      var root = {};
      root[template.title] = 'Root';
      breadcrumbs = !breadcrumbs.length ? [root] : breadcrumbs;

      for(var i=0;i<nodes.length;i++) {
        if(nodes[i][template.id] === id || _exists(nodes[i][template.nodes], template.id, id, template)) {
          breadcrumbs.push(nodes[i]);
        }
        _buildBreadCrumbs(id, nodes[i][template.nodes], breadcrumbs, template);
      }

      return breadcrumbs;
    };

    _buildPath = function(node, nodes, path, template) {
      nodes = nodes || [];

      for(var i=0;i<nodes.length;i++) {
        if(nodes[i][template.id] === node[template.id] || _exists(nodes[i][template.nodes], template.id, node[template.id], template)) {
          path += path.length ? ' > ' : '';
          path += _.trunc(nodes[i][template.title], 20);
        }
        path = _buildPath(node, nodes[i][template.nodes], path, template);
      }

      return path;
    };

    _selected = function(id, nodes, selected, template) {
      if(_.isArray(nodes)) {
        for(var i=0;i<nodes.length;i++) {
          if(nodes[i]._id === id) {
            selected.push(nodes[i]);
          }
          _selected(id, nodes[i][template.nodes], selected, template);
        }
      }

      return selected;
    };

    _createNodeWithFullPathAsTitle = function(node, tree, template) {
      var result = {};

      result[template.id] = node[template.id];
      result[template.title] = _buildPath(node, tree, '', template);
      if(_.isArray(node[template.nodes]) && node[template.nodes].length > 0) {
        result[template.nodes] = node[template.nodes];
      }

      return result;
    };

    SequoiaTree.prototype.setCurrentNodes = function(nodes) {
      this.nodes = !_.isArray(nodes) ? this.tree : nodes;
    };

    SequoiaTree.prototype.setNodesInPath = function(nodes) {
      this.nodesInPath = !_.isArray(nodes) ? this.tree : nodes;
    };

    SequoiaTree.prototype.getNodesInPath = function() {
      return _.isArray(this.nodesInPath) ? this.nodesInPath : this.tree;
    };

    SequoiaTree.prototype.isValidNode = function(node) {
      return _.isObject(node) && node[this.template.nodes];
    };

    SequoiaTree.prototype.breadcrumbs = function(id) {
      return _buildBreadCrumbs(id,this.tree,[], this.template);
    };

    SequoiaTree.prototype.find = function(key,value) {
      var results = [],
          found = _contains(this.tree, key, value, [], this.template);
      for(var i=0;i<found.length;i++) {
        results.push(_createNodeWithFullPathAsTitle(found[i], this.tree,this.template));
      }

      return results;
    };

    SequoiaTree.prototype.findSelected = function(ids) {
      var selected = [],
          results = [];

      if(_.isArray(ids)) {
        for(var i=0;i<ids.length;i++) {
          selected = _.union(selected, _selected(ids[i], this.tree, [], this.template));
        }

        for(var j=0;j<selected.length;j++) {
          results.push(_createNodeWithFullPathAsTitle(selected[j], this.tree,this.template));
        }
      } else {
        $log.warn('You must pass an array of IDs in order to find the selected nodes!');
      }

      return results;
    };

    return SequoiaTree;
  }

  SequoiaTreeFactory.$inject = ['$log', 'NODE_TEMPLATE'];

  angular.module('ngSequoia')
    .factory('SequoiaTree', SequoiaTreeFactory);

})();

angular.module("ngSequoia").run(["$templateCache", function($templateCache) {$templateCache.put("angular-sequoia.html","<div class=\"sequoia\">\n\n  <div class=\"sequoia-search\">\n    <div class=\"sequoia-search-form\" data-sequoia-search data-is-searching=\"searchEnabled\" data-tree=\"tree\" data-buttons=\"buttons\"></div>\n    <div class=\"sequoia-actions\" data-ng-include=\"\'sequoia-tree-actions.html\'\"></div>\n  </div>\n\n  <ul data-ng-if=\"!searchEnabled && !onlySelected\" class=\"sequoia-breadcrumbs\" data-ng-include=\"\'sequoia-breadcrumbs.html\'\"></ul>\n\n  <ul class=\"sequoia-tree\">\n    <li data-ng-repeat=\"node in tree.nodes track by node[tree.template.id]\">\n\n      <span class=\"sequoia-item-title\">\n        <span data-ng-if=\"!isEditing\" data-ng-bind=\"node[tree.template.title]\"></span>\n        <span data-ng-if=\"isEditing\">\n          <input type=\"text\" data-ng-model=\"node[tree.template.title]\">\n        </span>\n      </span>\n\n      <span class=\"sequoia-item-actions\" data-ng-include=\"\'sequoia-item-actions.html\'\"></span>\n    </li>\n  </ul>\n</div>\n");
$templateCache.put("sequoia-breadcrumbs.html","<li data-ng-if=\"breadcrumbs.length\" data-ng-repeat=\"link in breadcrumbs\" data-ng-class=\"$last ? \'last\' : \'\'\" data-ng-init=\"title = link[tree.template.title].length > 23 ? (link[tree.template.title] | limitTo:20) + \'&hellip;\' : link[tree.template.title]\">\n  <a data-ng-if=\"!$last\" href=\"\" data-ng-click=\"load(link)\" data-ng-bind=\"title\"></a>\n  <span data-ng-if=\"$last\" data-ng-bind=\"title\"></span>\n</li>");
$templateCache.put("sequoia-item-actions.html","<span data-ng-if=\"isSelected(node) && allowSelect\">\n  <a class=\"sequoia-button sequoia-button-danger\" href=\"\" title=\"Deselect\" data-ng-click=\"deselect(node)\" data-ng-bind=\"buttons.deselect\"></a>\n</span>\n\n<span data-ng-if=\"!isSelected(node) && allowSelect\">\n  <a class=\"sequoia-button sequoia-button-primary\" href=\"\" title=\"Select\" data-ng-click=\"select(node)\" data-ng-bind-html=\"buttons.select\"></a>\n</span>\n\n<span data-ng-if=\"isEditing\">\n  <a class=\"sequoia-button sequoia-button-danger\" href=\"\" title=\"Deselet\" data-ng-click=\"remove(node)\" data-ng-bind=\"buttons.remove\"></a>\n</span>\n\n<span data-ng-if=\"node[tree.template.nodes] && node[tree.template.nodes].length\">\n  <a class=\"sequoia-button sequoia-button-info\" href=\"\" title=\"Go to subitems\" data-ng-click=\"load(node)\" data-ng-bind=\"buttons.goToSubitems\"></a>\n</span>\n\n<span data-ng-if=\"isEditing && (!node[tree.template.nodes] || !node[tree.template.nodes].length)\">\n  <a class=\"sequoia-button sequoia-button-info\" href=\"\" title=\"Add subitems\" data-ng-click=\"addNode(node)\" data-ng-bind=\"buttons.addSubitems\"></a>\n</span>");
$templateCache.put("sequoia-search.html","<form data-ng-submit=\"search()\">\n  <input type=\"text\" placeholder=\"Search for an item by {{tree.template.title}}\" data-ng-model=\"query\" name=\"search\" />\n  <a class=\"sequoia-button sequoia-button-default\" href=\"\" data-ng-if=\"isSearching\" data-ng-click=\"clear()\" data-ng-bind-html=\"buttons.searchClear\"></a>\n</form>\n");
$templateCache.put("sequoia-tree-actions.html","<ul>\n  <li data-ng-if=\"(model.length || onlySelected) && !isEditing\">\n    <a class=\"sequoia-button sequoia-button-info\" href=\"\" data-ng-click=\"toggleSelected()\" data-ng-bind-html=\"model.length && !onlySelected ? buttons.showSelected : !model.length && onlySelected ? buttons.backToList : buttons.hideSelected\"></a>\n  </li>\n\n  <li data-ng-if=\"isEditing || !tree.tree.length\">\n    <a class=\"sequoia-button sequoia-button-success\" href=\"\" data-ng-click=\"addNode()\" data-ng-bind-html=\"buttons.addNode\"></a>\n  </li>\n\n  <li data-ng-if=\"canEdit && tree.tree.length\">\n    <a class=\"sequoia-button sequoia-button-info\" href=\"\" data-ng-click=\"toggleEditing()\" data-ng-bind-html=\"isEditing ? buttons.done : buttons.edit\"></a>\n  </li>\n\n</ul>\n");}]);