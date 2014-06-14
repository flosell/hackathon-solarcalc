var sunCalculator = function(){
  var instance = {};

//  FIXED DATE OF SUBSIDIES
  var TODAY = new Date();
  var SUBSIDIES = undefined;
  var PEOPLE = 0;

  instance.setPeople = function(numberOfPeople) {
    PEOPLE = numberOfPeople;
  };

  function init(){
    instance.adjustSubsidies(new Date());
  }

  instance.calculateKWP = function(sqm){
    return sqm ? formatFloat(sqm * 0.15, 5) : undefined;
  };

  instance.calculateKWHYearForKWPForState = function(KWP, state){
    var KWHperKWP = undefined;
    if (KWP && state) {
      KWHperKWP = getStateKWHData(state) ? formatFloat((getStateKWHData(state) * KWP) - (PEOPLE * KWH_PER_PERSON), 3) : undefined;
    }
    return KWHperKWP;
  };

  instance.getSubsidies = function (){
    return SUBSIDIES;
  };

  instance.setDates = function(oldDate, newDate){
    FIXED_DATE = oldDate;
    TODAY = newDate;
  };

  instance.calculateSubsidy = function(KWP, state, sum){
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

  function getMonthsDifference(fixedDate, today) {
    var d1Y = fixedDate.getFullYear();
    var d2Y = today.getFullYear();
    var d1M = fixedDate.getMonth();
    var d2M = today.getMonth();

    return (d2M+12*d2Y)-(d1M+12*d1Y);
  }

  instance.adjustSubsidies = function(fixedDateInput, todayInput) {
    var fixedDate = fixedDateInput ? fixedDateInput : FIXED_DATE;
    var today = todayInput ? todayInput : TODAY;

    var monthsDifference = getMonthsDifference(fixedDate, today);
    var adjustedSubsidies = [];

    for(var subsidy in BASE_SUBSIDIES) {
      var multiplicationFactor = Math.pow(0.99, monthsDifference);
      var adjustedSubsidy = BASE_SUBSIDIES[subsidy] * multiplicationFactor;
      adjustedSubsidies.push(formatFloat(adjustedSubsidy, 2));
    }

    SUBSIDIES = {'small' : adjustedSubsidies[0], 'medium' : adjustedSubsidies[1], 'large' : adjustedSubsidies[2]};
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

  init();
  return instance;
};
