export { updateComplexArray, updateInitialArray }

function updateComplexArray(complexArray, rules, arrayRules,  nodeArray, playedCount) {
    console.log(nodeArray);
    rules.forEach(rule => {
        complexArray[rule.index] = verifyRules(complexArray[rule.index], rule, nodeArray, playedCount);
    });
    arrayRules.forEach((object, index) => {complexArray[index] = forceValue(complexArray[index], object.loop, object.start, object.end);});
    return complexArray;
}

function updateInitialArray(complexArray, rules, arrayRules) {
    rules.forEach(rule => {
        complexArray[rule.index] = verifyRules(complexArray[rule.index], rule);
    });
    arrayRules.forEach((object, index) => {complexArray[index] = forceValue(complexArray[index], object.loop, object.start, object.end);});
    return complexArray;
}

function verifyRules(initialValue, rule, nodeArray = [], playedCount = 0) {
    var date = new Date();
    var day = date.getDay();
    var hour = date.getHours();
    let randomNum = Math.random();

    console.log("  SilDEBUG: Verifying rules.");
    if ('dayOfWeek' in rule.condition) {if (day === rule.condition.dayOfWeek) {initialValue = updateValue(initialValue, rule.action, rule.amount);}}
    if ('hourAbove' in rule.condition) {if (hour >= rule.condition.hourAbove) {initialValue = updateValue(initialValue, rule.action, rule.amount);}}
    if ('hourBelow' in rule.condition) {if (hour <= rule.condition.hourBelow) {initialValue = updateValue(initialValue, rule.action, rule.amount);}}
    if ('randomChanceBelow' in rule.condition) {if (randomNum < rule.condition.randomChanceBelow) {initialValue = updateValue(initialValue, rule.action, rule.amount);}}
    if ('visited' in rule.condition) {
        const isInArray = (value, array) => array.includes(value); 
        if (isInArray(rule.condition.visited, nodeArray)) {
            initialValue = updateValue(initialValue, rule.action, rule.amount);
        }
    }
    if ('totalCountExceeds' in rule.condition) {if (playedCount > rule.condition.totalCountExceeds) {initialValue = updateValue(initialValue, rule.action, rule.amount);}}

    return initialValue;
}

function updateValue(initialValue, action, amount) {
    if (action === "set") {initialValue = amount;}
    if (action === "increment") {initialValue += amount;}
    if (action === "decrement") {initialValue -= amount;}
    if (action === "toggle") {
        if (initialValue === 0) {initialValue = 1;}
        else if (initialValue === 1) {initialValue = 0;}
    }
    return initialValue;
}

function forceValue(initialValue, loop, start, end) {
    if (initialValue >= start && initialValue <= end) {
        console.log("  SilDEBUG: Inital value falls within bounds.");
        return initialValue;
    }
    console.log("  SilDEBUG: Inital value doesn't fall within bounds.");
    if (loop) {
        if (initialValue < start) {while (initialValue < start) {initialValue += (end - start + 1);}}
        if (initialValue > end) {while (initialValue > end) {initialValue -= (end - start + 1);}}
    } else {
        if (initialValue < start) {initialValue = start;}
        if (initialValue > end) {initialValue = end;}
    }
    return initialValue;
}