angular-sequoia
=============================

A native tree visualiser for AngularJS with multiselect, breadcrumbs and search. No JQuery.

[![Build Status](https://travis-ci.org/tricinel/angular-sequoia.svg)](https://travis-ci.org/tricinel/angular-sequoia)

#### Features:

* Visualize multi-level trees
* Breadcrumbs
* Deep search for the tree
* Select/Remove items
* Show/hide selected items

##### Usage:

Get the binaries of angular-multi-select-tree with any of the following ways.

```sh
bower install angular-sequoia --save
```

Make sure to load the scripts in your html.
```html
<link rel="stylesheet" href="../dist/angular-sequoia.css">
<script type="text/javascript" src="../dist/angular-sequoia.js"></script>
```

And Inject the sortable module as dependency.

```
angular.module('myApp', ['ngSequoia']);
```

###### Html Structure:
You can also check out the [examples](./examples) folder.

```javascript
function MainController() {
  var vm = this;

  vm.selectedNodes = [];

  vm.template = {
    id: '_id',
    nodes: 'nodes',
    title: 'title'
  };

  vm.tree = [
    {
      _id: '123412341234',
      title: 'Title one',
      nodes: [
        {
          _id: '2342346234',
          title: 'Subtitle one',
          nodes: [...]
        }
      ]
    }
  ];

  vm.treeOptions = {
    limit: 0,
    canEdit: true,
    useModal: false,
    buttons:  {
      done: 'Complete'
    }
  };
}
```

```html
<div data-ng-controller="MainController as vm">
  <div data-sequoia-tree="vm.tree" data-ng-model="vm.selectedNodes" data-node-template="vm.template" data-options="vm.treeOptions"></div>
</div>
```

You can ignore the `vm.template` as long as your nodes conform to the default template (which you can find here: [default template](./src/sequoia.constants.js)). Otherwise, just pass it through.

```javascript
vm.template = {
  id: 'key',
  nodes: 'categories',
  title: 'name'
};
```

By `passing canEdit = true` via `vm.treeOptions` you are basically turning your tree visualiser into a tree editor. You can add new nodes or remove and edit existing nodes.

You can configure all the button texts and even pass in icons for buttons. You don't need to configure all, just the ones that you need. You can find the default buttons here: [default buttons](./src/sequoia.constants.js)

You can also display the tree in an modal instead of the default inline. Just pass `useModal = true` via `vm.treeOptions`.

You can impose a limit of many nodes you can select using `limit = 1`, which would limit the selection to 1.

You can set a start path for the tree, so that it begins displaying with that node. Just pass `data-ng-tree-path="vm.someTreeNode"`.

##### Coming next

* Configurable node structure
* Add/Remove functions passed from the client and just applied by the directive

##### License

MIT, see [LICENSE.md](./LICENSE.md).
