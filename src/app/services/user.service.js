/**
 * Created by kh.levon98 on 20-Sep-16.
 */
class User {
	constructor(JWT, AppConstants, Restangular, Validator, $state, $q) {
		'ngInject';

		this._JWT = JWT;
		this._AppConstants = AppConstants;

		this._User = Restangular.all('user');
		this._Auth = Restangular.all('auth');
		this._$state = $state;
		this._$q = $q;
		this._Validator = new Validator();

		this.current = null;
		this._inProgress = false;

	}

	login(fields = {}) {
		let deferred = this._$q.defer();
		this._Auth.all("login").post(fields).then((result) => {
			this._Validator.validateHTTP(result);
			if (this._Validator.isValidHTTP()) {
				let response = this._Validator.getDataHTTP();
				/// set auth token
				this._JWT.save(response.token);
				this.current = response.user;

				deferred.resolve(response);
			} else {
				deferred.reject(this._Validator.getErrorsHTTP());
			}
		}, (result) => {
			this._Validator.validateHTTP(result.data);

			deferred.reject(this._Validator.getErrorsHTTP());
		});

		return deferred.promise;
	}

	signUp(fields = {}) {
		return this.create(fields).then((res)=> {
			this._JWT.save(res.token);
			this.current = res.user;

			return res;
		}, err=> {
			return err;
		})
	}

	update(userId = null, fields = {}) {
		let deferred = this._$q.defer();

		this._User.one(fields.username).customPUT(fields).then((result) => {
			this._Validator.validateHTTP(result);
			if (this._Validator.isValidHTTP()) {
				let response = this._Validator.getDataHTTP();
				deferred.resolve(response);
			} else {
				deferred.reject(this._Validator.getErrorsHTTP());
			}
		}, (result) => {
			this._Validator.validateHTTP(result.data);
			deferred.reject(this._Validator.getErrorsHTTP());
		});

		return deferred.promise;
	}

	updatePassword(fields = {}) {
		let deferred = this._$q.defer();

		this._User.one('password').customPUT(fields).then((result) => {
			this._Validator.validateHTTP(result);
			if (this._Validator.isValidHTTP()) {
				let response = this._Validator.getDataHTTP();
				deferred.resolve(response);
			} else {
				deferred.reject(this._Validator.getErrorsHTTP());
			}
		}, (result) => {
			this._Validator.validateHTTP(result.data);
			deferred.reject(this._Validator.getErrorsHTTP());
		});

		return deferred.promise;
	}

	create(fields = {}) {
		let deferred = this._$q.defer();

		this._User.post(fields).then((result) => {
			this._Validator.validateHTTP(result);
			if (this._Validator.isValidHTTP()) {
				let response = this._Validator.getDataHTTP();
				deferred.resolve(response);
			} else {
				deferred.reject(this._Validator.getErrorsHTTP());
			}
		}, (result) => {
			this._Validator.validateHTTP(result.data);

			deferred.reject(this._Validator.getErrorsHTTP());
		});

		return deferred.promise;
	}

	logout() {
		this.current = null;
		this._JWT.destroy();
		this._$state.go(this._$state.$current, null, {reload: true});
	}

	verifyAuth() {
		let deferred = this._$q.defer();
		// check for JWT token
		if (!this._JWT.get()) {
			deferred.resolve(false);
			return deferred.promise;
		}

		if (this.current) {
			deferred.resolve(true);
		} else {
			this._User.one("me").get().then((res) => {
				this.current = res.data;
				deferred.resolve(true);
			}, (err) => {
				this._JWT.destroy();
				deferred.resolve(false);
			});
		}
		return deferred.promise;
	}


	ensureAuthIs(bool = false) {
		let deferred = this._$q.defer();
		this.verifyAuth().then((authValid) => {
			if (authValid !== bool) {
				this._$state.go('landing.login');
				deferred.resolve(false);
			} else {
				deferred.resolve(true);
			}

		});

		return deferred.promise;
	}

}

export default User;