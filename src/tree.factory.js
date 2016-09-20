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
