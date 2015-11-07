function UniqueChoices(limit) {
	this._limit = (Number.isInteger(limit)) ? limit : 4;
	this._uniqueChoices = new Set([]);
	this._choices = [];
}

UniqueChoices.prototype.add = function(choice) {
	if (this.full())
		return false;
	if (this._uniqueChoices.has(choice))
		return false;
	this._uniqueChoices.add(choice);
	this._choices.push(choice);
	return true;
}

UniqueChoices.prototype.addAll = function(choicesArray) {
	if (!Array.isArray(choicesArray))
		throw "Invalid Parameter for Choices: addAll expects array parameter";
	for (var i = 0; choicesArray.length > i && !this.full(); i++) 
		this.add(choicesArray[i]);
}

UniqueChoices.prototype.getChoices = function() {
	return this._choices;
}

UniqueChoices.prototype.full = function() {
	return this._choices.length >= this._limit;
}

module.exports.UniqueChoices = UniqueChoices;







