class StoreCtrl {
    constructor($scope, AppConstants, ModulesService, ModulesStore, ProjectStore, EventBus, Notification, User, $uibModal) {
        'ngInject';
        this._AppConstants = AppConstants;
        this._ModulesService = ModulesService;
        this._ModulesStore = ModulesStore;
        this._ProjectStore = ProjectStore;
        this._Notification = Notification;
        this._User = User;
        this._EventBus = EventBus;
        this._$scope = $scope;
        this._$uibModal = $uibModal;
        this.onError = this.onError.bind(this);
        this.moduleSubscribe = this.moduleSubscribe.bind(this);
        this._ModulesStore.subscribeAndInit($scope, () => {
            this.modulesList = this._ModulesStore.getModules();
            this.myModules = this._ModulesStore.getMyModules();

            if (!this.modulesList) return this.getModulesList();

            if (this._User.current && !this.myModules) {
                return this.getMyModules();
            }

            if (this.modulesList && this.myModules) {
                this.modulesList = this._ModulesStore.handleMyModules();

            }

        });
    }

    getModulesList() {
        this._ModulesService.getList()
          .then(modules => this._EventBus.emit(this._EventBus.modules.SET, modules))
          .catch(err => this.onError(err));
    }

    getMyModules() {
        this._ModulesService.getMyModules()
            .then(modules => this._EventBus.emit(this._EventBus.modules.MYMODULESSET, modules))
            .catch(err => this.onError(err));
    }

    moduleSubscribe(module) {
        if (!this._User.current) {
            return this.onError([{ fieldName: 'You should logged in to purchase module' }]);
        }

        this.modalTitle = module.subscribed && !module.unsubscribed ? 'Unsubscribe'  : 'Subscribe';
        this.modalContent = module.subscribed && !module.unsubscribed ?  'Are you sure you want to unsubscribe... ?' : module.description;
        this.activateSubscribeButton = module.subscribed && !module.unsubscribed ? false : true;

        this.module = module;
        this.modalInstance = this._$uibModal.open({
            animation: this.animationsEnabled,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'pages/store/subscribeModal.html',
            controller: StoreCtrl,
            controllerAs: 'vm',
            bindToController: true,
            scope: this._$scope,
            resolve: {},
        });
    }

    purchaseModule(module) {
        this._ModulesService.subscribe({ moduleId: module._id })
            .then(subscribedModule =>  {
                this._Notification.success('Module Subscribed');
                module.subscribed = true;
                module.unsubscribed = false;
                this._EventBus.emit(this._EventBus.modules.UPDATE, module);
                this.modalInstance.close();
            })
            .catch(err => this.onError(err));
    }

    unsubscribeModule(module) {
        this._ModulesService.unsubscribe({ moduleId: module._id })
            .then(unsubscribedModule =>  {
                this._Notification.success('Module Unsubscribed');
                this.modalInstance.close();
                module.unsubscribed = true;
                this._EventBus.emit(this._EventBus.modules.UPDATE, module);
            })
            .catch(err => this.onError(err));
    }

    onError(err) {
        _.each(err, (val)=> {
            this._Notification.error(val.fieldName);
        });
    }
}
export default StoreCtrl;
