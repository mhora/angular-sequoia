###v0.3.0
___

* Refactor util functions from Factory and improve the model initialisation ([tricinel](http://github.com/tricinel))

###v0.2.17
___

* Fix modal positioning on mobile devices ([tricinel](http://github.com/tricinel))

###v0.2.16
___

* Fix issue when model can become undefined after the tree has been initialised ([tricinel](http://github.com/tricinel))

###v0.2.15
___

* Fix infinite scroll for modals ([tricinel](http://github.com/tricinel))
* Remove height-related styles from modal ([tricinel](http://github.com/tricinel))

###v0.2.14
___

* Make use of the new reset parameter for infinite scroll ([tricinel](http://github.com/tricinel))
* Add call to reset pagination when loading a new node ([tricinel](http://github.com/tricinel))
* Add pagination reset function ([tricinel](http://github.com/tricinel))
* Temporarily move ngInfinitScroll to personal branch ([tricinel](http://github.com/tricinel))

###v0.2.13
___

* Add infinite-scroll distance and listen for event to check if the nodes should update when navigating the tree ([tricinel](http://github.com/tricinel))

###v0.2.12
___

* Fix sorting not being saved ([tricinel](http://github.com/tricinel))

###v0.2.11
___

* Fix removeNode not removing from tree, only from currentNodes on screen ([tricinel](http://github.com/tricinel))
* Make allowSearch default to true ([tricinel](http://github.com/tricinel))

###v0.2.10
___

* Make search form optional, enabled by default ([tricinel](http://github.com/tricinel))

###v0.2.9
___

* Hide Up button when the user is searching ([tricinel](http://github.com/tricinel))
* Remove angular.copy tree nodes ([tricinel](http://github.com/tricinel))

###v0.2.8
___

* Add finished for infinite scroll ([tricinel](http://github.com/tricinel))

###v0.2.7
___

* Change watch to watchCollection ([tricinel](http://github.com/tricinel))
* Add path watcher ([tricinel](http://github.com/tricinel))

###v0.2.6
___

* Only show the modal if needed ([tricinel](http://github.com/tricinel))
* Add some one time binding where possible to limit the number of watchers ([tricinel](http://github.com/tricinel))

###v0.2.5
___

* Add button for Up a level ([tricinel](http://github.com/tricinel))

###v0.2.4
___

* Make directive scope binding optional for some values ([tricinel](http://github.com/tricinel))
* Improve long node names by adding a full path to it in the search and selected views ([tricinel](http://github.com/tricinel))
* Add angular-animate and styles for ngRepeat for tree nodes ([tricinel](http://github.com/tricinel))
* Add set path so that you can set where the tree should start displaying from ([tricinel](http://github.com/tricinel))

###v0.2.3
___

* Fix tests by adding BUTTONS ([tricinel](http://github.com/tricinel))
* Make Root wording customizable ([tricinel](http://github.com/tricinel))
* Add deselect all button ([tricinel](http://github.com/tricinel))

###v0.2.2
___

* Update search directive to paginate ([tricinel](http://github.com/tricinel))
* Disable searching when editing the tree ([tricinel](http://github.com/tricinel))

###v0.2.1
___

* Move add and remove functions to the factory ([tricinel](http://github.com/tricinel))

###v0.2.0
___

* Implement infinite scroll for nodes, subnodes and selected ([tricinel](http://github.com/tricinel))
* Replace as.sortable with Sortable; Jumpstart infinite scroll ([tricinel](http://github.com/tricinel))
* Replace default buttons with lodash _.defaults to extend ([tricinel](http://github.com/tricinel))

###v0.1.20
___

* Fix always empty model when limit=1 ([tricinel](http://github.com/tricinel))

###v0.1.19
___

* Fix bug that was showing the edit button when showing selected nodes ([tricinel](http://github.com/tricinel))
* Revert "Fix bug that tried to select invalid node" ([tricinel](http://github.com/tricinel))
* Add DEFAULT_OPTIONS for injector ([tricinel](http://github.com/tricinel))
* Fix bug that was hiding the Done button when the user deleted all the tree nodes in edit mode ([tricinel](http://github.com/tricinel))
* Fix bug that tried to select invalid node ([tricinel](http://github.com/tricinel))

###v0.1.18
___

* Fix ng-submit as part of ng-form for searching ([tricinel](http://github.com/tricinel))

###v0.1.17
___

* Fix inline to display inline and not the other way around ([tricinel](http://github.com/tricinel))
* Move default options to constant ([tricinel](http://github.com/tricinel))
* Change useModal to inline ([tricinel](http://github.com/tricinel))
* Add allowSelect as part of the options passed to the tree ([tricinel](http://github.com/tricinel))

###v0.1.16
___

* Fix allowSelect and async tree updates ([tricinel](http://github.com/tricinel))

###v0.1.15
___

* Fix allowSelect when no model is provided ([tricinel](http://github.com/tricinel))

###v0.1.14
___

* Add watch in case there is an async request for treeNodes ([tricinel](http://github.com/tricinel))
* Fix modal select button text when limit=1 ([tricinel](http://github.com/tricinel))

###v0.1.13
___

* Add ability to limit selection ([tricinel](http://github.com/tricinel))

###v0.1.12
___

* Add default Modal Select button text ([tricinel](http://github.com/tricinel))
* Add default Move button text ([tricinel](http://github.com/tricinel))
* Fix _defaults for undefined options ([tricinel](http://github.com/tricinel))

###v0.1.11
___

* Replace form with ng-form to allow for nested forms ([tricinel](http://github.com/tricinel))

###v0.1.10
___

* Style modal ([tricinel](http://github.com/tricinel))
* Add modal option and markup ([tricinel](http://github.com/tricinel))
* Fix drag and drop positioning bug fix and style the dragging element ([tricinel](http://github.com/tricinel))

###v0.1.9
___

* Separated the item views into edit and non-edit; add ng-sortable ([tricinel](http://github.com/tricinel))
* Fix empty options object ([tricinel](http://github.com/tricinel))
* Add ng-sortable for drag and drop sorting when editing ([tricinel](http://github.com/tricinel))
* Style the help text and error notifications for validations for inputs ([tricinel](http://github.com/tricinel))
* Add form and form validation when editing the nodes ([tricinel](http://github.com/tricinel))
* Fix data-ng-bind-htmls ([tricinel](http://github.com/tricinel))

###v0.1.8
___

* Move addNode function to directive ([tricinel](http://github.com/tricinel))
* Add placeholder in edit mode ([tricinel](http://github.com/tricinel))
* Fix bug that would show the select buttons when clicking edit even if allowSelect is false ([tricinel](http://github.com/tricinel))

###v0.1.6
___

* Add init function; add buttons texts ([tricinel](http://github.com/tricinel))
* Add BUTTONS constant ([tricinel](http://github.com/tricinel))
* Pass buttons to search directive ([tricinel](http://github.com/tricinel))
* Update nodeTemplate to be used from the constants ([tricinel](http://github.com/tricinel))
* Add constants (contain buttons and nodeTemplate) ([tricinel](http://github.com/tricinel))
* Add configurable button text ([tricinel](http://github.com/tricinel))
* Add angular sanitize as dependency ([tricinel](http://github.com/tricinel))

###v0.1.5
___

* Add minor fixes for responsiveness ([tricinel](http://github.com/tricinel))
* Move input[text] styles outside of search so that they can apply to node editing as well ([tricinel](http://github.com/tricinel))
* Update Readme to include instructions for adding nodes and tree options ([tricinel](http://github.com/tricinel))
* Update demo for adding/editing/removing of nodes ([tricinel](http://github.com/tricinel))
* Add handling of adding, removing and editing nodes ([tricinel](http://github.com/tricinel))
* Rename remove to deselect ([tricinel](http://github.com/tricinel))
* Fix hardcoded _id - template.id instead of _id ([tricinel](http://github.com/tricinel))
* Add tree options to scope ([tricinel](http://github.com/tricinel))
* Fix returning to current nodes when clearing searching ([tricinel](http://github.com/tricinel))
* Separate sequoia item actions into its own template ([tricinel](http://github.com/tricinel))
* Separate sequoia tree actions into its own template ([tricinel](http://github.com/tricinel))

###v0.1.4
___

* Fix bug that would not change the title of the Show selected button when going to subitems ([tricinel](http://github.com/tricinel))
* Fix bug that would show the option to go to subitems when there is an empty nodes array ([tricinel](http://github.com/tricinel))

###v0.1.3
___

* Add Back to list button when the selected items are empty and the Selected are shown ([tricinel](http://github.com/tricinel))
* Add the subnodes to a node when searching ([tricinel](http://github.com/tricinel))
* Add test to bower ignore ([tricinel](http://github.com/tricinel))
* Add HipChat notifications ([tricinel](http://github.com/tricinel))

###v0.1.2
___

* Fix various lint errors ([tricinel](http://github.com/tricinel))
* Change factory function definition name to avoid conflict with factory name ([tricinel](http://github.com/tricinel))
* Change model to ng-model ([tricinel](http://github.com/tricinel))
* Fix Show/Hide error for selected nodes ([tricinel](http://github.com/tricinel))
* Add demo folder to bower ignore ([tricinel](http://github.com/tricinel))

###v0.1.1
___

* Completed readme ([tricinel](http://github.com/tricinel))
* Fix travis tests not existing ([tricinel](http://github.com/tricinel))
* Add coming soon to readme ([tricinel](http://github.com/tricinel))
* Add TravisCI Configuration ([tricinel](http://github.com/tricinel))
* Replace lodash.custom with lodash from bower install ([tricinel](http://github.com/tricinel))

###v0.1.0
* first release ([tricinel](http://github.com/tricinel))
