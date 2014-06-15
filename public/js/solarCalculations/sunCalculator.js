var sunCalculator = function () {
//  CONSTANTS
  var PEAK_DATA = {
    'Baden-Wurttemberg': 1041.973,
    'Bavaria': 1025.547,
    'Thuringia': 998.547,
    'Sachsen-Anhalt': 988.167,
    'Saarland': 998.113,
    'Hesse': 954.843,
    'Saxony': 939.340,
    'Rhineland-Palatinate': 974.740,
    'North-Rhine-Westphalia': 917.513,
    'Lower-Saxony': 925.137,
    'Brandenburg': 895.697,
    'Hamburg': 856.610,
    'Schleswig-Holstein': 880.323,
    'Bremen': 801.117,
    'Mecklenburg-Vorpommern': 754.123,
    'Berlin': 730.910
  };

  var FIXED_DATE = new Date(2014, 5, 14);

  var BASE_SUBSIDIES = [13.01, 12.34, 11.01];

  var ACQUISITION_COST_PER_KWP_HOME = 1500;

  var ACQUISITION_COST_PER_KWP_FIELD = 1600;

  var CO2_SAVINGS_IN_GRAMM = 700;

  var GENERATION_IN_KWH_PER_KWP_PER_DAY = 2.85;

  var CONSUMPTION_PER_PERSON_DAY = 2.2;

  var EXTRA_SUBSIDY_IN_CENT = 13;

  var SAVED_ENERGY_PER_PERSON_PER_DAY_KWH = 1.1;

  var CURRENT_ENERGY_PRICE_CENT = 26;

  var USED_PRODUCTION = 1.18;

  var REDUCED_ENERGY_PRICE_EURO = 0.13;

  var instance = {};

  var TODAY = new Date();

  var SUBSIDIES = undefined;

  var PEOPLE = 0;

//  INITIATION
  function init() {
    instance.adjustSubsidies(new Date());
  }

//  PUBLIC INTERFACE
  instance.batteryToggle = false;

  instance.setBattery = function (boolean) {
    instance.batteryToggle = boolean;
  };

  instance.setPeople = function (numberOfPeople) {
    PEOPLE = numberOfPeople;
  };

  instance.calculateKWP = function (sqm) {
    return sqm ? formatFloat(sqm * 0.15, 5) : undefined;
  };

  instance.calculateCO2Savings = function (KWP, state) {
    return getStateKWHData(state) ? formatGrammtoKG(getStateKWHData(state) * KWP * CO2_SAVINGS_IN_GRAMM) : undefined;
  };

  instance.getSubsidies = function () {
    return SUBSIDIES;
  };

  instance.setDates = function (oldDate, newDate) {
    FIXED_DATE = oldDate;
    TODAY = newDate;
  };

  instance.calculateAmortization = function (acquisitionCost, grossProfit) {
    return formatFloat(acquisitionCost / (calculateYearlySavings() + grossProfit), 0);
  };

  instance.calculateAcquisitionCosts = function (KWP, kind) {
    if (KWP) {
      return kind === 'HOME'
        ? formatFloat((KWP * ACQUISITION_COST_PER_KWP_HOME), 2)
        : formatFloat((KWP * ACQUISITION_COST_PER_KWP_FIELD), 2);
    } else {
      return undefined;
    }
  };

  instance.calculateSubsidy = function (KWP, state, sum) {
    if (sum === 0) {
      sum = calculateExtraSubsidy(KWP)
    }

    if (KWP <= 10) {
      var midSumSmall = calculateKWHYearForKWPForStateSmall(KWP, state) * SUBSIDIES['small'] + sum;
      return formatCentToEuro(midSumSmall);
    } else if (KWP <= 40) {
      var midSumMedium = calculateKWHYearForKWPForStateOther(KWP - 10, state) * SUBSIDIES['medium'] + sum;
      return instance.calculateSubsidy(10, state, midSumMedium);
    } else {
      var midSumLarge = calculateKWHYearForKWPForStateOther(KWP - 40, state) * SUBSIDIES['large'] + sum;
      return instance.calculateSubsidy(40, state, midSumLarge);
    }
  };

  instance.calculateSolarCap = function (sqm, state, people, kind) {
    var returnObject = {};
    returnObject.error = undefined;

    if (sqm && state && people && kind) {
      instance.setPeople(people);
      var actualKWP = instance.calculateKWP(sqm);

      returnObject.yearlySubsidy = instance.calculateSubsidy(actualKWP, state, 0);
      returnObject.savingFromBattery = calculateRevenueFromBattery();
      returnObject.acquisitionCosts = calculateAdditionalAcquisitionCosts(instance.calculateAcquisitionCosts(actualKWP, kind));
      returnObject.amortizationInYears = instance.calculateAmortization(returnObject.acquisitionCosts,
        returnObject.yearlySubsidy);
      returnObject.CO2Savings = instance.calculateCO2Savings(actualKWP, state);
      returnObject.KWHPerYear = calculateKWHPerYear(actualKWP, state);
      returnObject.yearlySavings = calculateYearlySavings();
      returnObject.yearlyMoney = formatFloat(returnObject.yearlySavings + returnObject.yearlySubsidy, 2);

      if (returnObject.yearlySubsidy <= 0) {
        setToNegativeSubsidy(returnObject);
      }
    } else {
      returnObject.error = 'argument missing';
    }
    return returnObject;
  };

  instance.adjustSubsidies = function (fixedDateInput, todayInput) {
    var fixedDate = fixedDateInput ? fixedDateInput : FIXED_DATE;
    var today = todayInput ? todayInput : TODAY;

    var monthsDifference = getMonthsDifference(fixedDate, today);
    var adjustedSubsidies = [];

    for (var subsidy in BASE_SUBSIDIES) {
      var multiplicationFactor = Math.pow(0.99, monthsDifference);
      var adjustedSubsidy = BASE_SUBSIDIES[subsidy] * multiplicationFactor;
      adjustedSubsidies.push(formatFloat(adjustedSubsidy, 2));
    }

    SUBSIDIES = {'small': adjustedSubsidies[0], 'medium': adjustedSubsidies[1], 'large': adjustedSubsidies[2]};
  };

  instance.calculateYearlySavings = function(){
    return formatFloat(USED_PRODUCTION * PEOPLE * 365 * REDUCED_ENERGY_PRICE_EURO, 2);
  };

//  PRIVATE INTERFACE / HELPER METHODS
  function formatCentToEuro(cent) {
    return formatFloat((cent / 100), 2);
  }

  function calculateYearlySavings() {
    return formatFloat(instance.calculateYearlySavings() + calculateRevenueFromBattery(), 2);
  }

  function formatGrammtoKG(gramm) {
    return formatFloat((gramm / 1000), 2);
  }

  function calculateExtraSubsidy(KWP) {
    return ((GENERATION_IN_KWH_PER_KWP_PER_DAY * KWP) - (CONSUMPTION_PER_PERSON_DAY * PEOPLE)) * EXTRA_SUBSIDY_IN_CENT;
  }

  function getStateKWHData(state) {
    return PEAK_DATA[state] ? PEAK_DATA[state] : undefined;
  }

  function formatFloat(float, decimalPoints) {
    return parseFloat(float.toFixed(decimalPoints));
  }

  function calculateKWHYearForKWPForStateSmall(KWP, state) {
    var KWHperKWP = undefined;
    if (KWP && state) {
      if (getStateKWHData(state)) {
        KWHperKWP = formatFloat(((KWP * getStateKWHData(state)) - (PEOPLE * 1000) - 500));
      }
      return KWHperKWP;
    }
  }

  function getMonthsDifference(fixedDate, today) {
    var d1Y = fixedDate.getFullYear();
    var d2Y = today.getFullYear();
    var d1M = fixedDate.getMonth();
    var d2M = today.getMonth();

    return (d2M + 12 * d2Y) - (d1M + 12 * d1Y);
  }

  function calculateRevenueFromBattery() {
    if (instance.batteryToggle) {
      return formatFloat((SAVED_ENERGY_PER_PERSON_PER_DAY_KWH * PEOPLE * (CURRENT_ENERGY_PRICE_CENT - EXTRA_SUBSIDY_IN_CENT) * 365) / 100, 2);
    } else {
      return 0;
    }
  }

  function calculateAdditionalAcquisitionCosts(acquisitionCost) {
    if (instance.batteryToggle) {
      if (PEOPLE <= 3) {
        return acquisitionCost + 10000;
      } else {
        return acquisitionCost + 14000;
      }
    } else {
      return acquisitionCost;
    }
  }

  function calculateKWHPerYear (KWP, state) {
    return getStateKWHData(state) ? (getStateKWHData(state) * KWP) : undefined;
  }

  function calculateKWHYearForKWPForStateOther(KWP, state) {
    var KWHperKWP = undefined;
    if (KWP && state) {
      if (getStateKWHData(state)) {
        KWHperKWP = formatFloat(KWP * getStateKWHData(state), 3);
      }
      return KWHperKWP;
    }
  }

  function setToNegativeSubsidy (returnObject){
    returnObject.error = 'negative subsidy';
    returnObject.yearlySubsidy = 0;
    returnObject.savingFromBattery = 0;
    returnObject.amortizationInYears = 0;
    returnObject.acquisitionCosts = 0;
    returnObject.CO2Savings = 0;
    returnObject.KWHPerYear = 0;
    returnObject.yearlySavings = 0;
    returnObject.yearlyMoney = 0;

    return returnObject;
  }

  init();
  return instance;
};
var module = module || {};
module.exports = sunCalculator;