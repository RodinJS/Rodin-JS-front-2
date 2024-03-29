function StoreConfig($stateProvider) {
    'ngInject';
    $stateProvider
      .state('landing.store', {
        url: '/store',
        controller: 'StoreCtrl as $ctrl',
        templateUrl: 'pages/store/store.html',
        pageClass: 'page-store new',
        title: 'Store',
    });
}

export default StoreConfig;
