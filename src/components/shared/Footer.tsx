import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="p-6">
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
        &nbsp;&nbsp;☕
      </span>
      <span>
        &nbsp;&nbsp;or&nbsp;&nbsp;
        <a
          href="https://forms.gle/LQm8MAkahjd5zWvA6"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-blue underline font-semibold"
        >
          send a feedback
        </a>
        &nbsp;&nbsp;✉️
      </span>
    </div>
  );
};

export default Footer;
