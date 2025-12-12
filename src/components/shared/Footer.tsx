import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="privacy-note" style={{ marginTop: "1rem" }}>
      <span>
        💙 Love this?{" "}
        <a
          href="https://buymeacoffee.com/tidefield"
          target="_blank"
          rel="noopener"
          style={{
            color: "#4d65ff",
            textDecoration: "underline",
            fontWeight: 600,
          }}
        >
          Buy me a coffee
        </a>{" "}
        ☕
      </span>
      <span>
        or{" "}
        <a
          href="https://forms.gle/LQm8MAkahjd5zWvA6"
          target="_blank"
          style={{
            color: "#4d65ff",
            textDecoration: "underline",
            fontWeight: 600,
          }}
        >
          send a feedback
        </a>{" "}
        ✉️
      </span>
    </div>
  );
};

export default Footer;
