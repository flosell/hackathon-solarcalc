describe('sunCalculator', function(){

  var calculator;

  describe('calculateKWP', function(){

    beforeEach(function(){
      calculator = sunCalculator();
    });

    it('should return undefined for no input', function () {
      expect(calculator.calculateKWP(undefined)).toBeUndefined();
    });

    it('should return 0.11765 KWp for 1 sqm', function () {
      expect(calculator.calculateKWP(1)).toEqual(0.15);
    });

    it('should return 0.23529 KWp for 2 sqm', function () {
      expect(calculator.calculateKWP(2)).toEqual(0.30);
    });

    it('should return 1 KWp for 8.5 sqm', function () {
      expect(calculator.calculateKWP(10)).toEqual(1.50);
    });
  });

  describe('calculateKWHYearForKWPForState', function () {

    beforeEach(function(){
      calculator = sunCalculator();
    });

    it('should return undefined for undefined state', function () {
      expect(calculator.calculateKWHYearForKWPForState(1, undefined)).toEqual(undefined);
    });

    it('should return undefined for undefined KWP for no state', function () {
      expect(calculator.calculateKWHYearForKWPForState(undefined, 'Hessen')).toEqual(undefined);
    });

    it('should return 1041.973 for 1 KWP for Baden-Württemberg', function () {
      expect(calculator.calculateKWHYearForKWPForState(1, 'Baden-Württemberg')).toEqual(1041.973);
    });

    it('should return 856.610 for 1 KWP for Hamburg', function () {
      expect(calculator.calculateKWHYearForKWPForState(1, 'Hamburg')).toEqual(856.610);
    });

    it('should return 1878.680 for 2 KWP for Sachsen', function () {
      expect(calculator.calculateKWHYearForKWPForState(2, 'Saxony')).toEqual(1878.680);
    });

    it('should return 20829.042 for 26 KWP for Bremen', function () {
      expect(calculator.calculateKWHYearForKWPForState(26, 'Bremen')).toEqual(20829.042);
    });
  });

  describe('calculateSubsidy', function(){

    beforeEach(function(){
      calculator = sunCalculator();
    });

    it('should return 135.56 Euro for 1 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(1, 'Baden-Württemberg', 0)).toBe(135.56);
    });

    it('should return 271.12 Euro for 2 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(2, 'Baden-Württemberg', 0)).toBe(271.12);
    });

    it('should return 1355.61 Euro for 10 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(10, 'Baden-Württemberg', 0)).toBe(1355.61);
    });

    it('should return 1484.19 Euro for 11 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(11, 'Baden-Württemberg', 0)).toBe(1484.19);
    });

    it('should return 1484.19 Euro for 60 KWP in Baden-Wuerttemberg', function () {
      expect(calculator.calculateSubsidy(60, 'Baden-Württemberg', 0)).toBe(7507.42);
    });

    it('should return 8835.43 Euro for 80 KWP in Sachsen', function () {
      expect(calculator.calculateSubsidy(80, 'Saxony', 0)).toBe(8836.37);
    });
  });

  describe('adjustSubsidies', function(){

    beforeEach(function(){
      calculator = sunCalculator();
    });
    
    it('should not adjust the subsidies for current month', function () {
      var adjustedSubsidies = {'small'   : 13.01, 'medium'  : 12.34,'large'   : 11.01};

      calculator.adjustSubsidies(new Date(2014,5,14), new Date(2014,5,14));

      expect(calculator.getSubsidies()).toEqual(adjustedSubsidies);
    });

    it('should adjust the subsidies for 2 months in future', function () {
      var adjustedSubsidies = {'small'   : 12.75, 'medium'  : 12.09,'large'   : 10.79};

      calculator.adjustSubsidies(new Date(2014,5,14), new Date(2014,7,14));

      expect(calculator.getSubsidies()).toEqual(adjustedSubsidies);
    });

    it('should adjust the subsidies for 9 months in future', function () {
      var adjustedSubsidies = {'small'   : 11.88, 'medium'  : 11.27,'large'   : 10.06};

      calculator.adjustSubsidies(new Date(2014,5,14), new Date(2015,2,14));

      expect(calculator.getSubsidies()).toEqual(adjustedSubsidies);
    });
  });

  describe('adjustForOwnEnergyConsumption', function(){

    beforeEach(function(){
      calculator = sunCalculator();
    });

    it('should return 6343.89 Euro for 60 KWP in BW', function () {
      calculator.setPeople(4);

      expect(calculator.calculateSubsidy(60, 'Baden-Württemberg', 0)).toBe(6343.90);
    });
  });

  describe('calculateAcquisitionCosts', function(){

    beforeEach(function(){
      calculator = sunCalculator();
    });

    it('should return undefined for no KWP', function () {
      expect(calculator.calculateAcquisitionCosts(undefined)).toBe(undefined);
    });

    it('should return 1300.00 Euro for 1 KWP', function () {
      expect(calculator.calculateAcquisitionCosts(1)).toBe(1300.00);
    });

    it('should return 13000.00 Euro for 10 KWP', function () {
      expect(calculator.calculateAcquisitionCosts(10)).toBe(13000.00);
    });
  });
});