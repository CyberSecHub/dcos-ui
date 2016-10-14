import {DefaultRoute, Redirect, Route} from 'react-router';
/* eslint-disable no-unused-vars */
import React from 'react';
/* eslint-enable no-unused-vars */

import NodesTable from '../components/NodesTable';
import NodeDetailBreadcrumb from '../pages/nodes/breadcrumbs/NodeDetailBreadcrumb';
import NodeDetailPage from '../pages/nodes/NodeDetailPage';
import NodeDetailTab from '../pages/nodes/NodeDetailTab';
import NodeDetailHealthTab from '../pages/nodes/NodeDetailHealthTab';
import NodeDetailTaskTab from '../pages/nodes/NodeDetailTaskTab';
import NodesGridView from '../components/NodesGridView';
import NodesOverview from '../pages/NodesOverview';
import NodesPage from '../pages/NodesPage';
import TaskDetail from '../pages/task-details/TaskDetail';
import TaskDetailBreadcrumb from '../pages/nodes/breadcrumbs/TaskDetailBreadcrumb';
import TaskDetailsTab from '../pages/task-details/TaskDetailsTab';
import TaskFilesTab from '../pages/task-details/TaskFilesTab';
import TaskFileViewer from '../pages/task-details/TaskFileViewer';
import UnitsHealthNodeDetail from '../pages/system/UnitsHealthNodeDetail';
import UnitsHealthDetailBreadcrumb from '../pages/system/breadcrumbs/UnitsHealthDetailBreadcrumb';
import VolumeDetail from '../components/VolumeDetail';
import VolumeTable from '../components/VolumeTable';

let nodesRoutes = {
  type: Route,
  path: 'nodes',
  handler: NodesPage,
  category: 'resources',
  isInSidebar: true,
  buildBreadCrumb() {
    return {
      getCrumbs() {
        return [
          {
            label: 'Nodes',
            route: {to: '/nodes'}
          }
        ];
      }
    };
  },
  children: [
    {
      type: Route,
      handler: NodesOverview,
      children: [
        {
          type: DefaultRoute,
          handler: NodesTable
        },
        {
          type: Route,
          path: 'grid',
          handler: NodesGridView
        }
      ]
    },
    {
      type: Route,
      path: ':nodeID',
      handler: NodeDetailPage,
      buildBreadCrumb() {
        return {
          parentCrumb: '/nodes',
          getCrumbs(router) {
            return [
              <NodeDetailBreadcrumb
                parentRouter={router}
                routePath="/nodes/:nodeID" />
            ];
          }
        };
      },
      children: [
        {
          type: DefaultRoute,
          isTab: true,
          title: 'Tasks',
          handler: NodeDetailTaskTab
        },
        {
          type: Route,
          path: 'tasks/:taskID',
          handler: TaskDetail,
          hideHeaderNavigation: true,
          buildBreadCrumb() {
            return {
              parentCrumb: '/nodes/:nodeID',
              getCrumbs(router) {
                return [
                  <TaskDetailBreadcrumb
                    parentRouter={router}
                    routePath="/nodes/:nodeID/tasks/:taskID" />
                ];
              }
            };
          },
          children: [
            {
              type: DefaultRoute,
              handler: TaskDetailsTab,
              title: 'Detials',
              isTab: true,
              hideHeaderNavigation: true,
              buildBreadCrumb() {
                return {
                  parentCrumb: '/nodes/:nodeID/tasks/:taskID',
                  getCrumbs() { return []; }
                };
              }
            },
            {
              type: Route,
              path: 'files',
              isTab: true,
              handler: TaskFilesTab,
              title: 'Files',
              hideHeaderNavigation: true,
              fileViewerRoutePath: '/nodes/:nodeID/tasks/:taskID/view/?:filePath?/?:innerPath?',
              buildBreadCrumb() {
                return {
                  parentCrumb: '/nodes/:nodeID/tasks/:taskID',
                  getCrumbs() { return []; }
                };
              }
            },
            {
              type: Route,
              handler: TaskFileViewer,
              dontScroll: true,
              title: 'Logs',
              isTab: true,
              path: 'view/?:filePath?/?:innerPath?',
              hideHeaderNavigation: true,
              buildBreadCrumb() {
                return {
                  parentCrumb: '/nodes/:nodeID/tasks/:taskID',
                  getCrumbs() { return []; }
                };
              }
            },
            {
              type: Route,
              path: 'volumes/?:volumeID?',
              isTab: true,
              handler: VolumeTable,
              buildBreadCrumb() {
                return {
                  parentCrumb: '/nodes/:nodeID/tasks/:taskID',
                  getCrumbs() { return []; }
                };
              },
              title: 'Volumes'
            }
          ]
        },
        // This route needs to be rendered outside of the tabs that are rendered
        // in the nodes-task-details route.
        {
          type: Route,
          path: 'tasks/:taskID/volumes/:volumeID',
          handler: VolumeDetail,
          buildBreadCrumb() {
            return {
              parentCrumb: '/nodes/:nodeID',
              getCrumbs(router) {
                return [
                  {
                    label: 'Volumes',
                    route: {
                      params: router.getCurrentParams(),
                      to: '/nodes/:nodeID/tasks/:taskID/volumes/:volumeID'
                    }
                  },
                  {
                    label: router.getCurrentParams().volumeID
                  }
                ];
              }
            };
          }
        },
        {
          type: Route,
          path: 'health',
          title: 'Health',
          isTab: true,
          handler: NodeDetailHealthTab,
          buildBreadCrumb() {
            return {
              parentCrumb: '/nodes',
              getCrumbs(router) {
                return [
                  <NodeDetailBreadcrumb
                    parentRouter={router}
                    routePath="/nodes/:nodeID" />
                ];
              }
            };
          }
        },
        {
          type: Route,
          path: 'health/:unitNodeID/:unitID',
          handler: UnitsHealthNodeDetail,
          buildBreadCrumb() {
            return {
              parentCrumb: '/nodes/health',
              getCrumbs(router) {
                return [
                  <UnitsHealthDetailBreadcrumb
                    parentRouter={router}
                    routePath="/nodes/:nodeID/health/:unitNodeID/:unitID" />
                ];
              }
            };
          }
        },
        {
          type: Route,
          path: 'details',
          title: 'Details',
          isTab: true,
          handler: NodeDetailTab,
          buildBreadCrumb() {
            return {
              parentCrumb: '/nodes',
              getCrumbs(router) {
                return [
                  <NodeDetailBreadcrumb
                    parentRouter={router}
                    routePath="/nodes/:nodeID" />
                ];
              }
            };
          }
        }
      ]
    }
  ]
};

module.exports = nodesRoutes;
