/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
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
function Rectangle(x, y) {
  this.width = x;
  this.height = y;
  Rectangle.prototype.getArea = function hello() {
    return this.width * this.height;
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
function getJSON(x) {
  return JSON.stringify(x);
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
function fromJSON(x, y) {
  const r = Object.create(x);
  const j = JSON.parse(y);
  Object.keys(j).forEach((k) => {
    r[k] = j[k];
  });
  return r;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
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

class Builder {
  constructor() {
    this.result = '';
    this.el = null;
    this.pseudo = null;
    this.error = 'Element, id and pseudo-element should not occur more then one time inside the selector';
    this.orderError = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';
    this.order = 0;
  }

  element(value) {
    if (this.order) throw new Error(this.orderError);
    if (this.el) throw new Error(this.error);
    this.el = true;
    this.result += value;
    return this;
  }

  id(value) {
    if (this.order > 1) throw new Error(this.orderError);
    if (this.order) throw new Error(this.error);
    this.order = 1;
    this.result += `#${value}`;
    return this;
  }

  class(value) {
    if (this.order > 2) throw new Error(this.orderError);
    this.order = 2;
    this.result += `.${value}`;
    return this;
  }

  attr(value) {
    if (this.order > 3) throw new Error(this.orderError);
    this.order = 3;
    this.result += `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.order > 4) throw new Error(this.orderError);
    this.order = 4;
    this.result += `:${value}`;
    return this;
  }

  pseudoElement(value) {
    this.order = 5;
    if (this.pseudo) throw new Error(this.error);
    this.pseudo = true;
    this.result += `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.result = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    return this.result;
  }
}

const cssSelectorBuilder = {

  element(value) {
    const element = new Builder();
    element.element(value);
    return element;
  },

  id(value) {
    const id = new Builder();
    id.id(value);
    return id;
  },

  class(value) {
    const setClass = new Builder();
    setClass.class(value);
    return setClass;
  },

  attr(value) {
    const attr = new Builder();
    attr.attr(value);
    return attr;
  },

  pseudoClass(value) {
    const pseudoClass = new Builder();
    pseudoClass.pseudoClass(value);
    return pseudoClass;
  },

  pseudoElement(value) {
    const pseudoElement = new Builder();
    pseudoElement.pseudoElement(value);
    return pseudoElement;
  },

  combine(selector1, combinator, selector2) {
    const combine = new Builder();
    combine.combine(selector1, combinator, selector2);
    return combine;
  },

};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
