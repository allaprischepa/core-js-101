/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(w, h) {
  return {
    width: w,
    height: h,
    getArea: () => w * h,
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);

  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Selector {
  constructor(key, value) {
    this.selectors = [{
      type: key,
      selector: value,
    }];

    this.selectorsError = new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    this.selectorsOrder = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
    this.selectorsOrderError = new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
  }

  element(value) { return this.addSelector('element', value); }

  id(value) { return this.addSelector('id', `#${value}`); }

  class(value) { return this.addSelector('class', `.${value}`); }

  attr(value) { return this.addSelector('attr', `[${value}]`); }

  pseudoClass(value) { return this.addSelector('pseudoClass', `:${value}`); }

  pseudoElement(value) { return this.addSelector('pseudoElement', `::${value}`); }

  addSelector(sType, sValue) {
    if (['element', 'id', 'pseudoElement'].includes(sType) && this.hasSelectorType(sType)) throw this.selectorsError;

    this.selectors.push({
      type: sType,
      selector: sValue,
    });

    if (!this.checkSelectorsOrder()) throw this.selectorsOrderError;

    return this;
  }

  stringify() {
    return this.selectors.map((el) => el.selector).join('');
  }

  hasSelectorType(type) {
    return this.selectors.filter((el) => el.type === type).length;
  }

  checkSelectorsOrder() {
    const selectorsTypes = this.selectors
      .map((el) => el.type)
      .filter((type) => this.selectorsOrder.includes(type));
    const selectorsOrder = this.selectorsOrder.filter((type) => selectorsTypes.includes(type));

    return selectorsOrder.every((type, i) => type === selectorsTypes[i]);
  }
}

const cssSelectorBuilder = {
  element(value) { return new Selector('element', value); },

  id(value) { return new Selector('id', `#${value}`); },

  class(value) { return new Selector('class', `.${value}`); },

  attr(value) { return new Selector('attr', `[${value}]`); },

  pseudoClass(value) { return new Selector('pseudoClass', `:${value}`); },

  pseudoElement(value) { return new Selector('pseudoElement', `::${value}`); },

  combine(selector1, combinator, selector2) {
    const combined = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;

    return new Selector('combined', combined);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
