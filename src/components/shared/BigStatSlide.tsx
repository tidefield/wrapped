import React from "react";

interface SlideProps {
  title: string;
  value?: string | number;
  label?: string;
  description?: string;
  valueStyle?: React.CSSProperties;
  children?: React.ReactNode;
}

export const BigStatSlide: React.FC<SlideProps> = ({
  title,
  value,
  label,
  description,
  valueStyle,
  children,
}) => {
  return (
    <div className="active relative flex flex-col justify-center items-center h-full w-full">
      <div className="slide-header absolute top-4 left-0 right-0 text-center">
        🎁 Fitness (un)Wrapped
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <div className="text-3xl font-bold">{title}</div>
        {value && (
          <div className="text-5xl font-bold" style={valueStyle}>
            {value}
          </div>
        )}
        {label && <div className="stat-label">{label}</div>}
        {description && <p>{description}</p>}
        {children}
      </div>
    </div>
  );
};
