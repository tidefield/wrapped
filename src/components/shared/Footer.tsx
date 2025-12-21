import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="p-1 text-sm self-center">
      <span>
        💙 Love this?&nbsp;
        <a
          href="https://buymeacoffee.com/tidefield"
          target="_blank"
          rel="noopener"
          className="text-brand-blue underline font-semibold"
        >
          Buy me a coffee
        </a>
        &nbsp;☕
      </span>
      <span>
        &nbsp;or&nbsp;
        <a
          href="https://forms.gle/LQm8MAkahjd5zWvA6"
          target="_blank"
          className="text-brand-blue underline font-semibold"
        >
          send a feedback
        </a>
        &nbsp;✉️
      </span>
    </div>
  );
};

export default Footer;
