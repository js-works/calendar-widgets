import { createElement, render } from 'preact';
import { useState } from 'preact/hooks';
import { createUseDialogsHook } from 'shoelace-elements/internal';

// === exports =======================================================

export { useDialogs };

// === hooks =========================================================

const useDialogs = createUseDialogsHook({
  createElement,
  useState,
  render
});
