export default 'data:image/svg+xml,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <defs>
        <clipPath id="cut-off-bottom">
          <rect x="8" y="0" width="8" height="8" />
        </clipPath>
      </defs>
      
      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
      <circle r="6" cx="8" cy="8" fill="currentColor" clip-path="url(#cut-off-bottom)" />
    </svg>
  `);
