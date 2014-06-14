describe('sunCalculator', function(){

  var calculator;

  beforeEach(function(){
    calculator = sunCalculator();
  });

  describe('calculateKWP', function(){

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
      expect(calculator.calculateKWHYearForKWPForState(2, 'Sachsen')).toEqual(1878.680);
    });

    it('should return 20829.042 for 26 KWP for Bremen', function () {
      expect(calculator.calculateKWHYearForKWPForState(26, 'Bremen')).toEqual(20829.042);
    });
  });

  describe('calculateSubsidy', function(){

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
      expect(calculator.calculateSubsidy(60, 'Baden-Württemberg', 0)).toBe(7526.17);
    });

    it('should return 8835.43 Euro for 80 KWP in Sachsen', function () {
      expect(calculator.calculateSubsidy(80, 'Sachsen', 0)).toBe(8870.19);
    });
  })
});