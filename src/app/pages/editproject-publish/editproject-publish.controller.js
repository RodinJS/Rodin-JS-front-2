class EditProjectPublishCtrl {
    constructor(AppConstants, Project, $state, $stateParams, $q, $scope, User, JWT, EventBus, ProjectStore, moment, Notification) {
        'ngInject';

        this.Notification = Notification;
        this._moment = moment;
        this.appName = AppConstants.appName;
        this.domain = AppConstants.SITE;
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

        this.modals =  {
            updateVersion: false,
            rollBack:false,
            unpublish: false
        };

        this.eventBus = EventBus;
        ProjectStore.subscribeAndInit($scope, () => {
            this.project = ProjectStore.getProject();
            if(!this.project){
                this.getProject();
            }
            else {
                this.finaliseRequest();
            }
        });
    }

    getProject() {
        this.showLoader = true;
        this.Project.get(this.projectId).then(
            project => {
                this.eventBus.emit(this.eventBus.project.SET, project);
                this.finaliseRequest();
            },
            err => {
                this.showLoader = false;
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
            }
        );
    }

    getRollBackData(){
        this.Project.getPublishedHistory(this.projectId).then(
            data => {
                this.rollbackDates = _.map(data, (date)=>{
                    return {formated:this._moment.unix(parseInt(date)/1000).format('YYYY-MM-DD HH:mm:ss'), origin:date}
                });
                this.modals.rollBack = true;
            },
            err => {
                this.showLoader = false;
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
            }
        )
    }

    rollback(){
        if(!this.rollBackDate) return;
        this.Project.rollBack(this.projectId, {date:this.rollBackDate}).then(
            data => {
                this.Notification.success(`Project rolled back to ${this._moment.unix(parseInt(this.rollBackDate)/1000).format('YYYY-MM-DD HH:mm:ss')}`);
                this.modals.rollBack = false;
            },
            err => {
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
            }
        )
    }

    finaliseRequest() {
        this.project.publishedUrl = `${this._AppConstants.PUBLISH}/${this.user.username}/${this.project.name}`;
        this.showLoader = false;
    }

    publish() {
        this.modals.updateVersion = false;
        this.showLoader = true;
        this.Project.publish(this.projectId).then(
            data => {
                console.log(data);
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

    update() {
        this.modals.updateVersion = false;
        this.showLoader = true;
        this.Project.updatePublish(this.projectId).then(
            data => {
                this.Notification.success('Project updated');
                this.getProject();
            },
            err => {
                this.showLoader = false;
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
            }
        )
    }

    unpublish() {
        this.Project.unPublish(this.projectId).then(
            data => {
                this.Notification.success('Project unpublished');
                this.eventBus.emit(this.eventBus.project.SET, data);
            },
            err => {
                _.each(err, (val, key)=>{
                    this.Notification.error(val.fieldName);
                });
                this.showLoader = false;
            }
        );
        this.modals.unpublish = false;

    }
}

export default EditProjectPublishCtrl;
