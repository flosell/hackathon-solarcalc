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
      expect(calculator.calculateKWP(1)).toEqual(0.11765);
    });

    it('should return 0.23529 KWp for 2 sqm', function () {
      expect(calculator.calculateKWP(2)).toEqual(0.23529);
    });

    it('should return 1 KWp for 8.5 sqm', function () {
      expect(calculator.calculateKWP(8.5)).toEqual(1);
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
});