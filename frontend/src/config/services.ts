import { environment } from '@environments/environment';

const PRODUCTION = false; // TRUE: PRODUCTION ENVIRONMENT, FALSE: DEVELOPMENT ENVIRONMENT
const HOST = PRODUCTION ? 'http://54.169.53.162:8080' : 'http://54.255.192.219:8080';
const SEC_HOST = HOST + '/rest'; // SECURED RESTPOINTS

const prod_services = {
    'auth': HOST + '/authenticate',
    'user': SEC_HOST + '/users/display-user',
    'change-password': SEC_HOST + '/users/change-password',
    'window-status': SEC_HOST + '/admin-settings/display/window-status',
    'forgot-password': HOST + '/authenticate/forgot-password',
    'reset-password': HOST + '/authenticate/reset-password',
    'admin': {
        'notification': {
            'websocket': HOST + '/websocket-connection/',
            'topic': '/client/notifications'
        },
        'dashboard': {
            'display-dashboard': SEC_HOST + '/admin-settings/display-all',
            'display-requests': SEC_HOST + '/request/display-all',
            'change-window-status': SEC_HOST + '/admin-settings/update/window-status',
            'update-closing-date': SEC_HOST + '/admin-settings/update/closing-date',
            'update-multiplier': SEC_HOST + '/admin-settings/update/multiplier-rate',
            'update-decay': SEC_HOST + '/admin-settings/update/decay-rate'
        },
        'inventory':{
            'display-inventory': SEC_HOST + '/inventory/display-all',
            'create-inventory': SEC_HOST + '/inventory/create-item',
            'reset-inventory': SEC_HOST + '/inventory/reset-all',
            'update-inventory': SEC_HOST + '/inventory/update-item',
            'packing-status': SEC_HOST + '/packing/review-statuses'
        },
        'allocation': {
            'display-allocations': SEC_HOST + '/allocation/display-all',
            'update-allocation': SEC_HOST + '/allocation/update-allocation',
            'generate-list': SEC_HOST + '/packing/generate-list',
            'approve-allocations': SEC_HOST + '/allocation/approve-allocations',
            'get-approval-status': SEC_HOST + '/allocation/approval-status'
        },
        'packinglist': {
            'display-packing-list': SEC_HOST + '/packing/display/in-window',
            'update-packing-item': SEC_HOST + '/packing/update-by-item',
            'del-packing-item':''
        },
        'accounts': {
            'display-accounts': SEC_HOST + '/users/display-all',
            'display-beneficiary': SEC_HOST + '/beneficiary/get-details',
            'create-account': SEC_HOST + '/users/insert-user',
            'create-beneficiary': SEC_HOST + '/beneficiary/insert-beneficiary',
            'update-account': SEC_HOST + '/users/update-user',
            'update-beneficiary': SEC_HOST + '/beneficiary/update-beneficiary',
            'delete-account': SEC_HOST + '/users/delete-user',
            'reset-password': SEC_HOST + '/admin-settings/reset-password'
        },
        'donor': {
            'display-donor-list': SEC_HOST + '/donor/display-donors',
            'get-donor-history': SEC_HOST + '/donor/retrieve-np-donations'
        },
        'reports': {
            'display-invoice-numbers': SEC_HOST + '/reports/display-all',
            'get-invoice': SEC_HOST + '/reports/display',
            'retrieve-invoice': SEC_HOST + '/reports/retrieve-invoice',
            'generate-invoice': SEC_HOST + '/reports/generate-invoice'
        },
        'system': {
            'websocket': HOST + '/websocket-connection/',
            'topic': '/client/heartbeat-results',
            'listener': '/app/server/heartbeat-query'
        }
    },
    'volunteer': {
        'home' : {
            'qna-list': './../../assets/mock/volunteer/qna.json'
        },
        'stocktaking': {
            'display-inventory': SEC_HOST + '/inventory/display-all',
            'get-item': SEC_HOST + '/inventory/scanner',
            'get-donors': SEC_HOST + '/donor/display-donors',
            'add-item': SEC_HOST + '/inventory/update-item-quantity'
        },
        'packinglist': {
            'display-list': SEC_HOST + '/packing/display/in-window',
            'submit-packed': SEC_HOST + '/packing/update-list',
            'websocket': HOST + '/websocket-connection/',
            'topic':'/client/packing/',
            'listener':'/app/server/packing/'
        }
    },
    'beneficiary': {
        'home': {
            'curr-win-req': SEC_HOST + '/request/display',
            'curr-alloc': SEC_HOST + '/allocation/display-allocations',
            'update-request': SEC_HOST + '/request/create-request',
            'delete-request': SEC_HOST + '/request/delete-request',
            'display-req-hist': SEC_HOST + '/history/requests/display',
            'get-approval-status': SEC_HOST + '/allocation/approval-status',
            'similar-items': SEC_HOST + '/history/make-request'
        },
        'request': {
            'display-inventory': SEC_HOST + '/inventory/display-all',
            'solo-create-request': SEC_HOST + '/request/create-request'
        }
    }
};

