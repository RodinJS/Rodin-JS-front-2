import angular from 'angular/index';

// Create the module where our functionality can attach to
let editprojectDaydreamModule = angular.module('app.editprojectDaydream', []);

// Include our UI-Router config settings
import EditProjectDaydreamConfig from './editproject-daydream.config';
editprojectDaydreamModule.config(EditProjectDaydreamConfig);


// Controllers
import EditProjectDaydreamCtrl from './editproject-daydream.controller';
editprojectDaydreamModule.controller('EditProjectDaydreamCtrl', EditProjectDaydreamCtrl);


export default editprojectDaydreamModule;
