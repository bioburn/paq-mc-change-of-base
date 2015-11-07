var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

var paqChangeOfBaseMC = require("../");
var paqChangeOfBaseFR = require("paq-fr-change-of-base");
var paqUtils = require("../paq-utils");


describe("getDistractorRadices(rad)", function() {
	describe("when rad is 8", function() {
		it('should return array [10, 16]', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(8)).to.eql([10,16]);
		});
	});
	describe("when rad is 10", function() {
		it('should return array [8, 16]', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(10)).to.eql([8,16]);
		});
	});
	describe("when rad is 16", function() {
		it('should return array [8, 10]', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(16)).to.eql([8,10]);
		});
	});
	describe("when rad is not 8, 10, or 16", function() {
		it('should return an empty array', function() {
			expect(paqChangeOfBaseMC.getDistractorRadices(5)).to.eql([]);
			expect(paqChangeOfBaseMC.getDistractorRadices()).to.eql([]);
		});
	});
});

describe("generateToRadDistractors(toRad, numToConvert)", function() {
	var getDistractorRadicesStub, toStringStub;
	var getDistractorRadicesReturnDouble;
	var numToConvertDouble;
	beforeEach(function() {
		numToConvertDouble = { toString: function() {} };
		getDistractorRadicesReturnDouble = [2, 3, 4];
		getDistractorRadicesStub = sinon.stub(paqChangeOfBaseMC, "getDistractorRadices").returns(getDistractorRadicesReturnDouble);
		toStringStub = sinon.stub(numToConvertDouble, "toString");
	});
	afterEach(function() {
		getDistractorRadicesStub.restore();
		toStringStub.restore();
	});
	it("should call getDistractorRadices(toRad)", function() {
		paqChangeOfBaseMC.generateToRadDistractors(5, numToConvertDouble);
		expect(getDistractorRadicesStub.withArgs(5).calledOnce).to.be.true;
	});
	it("should call numToConvert.toString on each of the distractor radices", function() {
		paqChangeOfBaseMC.generateToRadDistractors(5, numToConvertDouble);
		expect(toStringStub.withArgs(2).calledOnce).to.be.true;
		expect(toStringStub.withArgs(3).calledOnce).to.be.true;
		expect(toStringStub.withArgs(4).calledOnce).to.be.true;
		expect(toStringStub.calledThrice).to.be.true;
	});
	it("should return an array with the results of the numToConvert.toString calls", function() {
		toStringStub
		.withArgs(2).returns("toStringTwoResult")
		.withArgs(3).returns("toStringThreeResult")
		.withArgs(4).returns("toStringFourResult");
		var res = paqChangeOfBaseMC.generateToRadDistractors(5, numToConvertDouble);
		expect(res).to.eql(["toStringTwoResult", "toStringThreeResult", "toStringFourResult"]);
	});
});

describe("generateFromRadDistractors(fromRad, toRad, numToConvert, from)", function() {
	var getDistractorRadicesStub, parseIntStub, isNaNStub;
	var getDistractorRadicesReturnDouble;
	var numToConvertDouble, fromRadDouble, toRadDouble, fromDouble;
	beforeEach(function() {
		numToConvertDouble = { toString: function() {} };
		fromDouble = "from-double";
		fromRadDouble = "from-rad-double";
		toRadDouble = "to-rad-double";
		getDistractorRadicesReturnDouble = [2, 3, 4];
		getDistractorRadicesStub = sinon.stub(paqChangeOfBaseMC, "getDistractorRadices").returns(getDistractorRadicesReturnDouble);
		parseIntStub = sinon.stub(global, "parseInt");
		isNaNStub = sinon.stub(global, "isNaN").returns(true);
	});
	afterEach(function() {
		getDistractorRadicesStub.restore();
		parseIntStub.restore();
		isNaNStub.restore();
	});
	it("should call getDistractorRadices(fromRad)", function() {
		paqChangeOfBaseMC.generateFromRadDistractors(fromRadDouble, toRadDouble, numToConvertDouble, fromDouble);
		expect(getDistractorRadicesStub.withArgs(fromRadDouble).calledOnce).to.be.true;
	});
	it("should call parseInt(from, rad) with all distractor radices", function() {
		paqChangeOfBaseMC.generateFromRadDistractors(fromRadDouble, toRadDouble, numToConvertDouble, fromDouble);
		expect(parseIntStub.calledWith(fromDouble, 2)).to.be.true;
		expect(parseIntStub.calledWith(fromDouble, 3)).to.be.true;
		expect(parseIntStub.calledWith(fromDouble, 4)).to.be.true;
		expect(parseIntStub.calledThrice).to.be.true;
	});

	describe("result array", function() {
		var validParsedIntDouble;
		var toStringStub;
		beforeEach(function() {
			validParsedIntDouble = { toString: function() {} };
			parseIntStub.onCall(0).returns(validParsedIntDouble);
			isNaNStub.withArgs(validParsedIntDouble).returns(false);
			toStringStub = sinon.stub(validParsedIntDouble, "toString").returns("to-string-double");
		});
		afterEach(function() {
			toStringStub.restore();
		});
		it("should include the toString(toRad) result of the values of parseInt that were not NaN's", function() {
			var result = paqChangeOfBaseMC.generateFromRadDistractors(fromRadDouble, toRadDouble, numToConvertDouble, fromDouble);
			expect(result).to.eql(["to-string-double"]);
		});
	});

});

