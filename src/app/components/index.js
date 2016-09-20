/**
 * Created by kh.levon98 on 13-Sep-16.
 */
import angular from 'angular/index';


const componentsModule = angular.module('app.components', []);

import ShowAuthed from './show-authed/index';
componentsModule.directive('showAuthed', ShowAuthed);

import CheckForUnique from './check-for-unique/index';
componentsModule.directive('checkForUnique', CheckForUnique);

export default componentsModule;
