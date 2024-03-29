/**
 * Created by xgharibyan on 10/29/16.
 */
function EditorNavigation() {
  'ngInject';

  const ControllerInjector = [
    '$scope',
    '$state',
    '$stateParams',
    editorNavigationCtrl,
  ];

  return {
    restrict: 'E',
    templateUrl: 'components/editorNavigation/index.html',
    bindToController: true,
    controllerAs: 'vm',
    replace: true,
    controller: ControllerInjector,
  };
}

function editorNavigationCtrl($scope, $state, $stateParams) {
  const vm = this;// jscs:ignore safeContextKeyword
  const active = $state.$current.url.segments[1].replace(/\//g, '') || 'setting';
  vm.projectID = $stateParams.projectId;
  vm.navigation = {
    setting: {
      active: false,
      title: 'Settings',
      url: 'app.editproject',
    },
    modules: {
      active: false,
      title: 'Modules',
      url: 'app.editprojectModules',
    },
    ios: {
      active: false,
      title: 'IOS',
      url: 'app.editprojectIos',
    },
    android: {
      active: false,
      title: 'Android',
      url: 'app.editprojectAndroid',
    },    
    // daydream: {
    //   active: false,
    //   title: 'Daydream',
    //   url: 'app.editprojectDaydream',
    // },
    oculus: {
      active: false,
      title: 'Oculus',
      url: 'app.editprojectOculus',
    },
    vive: {
      active: false,
      title: 'VIVE',
      url: 'app.editprojectVive',
    },
    web: {
      active: false,
      title: 'Web',
      url: 'app.editprojectWeb',
    },
    publish: {
      active: false,
      title: 'Publish',
      url: 'app.editprojectPublish',
    },
  };

  vm.navigation[active].active = true;

  vm.goTo = function (url) {
    $state.go(url, {projectId: vm.projectID});
  };

}

export default EditorNavigation;