describe("addDistractorChoices(answerChoices, fromRad, toRad, from, numToConvert)", function() {
	var answerChoicesMock, answerChoicesSpy;
	var generateToRadDistractorsStub, generateFromRadDistractorsStub;
	beforeEach(function() {
		answerChoicesMock = { addAll: function() {} };
		answerChoicesSpy = sinon.spy(answerChoicesMock, "addAll");
		generateToRadDistractorsStub = sinon.stub(paqChangeOfBaseMC, "generateToRadDistractors").returns("toRad-distractors-double");
		generateFromRadDistractorsStub = sinon.stub(paqChangeOfBaseMC, "generateFromRadDistractors").returns("fromRad-distractors-double");
	});
	afterEach(function() {
		generateToRadDistractorsStub.restore();
		generateFromRadDistractorsStub.restore();
		answerChoicesSpy.restore();
	});
	it ("should call generateToRadDistractors(toRad, numToConvert) once and add the choices", function() {
		paqChangeOfBaseMC.addDistractorChoices(answerChoicesMock, "fromRad-double", "toRad-double", "from-double", "numToConvert-double");
		expect(generateToRadDistractorsStub.calledOnce).to.be.true;
		expect(generateToRadDistractorsStub.withArgs("toRad-double", "numToConvert-double").calledOnce).to.be.true;
		expect(answerChoicesSpy.withArgs("toRad-distractors-double").calledOnce).to.be.true;
	});
	it ("should call generateFromRadDistractors(fromRad, toRad, numToConvert, from) once and add the choices", function() {
		paqChangeOfBaseMC.addDistractorChoices(answerChoicesMock, "fromRad-double", "toRad-double", "from-double", "numToConvert-double");
		expect(generateFromRadDistractorsStub.calledOnce).to.be.true;
		expect(generateFromRadDistractorsStub
			.withArgs("fromRad-double", "toRad-double", "numToConvert-double", "from-double")
			.calledOnce).to.be.true;
		expect(answerChoicesSpy.withArgs("fromRad-distractors-double").calledOnce).to.be.true;
	});
});
describe("addRandomChoices(randomStream, answerChoices, toRad, min, max)", function() {
	var answerChoicesMock, randomStreamMock, randIntResultMock;
	var fullStub, addStub, randIntBetweenInclusiveStub, toStringStub;
	var toRadDouble, minDouble, maxDouble, toStringReturnDouble;
	var sandbox;
	beforeEach(function() {
		toRadDouble = "toRad-double";
		minDouble = "min-double";
		maxDouble = "max-double";
		toStringReturnDouble = "toString-return-double";
		randIntResultMock = { toString: function() {} };
		answerChoicesMock = { full: function(){}, add: function() {} };
		randomStreamMock = { randIntBetweenInclusive: function() {} };
		sandbox = sinon.sandbox.create();
		fullStub = sandbox.stub(answerChoicesMock, "full");
		addStub = sandbox.stub(answerChoicesMock, "add");
		randIntBetweenInclusiveStub = sandbox.stub(randomStreamMock, "randIntBetweenInclusive").returns(randIntResultMock);
		toStringStub = sandbox.stub(randIntResultMock, "toString").returns(toStringReturnDouble);
	});
	afterEach(function() {
		sandbox.restore();
	});
	describe("when answerChoices becomes full", function() {
		beforeEach(function() {
			fullStub.returns(false);
			fullStub.onCall(1).returns(true);
			paqChangeOfBaseMC.addRandomChoices(randomStreamMock, answerChoicesMock, toRadDouble, minDouble, maxDouble);
		});
		it("should stop adding choices", function() {
			expect(fullStub.calledTwice).to.be.true;
			expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
			expect(addStub.calledOnce).to.be.true;
		});
	});
	describe("generating new choice", function() {
		beforeEach(function() {
			fullStub.returns(false);
			fullStub.onCall(1).returns(true);
			paqChangeOfBaseMC.addRandomChoices(randomStreamMock, answerChoicesMock, toRadDouble, minDouble, maxDouble);
		});
		describe("randIntBetweenInclusive", function() {
			it("should be called with min and max as parameters", function() {
				expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
				expect(randIntBetweenInclusiveStub.calledWith(minDouble, maxDouble)).to.be.true;
			});
		});
		describe("distractor", function() {
			it("should call toString(toRad)", function() {
				expect(toStringStub.calledOnce).to.be.true;
				expect(toStringStub.calledWith(toRadDouble)).to.be.true;
			});
		});
		describe("answerChoices.add", function() {
			it("should be called with the result of distractor's toString", function() {
				expect(addStub.calledOnce).to.be.true;
				expect(addStub.calledWith(toStringReturnDouble)).to.be.true;
			});
		});
	});
});



