function EditProjectModulesConfig($stateProvider) {
    'ngInject';


    $stateProvider
      .state('app.editprojectModules', {
        url: '/project/:projectId/modules',
        controller: 'EditProjectModulesCtrl',
        controllerAs: '$ctrl',
        templateUrl: 'pages/editproject-modules/editproject-modules.html',
        title: 'Edit Project Modules',
        pageClass: 'page-account new',
        resolve: {
            auth: function (User) {
                return User.ensureAuthIs(true);
            },
        },
    });
}

export default EditProjectModulesConfig;
