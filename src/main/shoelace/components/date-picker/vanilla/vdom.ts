// Code is based on this article here - many thanks to Jason Yu:
// https://dev.to/ycmjason/building-a-simple-virtual-dom-from-scratch-3d05

export { h, diff, renderVElement as render, renderToString };
export type { VElement, VNode };

type Attrs = Record<string, string | number | null | undefined>;
type Patch = (elem: Element | Text) => void;

type VElement = {
  tagName: string;
  attrs: Attrs | null;
  children: VNode[];
};

type VNode = string | number | VElement | null | undefined;

function h(
  tagName: string,
  attrs: Attrs | null = null,
  ...children: (VNode | VNode[])[]
): VElement {
  return {
    tagName,
    attrs,
    children: children.flat().filter((it) => it != null && it !== '')
  };
}

function renderToString(vnode: VNode): string {
  const tokens: string[] = [];
  const push = tokens.push.bind(tokens);
  const encodedEntities = /["&<]/g;

  const entityReplacements: Record<string, string> = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;'
  };

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

function renderVElement({ tagName, attrs, children }: VElement): HTMLElement {
  const elem = document.createElement(tagName);

  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v != null) {
        elem.setAttribute(k, String(v));
      }
    }
  }

  for (const child of children.flat()) {
    if (child !== null && child !== '') {
      elem.append(renderVNode(child));
    }
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
      patches.push(($node) => {
        if ($node instanceof Element) {
          if (v == null) {
            $node.removeAttribute(k);
          } else {
            $node.setAttribute(k, String(v));
          }
        }
      });
    }
  }

  for (const k in oldAttrs) {
    if (!(k in newAttrs)) {
      patches.push(($node) => {
        if ($node instanceof Element) {
          $node.removeAttribute(k);
        }
      });
    }
  }

  return ($node) => patches.forEach((patch) => patch($node));
}

function diffChildren(oldVChildren: VNode[], newVChildren: VNode[]): Patch {
  const childPatches: Patch[] = [];

  oldVChildren.forEach((oldVChild, i) =>
    childPatches.push(diff(oldVChild, newVChildren[i]))
  );

  const additionalPatches: Patch[] = [];

  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push(($node) => {
      $node.appendChild(renderVNode(additionalVChild));
    });
  }

  return ($parent) => {
    const length = Math.min(childPatches.length, $parent.childNodes.length);
    const childNodes: Node[] = [];

    for (let i = 0; i < length; ++i) {
      childNodes.push($parent.childNodes[i]);
    }

    for (let i = 0; i < length; ++i) {
      const patch = childPatches[i];
      const $child = childNodes[i];
      patch($child as any);
    }

    for (const patch of additionalPatches) {
      patch($parent);
    }
  };
}

function diff(oldVTree: VNode, newVTree: VNode): Patch {
  if (oldVTree == null) {
    return ($node) => {
      const content = renderVNode(newVTree);
      $node.replaceWith(content);
      return content;
    };
  }

  if (newVTree == null) {
    return ($node) => $node.remove();
  }

  if (
    typeof oldVTree === 'string' ||
    typeof oldVTree === 'number' ||
    typeof newVTree === 'string' ||
    typeof newVTree === 'number'
  ) {
    return oldVTree !== newVTree
      ? ($node) => $node.replaceWith(renderVNode(newVTree))
      : () => {};
  }

  if (oldVTree.tagName !== newVTree.tagName) {
    return ($node) => $node.replaceWith(renderVElement(newVTree));
  }

  const patchAttrs = diffAttrs(oldVTree.attrs || {}, newVTree.attrs || {});
  const patchChildren = diffChildren(oldVTree.children, newVTree.children);

  return ($node) => {
    patchAttrs($node);
    patchChildren($node);
  };
}

// cSpell:words velem vnode
