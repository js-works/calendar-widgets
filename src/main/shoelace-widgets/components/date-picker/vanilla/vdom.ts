// Code is based on this article here - many thanks to Jason Yu:
// https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05

// === exports =======================================================

export { h, render, renderToString };
export type { VElement, VNode };

// === types =========================================================

type Attrs = Record<string, string | number | boolean | null | undefined>;
type Patch = (node: Element | Text) => void;

type VElement = {
  tagName: string;
  attrs: Attrs | null;
  children: VNode[];
};

type VNode = string | number | VElement | null | undefined;

// === local constants ===============================================

const symbolVElem = Symbol('velem');
const encodedEntities = /["&<]/g;

const entityReplacements: Record<string, string> = {
  '"': '&quot;',
  '&': '&amp;',
  '<': '&lt;'
};

// === exported functions ============================================

function h(
  tagName: string,
  attrs: Attrs | null = null,
  ...children: (VNode | VNode[])[]
): VElement {
  return {
    tagName,
    attrs,
    children: children.flat(100)
  };
}

function renderToString(vnode: VNode): string {
  const tokens: string[] = [];
  const push = tokens.push.bind(tokens);

  const encodeEntities = (s: string) =>
    s.replaceAll(encodedEntities, (ch) => entityReplacements[ch]);

  const process = (vnode: VNode): void => {
    if (vnode == null) {
      return;
    }

    if (typeof vnode === 'string') {
      push(vnode);
    } else if (typeof vnode === 'number') {
      push(String(vnode));
    } else {
      push('<', vnode.tagName);

      if (vnode.attrs) {
        for (const [k, v] of Object.entries(vnode.attrs)) {
          if (v !== null) {
            push(' ', k, '="', encodeEntities(String(v)), '"');
          }
        }
      }

      push('>');
      vnode.children.forEach(process);
      push('</', vnode.tagName, '>');
    }
  };

  process(vnode);

  return tokens.join('');
}

function render(container: Element, velem: VElement) {
  const oldVElem = (container as any)[symbolVElem];

  if (!oldVElem) {
    container.replaceChildren(renderVElement(velem));
  } else {
    diff(oldVElem, velem)(container.firstElementChild!);
  }

  (container as any)[symbolVElem] = velem;
}

// === local functions ===============================================

function renderVElement(velem: VElement): HTMLElement {
  const elem = document.createElement(velem.tagName);

  if (velem.attrs) {
    for (const [k, v] of Object.entries(velem.attrs)) {
      if (v != null && v !== false) {
        elem.setAttribute(k, v === true ? '' : String(v));
      }
    }
  }

  for (const vchild of velem.children) {
    elem.append(renderVNode(vchild));
  }

  return elem;
}

function renderVNode(vnode: VNode): HTMLElement | Text {
  return vnode == null
    ? document.createTextNode('')
    : typeof vnode !== 'object'
    ? document.createTextNode(String(vnode))
    : renderVElement(vnode);
}

function diffAttrs(oldAttrs: Attrs, newAttrs: Attrs): Patch {
  const patches: Patch[] = [];

  for (const [k, v] of Object.entries(newAttrs)) {
    if (v !== oldAttrs[k]) {
      patches.push((node) => {
        if (node instanceof Element) {
          updateAttribute(node, k, v);
        }
      });
    }
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push((node) => {
        if (node instanceof Element) {
          node.removeAttribute(k);
        }
      });
    }
  }

  return (node) => patches.forEach((patch) => patch(node));
}

function diffChildren(oldVChildren: VNode[], newVChildren: VNode[]): Patch {
  const childPatches: Patch[] = [];

  oldVChildren.forEach((oldVChild, i) => {
    if (i < newVChildren.length) {
      childPatches.push(diff(oldVChild, newVChildren[i]));
    } else {
      childPatches.push((node) => node.remove());
    }
  });

  const additionalPatches: Patch[] = [];

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push((node) => {
      node.appendChild(renderVNode(additionalVChild));
    });
  }

  return (parent) => {
    const length = Math.min(childPatches.length, parent.childNodes.length);
    const childNodes: Node[] = [];

    for (let i = 0; i < length; ++i) {
      childNodes.push(parent.childNodes[i]);
    }

    for (let i = 0; i < length; ++i) {
      childPatches[i](childNodes[i] as any);
    }

    for (const patch of additionalPatches) {
      patch(parent);
    }
  };
}

function diff(oldVTree: VNode, newVTree: VNode): Patch {
  if (oldVTree == null) {
    return (node) => node.replaceWith(renderVNode(newVTree));
  }

  if (newVTree == null) {
    return (node) => node.replaceWith(document.createTextNode(''));
  }

  if (
    typeof oldVTree === 'string' ||
    typeof oldVTree === 'number' ||
    typeof newVTree === 'string' ||
    typeof newVTree === 'number'
  ) {
    return oldVTree !== newVTree
      ? (node) => node.replaceWith(renderVNode(newVTree))
      : () => {};
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    return (node) => node.replaceWith(renderVElement(newVTree));
  }

  const patchAttrs = diffAttrs(oldVTree.attrs || {}, newVTree.attrs || {});
  const patchChildren = diffChildren(oldVTree.children, newVTree.children);

  return (node) => {
    patchAttrs(node);
    patchChildren(node);
  };
}

// === local helpers =================================================

function updateAttribute(
  elem: Element,
  attrName: string,
  value: string | number | boolean | null | undefined
) {
  if (value == null || value === false) {
    elem.removeAttribute(attrName);
  } else {
    const val = value === true ? '' : String(value);
    elem.setAttribute(attrName, val);

    if (elem.tagName === 'INPUT' && attrName === 'value') {
      (elem as HTMLInputElement).value = val;
    }
  }
}

// cSpell:words vchild vchildren velem vnode
