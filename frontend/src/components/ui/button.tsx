import * as React from 'react';

export const Button = ({ children, ...props }: any) => (
  <button {...props}>{children}</button>
);
