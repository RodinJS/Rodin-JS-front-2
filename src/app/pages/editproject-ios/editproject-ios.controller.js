class EditProjectIosCtrl {
    constructor(AppConstants, Project, $state, $stateParams, $q, $scope, User, JWT, EventBus, ProjectStore, Validator, Notification, $interval) {
        'ngInject';

        if (!$stateParams.projectId) return $state.go('landing.error');

        this.Notification = Notification;
        this.appName = AppConstants.appName;
        this._AppConstants = AppConstants;
        this._JWT = JWT;
        this._$interval = $interval;
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
            p12: false,
        };

        this.files = {
            profile: {
                name: '',
            },
            cert: {
                name: '',
            },
            icon: {
                name: '',
                src: '',
            },
        };

        this.modals = {
            password: false,
        };

        this.submiting = false;
        this.openEvent = null;

        // const self = this;
        this.eventBus = EventBus;
        this.project = false;

        this.getProject();
        ProjectStore.subscribeAndInit($scope, () => {
            this.project = ProjectStore.getProject();

            //temprary fix for RO-859
            angular.forEach(angular.element('input'), (val, key) => {
                angular.element(val).attr('disabled', false)
            })

            console.log('IOS', this.project);
            if (this.project &&
                this.project.fields && this.project.fields.ios &&
                (!this.project.ios || Object.keys(this.project.ios).length <= 0 ) && !this.project.build.ios.built) {
                this.project.ios = {
                    name: this.project.fields.appName,
                    version: this.project.fields.version,
                    bundle: this.project.fields.ios.bundleIdentifier,
                    developerId: this.project.fields.ios.developerId
                };
                this.projectError = this.project.fields.error;

                if (this.projectError) {
                    this.project.build.ios.requested = false;
                    this.errorText = '';//`${this._AppConstants.ERRORCODES['OTHERBUILDERROR'].message} ${this.project.fields.buildId}`;

                    if (this.timer) {
                        this._$interval.cancel(this.timer);
                    }
                    angular.forEach(angular.element('input'), (val, key) => {
                        angular.element(val).attr('disabled', false)
                    })

                }
                else{
                    angular.forEach(angular.element('input'), (val, key) => {
                        angular.element(val).attr('disabled', true)
                    })
                }

            }
        });
        $scope.$on('$destroy', () => {
            if (this.timer) {
                this._$interval.cancel(this.timer);
            }
        })
    }

    getProject() {
        this.showLoader = true;
        this.Project.get(this.projectId, {device: 'ios'}).then(
            project => {
                this.showLoader = false;
                this.eventBus.emit(this.eventBus.project.SET, project);


                if (this.project && this.project.build.ios.built && this.timer) {
                    this._$interval.cancel(this.timer);
                }
            },

            err => {
                _.each(err, (val, key) => {
                    this.Notification.error(val.fieldName);
                });
                if(this.timer) {
                    this._$interval.cancel(this.timer);
                }
                this.showLoader = false;
                //this.$state.go('landing.error');
            }
        );
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
                _.each(err, (val, key) => {
                    this.Notification.error(val.fieldName);
                });
            }
        );
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
            message: '',
        };

        if (file.size > 1024 * 1024) {
            result.valid = false;
            result.message = 'FIle size must be less than 1mb';
            var tim = $timeout(function () {
                defer.reject(result);
                $timeout.cancel(tim);
            });
        } else {
            var fileReader = new FileReader();
            fileReader.onloadend = function (e) {
                var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
                var header = '';
                for (var i = 0; i < arr.length; i++) {
                    header += arr[i].toString(16);
                }

                switch (header) {
                    case '89504e47':
                        break;
                    default:
                        result.valid = false;
                        result.message = 'Allowed only .jpg .jpeg and .png file types.';
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
            // console.log("--------- Cert name", file.name);
            this.files.cert.name = file.name;
            this._$scope.$apply();

        } else {
            this.Notification.warning('It seems your browser doesn\'t support FileReader.');
        }
    }

    changeProfile(e) {
        if (window.FileReader && window.Blob) {
            var file = e.target.files[0];
            // console.log("--------- profile name", file.name);
            this.files.profile.name = file.name;
            this._$scope.$apply();

        } else {
            this.Notification.warning('It seems your browser doesn\'t support FileReader.');
        }
    }

    publishNbuild(e) {
        this.showLoader = true;
        this.Project.publish(this.projectId).then(
            data => {
                this.project.publishedPublic = true;
                this.open(e);
                this.modals.notPublished = false;

            },
            err => {
                this.showLoader = false;
                _.each(err, (val, key) => {
                    this.Notification.error(val.fieldName);
                });
            }
        )
    }

    build(event) {
        if (!this.project.publishedPublic) {
            return this.modals.notPublished = true;
        }
        const ctrl = this;
        event.preventDefault();
        let project = {
            userId: this.user.username,
            appId: this.projectId,
            appName: this.project.ios.name,
            version: this.project.ios.version,
            ios: {
                exportMethod: 'ad-hoc',
                bundleIdentifier: this.project.ios.bundle,
                developerId: this.project.ios.developerId,
                certPassword: this.project.ios.certPassword,
            },
        };

        ctrl.showLoader = true;
        this.modals.notPublished = false;
        
        $('#configs').ajaxForm({
            dataType: 'json',
            url: this._AppConstants.API + '/project/' + this.projectId + '/build/ios',
            headers: {
                'x-access-token': this._JWT.get(),
            },
            data: {
                project: angular.toJson(project),
            },
            success: function (data) {
                ctrl.modals.password = false;
                ctrl._$scope.configs.displayName.focused = false;
                ctrl._$scope.configs.version.focused = false;
                ctrl._$scope.configs.bundle.focused = false;
                ctrl._$scope.configs.developerId.focused = false;
                ctrl.files.icon.name = '';
                ctrl.files.icon.src = '';
                ctrl.files.cert.name = '';
                ctrl.files.profile.name = '';
                ctrl.Project.cleanInputFiles('#profile-file');
                ctrl.Project.cleanInputFiles('#cert-file');
                ctrl.Project.cleanInputFiles('#icon-file');
                ctrl.getProject();
                ctrl.Notification.success('iOS build start');
                ctrl.timer = ctrl._$interval(() => {
                    ctrl.getProject();
                }, 2000);
                ctrl._$scope.$apply();
            },

            error: function (data) {
                if (data.responseJSON && data.responseJSON.error.message)
                    ctrl.Notification.error(data.responseJSON.error.message);
                ctrl.showLoader = false;
                ctrl._$scope.$apply();
            },
        }).submit();
    };

    cancelBuild(e) {
        const ctrl = this;
        e.preventDefault();
        let project = {
            userId: this.user.username,
            appId: this.projectId,
        };

        ctrl.showLoader = true;
        $('#configs').ajaxForm({
            dataType: 'json',
            type: 'DELETE',
            url: this._AppConstants.API + '/project/' + this.projectId + '/build/ios',
            headers: {
                'x-access-token': this._JWT.get(),
            },
            data: {
                project: angular.toJson(project),
            },
            success: function (data) {
                ctrl.getProject();
                ctrl.showLoader = false;
                ctrl._$scope.$apply();
            },

            error: function (data) {
                ctrl.showLoader = false;
                ctrl._$scope.$apply();
            },
        }).submit();
    };

    open(e) {
        if (!this.project.publishedPublic) {
            return this.modals.notPublished = true;
        }
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
                _.each(err, (val, key) => {
                    this.Notification.error(val.fieldName);
                });
            }
        );
    }

    gotToPublish() {
        this.$state.go('app.editprojectPublish', {projectId: this.project._id});
    }
}

export default EditProjectIosCtrl;