import Data from 'lib/Data';
import React, { useContext } from 'react';

export const DataContext = React.createContext<Data>(undefined as never);

export const useData = () => useContext(DataContext);
