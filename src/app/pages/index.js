/**
 * Created by kh.levon98 on 14-Sep-16.
 */
import angular from 'angular/index';

import './demo/index';

import './auth/index';

import './home/index';

import './error/index';

import './dashboard/index';

import './profile/index';

import './project/index';

import './editproject/index';

import './plans/index';

import './billing/index';

import './purchases/index';

import './editproject-ios/index';

// Create the module where our functionality can attach to
let pagesModule = angular.module('app.pages', [
	'landing.auth',
	'landing.home',
	'landing.demo',
	'landing.error',

	'app.dashboard',
	'app.profile',
	'app.project',
	'app.editproject',
	'app.editporjectIos',
	'app.plans',
	'app.billing',
	'app.purchases'
]);


export default pagesModule;
