import { createElement, useState, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { createUseDialogsHook } from 'shoelace-widgets/internal';

// === exports =======================================================

export { useDialogs };

// === hooks =========================================================

const useDialogs = createUseDialogsHook<ReactNode>({
  createElement,
  useState,

  render: (content: ReactNode, target: HTMLElement) => {
    const root = createRoot(target);

    root.render(content);
  }
});
