class EditProjectIosCtrl {
    constructor(AppConstants, Project, $state, $stateParams, $q, $scope, User, JWT, EventBus, ProjectStore, Validator, Notification) {
        'ngInject';
        this.Notification = Notification;
        this.appName = AppConstants.appName;
        this._AppConstants = AppConstants;
        this._JWT = JWT;
        this.Project = Project;
        this.$state = $state;
        this.$q = $q;
        this._$scope = $scope;

        this.projectId = $stateParams.projectId;
        this.project = {};
        this.showLoader = true;

        this.user = User.current;
        this._checkVersion = Validator.checkVersion;

        this.fileChoosen = {
            profile: false,
            p12: false
        };

        this.files = {
            profile: {
                name: ""
            },
            cert: {
                name: ""
            },
            icon: {
                name: "",
                src: ""
            }
        };

        this.modals = {
            password: false
        };

        this.submiting = false;
        this.openEvent = null;

        const self = this;
        this.eventBus = EventBus;
        this.getProject();
        ProjectStore.subscribeAndInit($scope, ()=> {
            this.project = ProjectStore.getProject();
        });
    }

    getProject() {
        this.showLoader = true;
        this.Project.get(this.projectId, {device: 'ios'}).then(
            project => {
                this.showLoader = false;
                this.eventBus.emit(this.eventBus.project.SET, project);
                this.project = project;
            },
            err => {
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
                //this.$state.go('landing.error');
            }
        )
    }

    update() {
        this.showLoader = true;
        this.Project.update(this.projectId, this.project).then(
            data => {
                this.showLoader = false;
                this.eventBus.emit(this.eventBus.project.SET, data);
            },
            err => {
                this.showLoader = false;
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
            }
        )
    }

    changeIcon(e) {
        if (window.FileReader && window.Blob) {

            var file = e.target.files[0];

            if (file) {
                this.isValidImage(file).then((result) => {
                    var reader = new FileReader();
                    reader.onloadend = (e) => {
                        this.files.icon.name = file.name;
                        this.files.icon.src = reader.result;
                        this._$scope.$apply();
                    };
                    reader.readAsDataURL(file);
                }, (result) => {
                    this.Notification.error('Unsupported image type');
                });
            }

        } else {
            this.Notification.warning('It seems your browser doesn\'t support FileReader.');
        }
    }

    isValidImage(file) {
        var defer = this.$q.defer();
        var result = {
            valid: true,
            message: ""
        };

        if (file.size > 1024 * 1024) {
            result.valid = false;
            result.message = "FIle size must be less than 1mb";
            var tim = $timeout(function () {
                defer.reject(result);
                $timeout.cancel(tim);
            });
        } else {
            var fileReader = new FileReader();
            fileReader.onloadend = function (e) {
                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                var header = "";
                for (var i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }

                switch (header) {
                    case "89504e47":
                        break;
                    default:
                        result.valid = false;
                        result.message = "Allowed only .jpg .jpeg and .png file types.";
                        break;
                }

                if (result.valid) {
                    defer.resolve(result);
                } else {
                    defer.reject(result);
                }
            };
            fileReader.readAsArrayBuffer(file);
        }

        return defer.promise;
    }

    changeCert(e) {
        if (window.FileReader && window.Blob) {
            var file = e.target.files[0];
            this.files.cert.name = file.name;
            this._$scope.$apply();

        } else {
            this.Notification.warning('It seems your browser doesn\'t support FileReader.');
        }
    }

    changeProfile(e) {
        if (window.FileReader && window.Blob) {
            var file = e.target.files[0];
            this.files.profile.name = file.name;
            this._$scope.$apply();

        } else {
            this.Notification.warning('It seems your browser doesn\'t support FileReader.');
        }
    }

    build() {
        const e = this.openEvent;
        const ctrl = this;
        e.preventDefault();
        let project = {
            userId: this.user.username,
            appId: this.projectId,
            appName: this.project.ios.name,
            version:this.project.ios.version,
            ios: {
                exportMethod: "ad-hoc",
                bundleIdentifier: this.project.ios.bundle,
                developerId: this.project.ios.developerId,
                certPassword: this.project.ios.certPassword
            }
        };
        console.log("this.project", this.project);
        ctrl.showLoader = true;
        $("#configs").ajaxForm({
            dataType: "json",
            url: this._AppConstants.API + '/project/' + this.projectId + '/build/ios',
            headers: {
                "x-access-token": this._JWT.get()
            },
            data: {
                project: angular.toJson(project)
            },
            success: function (data) {
                ctrl.modals.password = false;
                ctrl._$scope.configs.displayName.focused = false;
                ctrl._$scope.configs.version.focused = false;
                ctrl._$scope.configs.bundle.focused = false;
                ctrl._$scope.configs.developerId.focused = false;
                ctrl.getProject();
                ctrl.Notification.success('iOS build start');
                ctrl._$scope.$apply();
            },
            error: function (data) {
                console.log(data);
                ctrl.showLoader = false;
            }
        }).submit();
    };

    cancelBuild(e) {
        const ctrl = this;
        e.preventDefault();
        let project = {
            userId: this.user.username,
            appId: this.projectId,
        };
        console.log("this.project", this.project);
        ctrl.showLoader = true;
        $("#configs").ajaxForm({
            dataType: "json",
            type: 'DELETE',
            url: this._AppConstants.API + '/project/' + this.projectId + '/build/ios',
            headers: {
                "x-access-token": this._JWT.get()
            },
            data: {
                project: angular.toJson(project)
            },
            success: function (data) {
                ctrl.getProject();
                ctrl.showLoader = false;
                ctrl._$scope.$apply();
            },
            error: function (data) {
                ctrl.showLoader = false;
                ctrl._$scope.$apply();
            }
        }).submit();
    };

    open(e) {
        this.modals.password = true;
        this.openEvent = e;
    }

    download() {
        this.showLoader = true;
        this.Project.download(this.projectId, 'ios').then(
            data => {
                this.showLoader = false;
                window.location = data.downloadUrl;
            },
            err => {
                this.showLoader = false;
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
            }
        )
    }
}

export default EditProjectIosCtrl;
