'use strict';

describe('Sequoia Tree Factory', function() {

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

  var SequoiaTree,
      Utils,
      log,
      NODE_TEMPLATE,
      BUTTONS;

  beforeEach(inject(function(_SequoiaTree_, _SequoiaTreeUtils_, _$log_, _NODE_TEMPLATE_, _BUTTONS_){
    SequoiaTree = _SequoiaTree_;
    Utils = _SequoiaTreeUtils_;
    log = _$log_;
    NODE_TEMPLATE = _NODE_TEMPLATE_;
    BUTTONS = _BUTTONS_;
  }));

  it('should create a new tree', function() {
    var tree1 = new SequoiaTree(nodes,template),
        tree2 = new SequoiaTree(nodes);

    expect(tree1).toBeDefined(); //passing a template
    expect(tree2).toBeDefined(); //create a tree with the default template
  });

  it('should validate the node template', function() {
    var tree = new SequoiaTree(nodes,template);

    expect(tree.tree.length).toBeTruthy();
  });

  it('should not validate the node template', function() {
    var tree = new SequoiaTree(nodes,wrongTemplate);

    expect(tree.tree.length).toBeFalsy();
  });

  it('should validate a node', function() {
    var tree = new SequoiaTree([],template);

    expect(tree.isValidNode(node)).toBeTruthy();
  });

  it('should set reset the startkey for pagination and empty the current nodes', function() {
    var tree = new SequoiaTree(nodes,template);

    tree.setCurrentNodes();
    expect(tree.nodes).toEqual([]);
    expect(tree.pagination.startkey).toEqual(0);
  });

  it('should set the current nodes to the tree nodes', function() {
    var tree = new SequoiaTree(nodes,template);

    tree.setCurrentNodes();
    tree.paginate();
    expect(tree.nodes).toEqual(nodes);
  });

  it('should paginate', function() {
    var tree, i, _nodes = [];

    _nodes = nodes.concat([0]);

    for(i=0;i<25;i++) {
      _nodes.push({_id: 'generated_' + i, title: 'Generated title ' + i, nodes: []});
    }

    tree = new SequoiaTree(_nodes,template);

    tree.setCurrentNodes();
    tree.paginate();
    expect(tree.currentNodes.length).toEqual(_nodes.length);
    expect(tree.nodes.length).toEqual(tree.pagination.limit);
  });

  it('should not finish pagination', function() {
    var tree, i, _nodes = [];

    for(i=0;i<25;i++) {
      _nodes.push({_id: 'generated_' + i, title: 'Generated title ' + i, nodes: []});
    }

    tree = new SequoiaTree(_nodes,template);

    tree.setCurrentNodes();
    tree.paginate();
    expect(tree.pagination.finished).toBe(false);
  });

  it('should finish pagination', function() {
    var tree;

    tree = new SequoiaTree(nodes,template);

    tree.setCurrentNodes();
    tree.paginate();
    expect(tree.pagination.finished).toBe(true);
  });

  it('should set the current nodes to passed nodes', function() {
    var someNodes = [{_id: '1234', title: 'Title', nodes: []}],
        tree = new SequoiaTree(nodes,template);

    tree.setCurrentNodes(someNodes);
    tree.paginate();
    expect(tree.nodes).toEqual(someNodes);
  });

  it('should find elements containing a string in the title', function() {
    var tree = new SequoiaTree(nodes,template),
        found = tree.find('title', 'sub');

    expect(found.length).toBe(3);
  });

  it('should find selected items', function() {
    var tree = new SequoiaTree(nodes,template),
        ids = ['1234', '5678', '12345', 'wrong_id'],
        found = tree.findSelected(ids);

    expect(found.length).toBe(3);
  });

  it('create breadcrumbs', function() {
    var tree = new SequoiaTree(nodes,template),
        breadcrumbs = [{ title: BUTTONS.root },{ _id: '9012', title: 'Title three', nodes: [{ _id: '3456', title: 'Subtitle one', nodes: []}, { _id: '7890', title: 'Subtitle two', nodes: [{ _id: '12345', title: 'Subsubtitle one', nodes: []}]}]}, { _id: '7890', title: 'Subtitle two', nodes: [{ _id: '12345', title: 'Subsubtitle one', nodes: []}]}, { _id: '12345', title: 'Subsubtitle one', nodes: []}];

    expect(tree.breadcrumbs('12345')).toEqual(breadcrumbs);
  });

  it('should get the parent node', function() {
    var tree = new SequoiaTree(nodes,template),
        path = [{ _id: '9012', title: 'Title', nodes: [] }, { _id: '90122', title: 'Title two', nodes: [] }, { _id: '90123', title: 'Title three', nodes: [] }],
        node = { _id: '90122', title: 'Title two', nodes: [] };

    expect(tree.findParentNode(path)).toEqual(node);
  });

  it('should build the correct path to a node', function() {
    var tree = new SequoiaTree(nodes,template),
        testPath = 'Full path: ' + BUTTONS.root + ' » Title three » Subtitle two » Subsubtitle one',
        path = tree.buildPathToNode({ _id: '12345', title: 'Subsubtitle one', nodes: [] });

    expect(testPath).toEqual(path);
  });

  it('should retrieve the path to a single node passed as a string', function() {
    var tree = new SequoiaTree(nodes,template),
        found = tree.findSelected('1234');

    expect(found.length).toBe(1);
  });

  it('should retrieve the path to two nodes passed as an array', function() {
    var tree = new SequoiaTree(nodes,template),
        found = tree.findSelected(['1234', '5678']);

    expect(found.length).toBe(2);
  });

  it('should fail to retrieve the path to a node passed as an object', function() {
    var tree = new SequoiaTree(nodes,template),
        found = tree.findSelected({id: '1234'});

    expect(found.length).toBe(0);
    expect(log.warn.logs).toContain(['You must pass an array of IDs or a single ID in order to find the selected nodes!']);
  });

  it('should create a new empty node', function() {
    var tree = new SequoiaTree(nodes,template);

    tree.setCurrentNodes(nodes);

    var node = tree.addNode();

    expect(nodes.length).toEqual(tree.currentNodes.length);
  });

  it('should remove an existing node', function() {
    var tree = new SequoiaTree(nodes,template),
        remove = nodes[0],
        initialLength = tree.tree.length;

    tree.removeNode(remove);

    expect(initialLength).toEqual(tree.tree.length + 1);
  });

});