const dev_services = {
    'user':'./../../assets/mock/get-user.json',
    'window-status': './../../assets/mock/get-window-status.json',
    'change-password':'./../../assets/mock/change-password.json',
    'forgot-password': './../../assets/mock/reset-password.json',
    'reset-password': './../../assets/mock/reset-password.json',
    'admin': {
        'notification': {
            'websocket': HOST + '/websocket-connection',
            'topic': HOST + '/client/notifications'
        },
        'dashboard': {
            'display-dashboard':'./../../assets/mock/admin/get-dashboard.json',
            'display-requests':'./../../assets/mock/admin/get-requests.json',
            'change-window-status':'./../../assets/mock/admin/change-window-status.json',
            'update-opening-date':'./../../assets/mock/admin/update-opening-date.json',
            'update-closing-date':'./../../assets/mock/admin/update-closing-date.json',
            'update-multiplier':'./../../assets/mock/admin/update-multiplier.json',
            'update-decay':'./../../assets/mock/admin/update-decay.json'
        },
        'inventory': {
            'display-inventory':'./../../assets/mock/get-inventory.json',
            'create-inventory':'./../../assets/mock/admin/create-inventory.json',
            'reset-inventory':'./../../assets/mock/admin/reset-inventory.json',
            'update-inventory':'./../../assets/mock/admin/update-inventory.json',
            'packing-status':'./../../assets/mock/admin/packing-status.json'
        },
        'allocation': {
            'display-allocations':'./../../assets/mock/admin/display-allocations.json',
            'update-allocation':'./../../assets/mock/admin/update-allocation.json',
            'generate-list':'./../../assets/mock/admin/generate-packing-list.json',
            'approve-allocations':'./../../assets/mock/admin/approve-allocations.json',
            'get-approval-status':'./../../assets/mock/admin/get-approval-status.json'
        },
        'packinglist': {
            'display-packing-list':'./../../assets/mock/admin/display-packing-list.json',
            'update-packing-item':'./../../assets/mock/admin/update-packing-item.json',
            'del-packing-item':'./../../assets/mock/admin/del-packing-item.json'
        },
        'accounts': {
            'display-accounts':'./../../assets/mock/admin/accounts.json',
            'display-beneficiary':'./../../assets/mock/admin/display-beneficiary.json',
            'create-account':'./../../assets/mock/admin/create-account.json',
            'create-beneficiary':'./../../assets/mock/admin/create-beneficiary.json',
            'update-account':'./../../assets/mock/admin/update-account.json',
            'update-beneficiary':'./../../assets/mock/admin/update-beneficiary.json',
            'delete-account':'./../../assets/mock/admin/delete-account.json',
            'reset-password':'./../../assets/mock/admin/reset-password.json'
        },
        'donor': {
            'display-history': './../../assets/mock/admin/display-donor-history.json'
        },
        'reports': {
            'retrieve-invoice':'./../../assets/mock/admin/FBDO-2017-12-6204.pdf',
            'display-invoice-numbers':'./../../assets/mock/admin/display-invoice-numbers.json',
            'get-invoice':'./../../assets/mock/admin/get-invoice.json',
            'generate-invoice':'./../../assets/mock/admin/generate-invoice.json'
        },
        'system': {
            'websocket': '',
            'topic': '',
            'listener': ''
        }
    },
    'volunteer': {
        'home' : {
            'qna-list' : './../../assets/mock/volunteer/qna.json'
        },
        'stocktaking': {
            'display-inventory':'./../../assets/mock/get-inventory.json',
            'get-item':'./../../assets/mock/volunteer/get-item.json',
            'get-donors':'./../../assets/mock/volunteer/get-donors.json',
            'add-item' : './../../assets/mock/volunteer/submit-form.json'
        },
        'packinglist': {
            'display-list': './../../assets/mock/volunteer/display-packing-list.json',
            'submit-packed':'./../../assets/mock/volunteer/submit-packed.json',
            'websocket':'',
            'topic':'',
            'listener':''
        }
    },
    'beneficiary': {
        'home': {
            'curr-win-req':'./../../assets/mock/beneficiary/curr-win-req.json',
            'curr-alloc':'./../../assets/mock/beneficiary/curr-alloc.json',
            'update-request':'./../../assets/mock/beneficiary/update-request.json',
            'delete-request':'./../../assets/mock/beneficiary/delete-request.json',
            'display-req-hist':'./../../assets/mock/beneficiary/display-req-hist.json',
            'get-approval-status':'./../../assets/mock/beneficiary/get-approval-status.json',
            'similar-items': './../../assets/mock/beneficiary/similar-items.json'
        },
        'request': {
            'display-inventory':'./../../assets/mock/get-inventory.json',
            'solo-create-request':'./../../assets/mock/beneficiary/solo-add.json'
        }
    }
};

// TOGGLE BETWEEN LOCAL FILES AND AWS SERVERS ( DEVELOPMENT / PRODUCTION )
const services = environment.production ? prod_services : dev_services;

export default services;
