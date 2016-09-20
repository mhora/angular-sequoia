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
