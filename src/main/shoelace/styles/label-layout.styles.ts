import { css } from 'lit';

export default css`
  .label-layout-vertical {
    --label-layout-direction: column;
    --label-layout-width: auto;
    --label-layout-gap: 0;
    --label-layout-justify: stretch;
    --label-layout-placement: start;
  }

  .label-layout-horizontal {
    --label-layout-direction: row;
    --label-layout-width: 9rem;
    --label-layout-gap: 1.25rem;
    --label-layout-justify: start;
    --label-layout-placement: end;
  }
`;
