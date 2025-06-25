"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";

type DelimitedTextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  onChange: (value: string) => void;
};

export const DelimitedTextarea: React.FC<DelimitedTextareaProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const original = e.target.value;
    const replaced = original.replace(/[・\/、\-\\\s\u3000]/g, ",");

    if (original !== replaced && !window.__delimiterAlertShown) {
      alert("他の区切り文字（スペース / バックスラッシュ ・ 、 - 等）はカンマ（,）に自動変換されます。");
      window.__delimiterAlertShown = true;
    }

    onChange(replaced);
  };

  return <Textarea value={value} onChange={handleChange} {...rest} />;
};