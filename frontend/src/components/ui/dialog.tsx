import * as React from 'react';

export const Dialog = ({ children, open }: any) => open ? <div>{children}</div> : null;
export const DialogContent = ({ children, className }: any) => <div className={className}>{children}</div>;
export const DialogHeader = ({ children }: any) => <div>{children}</div>;
export const DialogTitle = ({ children, className }: any) => <h2 className={className}>{children}</h2>;
export const DialogTrigger = ({ children }: any) => <div>{children}</div>;
