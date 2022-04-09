const Globals = {

    /* VARIABLES */
    ACTIVE: 'ACTIVE',
    ADMIN: 'admin',
    ADMINISTRATOR: 'administrator',
    ALL: 'All',
    AUTHORIZATION: 'Authorization',
    BENEFICIARY: 'beneficiary',
    CATEGORY: 'category',
    CONFIRM: 'confirm',
    CLASSIFICATION: 'classification',
    CURRENT_WINDOW_ALLOCATION: 'Current Window Allocation',
    CURRENT_WINDOW_REQUEST:'Current Window Request',
    DASHBOARD: 'dashboard',
    DECODERS: [
        'code_128_reader',
        'ean_reader',
        'ean_8_reader',
        'code_39_reader',
        'code_39_vin_reader',
        'codabar_reader',
        'upc_reader',
        'upc_e_reader',
        'i2of5_reader'
    ],
    DELIVERY: 'delivery',
    DESCRIPTION: 'description',
    DONOR: 'donor',
    FAIL: 'FAIL',
    HALAL: 'halal',
    HISTORY: 'history',
    HOME: 'home',
    INVALID_DATE: 'Invalid Date',
    INVALID_STATUS: 'INVALID STATUS',
    INVOICE: 'invoice',
    MEASUREMENT: 'measurement',
    MONTH: 'month',
    MONTH_ENUM: {
        '01': 'January',
        '02': 'February',
        '03': 'March',
        '04': 'April',
        '05': 'May',
        '06': 'June',
        '07': 'July',
        '08': 'August',
        '09': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    },
    NO: 'No',
    NON_HALAL: 'non-halal',
    NO_RESPONSE: 'NO RESPONSE RECEIVED',
    OTHERS: 'Others',
    PACKING_LIST: 'packinglist',
    REQUEST: 'request',
    REQUEST_HISTORY: 'Request History',
    RETRY: 'retry',
    SCAN: 'scan',
    SELF_COLLECT: 'self_collect',
    SESSION_STORAGE: 'fb-session',
    SUCCESS: 'SUCCESS',
    TOTAL: 'total',
    UNIT: 'unit',
    UNITS: {
        GRAM: 'g',
        KILOGRAM: 'kg',
        MILLILITRE: 'ml',
        LITRE: 'l'
    },
    VERBOSE: true,
    VOLUNTEER: 'volunteer',
    YES: 'Yes',

    /* METHODS */
    print: (statement: any) => { if (Globals.VERBOSE) console.log(statement) }

}

export default Globals;
