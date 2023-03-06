import React, { Dispatch, SetStateAction, useContext } from 'react';

export type PageState = readonly [() => JSX.Element, Dispatch<SetStateAction<() => JSX.Element>>];

const PageContext = React.createContext<PageState>(undefined as never);

export default PageContext;

export const usePage = () => useContext(PageContext);

export const PreviousPageContext = React.createContext<() => JSX.Element>(undefined as never);
