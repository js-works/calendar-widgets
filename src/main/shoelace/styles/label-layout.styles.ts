import { css } from 'lit';

export default css`
  .label-layout-vertical {
    --label-layout-direction: column;
    --label-layout-width: auto;
    --label-layout-gap: 0;
    --label-layout-justify: stretch;
    --label-layout-align: start;
  }

  .label-layout-horizontal {
    --label-layout-direction: row;
    --label-layout-width: 9rem;
    --label-layout-gap: 1.25rem;
    --label-layout-justify: center;
    --label-layout-align: end;
  }
`;
