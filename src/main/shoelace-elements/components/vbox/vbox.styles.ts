import { css } from 'lit';

export default css`
  .base {
    display: flex;
    flex-direction: column;
  }

  .align-items-top {
    align-items: start;
  }

  .align-items-center {
    align-items: center;
  }

  .align-items-bottom {
    align-items: flex-end;
  }

  .gap-none {
    gap: 0;
  }

  .gap-tiny {
    gap: 0.25rem;
  }

  .gap-small {
    gap: 0.5rem;
  }

  .gap-medium {
    gap: 1.25rem;
  }

  .gap-large {
    gap: 2.5rem;
  }

  .gap-huge {
    gap: 3.75rem;
  }
`;