// bad giant unit test...
describe("generate(randomStream, params)", function() {
	var res;
	var numToConvertMock, randomStreamMock, answerChoicesMock, choicesMock;
	var getConversionStub, randIntBetweenInclusiveStub, toStringStub, UniqueChoicesStub,
		addDistractorChoicesStub, addRandomChoicesStub, shuffleStub, indexOfStub, getChoicesStub,
		generateQuestionTextStub, addStub;
	var conversionDouble, fromRadDouble, toRadDouble, minDoube, maxDouble, paramsDouble,
		fromDouble, answerDouble, indexDouble, questionTextDouble;
	var sandbox;
	beforeEach(function() {
		sandbox = sinon.sandbox.create();

		numToConvertMock = { toString: function() { } };
		randomStreamMock = { shuffle: function() { }, randIntBetweenInclusive: function() {} };
		answerChoicesMock = { add: function() { }, getChoices: function() { } };
		choicesMock = { indexOf: function() {} };
		fromDouble = sandbox.spy();
		answerDouble = sandbox.spy();
		paramsDouble = sandbox.spy();
		maxDouble = sandbox.spy();
		minDouble = sandbox.spy();
		fromRadDouble = sandbox.spy();
		toRadDouble = sandbox.spy();
		indexDouble = sandbox.spy();
		questionTextDouble = sandbox.spy();
		conversionDouble = {
			radix: { from: fromRadDouble, to: toRadDouble },
			range: { min: minDouble, max: maxDouble }
		}

		getConversionStub = sandbox.stub(paqChangeOfBaseFR, "getConversion").returns(conversionDouble);
		shuffleStub = sandbox.stub(randomStreamMock, "shuffle");
		randIntBetweenInclusiveStub = sandbox.stub(randomStreamMock, "randIntBetweenInclusive").returns(numToConvertMock);
		toStringStub = sandbox.stub(numToConvertMock, "toString")
			.withArgs(fromRadDouble).returns(fromDouble)
			.withArgs(toRadDouble).returns(answerDouble);
		UniqueChoicesStub = sandbox.stub(paqUtils, "UniqueChoices").returns(answerChoicesMock);
		addStub = sandbox.stub(answerChoicesMock, "add");
		getChoicesStub = sandbox.stub(answerChoicesMock, "getChoices").returns(choicesMock);
		addDistractorChoicesStub = sandbox.stub(paqChangeOfBaseMC, "addDistractorChoices");
		addRandomChoicesStub = sandbox.stub(paqChangeOfBaseMC, "addRandomChoices");
		indexOfStub = sandbox.stub(choicesMock, "indexOf").returns(indexDouble);
		generateQuestionTextStub = sandbox.stub(paqChangeOfBaseFR, "generateQuestionText").returns(questionTextDouble);

		res = paqChangeOfBaseMC.generate(randomStreamMock, paramsDouble);

	});
	afterEach(function() {
		sandbox.restore();
	});

	describe("getConversion", function() {
		it("should be called with appropriate parameters", function() {
			expect(getConversionStub.calledOnce).to.be.true;
			expect(getConversionStub.calledWith(
				randomStreamMock, paramsDouble, paqChangeOfBaseFR.defaultConversions
			)).to.be.true;
		});
	});
	describe("numToConvert", function() {
		it("should be selected with randIntBetweenInclusive with min, max from conversion", function() {
			expect(randIntBetweenInclusiveStub.calledOnce).to.be.true;
			expect(randIntBetweenInclusiveStub.calledWith(minDouble, maxDouble)).to.be.true;
		});
	});
	describe("number to convert string format", function() {
		it("should be determined by toString(fromRad) on numToConvert", function() {
			expect(toStringStub.withArgs(fromRadDouble).calledOnce).to.be.true;
		});
	});
	describe("answer", function() {
		it("should be determined by toString(toRad) on numToConvert", function() {
			expect(toStringStub.withArgs(toRadDouble).calledOnce).to.be.true;
		});
	});
	describe("answerChoices", function() {
		it("should create a new UniqueChoices object with limit of 5", function() {
			expect(UniqueChoicesStub.calledOnce).to.be.true;
			expect(UniqueChoicesStub.calledWith(5)).to.be.true;
		});
		it("should add the answer", function() {
			expect(addStub.calledOnce).to.be.true;
			expect(addStub.calledWith(answerDouble)).to.be.true;
		});
	});
	describe("addDistractorChoices", function() {
		it("should be called with appropriate parameters", function() {
			expect(addDistractorChoicesStub.calledOnce).to.be.true;
			expect(addDistractorChoicesStub.calledWith(
				answerChoicesMock, fromRadDouble, toRadDouble, fromDouble, numToConvertMock
			)).to.be.true;
		});
	});
	describe("addRandomChoices", function() {
		it("should be called with appropriate parameters", function() {
			expect(addRandomChoicesStub.calledOnce).to.be.true;
			expect(addRandomChoicesStub.calledWith(
				randomStreamMock, answerChoicesMock, toRadDouble, minDouble, maxDouble
			)).to.be.true;
		});
	});
	describe("unique choices result", function() {
		it("should be the result of answerChoices.getChoices()", function() {
			expect(getChoicesStub.calledOnce).to.be.true;
		});
		it("should be set after the correct, distractor, and random choices were generated", function() {
			expect(getChoicesStub.calledAfter(addStub)).to.be.true;
			expect(getChoicesStub.calledAfter(addDistractorChoicesStub)).to.be.true;
			expect(getChoicesStub.calledAfter(addRandomChoicesStub)).to.be.true;
		});
		it("should be shuffled by randomStream's shuffle method", function() {
			expect(shuffleStub.calledOnce).to.be.true;
			expect(shuffleStub.calledWith(choicesMock)).to.be.true;
		});
	});
	describe("properties assigned to this", function() {
		describe("choices", function() {
			it("should be assigned the shuffled choices", function() {
				expect(res.choices).to.equal(choicesMock);
			});
		});
		describe("answer", function() {
			it("should be the index of the correct answer in choices", function() {
				expect(indexOfStub.withArgs(answerDouble).calledOnce).to.be.true;
				expect(res.answer).to.equal(indexDouble);
			});
		});
		describe("question", function() {
			it("should be determined by generateQuestionText(randomStream, from, fromRad, toRad)", function() {
				expect(generateQuestionTextStub.withArgs(
					randomStreamMock, fromDouble, fromRadDouble, toRadDouble
				).calledOnce).to.be.true;
			});
			it("should be assigned to result of generateQuestionText", function() {
				expect(res.question).to.equal(questionTextDouble);
			});
		});
		describe("format", function() {
			it("should be multiple-choice", function() {
				expect(res.format).to.equal("multiple-choice");
			});
		});
	});
});






















