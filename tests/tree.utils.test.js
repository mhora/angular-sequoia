'use strict';

describe('Sequoia Tree Utils', function() {

  var node, template, wrongTemplate, nodes;

  node = { _id: '1234', title: 'My title', nodes: [] };
  template = { id: '_id', title: 'title', nodes: 'nodes' };
  wrongTemplate = { id: 'not_id', title: 'title', nodes: 'nodes' };
  nodes = [
    { _id: '1234', title: 'Title one', nodes: [] },
    { _id: '5678', title: 'Title two', nodes: [] },
    { _id: '9012', title: 'Title three', nodes: [{ _id: '3456', title: 'Subtitle one', nodes: [] }, { _id: '7890', title: 'Subtitle two', nodes: [{ _id: '12345', title: 'Subsubtitle one', nodes: [] }] }] }
  ];

  beforeEach(module('ngSequoia'));

  var Utils,
      log,
      NODE_TEMPLATE,
      BUTTONS;

  beforeEach(inject(function(_SequoiaTreeUtils_, _$log_){
    Utils = _SequoiaTreeUtils_;
    log = _$log_;
  }));

  describe('when the tree is multi-select', function() {
    var isMultiSelect = true;

    it('should set the model to model when passing an array', function() {
      var model = Utils.setModel(isMultiSelect, nodes);

      expect(model).toEqual(nodes);
    });

    it('should set the model to an array containing the string when passing a string', function() {
      var model = Utils.setModel(isMultiSelect, 'nodes');

      expect(model).toEqual(['nodes']);
      expect(log.warn.logs).toContain(['You passed a string to a multi-select model, but the model is expected to be an array!']);
    });

    it('should set the model to an empty array when passing an object', function() {
      var model = Utils.setModel(isMultiSelect, {'foo': 'bar'});

      expect(model).toEqual([]);
      expect(log.warn.logs).toContain(['The model is expected to be an array for a multi-select tree!']);
    });
  });

  describe('when the tree is single-select', function() {
    var isMultiSelect = false;

    it('should set the model to model when passing a string', function() {
      var model = Utils.setModel(isMultiSelect, 'nodes');

      expect(model).toEqual('nodes');
    });

    it('should set the model to a string containing the first element of the array when passing an array', function() {
      var model = Utils.setModel(isMultiSelect, ['nodes']);

      expect(model).toEqual('nodes');
      expect(log.warn.logs).toContain(['You passed an array to a single-select model, but the model is expected to be a string!']);
    });

    it('should set the model to an empty string when passing an object', function() {
      var model = Utils.setModel(isMultiSelect, {'foo': 'bar'});

      expect(model).toEqual('');
      expect(log.warn.logs).toContain(['The model is expected to be a string for a single-select tree!']);
    });
  });

});
