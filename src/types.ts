import React from 'react';

export type PageId = 'P001' | 'P002' | 'P003' | 'P004' | 'P005';

export interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  extra?: React.ReactNode;
}
