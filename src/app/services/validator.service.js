/**
 * Created by kh.levon98 on 15-Sep-16.
 */

function Validator(AppConstants, $log) {
    'ngInject';

    const ERRORCODES = AppConstants.ERRORCODES;

    Factory.checkVersion = (_old = '0.0.0', _new = '0.0.0') => {
        _old = _old.split('.').map(i => parseInt(i));
        _new = _new.split('.').map(i => parseInt(i));

        for (let i = 0; i < _old.length; i++) {
            if (_new[i] === _old[i])
                continue;
            return _new[i] > _old[i];
        }

        return false;
    };

    return Factory;

    function Factory() {
        const self = this;

        let isValidData;
        let validData;
        let errors = [];
        let defaultCode = 327;


        self.validate = validate;
        self.isValid = isValid;
        self.getErrors = getErrors;
        self.getData = getData;


        self.validateHTTP = validateHTTP;
        self.isValidHTTP = isValidHTTP;
        self.getErrorsHTTP = getErrorsHTTP;
        self.getDataHTTP = getDataHTTP;


        ////////////////

        /// Local data validate functions

        /**
         * @description
         * Analysis data. Generate errors if data is not valid.
         * @param data {Object}
         * @return {Boolean}
         * */
        function validate(data) {
            // reset data information
            errors.splice(0, errors.length);
            isValidData = false;
            validData = {};
            if (!_.isArray(data)) {
                $log.error('Please check sent data.');
                return false;
            }

            let length = data.length;

            for (let i = 0; i < length; ++i) {
                let field = data[i];

                // check is required field
                if (_.isObject(field) && _.isObject(field.conditions)) {
                    if (_.isEmpty(field.conditions) && field.value !== undefined) {
                        const fields = field.name.split('.');

                        let tmp = validData;
                        for (let i = 0; i < fields.length - 1; i++) {
                            const field = fields[i];
                            if (!tmp.hasOwnProperty(field)) {
                                tmp[field] = {};
                            }
                            tmp = tmp[field];
                        }
                        let ln = fields.length;
                        tmp[fields[ln - 1]] = field.value;
                    } else {
                        for (let j in field.conditions) {
                            if (isValidField(j, field.conditions[j], field.value, data) && field.value !== undefined) {
                                const fields = field.name.split('.');

                                let tmp = validData;
                                for (let i = 0; i < fields.length - 1; i++) {
                                    const field = fields[i];
                                    if (!tmp.hasOwnProperty(field)) {
                                        tmp[field] = {};
                                    }
                                    tmp = tmp[field];
                                }
                                let ln = fields.length;
                                tmp[fields[ln - 1]] = field.value;
                            } else {
                                errors.push({
                                    fieldName: field.name,
                                    error: j /// TODO by Lyov: assign correct error message
                                })
                            }
                        }
                    }
                } else {
                    $log.error('Please check sent data.');
                    return false;
                }
            }
            isValidData = !errors.length;
        }

        /**
         * @description
         * Is valid latest validated data.
         * @return {Boolean}
         * */
        function isValid() {
            return isValidData;
        }

        /**
         * @description
         * Latest validated data errors.
         * @return {Array}
         * */
        function getErrors() {
            return errors;
        }

        /**
         * @description
         * Latest validated data.
         * @return {Object}
         * */
        function getData() {
            return validData;
        }

        /// HTTP data validate functions

        /**
         * @description
         * Analysis data. Generate errors if data is not valid.
         * @param data {Object}
         * @return {Boolean}
         * */
        function validateHTTP(data) {
            // reset data information
            errors.splice(0, errors.length);
            isValidData = false;
            validData = null;
            let error;
            // validate data
            if (data.success) {
                isValidData = true;
                validData = data.data;
            } else {
                // error analysis
                let backErrors = data.error;
                if (backErrors) {
                    error = ERRORCODES[backErrors.status];
                    errors.push({
                        fieldName: error.field || backErrors.message,
                        code: backErrors.status,
                        error: error.message
                    })
                } else {
                    error = ERRORCODES[defaultCode];
                    errors.push({
                        fieldName: error.field,
                        code: defaultCode,
                        error: error.message
                    })
                }
            }
        }

        /**
         * @description
         * Is valid latest validated data.
         * @return {Boolean}
         * */
        function isValidHTTP() {
            return isValidData;
        }

        /**
         * @description
         * Latest validated data errors.
         * @return {Array}
         * */
        function getErrorsHTTP() {
            console.log(errors);
            return errors;
        }

        /**
         * @description
         * Latest validated data.
         * @return {Object}
         * */
        function getDataHTTP() {
            return validData;
        }


        /// Private functions
        /**
         * @description
         * Check field validity.
         * @param type {String}
         * @param value {Any}
         * @param field {Any}
         * @param allFields {Array}
         * */
        function isValidField(type, value, field, allFields) {
            let comparedField;
            switch (type) {
                case 'required':
                    return (field && field.toString().trim() != "");
                    break;
                case 'minLength':
                    return (field && field.toString().trim().length >= value);
                    break;
                case 'maxLength':
                    return (field && field.toString().trim().length <= value);
                    break;
                case 'min':
                    return (field && _.isNumber(parseFloat(field)) && parseFloat(field) >= value);
                    break;
                case 'max':
                    return (field && _.isNumber(parseFloat(field)) && parseFloat(field) <= value);
                    break;
                case 'equalTo':
                    comparedField = allFields.filter(function (obj) {
                        return obj.name == value;
                    })[0].value;
                    return (field == comparedField);
                    break;
                case 'notEqualTo':
                    comparedField = allFields.filter(function (obj) {
                        return obj.name == value;
                    })[0].value;
                    return !(field == comparedField);
                    break;
                case 'pattern':
                    return (new RegExp(value)).test(field);
                    break;
                default:
                    $log.warn('\`' + type + '\` type is not existing.');
                    break;
            }
            return true;
        }
    }
}


export default Validator;