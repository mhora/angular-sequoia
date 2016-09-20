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
