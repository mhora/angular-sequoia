'use strict';

function MainController($timeout) {
  var vm = this;

  vm.selectedNodes = [];

  vm.template = {
    id: '_id',
    nodes: 'nodes',
    title: 'title'
  };

  var tree = [
    {
      _id: _.uniqueId(),
      title: 'Title one',
      nodes: [
        {
          _id: _.uniqueId(),
          title: 'Subtitle one',
          nodes: [
            {
              _id: _.uniqueId(),
              title: 'Subsubtitle one',
              nodes: [
                {
                  _id: _.uniqueId(),
                  title: 'Subsubsubtitle one'
                }
              ]
            }
          ]
        },
        {
          _id: _.uniqueId(),
          title: 'Subtitle two'
        }
      ]
    },
    {
      _id: _.uniqueId(),
      title: 'Title two',
      nodes: [
        {
          _id: _.uniqueId(),
          title: 'Subtitle one'
        },
        {
          _id: _.uniqueId(),
          title: 'Subtitle two'
        }
      ]
    },
    {
      _id: _.uniqueId(),
      title: 'Curriculum Items',
      nodes: [
        {
          _id: _.uniqueId(),
          title: 'RCPCH Paediatric Immunology, Infectious Diseases and Allergy',
          nodes: [
            {
              _id: _.uniqueId(),
              title: 'Detailed knowledge of common and serious paediatric conditions and their management in General Paediatrics or in a paediatric sub-specialty',
              nodes: [
                  {
                  _id: _.uniqueId(),
                  title: 'Emphasis on Immunology and infectious diseases',
                  nodes: [
                    {
                      _id: _.uniqueId(),
                      title: 'Know and understand the complexities of the relationship between the host and infecting organisms'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  /* Setup all demos */

  //Tree edit
  vm.treeEdit = angular.copy(tree);
  vm.treeEditOptions = { canEdit: true, inline: true, allowSelect: false };

  //Tree create
  vm.treeCreate = [];
  vm.treeCreateOptions = { canEdit: true, inline: true, allowSelect: false };

  //Tree select
  vm.treeSelect = angular.copy(tree);
  vm.treeSelectOptions = { canEdit: false, inline: true };

  //Tree single select
  vm.treeSingleSelect = angular.copy(tree);
  vm.treeSingleSelectOptions = { canEdit: false, inline: true, limit: 1 };
  vm.singleSelectedNode = '123412341234';

  //Tree full
  vm.treeFull = angular.copy(tree);
  vm.treeFullOptions = { canEdit: true, inline: true, allowSelect: true };

  //Tree view
  vm.treeView = angular.copy(tree);
  vm.treeViewOptions = { canEdit: false, inline: true, allowSelect: false };

  //Tree modal
  vm.treeModalOptions = { canEdit: true, inline: false, allowSelect: true };

  //Tree async
  vm.treeAsync = [];
  vm.treeAsyncOptions = { canEdit: false, inline: true, allowSelect: false };
  $timeout(function(){
    vm.treeAsync = angular.copy(tree);
  }, 1000);

  //Tree for infinite scroll
  vm.treeInfiniteScroll = angular.copy(tree);
  for(var i=0;i<100;i++) {
    vm.treeInfiniteScroll.push({_id: _.uniqueId('generated_'), title: 'Generated title ' + i});
  }
  for(var j=0;j<50;j++) {
    vm.treeInfiniteScroll[0].nodes.push({_id: _.uniqueId('generated_subitem_'), title: 'Subgenerated title ' + j});
  }

  //Tree with a set path
  vm.treeSetPath = angular.copy(tree);
  vm.nodeForPath = {_id: '0000000000', title: 'Set path', nodes: [{ _id: _.uniqueId(), title: 'Sub set path'}]};
  vm.treeSetPath.push(vm.nodeForPath);

  //Huge tree
  vm.treeHuge = angular.copy(tree);
  for(var i=0;i<10000;i++) {
    vm.treeHuge.push({_id: _.uniqueId('generated_'), title: 'Generated title ' + i});
  }
  for(var j=0;j<1000;j++) {
    vm.treeHuge[0].nodes.push({_id: _.uniqueId('generated_subitem_'), title: 'Subgenerated title ' + j});
    vm.treeHuge[1].nodes.push({_id: _.uniqueId('generated_subitem_'), title: 'Subgenerated title ' + j});
    vm.treeHuge[2].nodes.push({_id: _.uniqueId('generated_subitem_'), title: 'Subgenerated title ' + j});
  }

}

MainController.$inject = ['$timeout'];

var app = angular.module('sequioaDemo', ['ngSequoia', 'ngSanitize']);

app.controller('MainController', MainController);