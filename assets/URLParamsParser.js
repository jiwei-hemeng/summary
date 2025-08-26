class URLParamsParser {
  constructor(url = window.location.href) {
    this.url = new URL(url);
    this.params = new URLSearchParams(this.url.search);
  }
  get(key, defaultValue = null) {
    return this.params.get(key) || defaultValue;
  }
  getNumber(key, defaultValue = 0) {
    const value = this.params.get(key);
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  getBoolean(key, defaultValue = false) {
    const value = this.params.get(key);
    if (value === null) return defaultValue;
    return value.toLowerCase() === "true" || value === "1";
  }
  getArray(key, separator = ",", defaultValue = []) {
    const value = this.params.get(key);
    return value
      ? value.split(separator).map((item) => item.trim())
      : defaultValue;
  }
  getObject() {
    const obj = {};
    for (const [key, value] of this.params.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  set(key, value) {
    this.params.set(key, value);
    return this;
  }
  remove(key) {
    this.params.delete(key);
    return this;
  }
  toString() {
    return this.params.toString();
  }
  updateURL(pushState = true) {
    const newURL = `${this.url.pathname}?${this.toString()}`;
    if (pushState) {
      history.pushState({}, "", newURL);
    } else {
      history.replaceState({}, "", newURL);
    }
  }
}
// Usage examples
const parser = new URLParamsParser(
  "https://example.com?page=2&active=true&tags=js,react,node"
);
console.log(parser.getNumber("page")); // 2
console.log(parser.getBoolean("active"));
// // true
console.log(parser.getArray("tags")); // ['js', 'react', 'node']
// Update URL
parser.set("page", 3).remove("active").updateURL();
