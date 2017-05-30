function EditProjectDaydreamConfig($stateProvider) {
    'ngInject';

    $stateProvider
     .state('app.editprojectDaydream', {
        url: '/project/:projectId/daydream',
        controller: 'EditProjectDaydreamCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'pages/editproject-daydream/editproject-daydream.html',
        title: 'Edit Project - Daydream',
        pageClass: 'page-account',
        resolve: {
            auth: function (User) {
                return User.ensureAuthIs(true);
            },
        },
    });
}

export default EditProjectDaydreamConfig;
