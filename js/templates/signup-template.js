/*!
 * Iguana auth/signup template
 *
 */

'use_strict';

templates.registerTemplate('signup',
'<div class="body-wrapper auth-main">' +
  '<div class="container-fluid">' +
    '<div class="row centered">' +
      '<!-- // create account form start -->' +
      '<section class="form-container create-account-form">' +
        '<header class="form-header orange-gradient box-shadow-bottom">' +
          '<i class="bi_interface-arrow-left text-shadow cursor-pointer btn-back"></i>' +
          '<div class="title text-shadow">' + helper.lang('CREATE_ACCOUNT.ADD_ACCOUNT') + '</div>' +
        '</header>' +
        '<div class="form-content">' +
          '<div class="login-add-coin-selection">' +
            '<div class="login-add-coin-selection-title offset-bottom-sm cursor-pointer">' + helper.lang('LOGIN.SELECT_A_WALLET') + '</div>' +
          '</div>' +
          '<div class="login-input-directions center offset-bottom-md unselectable passphrase-word-count">' + helper.lang('CREATE_ACCOUNT.WRITE_DOWN_THIS_P1') + '24-' + helper.lang('CREATE_ACCOUNT.WRITE_DOWN_THIS_P2') + ' <strong>' + helper.lang('CREATE_ACCOUNT.WRITE_DOWN_THIS_P3') + '</strong></div>' +
          '<div class="passphrase-container row center offset-bottom-md">' +
            '<div class="title unselectable">' + helper.lang('CREATE_ACCOUNT.COPY_PASSPHRASE') + ':</div>' +
            '<div class="generated-passhprase cursor-pointer"></div>' +
            '<input type="text" class="generated-passhprase-hidden cursor-pointer"></input>' +
          '</div>' +
          '<input type="checkbox" id="passphrase-saved-checkbox" name="passphraseSaved" class="checkbox" />' +
          '<label for="passphrase-saved-checkbox" class="checkbox-label cursor-pointer">' +
            '<span class="box"></span><span class="label-text unselectable">' + helper.lang('CREATE_ACCOUNT.I_SAVED_A_PASSPHRASE') + '</span>' +
          '</label>' +
          '<div class="non-iguana-coins-repeater hidden"></div>' +
          '<div class="non-iguana-coins-repeater-errors"></div>' +
          '<div class="login-or-delim center"></div>' +
          '<button class="btn btn-block disabled orange-gradient box-shadow-all text-shadow row btn-verify-passphrase">' + helper.lang('CREATE_ACCOUNT.NEXT') + '</button>' +
        '</div>' +
      '</section>' +
      '<!-- // create account form end -->' +
      '<!-- // verify passphrase form start -->' +
      '<section class="form-container verify-passphrase-form hidden">' +
        '<header class="form-header orange-gradient box-shadow-bottom">' +
          '<i class="bi_interface-arrow-left text-shadow cursor-pointer btn-back"></i>' +
          '<div class="title text-shadow">' + helper.lang('CREATE_ACCOUNT.ADD_ACCOUNT') + '</div>' +
        '</header>' +
        '<div class="form-content">' +
          '<div class="login-input-directions-error center offset-bottom-sm col-red hidden unselectable passphrase-word-count">' + helper.lang('LOGIN.INCORRECT_INPUT_P1') + ' 24 ' + helper.lang('LOGIN.INCORRECT_INPUT_P2') + '</div>' +
          '<div class="login-input-directions center offset-bottom-sm unselectable">' + helper.lang('CREATE_ACCOUNT.TYPE_OR_PASTE_THE_PASSPHRASE_P1') + ' <span class="paste-from-clipboard-link cursor-pointer">' + helper.lang('CREATE_ACCOUNT.TYPE_OR_PASTE_THE_PASSPHRASE_P2') + '</span></div>' +
          '<textarea name="verifyPassphrase" id="passphrase" class="login-passphrase-textarea offset-bottom-sm row center"></textarea>' +
          '<div class="non-iguana-walletpassphrase-errors"></div>' +
          '<div class="login-or-delim center unselectable"></div>' +
          '<button class="btn btn-block orange-gradient box-shadow-all text-shadow row btn-add-account disabled">' + helper.lang('CREATE_ACCOUNT.ADD_ACCOUNT') + '</button>' +
        '</div>' +
      '</section>' +
      '<!-- // verify passphrase form end -->' +
    '</div>' +
  '</div>' +
'</div>');