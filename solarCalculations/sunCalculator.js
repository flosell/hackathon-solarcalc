var sunCalculator = function(){
  var instance = {};

  instance.calculateKWP = function(sqm){
    return sqm ? formatFloat(sqm * 0.117647, 5) : undefined;
  };

  instance.calculateKWHYearForKWPForState = function(KWP, state){
    var KWHperYear = undefined;
    if (KWP && state) {
      KWHperYear = getStateKWHData(state) ? formatFloat((getStateKWHData(state) * KWP), 3) : undefined;
    }
    return KWHperYear;
  };

  function getStateKWHData(state) {
    return PEAK_DATA[state] ? PEAK_DATA[state] : undefined;
  }

  function formatFloat(float, decimalPoints) {
    return parseFloat(float.toFixed(decimalPoints));
  }

  return instance;
};
