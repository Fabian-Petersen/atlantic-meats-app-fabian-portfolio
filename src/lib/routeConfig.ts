export const assetHistoryPageRouteConfig = {
  home: {
    label: "Home",
    path: "/",
  },
  assetsList: {
    label: "Assets",
    path: "/assets/list",
  },
  assetHistory: {
    label: "History",
    path: "/assets/:id/history",
    parent: "assetsList",
  },
};

export const assetOverviewPageRouteConfig = {
  home: {
    label: "Home",
    path: "/",
  },
  assetsList: {
    label: "Assets",
    path: "/assets/list",
    parent: "home",
  },
};
