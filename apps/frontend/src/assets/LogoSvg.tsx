export const LogoSvg = ({
  id = "logo",
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="128"
    height="128"
    viewBox="0 0 128 128"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clip-path={`url(#clip0_${id})`}>
      <path
        d="M112 32C120.837 32 128 24.8366 128 16C128 7.16344 120.837 0 112 0H16C7.16344 0 0 7.16344 0 16C0 24.8366 7.16344 32 16 32H112Z"
        fill={`url(#paint0_linear_logo_${id})`}
      />
      <path
        d="M48 64C48 99.3462 76.6538 128 112 128C120.837 128 128 120.837 128 112C128 103.163 120.837 96 112 96C94.3269 96 80 81.6731 80 64C80 46.3269 94.3269 32 112 32C120.837 32 128 24.8366 128 16C128 7.16344 120.837 0 112 0C88.311 0 67.628 12.8704 56.5621 32C51.1166 41.4135 48 52.3428 48 64Z"
        fill={`url(#paint1_linear_logo_${id})`}
      />
    </g>
    <defs>
      <linearGradient
        id={`paint0_linear_logo_${id}`}
        x1="0"
        y1="0"
        x2="128"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="var(--foreground)" />
        <stop offset="1" stop-color="var(--muted-foreground)" />
      </linearGradient>
      <linearGradient
        id={`paint1_linear_logo_${id}`}
        x1="128"
        y1="128"
        x2="128"
        y2="-2.38419e-06"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="var(--foreground)" />
        <stop offset="1" stop-color="var(--muted-foreground)" />
      </linearGradient>
      <clipPath id="clip0_1067_47">
        <rect width="128" height="128" fill="white" />
      </clipPath>
    </defs>
  </svg>
)
