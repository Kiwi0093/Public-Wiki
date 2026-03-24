import React from 'react';
// 匯入原有的組件
import MDXComponents from '@theme-original/MDXComponents';

// 定義你的 Rb 組件
const Rb = ({ children, rt, color = "blue", rtColor = "orange" }) => (
  <ruby style={{ color }}>
    {children}
    <rp>(</rp>
    <rt style={{ color: rtColor, fontSize: '0.8em' }}>{rt}</rt>
    <rp>)</rp>
  </ruby>
);

export default {
  ...MDXComponents,
  Rb, // 註冊 Rb 為全域組件
};
