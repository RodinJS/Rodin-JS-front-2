import footer from '../home/scripts/components/footer';

class PageCtrl {
    constructor(AppConstants, $scope, $state, $stateParams,  EventBus, PagesService, PagesStore, $window, $anchorScroll, $location) {
        'ngInject';

        $window.scrollTo(0, 0);
        this.pageURL = $stateParams.pageURL;

        this._$state = $state;
        this._$stateParams = $stateParams;
        this._EventBus = EventBus;
        this._PagesService = PagesService;
        this._PagesStore = PagesStore;

        //console.log(this.pageURL);

        if (!this.pageURL) return this.onFailedPage();
        this.getPageContent();
	    $scope.$on('$viewContentLoaded', () => {
		    $(document).ready(()=> {
			    footer.init();
		    });
	    });

        /* this._PagesStore.subscribeAndInit($scope, () => {
             this.pagesList = this._PagesStore.getPagesList();
             if (this.pagesList.length > 0) {
                 if (!_.find(this.pagesList, (page)=> page.slug === this.pageURL)) {
                     return this.onFailedPage();
                 }

                 this.page = this._PagesStore.getPage(this.pageURL);
                 console.log(this.page);
                 if (!this.page) return this.getPageContent();
             }
         });*/
    }

    getPageContent() {
        this._PagesService.get(this.pageURL).then(
            page => {
                this.page = page;
                //this._EventBus.emit(this._EventBus.pages.SET_CONTENT, page);
            },

            err => {
                this.onFailedPage();
            }
        );
    }

    onFailedPage() {
        return this._$state.go('landing.error');
    }
	gotoAnchor = function(x) {
		var newHash = 'anchor' + x;
		if ($location.hash() !== newHash) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			$location.hash('anchor' + x);
		} else {
			// call $anchorScroll() explicitly,
			// since $location.hash hasn't changed
			$anchorScroll();
		}
	};


}
export default PageCtrl;
