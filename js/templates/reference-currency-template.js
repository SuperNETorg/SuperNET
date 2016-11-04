/*!
 * Iguana dashboard/reference currency template
 *
 */

'use_strict';

templates.registerTemplate('referenceCurrency',
'<section class="dashboard unselectable">' +
  '<nav class="navbar top unselectable navbar-inverse">' +
    '<div class="clearfix">' +
      '<div class="navbar-header">' +
        '<div class="navbar-brand">' + helper.lang('DASHBOARD.IGUANA') + '</div>' +
        '<div class="cursor-pointer lnk-logout">' + helper.lang('DASHBOARD.LOGOUT') + '</div>' +
      '</div>' +
      '<div class="top" id="top-menu">' +
        '<ul class="nav navbar-nav top-menu">' +
          '<li class="item cursor-pointer text-center" data-url="dashboard">' +
            '<div class="text">' + helper.lang('DASHBOARD.DASHBOARD') + '</div>' +
            '<div class="border"></div>' +
          '</li>' +
          '<li class="item cursor-pointer text-center active" data-url="settings">' +
            '<div class="text">' + helper.lang('DASHBOARD.SETTINGS') + '</div>' +
            '<div class="border"></div>' +
          '</li>' +
          '<li class="item cursor-pointer text-center hidden" data-url="payments">' +
            '<div class="text">' + helper.lang('DASHBOARD.PAYMENTS') + '</div>' +
            '<div class="border"></div>' +
          '</li>' +
          '<li class="item cursor-pointer text-center hidden" data-url="contacts">' +
            '<div class="text">' + helper.lang('DASHBOARD.CONTACTS') + '</div>' +
            '<div class="border"></div>' +
          '</li>' +
        '</ul>' +
        '<div class="nav-buttons">' +
          '<div class="nav-left"></div>' +
          '<div class="nav-right"></div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</nav>' +
  '<div class="container-fluid reference-currency-main">' +
    '<div class="row">' +
      '<div class="currency-content">' +
        '<div class="col-md-3 col-md-offset-1 col-sm-5 container-left">' +
          '<h3 class="choose-currency">' + helper.lang('SETTINGS.REFERENCE_CURRENCY') + ':</h3>' +
          '<h4 class="transaction-amount">' + helper.lang('SETTINGS.CHOOSE_YOUR_CURRENCY') + '</h4>' +
          '<h4 class="transaction-amount">' + helper.lang('SETTINGS.AMOUNT_OF_TRANSACTIONS') + '</h4>' +
        '</div>' +
        '<div class="col-md-7 col-sm-6 currency-parent">' +
          '<ul class="currency-loop clearfix"></ul>' +
        '</div>' +
        '<div class="clearfix"></div>' +
      '</div>' +
    '</div>' +
  '</div>' +
'</section>');