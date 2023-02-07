class URLParser {
  constructor(delimiterPath, delimiterVar, delimiterParams, delimiterQParams, delimiterQValue) {
    this.delimiterPath = delimiterPath;
    this.delimiterParams = delimiterParams;
    this.delimiterQParams = delimiterQParams;
    this.delimiterVar = delimiterVar;
    this.delimiterQValue = delimiterQValue;
  }
  getVal(val) {
    if (isNaN(val)) {
      return val;
    } else {
      return +val;
    }
  };

  getQueryParamsValue(qp) {
    const result = {};
    try {
      const keyValues = qp.split(this.delimiterQParams);
      keyValues.forEach(kv => {
        const [r, v] = kv.split(this.delimiterQValue);
        result[r] = this.getVal(v);
      })
      return result;
    } catch (error) {
      console.log("Error creating query param values");
      return result;
    }
  };

  registerUrlFormat(path) {
    const valueIndexes = [];
    const parts = path.split(this.delimiterPath);
  
    const keys = [];
    for (const p in parts) {
      if (parts[p].startsWith(this.delimiterVar)) {
        keys.push(parts[p].slice(1));
        valueIndexes.push(p);
      }
    }
  
    return [keys, valueIndexes];
  };

  getDataFromFormat(keys, valueIndexes, url) {
    const parts = url.split(this.delimiterPath);
  
    const values = [];
    for (const p in parts) {
      if (!valueIndexes.includes(p)) {
        continue
      }
      values.push(parts[p]);
      }
  
  
    let result = {};
    values.reduce((_, currentVal, index) => {
      if (currentVal.includes(this.delimiterParams)) {
        const [lastValue, queryParams] = currentVal.split(this.delimiterParams);
        result = { ...result, [keys[index]]: this.getVal(lastValue) }
  
        const qpValues = this.getQueryParamsValue(queryParams);
        result = { ...result, ...qpValues }
        return result; 
      }
  
      result = { ...result, [keys[index]] : this.getVal(currentVal) }
      return result;
    }, result)
    return result;
  }
}
 
function main() {
  //Provided Any URL Format
  const urlParser = new URLParser("/", ":", "?", "&", "=");

  //Register URL Format
  const urlFormat = '/:version/api/:collection/:id';
  const [keys, valueIndexes] = urlParser.registerUrlFormat(urlFormat);

  //Executing program
  const urlExample = '/6/api/listings/3?sort=desc&limit=10';
  const result = urlParser.getDataFromFormat(keys, valueIndexes, urlExample);

  console.log("Program Result", JSON.stringify(result));
}

main();