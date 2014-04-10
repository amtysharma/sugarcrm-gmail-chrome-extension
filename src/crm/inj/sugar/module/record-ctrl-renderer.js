// Copyright 2014 YDN Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Record module panel renderer.
 *
 */


goog.provide('ydn.crm.inj.sugar.module.RecordCtrlRenderer');
goog.require('goog.ui.ControlRenderer');
goog.require('ydn.crm.inj.sugar.module.Group');
goog.require('ydn.crm.inj.sugar.module.group.Address');
goog.require('ydn.crm.inj.sugar.module.group.Email');
goog.require('ydn.crm.inj.sugar.module.group.List');
goog.require('ydn.crm.inj.sugar.module.group.Name');
goog.require('ydn.crm.inj.sugar.model.GDataSugar');



/**
 * Contact sidebar panel.
 * @constructor
 * @struct
 * @extends {goog.ui.ControlRenderer}
 * @suppress {checkStructDictInheritance} suppress closure-library code.
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer = function() {
  goog.base(this);
};
goog.inherits(ydn.crm.inj.sugar.module.RecordCtrlRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(ydn.crm.inj.sugar.module.RecordCtrlRenderer);


/**
 * @define {boolean} debug flag.
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.DEBUG = false;


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS = 'record-panel';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER = 'record-header';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT = 'record-content';


/**
 * @const
 * @type {string}
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.NAME_DETAIL = 'detail';


/**
 * @const
 * @type {string} class name for body content when viewing.
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL = 'detail';


/** @return {string} */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.prototype.getCssClass = function() {
  return ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS;
};


/**
 * @inheritDoc
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.prototype.createDom = function(x) {
  var root = goog.base(this, 'createDom', x);
  var ctrl = /** @type {ydn.crm.inj.sugar.module.RecordCtrl} */ (x);
  var dom = ctrl.getDomHelper();

  var header = dom.createDom('div', ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER);
  var content = dom.createDom('div', ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT);
  root.appendChild(header);
  root.appendChild(content);
  ctrl.setElementInternal(root);

  // create ui elements

  var a_detail = dom.createDom('a', {
    'name': ydn.crm.inj.sugar.module.RecordCtrlRenderer.NAME_DETAIL
  }, 'detail');
  a_detail.href = '#';

  header.appendChild(a_detail);

  var model = ctrl.getModel();
  var groups = model.listGroups();
  var group_renderer = ydn.crm.inj.sugar.module.GroupRenderer.getInstance();
  for (var i = 0; i < groups.length; i++) {
    var name = groups[i];
    var field;
    var field_model = model.getGroupModel(name);
    if (/address/i.test(name)) {
      field = new ydn.crm.inj.sugar.module.group.Address(field_model, dom);
    } else if (name == 'email') {
      field = new ydn.crm.inj.sugar.module.group.Email(field_model, dom);
    } else if (name == 'phone') {
      field = new ydn.crm.inj.sugar.module.group.List(field_model, dom);
    } else if (name == 'name') {
      field = new ydn.crm.inj.sugar.module.group.Name(field_model, dom);
    } else {
      field = new ydn.crm.inj.sugar.module.Group(field_model, group_renderer, dom);
    }
    ctrl.addChild(field, true);
  }

  return root;
};


/**
 * Get View click control
 * @param {Element} ele ancentor
 * @return {Element}
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.prototype.getDetailButton = function(ele) {
  return ele.querySelector('a[name=' +
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.NAME_DETAIL + ']');
};


/**
 * Reset control UI to initial state.
 * @param {ydn.crm.inj.sugar.module.RecordCtrl} ctrl
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.prototype.reset = function(ctrl) {
  var ele = ctrl.getElement();
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT, ele);
  var a_detail = this.getDetailButton(header_ele);
  a_detail.textContent = 'detail';
  goog.style.setElementShown(a_detail, true);
};


/**
 * Toggle view.
 * @param {Element} ele
 */
ydn.crm.inj.sugar.module.RecordCtrlRenderer.prototype.toggleDetail = function(ele) {
  var header_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_HEADER, ele);
  var content_ele = goog.dom.getElementByClass(
      ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_CONTENT, ele);
  var a_view = this.getDetailButton(header_ele);
  if (content_ele.classList.contains(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL)) {
    a_view.textContent = 'detail';
    content_ele.classList.remove(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL);
  } else {
    a_view.textContent = 'less';
    content_ele.classList.add(ydn.crm.inj.sugar.module.RecordCtrlRenderer.CSS_CLASS_DETAIL);
  }
};



