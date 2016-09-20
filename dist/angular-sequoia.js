(function() {
  'use strict';

  angular.module('ngSequoia', ['angular-lodash', 'ng-sortable', 'infinite-scroll', 'ngAnimate']);

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
(function() {
  'use strict';

  var buttons = {
    root: 'Home',
    edit: 'Edit',
    select: 'Select',
    deselect: 'Deselect',
    goToSubitems: 'Go to subitems',
    addSubitems: 'Add subitems',
    addNode: 'Add node',
    remove: 'Delete',
    done: 'Done',
    search: '&rsaquo;',
    searchClear: '&times;',
    showSelected: 'Show selected',
    hideSelected: 'Hide selected',
    deselectAll: 'Deselect all',
    backToList: 'Back to list',
    move: 'Move',
    modalSelect: 'Select',
    up: 'Up a level',
    searchText: 'Search for an item by title'
  };

  var nodeTemplate = {
    id: '_id',
    nodes: 'nodes',
    title: 'title'
  };

  var defaultOptions = {
    allowSelect: true,
    allowSearch: true,
    canEdit: false,
    inline: false,
    buttons: {},
    limit: 0
  };

  var sortableOptions = {
    sort: true,
    handle: '.sequoia-move-handle',
    ghostClass: 'as-sortable-dragging'
  };

  angular.module('ngSequoia')
    .constant('BUTTONS', buttons)
    .constant('NODE_TEMPLATE', nodeTemplate)
    .constant('DEFAULT_OPTIONS', defaultOptions)
    .constant('SORTABLE_OPTIONS', sortableOptions);

})();

(function() {
  'use strict';

  function sequoiaTreeDirective(Tree, Utils, BUTTONS, DEFAULT_OPTIONS, SORTABLE_OPTIONS){

    return {
      restrict: 'AE',
      replace: true,
      templateUrl: 'angular-sequoia.html',
      scope: {
        'treeNodes': '=sequoiaTree',
        'model': '=?ngModel',
        'template': '=?nodeTemplate',
        'options': '=?',
        'path': '=?sequoiaTreePath'
      },
      link: function(scope) {
        function init() {
          /* Set the default options*/
          scope.options = _.defaults(scope.options || {}, DEFAULT_OPTIONS);
          scope.canEdit = scope.options.canEdit;
          scope.inline = scope.options.inline;
          scope.allowSelect = scope.options.allowSelect;
          scope.isMultiSelect = scope.options.limit === 1 ? false : true;
          scope.breadcrumbs = [];
          scope.buttons = _.defaults(scope.options.buttons, BUTTONS);
          scope.sortableOptions = _.assign({}, SORTABLE_OPTIONS, {onSort: handleSort});
          scope.tree = new Tree(scope.treeNodes, scope.template, scope.buttons);

          scope.model = Utils.setModel(scope.isMultiSelect, scope.model);

          scope.containerStyle = !scope.inline ? { 'overflow': 'scroll', 'max-height': '400px' } : {};
        }

        function handleSort(evt) {
          scope.treeNodes = evt.models;
        }

        function paginate() {
          scope.tree.paginate();
          scope.finished = scope.tree.pagination.finished;
        }

        scope.load = function(node) {
          scope.onlySelected = false;

          var n = node ? node : scope.path ? scope.path : null;

          if(scope.tree.isValidNode(n)) {
            scope.tree.setCurrentNodes(n[scope.tree.template.nodes]);
            scope.breadcrumbs = scope.tree.breadcrumbs(n[scope.tree.template.id]);
            scope.path = n;
            scope.parentNode = scope.tree.findParentNode(scope.breadcrumbs);
          } else {
            scope.tree.setCurrentNodes();
            scope.breadcrumbs = [];
            scope.parentNode = null;
            scope.path = null;
          }

          scope.tree.resetPagination();
          paginate();
          scope.$emit('nodes:updated');
        };

        scope.loadMore = function() {
          paginate();
        };

        scope.select = function(node) {
          //make sure that scope.model is setup
          if(_.isUndefined(scope.model)) {
            scope.model = Utils.setModel(scope.isMultiSelect, scope.model);
          }

          if(node[scope.tree.template.id]) {
            if(scope.options.limit !== 0 && scope.model.length === scope.options.limit) {
              scope.notification = 'You cannot select more than ' + scope.options.limit + ' items!';
            } else {
              if(scope.isMultiSelect) {
                scope.model.push(node[scope.tree.template.id]);
              } else {
                scope.model = node[scope.tree.template.id];
              }
            }
          }
        };

        scope.deselect = function(node) {
          if(scope.isMultiSelect) {
            var index = node[scope.tree.template.id] ? _.indexOf(scope.model,node[scope.tree.template.id]) : -1;
            if(index !== -1) {
              scope.model.splice(index, 1);
            }
          } else {
            scope.model = '';
          }

        };

        scope.deselectAll = function() {
          scope.model = scope.isMultiSelect ? [] : '';
        };

        scope.isSelected = function(node) {
          return scope.isMultiSelect ? _.indexOf(scope.model, node[scope.tree.template.id]) !== -1 ? true : false : scope.model === node[scope.tree.template.id];
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

          paginate();
        };

        init();

        scope.$watchCollection('treeNodes', function(newVal) {
          if(newVal) {
            scope.tree = new Tree(scope.treeNodes, scope.template, scope.buttons);
            scope.load();
          }
        });

        scope.$watchCollection('path', function(newVal) {
          if(newVal) {
            scope.load();
          }
        });

        // if(!scope.inline) {
          scope.load();
        // }

        /* Handle Modal */
        scope.showModal = function() {
          scope.load();
          scope.modalShown = true;
        };

        scope.closeModal = function() {
          scope.modalShown = false;
        };

        /* Handle adding and editing nodes */
        scope.toggleEditing = function(form) {
          //handle form validation
          if(scope.isEditing) {
            form.isSubmitted = true;
          }
          if(form && !form.$valid) {
            return;
          }

          scope.treeNodes = scope.tree.tree;

          scope.isEditing = !scope.isEditing;
        };

        scope.addNode = function(node) {
          if(scope.tree.isValidNode(node)) {
            scope.load(node);
          }

          scope.tree.addNode();
          paginate();

          scope.isEditing = true;
        };

        scope.remove = function(node) {
          scope.tree.removeNode(node);
          paginate();
        };

        scope.closeNotification = function() {
          scope.notification = '';
        };
      }
    };

  }

  sequoiaTreeDirective.$inject = ['SequoiaTree', 'SequoiaTreeUtils', 'BUTTONS', 'DEFAULT_OPTIONS', 'SORTABLE_OPTIONS'];

  angular.module('ngSequoia')
    .directive('sequoiaTree', sequoiaTreeDirective);

})();
(function() {
  'use strict';

  function SequoiaTreeFactory($log, Utils, NODE_TEMPLATE, BUTTONS) {

    var SequoiaTree = function(tree, template, buttons) {
      this.template = template || NODE_TEMPLATE;
      this.tree = Utils.checkNodeStructure(_.isArray(tree) ? tree[0] : {}, this.template) ? tree : [];
      this.pagination = {};
      this.buttons = buttons || BUTTONS;

      this.resetPagination();
    };

    SequoiaTree.prototype.findParentNode = function(path) {
      return _.last(_.dropRight(path));
    };

    SequoiaTree.prototype.buildPathToNode = function(node) {
      return Utils.buildPath(node, this.tree, '', this.template, this.buttons.root);
    };

    SequoiaTree.prototype.paginate = function() {
      var paginate = function(nodes, limit, startkey) {
          return nodes.length > limit ? nodes.slice(startkey, startkey + limit) : nodes;
        },
        append = paginate(this.currentNodes, this.pagination.limit, this.pagination.startkey);

      //set the new startkey
      this.pagination.startkey = _.indexOf(this.currentNodes, _.last(append));

      //set the new nodes
      this.nodes = _.union(this.nodes, append);

      //have we reached the end of the array?
      if(this.nodes.length === this.currentNodes.length) {
        this.pagination.finished = true;
      }
    };

    SequoiaTree.prototype.resetPagination = function() {
      this.pagination = {
        startkey: 0,
        limit: 20,
        finished: false
      };
    };

    SequoiaTree.prototype.setCurrentNodes = function(nodes) {
      this.nodes = [];
      this.pagination.startkey = 0;
      this.currentNodes = !_.isArray(nodes) ? this.tree : nodes;
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
      return Utils.buildBreadCrumbs(id,this.tree,[], this.template, this.buttons.root);
    };

    SequoiaTree.prototype.find = function(key,value) {
      var results = [],
          found = Utils.contains(this.tree, key, value, [], this.template);
      for(var i=0;i<found.length;i++) {
        results.push(Utils.createNodeWithFullPathAsTitle(found[i], this.tree,this.template, this.buttons.root));
      }

      return results;
    };

    SequoiaTree.prototype.findSelected = function(obj) {
      var selected = [],
          results = [];

      if(_.isArray(obj)) {
        for(var i=0;i<obj.length;i++) {
          selected = _.union(selected, Utils.selected(obj[i], this.tree, [], this.template));
        }

        for(var j=0;j<selected.length;j++) {
          results.push(Utils.createNodeWithFullPathAsTitle(selected[j], this.tree,this.template, this.buttons.root));
        }
      } else if(_.isString(obj)) {
        selected = Utils.selected(obj, this.tree, [], this.template);
        results.push(Utils.createNodeWithFullPathAsTitle(selected[0], this.tree, this.template, this.buttons.root));
      } else {
        $log.warn('You must pass an array of IDs or a single ID in order to find the selected nodes!');
      }

      return results;
    };

    SequoiaTree.prototype.addNode = function() {
      var node = {};

      node[this.template.id] = Utils.guid();
      node[this.template.title] = '';
      node[this.template.nodes] = [];

      this.currentNodes.push(node);
    };

    SequoiaTree.prototype.removeNode = function(node) {
      //remove node from nodes currently visible
      this.currentNodes = _.without(this.currentNodes, node);
      this.nodes = _.without(this.nodes, node);
      //remove node from the tree, search recursively
      this.tree = Utils.pruneTree(this.tree, node[this.template.id], this.template);
    };

    return SequoiaTree;
  }

  SequoiaTreeFactory.$inject = ['$log', 'SequoiaTreeUtils', 'NODE_TEMPLATE', 'BUTTONS'];

  angular.module('ngSequoia')
    .factory('SequoiaTree', SequoiaTreeFactory);

})();

(function() {
  'use strict';

  function SequoiaTreeUtils($log) {

    var service = {};

    service.guid = function() {
      // https://gist.github.com/jed/982883
      var b = function(a) {return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);}; // jshint ignore:line

      return b();
    };

    service.checkNodeStructure = function(node, template) {
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

    service.exists = function (nodes, key, value, template) {
      if (_.isArray(nodes)) {
        return _.some(nodes, function(node){
          return node[key] === value ? true : service.exists(node[template.nodes], key, value, template);
        });
      } else {
        return false;
      }
    };

    service.contains = function (nodes, key, value, results, template) {
      if (_.isArray(nodes)) {
        for(var i=0;i<nodes.length;i++) {
          if(nodes[i][key].toLowerCase().indexOf(value.toLowerCase()) > -1) {
            results.push(nodes[i]);
          }
          service.contains(nodes[i][template.nodes], key, value, results, template);
        }
      }

      return results;
    };

    service.buildBreadCrumbs = function(id, nodes, breadcrumbs, template, rootText) {
      nodes = nodes || [];
      var root = {};
      root[template.title] = rootText;
      breadcrumbs = !breadcrumbs.length ? [root] : breadcrumbs;

      for(var i=0;i<nodes.length;i++) {
        if(nodes[i][template.id] === id || service.exists(nodes[i][template.nodes], template.id, id, template)) {
          breadcrumbs.push(nodes[i]);
        }
        service.buildBreadCrumbs(id, nodes[i][template.nodes], breadcrumbs, template, rootText);
      }

      return breadcrumbs;
    };

    service.buildPath = function(node, nodes, path, template, rootText) {
      nodes = nodes || [];

      for(var i=0;i<nodes.length;i++) {
        if(nodes[i][template.id] === node[template.id] || service.exists(nodes[i][template.nodes], template.id, node[template.id], template)) {
          path += path.length ? ' » ' : 'Full path: ' + rootText + ' » ';
          path += nodes[i][template.title];
        }
        path = service.buildPath(node, nodes[i][template.nodes], path, template, rootText);
      }

      return path;
    };

    service.selected = function(id, nodes, selected, template) {
      if(_.isArray(nodes)) {
        for(var i=0;i<nodes.length;i++) {
          if(nodes[i]._id === id) {
            selected.push(nodes[i]);
          }
          service.selected(id, nodes[i][template.nodes], selected, template);
        }
      }

      return selected;
    };

    service.getParentNode = function(id, nodes, template, breadcrumbs) {
      nodes = nodes || [];

      breadcrumbs = breadcrumbs || [];

      for(var i=0;i<nodes.length;i++) {
        if(nodes[i][template.id] === id || service.exists(nodes[i][template.nodes], template.id, id, template)) {
          breadcrumbs.push(nodes[i]);
        }
        service.getParentNode(id, nodes[i][template.nodes], template, breadcrumbs);
      }

      return breadcrumbs;
    };

    service.createNodeWithFullPathAsTitle = function(node, tree, template, rootText) {
      var result = {};

      result[template.id] = node[template.id];
      result[template.title] = node[template.title];
      /* This is a bit hacky, will fix */
      result.fullpath = '<span class="help-text mute">' + service.buildPath(node, tree, '', template, rootText) + '</span>';
      if(_.isArray(node[template.nodes]) && node[template.nodes].length > 0) {
        result[template.nodes] = node[template.nodes];
      }

      return result;
    };

    service.pruneTree = function(nodes, id, template) {
      for (var i=0;i<nodes.length;i++) {
        var node = nodes[i];
        if (node[template.id] === id) {
          nodes.splice(i, 1);
          return nodes;
        }
        if (node[template.nodes]) {
          if (service.pruneTree(node[template.nodes], id, template)) {
            if (node[template.nodes].length === 0) {
              delete node[template.nodes];
            }
            return nodes;
          }
        }
      }
    };

    service.setModel = function(isMultiSelect, model) {
      if(isMultiSelect) {
        if(_.isArray(model)) {
          return model;
        } else if(_.isString(model)) {
          $log.warn('You passed a string to a multi-select model, but the model is expected to be an array!');
          return [model];
        } else {
          $log.warn('The model is expected to be an array for a multi-select tree!');
          return [];
        }
      } else {
        if(_.isString(model)) {
          return model;
        } else if(_.isArray(model)) {
          $log.warn('You passed an array to a single-select model, but the model is expected to be a string!');
          return model[0];
        } else {
          $log.warn('The model is expected to be a string for a single-select tree!');
          return '';
        }
      }
    };

    return service;
  }

  SequoiaTreeUtils.$inject = ['$log'];

  angular.module('ngSequoia')
    .service('SequoiaTreeUtils', SequoiaTreeUtils);

})();

angular.module("ngSequoia").run(["$templateCache", function($templateCache) {$templateCache.put("angular-sequoia.html","<div class=\"sequoia\">\n  <div class=\"sequoia-modal-container\" data-ng-if=\"!inline\">\n    <a href=\"\" class=\"sequoia-button sequoia-button-info\" data-ng-click=\"showModal()\" data-ng-bind=\"model.length ? isMultiSelect ? buttons.modalSelect + \' (\' + model.length + \')\' : buttons.modalSelect + \' (1)\' : buttons.modalSelect\"></a>\n    <div data-ng-if=\"modalShown\">\n      <div class=\"sequoia-overlay\"></div>\n      <div class=\"sequoia-modal\">\n        <div class=\"sequoia-modal-title\">\n          <h4 class=\"pull-left\" data-ng-bind-html=\"buttons.modalSelect\"></h4>\n          <a href=\"\" class=\"sequoia-modal-close pull-right\" data-ng-click=\"closeModal()\">&times;</a>\n        </div>\n        <div data-ng-include=\"\'sequoia-tree.html\'\"></div>\n      </div>\n    </div>\n  </div>\n\n  <div data-ng-if=\"inline\" data-ng-include=\"\'sequoia-tree.html\'\"></div>\n\n</div>\n");
$templateCache.put("sequoia-breadcrumbs.html","<li data-ng-if=\"breadcrumbs.length\" data-ng-repeat=\"link in breadcrumbs\" data-ng-class=\"$last ? \'last\' : \'\'\">\n  <a data-ng-if=\"!$last\" href=\"\" data-ng-click=\"load(link)\" data-ng-bind=\"link[tree.template.title]\"></a>\n  <span data-ng-if=\"$last\" data-ng-bind=\"link[tree.template.title]\"></span>\n</li>\n");
$templateCache.put("sequoia-item-actions.html","<span data-ng-if=\"allowSelect && isSelected(node)\">\n  <a class=\"sequoia-button sequoia-button-danger\" href=\"\" title=\"Deselect\" data-ng-click=\"deselect(node)\" data-ng-bind-html=\"buttons.deselect\"></a>\n</span>\n\n<span data-ng-if=\"allowSelect && !isSelected(node)\">\n  <a class=\"sequoia-button sequoia-button-primary\" href=\"\" title=\"Select\" data-ng-click=\"select(node)\" data-ng-bind-html=\"buttons.select\"></a>\n</span>\n\n<span data-ng-if=\"node[tree.template.nodes] && node[tree.template.nodes].length\">\n  <a class=\"sequoia-button sequoia-button-info\" href=\"\" title=\"Go to subitems\" data-ng-click=\"load(node)\" data-ng-bind-html=\"buttons.goToSubitems\"></a>\n</span>\n");
$templateCache.put("sequoia-item-edit-actions.html","<span>\n  <a class=\"sequoia-button sequoia-button-danger\" href=\"\" title=\"Remove\" data-ng-click=\"remove(node)\" data-ng-bind-html=\"buttons.remove\"></a>\n</span>\n\n<span data-ng-if=\"node[tree.template.nodes] && node[tree.template.nodes].length\">\n  <a class=\"sequoia-button sequoia-button-info\" href=\"\" title=\"Go to subitems\" data-ng-click=\"load(node)\" data-ng-bind-html=\"buttons.goToSubitems\"></a>\n</span>\n\n<span data-ng-if=\"!node[tree.template.nodes] || !node[tree.template.nodes].length\">\n  <a class=\"sequoia-button sequoia-button-info\" href=\"\" title=\"Add subitems\" data-ng-click=\"addNode(node)\" data-ng-bind-html=\"buttons.addSubitems\"></a>\n</span>\n\n<span>\n  <a class=\"sequoia-button sequoia-button-default sequoia-move-handle\" href=\"\" data-ng-bind-html=\"buttons.move\"></a>\n</span>");
$templateCache.put("sequoia-item.html","<span class=\"sequoia-item-title\">\n  <span data-ng-if=\"!isEditing\" data-ng-bind-html=\"node[tree.template.title] + \'<br/>\' + node.fullpath\"></span>\n  <span data-ng-if=\"isEditing\">\n    <input required name=\"itemTitle_{{::node[tree.template.id]}}\" type=\"text\" data-ng-model=\"node[tree.template.title]\" placeholder=\"Enter a {{::tree.template.title}}\">\n    <p class=\"help-text has-error\" data-ng-show=\"form.isSubmitted && form[\'itemTitle_\' + node[tree.template.id]].$error.required\">The item {{::tree.template.title}} is required!</p>\n  </span>\n</span>\n\n<span class=\"sequoia-item-actions\" data-ng-include=\"\'sequoia-item-actions.html\'\" data-ng-if=\"!isEditing\"></span>\n<span class=\"sequoia-item-actions\" data-ng-include=\"\'sequoia-item-edit-actions.html\'\" data-ng-if=\"isEditing\"></span>\n");
$templateCache.put("sequoia-search.html","<ng-form name=\"sequoiaSearchForm\" data-ng-submit=\"search()\" novalidate>\n  <input type=\"text\" placeholder=\"{{::buttons.searchText}}\" data-ng-model=\"query\" name=\"search\" data-ng-disabled=\"isEditing\" />\n  <a class=\"sequoia-button sequoia-button-success\" href=\"\" data-ng-if=\"query.length\" data-ng-click=\"search()\" data-ng-bind-html=\"buttons.search\"></a>\n  <a class=\"sequoia-button sequoia-button-default\" href=\"\" data-ng-if=\"isSearching\" data-ng-click=\"clear()\" data-ng-bind-html=\"buttons.searchClear\"></a>\n</ng-form>\n");
$templateCache.put("sequoia-tree-actions.html","<ul>\n  <li data-ng-if=\"(model.length || onlySelected) && !isEditing\">\n    <a class=\"sequoia-button sequoia-button-info\" href=\"\" data-ng-click=\"toggleSelected()\" data-ng-bind-html=\"model.length && !onlySelected ? buttons.showSelected : !model.length && onlySelected ? buttons.backToList : buttons.hideSelected\"></a>\n  </li>\n\n  <li data-ng-if=\"model.length && onlySelected && !isEditing\">\n    <a class=\"sequoia-button sequoia-button-info\" href=\"\" data-ng-click=\"deselectAll()\" data-ng-bind-html=\"buttons.deselectAll\"></a>\n  </li>\n\n  <li data-ng-if=\"isEditing && !onlySelected\">\n    <a class=\"sequoia-button sequoia-button-success\" href=\"\" data-ng-click=\"addNode()\" data-ng-bind-html=\"buttons.addNode\"></a>\n  </li>\n\n  <li data-ng-if=\"canEdit && !onlySelected\">\n    <a class=\"sequoia-button sequoia-button-info\" href=\"\" data-ng-click=\"toggleEditing(sequoiaEditForm)\" data-ng-bind-html=\"isEditing ? buttons.done : buttons.edit\"></a>\n  </li>\n\n</ul>\n");
$templateCache.put("sequoia-tree.html","<ng-form name=\"sequoiaEditForm\" novalidate>\n\n  <div class=\"sequoia-search\">\n    <div data-ng-if=\"::options.allowSearch\" class=\"sequoia-search-form\" data-sequoia-search data-is-searching=\"searchEnabled\" data-is-editing=\"isEditing\" data-tree=\"tree\" data-buttons=\"buttons\"></div>\n\n    <div class=\"sequoia-actions\" data-ng-include=\"\'sequoia-tree-actions.html\'\"></div>\n  </div>\n\n  <ul data-ng-if=\"!searchEnabled && !onlySelected\" class=\"sequoia-breadcrumbs\" data-ng-include=\"\'sequoia-breadcrumbs.html\'\"></ul>\n\n  <p class=\"sequoia-up-one-level\" data-ng-if=\"parentNode && !searchEnabled\">\n    <a href=\"\" class=\"sequoia-button sequoia-button-info\" data-ng-click=\"load(parentNode)\" data-ng-bind-html=\"buttons.up\"></a>\n  </p>\n\n  <div class=\"sequoia-notification\" data-ng-show=\"notification\">\n    <p>\n      <span class=\"pull-left\" data-ng-bind=\"notification\"></span>\n      <a class=\"pull-right sequoia-button\" href=\"\" data-ng-click=\"closeNotification()\" data-ng-bind-html=\"buttons.searchClear\"></a>\n    </p>\n  </div>\n\n  <div data-ng-style=\"containerStyle\">\n    <div data-infinite-scroll=\"loadMore()\" data-infinite-scroll-disabled=\"finished\" data-infinite-scroll-listen-for-event=\"nodes:updated\" data-infinite-scroll-reset=\"true\" data-ng-attr-data-infinite-scroll-parent=\"{{!inline || undefined}}\">\n      <ul id=\"sequoia-tree\" class=\"sequoia-tree\" data-ng-sortable=\"sortableOptions\" data-ng-model=\"tree.nodes\">\n        <li class=\"sequoia-animate-repeat\" data-ng-repeat=\"node in tree.nodes track by node[tree.template.id]\" data-ng-include=\"\'sequoia-item.html\'\"></li>\n      </ul>\n    </div>\n  </div>\n\n</ng-form>\n");}]);