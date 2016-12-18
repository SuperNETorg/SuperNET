'use strict';

angular.module('IguanaGUIApp')
.controller('sendCoinModalController', [
  '$scope',
  '$uibModalInstance',
  'util',
  '$storage',
  '$state',
  '$api',
  '$uibModal',
  '$filter',
  '$rates',
  'vars',
  '$message',
  '$http',
  function($scope, $uibModalInstance, util, $storage, $state, $api, $uibModal, $filter, $rates, vars, $message, $http) {
    $scope.isIguana = $storage.isIguana;
    $scope.util = util;
    $scope.activeCoin = $storage['iguana-active-coin'] && $storage['iguana-active-coin'].id ? $storage['iguana-active-coin'].id : 0;
    $scope.checkModel = {};
    $scope.radioModel = true;
    $scope.dropDown = {};
    $scope.feeAllText = '';
    $scope.feeCurrencyAllText = '';
    $scope.checkedAmountType ='';
    $scope.feeAllTextCustom ='';
    $scope.feeCurrencyAllTextCustom = '';

    $scope.close = function() {
      $uibModalInstance.dismiss();
    };

    $scope.change = function() {
      if (Object.keys($scope.checkModel).length) {
        $scope.checkedAmountType = $scope.$eval($scope.checkModel.type).name;
        $scope.sendCoin.fee = $scope.$eval($scope.checkModel.type).coin;
        $scope.sendCoin.feeCurrency = $scope.$eval($scope.checkModel.type).amount;
        $scope.feeAllText = $scope.sendCoin.fee + ' ' + $scope.sendCoin.coinId;
        $scope.feeCurrencyAllText = $scope.sendCoin.feeCurrency + ' ' + $scope.sendCoin.currency;
      }
    };

    var defaultAccount = $scope.isIguana ? settings.defaultAccountNameIguana : settings.defaultAccountNameCoind,
        defaultCurrency = $rates.getCurrency() ? $rates.getCurrency().name : null || settings.defaultCurrency,
        coinsInfo = vars.coinsInfo;

    $scope.sendCoin = {
      initStep: true,
      success: false,
      address: '',
      amount: '',
      amountCurrency: '',
      fee: '',
      minFee: coinsInfo[$scope.activeCoin].relayFee || 0.00001,
      feeCurrency: '',
      note: '',
      passphrase: '',
      valid: {
        address: true,
        amount: {
          empty: false,
          notEnoughMoney: false
        },
        fee: {
          empty: false,
          notEnoughMoney: false
        }
      },
      entryFormIsValid: false
    };

    $scope.$modalInstance = {};
    $scope.receivedObject = undefined;

    $scope.openSendCoinPassphraseModal = function() {
      var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            controller: 'sendCoinPassphraseModalController',
            templateUrl: 'partials/send-coin-passphrase.html',
            appendTo: angular.element(document.querySelector('.send-coin-passphrase-modal-container')),
            resolve: {
              receivedObject: function() {
                return $scope.receivedObject;
              }
            }
          });
      modalInstance.result.then(onDone);

      function onDone(receivedObject) {
        if (receivedObject) execSendCoinCall();
      }
    };

    $api.getBalance(defaultAccount, $scope.activeCoin).then(function(response) {
      initSendCoinModal(response[0], response[1]);
      // TODO: add time estimates based on https://bitcoinfees.21.co/api/v1/fees/list
      $api.bitcoinFees().then(function(response) {
        $api.bitcoinFeesAll().then(function(responseAll) {
          var currencyName = $rates.getCurrency() ? $rates.getCurrency().name : settings.defaultCurrency,
              coinName = $storage['iguana-active-coin']['id'].toUpperCase();

          $api.getExternalRate(coinName + '/' + currencyName).then(function(currency) {
            var fastestFee = checkFeeCount(response.data.fastestFee),
                halfHourFee = checkFeeCount(response.data.halfHourFee),
                hourFee = checkFeeCount(response.data.hourFee),
                coinCurrencyRate = currency[0][coinName][currencyName];

            if ($scope.activeCoin === 'btc') {
              var feeTime = {
                    default: {
                      min: '',
                      max: ''
                    },
                    low: {
                      min: '',
                      max: ''
                    },
                    normal: {
                      min: '',
                      max: ''
                    },
                    high: {
                      min: '',
                      max: ''
                    }
                  };

              responseAll.data.fees.forEach(function(el) {
                if (el.maxFee === 0) {
                  feeTime.default = {
                    min: el.minMinutes,
                    max: el.maxMinutes
                  };
                }
                if (el.maxFee === response.data.fastestFee) {
                  feeTime.high = {
                    min: el.minMinutes,
                    max: el.maxMinutes
                  };
                }
                if (el.maxFee === response.data.halfHourFee) {
                  feeTime.normal = {
                    min: el.minMinutes,
                    max: el.maxMinutes
                  };
                }
                if (el.maxFee === response.data.hourFee) {
                  feeTime.low = {
                    min: el.minMinutes,
                    max: el.maxMinutes
                  };
                }
              });

              $scope.dropDown.items = [{
                id: 0,
                name: $filter('lang')('SEND.FEE_MIN'),
                coin: $scope.sendCoin.minFee.toFixed(7),
                amount: (coinCurrencyRate * $scope.sendCoin.minFee).toFixed(12),
                feeMinTime: feeTime.default.min,
                feeMaxTime: feeTime.default.max
              }, {
                id: 1,
                name: $filter('lang')('SEND.FEE_LOW'),
                coin: hourFee.coin.toFixed(7),
                amount: (coinCurrencyRate * hourFee.coin).toFixed(12),
                feeMinTime: feeTime.low.min,
                feeMaxTime: feeTime.low.max
              }, {
                id: 2,
                name: $filter('lang')('SEND.FEE_NORMAL'),
                coin: halfHourFee.coin.toFixed(7),
                amount: (coinCurrencyRate * halfHourFee.coin).toFixed(12),
                feeMinTime: feeTime.normal.min,
                feeMaxTime: feeTime.normal.max
              }, {
                id: 3,
                name: $filter('lang')('SEND.FEE_HIGH'),
                coin: fastestFee.coin.toFixed(7),
                amount: (coinCurrencyRate * fastestFee.coin).toFixed(12),
                feeMinTime: feeTime.high.min,
                feeMaxTime: feeTime.high.max
              }];
            } else {
              $scope.dropDown.items = [{
                id: 0,
                name: $filter('lang')('SEND.FEE_MIN'),
                coin: $scope.sendCoin.minFee.toFixed(7),
                amount: ($scope.sendCoin.minFee * coinCurrencyRate).toFixed(12),
                feeMinTime: '',
                feeMaxTime: ''
              }, {
                id: 1,
                name: $filter('lang')('SEND.FEE_CUSTOM'),
                coin: $scope.sendCoin.minFee.toFixed(7),
                amount: ($scope.sendCoin.minFee * coinCurrencyRate).toFixed(12),
                feeMinTime: '',
                feeMaxTime: ''
              }];

              $scope.dropDown.item = $scope.dropDown.items[0];
            }
          }.bind(this));
        }.bind(this));
      }.bind(this));

    }, function(reason) {
      console.log('request failed: ' + reason);
    });

    function initSendCoinModal(balance, coin) {
      $scope.sendCoin.currencyRate = $rates.updateRates(coin, defaultCurrency, true);
      $scope.sendCoin.initStep = -$scope.sendCoin.initStep;
      $scope.sendCoin.currency = defaultCurrency;
      $scope.sendCoin.coinName = supportedCoinsList[coin].name;
      $scope.sendCoin.coinId = $scope.activeCoin.toUpperCase();
      $scope.sendCoin.coinValue = balance;
      $scope.sendCoin.currencyValue = balance * $scope.sendCoin.currencyRate;

      if (dev && dev.isDev && sendDataTest && sendDataTest[coin]) {
        $scope.sendCoin.address = sendDataTest[coin].address;
        $scope.sendCoin.amount = sendDataTest[coin].val;
        $scope.sendCoin.fee = 0.00001;
        $scope.sendCoin.note = sendDataTest[coin].note;
      }
    }

    $scope.toggleSendCoinModal = function() {
      toggleSendCoinModal();
    };

    $scope.sendCoinKeyingAmount = function() {
      if ($scope.sendCoin.amount)
        $scope.sendCoin.amountCurrency = $filter('decimalPlacesFormat')($scope.sendCoin.amount * $scope.sendCoin.currencyRate, 'currency');
    };

    $scope.sendCoinKeyingAmountCurrency = function() {
      if ($scope.sendCoin.amountCurrency && $scope.sendCoin.amountCurrency > 0)
        $scope.sendCoin.amount = $filter('decimalPlacesFormat')($scope.sendCoin.amountCurrency / $scope.sendCoin.currencyRate, 'coin');
    };

    $scope.sendCoinKeyingFee = function(feeAllTextCustom) {
      if (feeAllTextCustom) {
        $scope.feeCurrencyAllTextCustom = parseInt($filter('decimalPlacesFormat')(parseInt(feeAllTextCustom) * $scope.sendCoin.currencyRate, 'currency')).toFixed(12);
      }
    };

    $scope.sendCoinKeyingFeeCurrency = function(feeCurrencyAllTextCustom) {
      if (feeCurrencyAllTextCustom)
        $scope.feeCurrencyAllTextCustom = $filter('decimalPlacesFormat')(feeCurrencyAllTextCustom / $scope.sendCoin.currencyRate, 'coin');
    };

    $scope.validateSendCoinForm = function() {
      if (_validateSendCoinForm()) {
        $scope.sendCoin.amountCurrency = $scope.sendCoin.currencyRate * $scope.sendCoin.amount;
        $scope.sendCoin.feeCurrency = ($scope.sendCoin.currencyRate * $scope.sendCoin.fee).toFixed(12);
        $scope.sendCoin.initStep = false;
      }
    };

    // TODO: 1) coin address validity check e.g. btcd address cannot be used in bitcoin send tx
    //      1a) address byte prefix check
    function _validateSendCoinForm() {
      // address
      $scope.sendCoin.valid.address = $scope.sendCoin.address.length !== 34 ? false : true;
      $scope.sendCoin.valid.feeType = $scope.sendCoin.fee ? true : false;
      // coin amount
      if (Number($scope.sendCoin.amount) === 0 || !$scope.sendCoin.amount.length || Number($scope.sendCoin.amount) > Number($scope.sendCoin.coinValue)) {
        $scope.sendCoin.valid.amount.empty = (Number($scope.sendCoin.amount) === 0 || !$scope.sendCoin.amount.length) ? true : false;
        $scope.sendCoin.valid.amount.notEnoughMoney = (Number($scope.sendCoin.amount) === 0 || !$scope.sendCoin.amount.length) ? false : true;
      } else {
        $scope.sendCoin.valid.amount.empty = $scope.sendCoin.valid.amount.notEnoughMoney = false;
      }
      // fee
      if ((Number($scope.sendCoin.fee) + Number($scope.sendCoin.amount)) > Number($scope.sendCoin.coinValue)) {
        $scope.sendCoin.valid.fee.empty = false;
        $scope.sendCoin.valid.fee.notEnoughMoney = true;
      }
      if (Number($scope.sendCoin.fee) < Number($scope.sendCoin.minFee)) {
        $scope.sendCoin.valid.fee.empty = true;
        $scope.sendCoin.valid.fee.notEnoughMoney = false;
      }
      if ((Number($scope.sendCoin.fee) >= Number($scope.sendCoin.minFee))
          && (Number($scope.sendCoin.fee) + Number($scope.sendCoin.amount)) < Number($scope.sendCoin.coinValue)) {
        $scope.sendCoin.valid.fee.empty = false;
        $scope.sendCoin.valid.fee.notEnoughMoney = false;
      }
      if ($scope.dropDown.item === null) { // TODO: ng-class
        angular.element(document.querySelectorAll('.dropdown-button-style')).addClass('validation-field-error');
      }
      // final check
      if ($scope.sendCoin.address.length !== 34 ||
          Number($scope.sendCoin.amount) === 0 ||
          !$scope.sendCoin.amount.length ||
          (Number($scope.sendCoin.fee) < Number($scope.sendCoin.minFee)) ||
          Number($scope.sendCoin.amount) > Number($scope.sendCoin.coinValue) ||
          (Number($scope.sendCoin.fee) + Number($scope.sendCoin.amount)) > Number($scope.sendCoin.coinValue)) {
        $scope.sendCoin.entryFormIsValid = false;
      } else {
        $scope.sendCoin.entryFormIsValid = true;
      }

      return $scope.sendCoin.entryFormIsValid;
    }

    $scope.sendCoinFormConfirm = function() {
      if (!$scope.isIguana) {
        $scope.openSendCoinPassphraseModal();
      } else {
        execSendCoinCall();
      }
    };

    function checkFeeCount(fee) {
      var coin = fee * 1024 / 100000000, // satoshi per kb
          amount = $scope.sendCoin.currencyRate * coin;

      return {
        'coin': coin,
        'amount': amount
      };
    }

    function execSendCoinCall() {
      var setTxFeeResult = false,
          txDataToSend = {
            address: $scope.sendCoin.address,
            amount: $scope.sendCoin.amount,
            note: $scope.sendCoin.note
          };

      if (Number($scope.sendCoin.fee) !== Number(coinsInfo[$scope.activeCoin].relayFee) /*&& Number($scope.sendCoin.fee) !== 0.00001*/ && Number($scope.sendCoin.fee) !== 0) {
        $api.setTxFee($scope.activeCoin, $scope.sendCoin.fee)
        .then(function(response) {
          $api.sendToAddress($scope.activeCoin, txDataToSend)
          .then(function(response) {
            if (response.length === 64) {
              $scope.sendCoin.success = true;
            }
            // revert pay fee
            $api.setTxFee($scope.activeCoin, coinsInfo[$scope.activeCoin].relayFee)
            .then(function(response) {
              // do nothing
            }, function(reason) {
              console.log('request failed: ' + reason);
              // TODO: show error
            });
          }, function(reason) {
            $message.ngPrepMessageModal($filter('lang')('MESSAGE.TRANSACTION_ERROR'), 'red');
            // revert pay fee
            $api.setTxFee($scope.activeCoin, coinsInfo[$scope.activeCoin].relayFee)
            .then(function(response) {
              // do nothing
            }, function(reason) {
              console.log('request failed: ' + reason);
              // TODO: show error
            });
          });
        }, function(reason) {
          $message.ngPrepMessageModal($filter('lang')('MESSAGE.TRANSACTION_ERROR'), 'red');
          console.log('request failed: ' + reason);
        });
      } else {
        $api.sendToAddress($scope.activeCoin, txDataToSend)
        .then(function(response) {
          if (response.length === 64) {
            $scope.sendCoin.success = true;
          }
        }, function(reason) {
          $message.ngPrepMessageModal($filter('lang')('MESSAGE.TRANSACTION_ERROR'), 'red');
          console.log('request failed: ' + reason);
        });
      }
    }

    $scope.close = function() {
      $uibModalInstance.dismiss();
    };
  }
]);