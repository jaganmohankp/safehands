import Globals from '@config/globals';

export default class DataUtil {

    /* HTTP RESPONSE WRAPPER */
    static processResponse (response: any, successCallback: any, errorCallback: any = null) {
        if (response) {
            Globals.print(response.message);
            if (response.status === Globals.SUCCESS) {
                successCallback(response.result);
            } else if (response.status === Globals.FAIL) {
                Globals.print(Globals.FAIL);
                if (errorCallback) errorCallback();
            } else {
                Globals.print(Globals.INVALID_STATUS);
            }
        } else {
            Globals.print(Globals.NO_RESPONSE);
        }
    }

    /* ITEM EQUALITY COMPARATOR */
    static compareItem (item1: any, item2: any) {
        return (
            item1.category === item2.category &&
            item1.classification === item2.classification &&
            item1.description === item2.description
        );
    }

    /* GENERATE KEY STRING BASED ON CATEGORY, CLASSIFICATION AND DESCRIPTION */
    static keygen (item: any) {
        return item.category + '|' + item.classification + '|' + item.description;
    }

    /* CHECK IF OBJECT IS NULL OR UNDEFINED */
    static isNone (object: any) {
        return object === null || object === undefined;
    }

    /* CHECK IF OBJECT IS NOT NULL AND NOT UNDEFINED */
    static exists (object: any) {
        return object !== null && object !== undefined;
    }

    /* CHECK IF OBJECT IS EMPTY STRING */
    static isEmptyString (value: string) {
        return value === '';
    }

    /* CHECK IF OBJECT IS NOT EMPTY STRING */
    static notEmptyString (value: string) {
        return value !== '';
    }

    /* CATEGORY, CLASSIFICATION AND DESCRIPTION COMPARATOR */
    static sortInventory (a: any, b: any) {
        if (a.category < b.category) return -1;
        if (a.category > b.category) return 1;
        if (a.classification < b.classification) return -1;
        if (a.classification > b.classification) return 1;
        let a_desc = a.description.split('-');
        let b_desc = b.description.split('-');
        let a_halal = a_desc[2];
        let b_halal = b_desc[2];
        if (!a_halal && b_halal) return -1;
        if (a_halal && !b_halal) return 1;
        let a_title = a_desc[0];
        let b_title = b_desc[0];
        if (a_title < b_title) return -1;
        if (a_title > b_title) return 1;
        let regex = /[a-zA-Z]/;
        let a_weight = a_desc[1];
        let b_weight = b_desc[1];
        let a_match = regex.exec(a_weight).index;
        let b_match = regex.exec(b_weight).index;
        let a_unit = a_weight.substring(a_match);
        let b_unit = b_weight.substring(b_match);
        let units = ['g', 'kg', 'ml', 'l'];
        let a_index = units.indexOf(a_unit);
        let b_index = units.indexOf(b_unit);
        if (a_index < b_index) return -1;
        if (a_index > b_index) return 1;
        let a_num = Number(a_weight.substring(0, a_match));
        let b_num = Number(b_weight.substring(0, b_match));
        if (a_num >= 50 && b_num < 50) return -1;
        if (a_num < 50 && b_num >= 50) return 1;
        return a_num - b_num;
    }

    /* DESCRIPTION ONLY COMPARATOR */
    static sortDescription (a: any, b: any) {
        let a_desc = a.description.split('-');
        let b_desc = b.description.split('-');
        let a_halal = a_desc[2];
        let b_halal = b_desc[2];
        if (!a_halal && b_halal) return -1;
        if (a_halal && !b_halal) return 1;
        let a_title = a_desc[0].toLowerCase();
        let b_title = b_desc[0].toLowerCase();
        if (a_title < b_title) return -1;
        if (a_title > b_title) return 1;
        let regex = /[a-zA-Z]/;
        let a_weight = a_desc[1];
        let b_weight = b_desc[1];
        let a_match = regex.exec(a_weight).index;
        let b_match = regex.exec(b_weight).index;
        let a_unit = a_weight.substring(a_match);
        let b_unit = b_weight.substring(b_match);
        let units = ['g', 'kg', 'ml', 'l'];
        let a_index = units.indexOf(a_unit);
        let b_index = units.indexOf(b_unit);
        if (a_index < b_index) return -1;
        if (a_index > b_index) return 1;
        let a_num = Number(a_weight.substring(0, a_match));
        let b_num = Number(b_weight.substring(0, b_match));
        if (a_num >= 50 && b_num < 50) return -1;
        if (a_num < 50 && b_num >= 50) return 1;
        return a_num - b_num;
    }

}
