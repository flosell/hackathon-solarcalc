var sunCalculator = function(){
  var instance = {};

  instance.calculateKWP = function(sqm){
    return sqm ? formatFloat(sqm * 0.15, 5) : undefined;
  };

  instance.calculateKWHYearForKWPForState = function(KWP, state){
    var KWHperKWP = undefined;
    if (KWP && state) {
      KWHperKWP = getStateKWHData(state) ? formatFloat((getStateKWHData(state) * KWP), 3) : undefined;
    }
    return KWHperKWP;
  };

  instance.calculateSubsidy = function(KWP, state, sum){
    var SUBSIDIES = {
      'small'   : 13.01,
      'medium'  : 12.34,
      'large'   : 11.10
    };

    if(KWP <= 10) {
      var midSumSmall = instance.calculateKWHYearForKWPForState(KWP, state) * SUBSIDIES['small'] + sum;
      return formatCentToEuro(midSumSmall);
    } else if (KWP <= 40){
      var midSumMedium = instance.calculateKWHYearForKWPForState(KWP - 10, state) * SUBSIDIES['medium'] + sum;
      return instance.calculateSubsidy(10, state, midSumMedium);
    } else {
      var midSumMediumLarge = instance.calculateKWHYearForKWPForState(KWP - 40, state) * SUBSIDIES['large'] + sum;
      return instance.calculateSubsidy(40, state, midSumMediumLarge);
    }
  };

  function formatCentToEuro (cent) {
    return formatFloat((cent / 100), 2);
  }

  function getStateKWHData(state) {
    return PEAK_DATA[state] ? PEAK_DATA[state] : undefined;
  }

  function formatFloat(float, decimalPoints) {
    return parseFloat(float.toFixed(decimalPoints));
  }

  return instance;
};
