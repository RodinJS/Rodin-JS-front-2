function FaqConfig($stateProvider) {
	'ngInject';
	$stateProvider
		.state('landing.faq', {
			url: '/faq',
			controller: 'FaqCtrl as $ctrl',
			templateUrl: 'pages/faq/faq.html',
			title: 'Faq'
		})
}

export default FaqConfig;