import { createElement } from 'react';

const dynamicWrapper = (component) => {
  return (props) => {
    return createElement(component().default, {
      ...props,
    });
  };
};
export const constantlyTemps = {
  GuardDoorCounting: {
    name: 'GuardDoorCounting', component: dynamicWrapper(() => import('./ConstantlyTemplate')),
  },
  GuardAreaCounting: {
    name: 'GuardAreaCounting', component: dynamicWrapper(() => import('./ConstantlyTemplate')),
  },
  Gas: {
    name: 'Gas', component: dynamicWrapper(() => import('./ConstantlyTemplate')),
  },
  Env: {
    name: 'Env', component: dynamicWrapper(() => import('./ConstantlyTemplate')),
  },
  Water: {
    name: 'Water', component: dynamicWrapper(() => import('./ConstantlyTemplate')),
  },
};
