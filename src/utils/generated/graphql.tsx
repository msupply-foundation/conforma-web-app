import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: any;
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any;
  /** A point in time as described by the [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone. */
  Datetime: any;
  /** The day, does not include a time. */
  Date: any;
  /** A signed eight-byte integer. The upper big integer values are greater than the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers. */
  BigInt: any;
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Exposes the root query type nested one level down. This is helpful for Relay 1 which can only query top level fields if they are in a particular form. */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `ActionPlugin`. */
  actionPlugins?: Maybe<ActionPluginsConnection>;
  /** Reads and enables pagination through a set of `ActionQueue`. */
  actionQueues?: Maybe<ActionQueuesConnection>;
  /** Reads and enables pagination through a set of `AllPermission`. */
  allPermissions?: Maybe<AllPermissionsConnection>;
  /** Reads and enables pagination through a set of `Application`. */
  applications?: Maybe<ApplicationsConnection>;
  /** Reads and enables pagination through a set of `ApplicationList`. */
  applicationLists?: Maybe<ApplicationListsConnection>;
  /** Reads and enables pagination through a set of `ApplicationResponse`. */
  applicationResponses?: Maybe<ApplicationResponsesConnection>;
  /** Reads and enables pagination through a set of `ApplicationSection`. */
  applicationSections?: Maybe<ApplicationSectionsConnection>;
  /** Reads and enables pagination through a set of `ApplicationStageHistory`. */
  applicationStageHistories?: Maybe<ApplicationStageHistoriesConnection>;
  /** Reads and enables pagination through a set of `ApplicationStageStatusAll`. */
  applicationStageStatusAlls?: Maybe<ApplicationStageStatusAllsConnection>;
  /** Reads and enables pagination through a set of `ApplicationStatusHistory`. */
  applicationStatusHistories?: Maybe<ApplicationStatusHistoriesConnection>;
  /** Reads and enables pagination through a set of `ApplicationTriggerState`. */
  applicationTriggerStates?: Maybe<ApplicationTriggerStatesConnection>;
  /** Reads and enables pagination through a set of `ElementTypePlugin`. */
  elementTypePlugins?: Maybe<ElementTypePluginsConnection>;
  /** Reads and enables pagination through a set of `File`. */
  files?: Maybe<FilesConnection>;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications?: Maybe<NotificationsConnection>;
  /** Reads and enables pagination through a set of `Organisation`. */
  organisations?: Maybe<OrganisationsConnection>;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoins?: Maybe<PermissionJoinsConnection>;
  /** Reads and enables pagination through a set of `PermissionName`. */
  permissionNames?: Maybe<PermissionNamesConnection>;
  /** Reads and enables pagination through a set of `PermissionPolicy`. */
  permissionPolicies?: Maybe<PermissionPoliciesConnection>;
  /** Reads and enables pagination through a set of `Review`. */
  reviews?: Maybe<ReviewsConnection>;
  /** Reads and enables pagination through a set of `ReviewAssignment`. */
  reviewAssignments?: Maybe<ReviewAssignmentsConnection>;
  /** Reads and enables pagination through a set of `ReviewQuestionAssignment`. */
  reviewQuestionAssignments?: Maybe<ReviewQuestionAssignmentsConnection>;
  /** Reads and enables pagination through a set of `ReviewResponse`. */
  reviewResponses?: Maybe<ReviewResponsesConnection>;
  /** Reads and enables pagination through a set of `ReviewStatusHistory`. */
  reviewStatusHistories?: Maybe<ReviewStatusHistoriesConnection>;
  /** Reads and enables pagination through a set of `Template`. */
  templates?: Maybe<TemplatesConnection>;
  /** Reads and enables pagination through a set of `TemplateAction`. */
  templateActions?: Maybe<TemplateActionsConnection>;
  /** Reads and enables pagination through a set of `TemplateElement`. */
  templateElements?: Maybe<TemplateElementsConnection>;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissions?: Maybe<TemplatePermissionsConnection>;
  /** Reads and enables pagination through a set of `TemplateSection`. */
  templateSections?: Maybe<TemplateSectionsConnection>;
  /** Reads and enables pagination through a set of `TemplateStage`. */
  templateStages?: Maybe<TemplateStagesConnection>;
  /** Reads and enables pagination through a set of `TriggerQueue`. */
  triggerQueues?: Maybe<TriggerQueuesConnection>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UsersConnection>;
  /** Reads and enables pagination through a set of `UserOrgJoin`. */
  userOrgJoins?: Maybe<UserOrgJoinsConnection>;
  /** Reads and enables pagination through a set of `UserOrganisation`. */
  userOrganisations?: Maybe<UserOrganisationsConnection>;
  actionPlugin?: Maybe<ActionPlugin>;
  actionQueue?: Maybe<ActionQueue>;
  application?: Maybe<Application>;
  applicationBySerial?: Maybe<Application>;
  applicationResponse?: Maybe<ApplicationResponse>;
  applicationSection?: Maybe<ApplicationSection>;
  applicationStageHistory?: Maybe<ApplicationStageHistory>;
  applicationStatusHistory?: Maybe<ApplicationStatusHistory>;
  elementTypePlugin?: Maybe<ElementTypePlugin>;
  file?: Maybe<File>;
  notification?: Maybe<Notification>;
  organisation?: Maybe<Organisation>;
  permissionJoin?: Maybe<PermissionJoin>;
  permissionName?: Maybe<PermissionName>;
  permissionPolicy?: Maybe<PermissionPolicy>;
  review?: Maybe<Review>;
  reviewAssignment?: Maybe<ReviewAssignment>;
  reviewQuestionAssignment?: Maybe<ReviewQuestionAssignment>;
  reviewResponse?: Maybe<ReviewResponse>;
  reviewStatusHistory?: Maybe<ReviewStatusHistory>;
  template?: Maybe<Template>;
  templateAction?: Maybe<TemplateAction>;
  templateElement?: Maybe<TemplateElement>;
  templatePermission?: Maybe<TemplatePermission>;
  templateSection?: Maybe<TemplateSection>;
  templateStage?: Maybe<TemplateStage>;
  triggerQueue?: Maybe<TriggerQueue>;
  user?: Maybe<User>;
  userByUsername?: Maybe<User>;
  userOrganisation?: Maybe<UserOrganisation>;
  applicationStatusHistoryApplicationId?: Maybe<Scalars['Int']>;
  jwtGetBigint?: Maybe<Scalars['BigInt']>;
  jwtGetBoolean?: Maybe<Scalars['Boolean']>;
  jwtGetText?: Maybe<Scalars['String']>;
  reviewApplicationId?: Maybe<Scalars['Int']>;
  reviewReviewerId?: Maybe<Scalars['Int']>;
  /** Reads a single `ActionPlugin` using its globally unique `ID`. */
  actionPluginByNodeId?: Maybe<ActionPlugin>;
  /** Reads a single `ActionQueue` using its globally unique `ID`. */
  actionQueueByNodeId?: Maybe<ActionQueue>;
  /** Reads a single `Application` using its globally unique `ID`. */
  applicationByNodeId?: Maybe<Application>;
  /** Reads a single `ApplicationResponse` using its globally unique `ID`. */
  applicationResponseByNodeId?: Maybe<ApplicationResponse>;
  /** Reads a single `ApplicationSection` using its globally unique `ID`. */
  applicationSectionByNodeId?: Maybe<ApplicationSection>;
  /** Reads a single `ApplicationStageHistory` using its globally unique `ID`. */
  applicationStageHistoryByNodeId?: Maybe<ApplicationStageHistory>;
  /** Reads a single `ApplicationStatusHistory` using its globally unique `ID`. */
  applicationStatusHistoryByNodeId?: Maybe<ApplicationStatusHistory>;
  /** Reads a single `ElementTypePlugin` using its globally unique `ID`. */
  elementTypePluginByNodeId?: Maybe<ElementTypePlugin>;
  /** Reads a single `File` using its globally unique `ID`. */
  fileByNodeId?: Maybe<File>;
  /** Reads a single `Notification` using its globally unique `ID`. */
  notificationByNodeId?: Maybe<Notification>;
  /** Reads a single `Organisation` using its globally unique `ID`. */
  organisationByNodeId?: Maybe<Organisation>;
  /** Reads a single `PermissionJoin` using its globally unique `ID`. */
  permissionJoinByNodeId?: Maybe<PermissionJoin>;
  /** Reads a single `PermissionName` using its globally unique `ID`. */
  permissionNameByNodeId?: Maybe<PermissionName>;
  /** Reads a single `PermissionPolicy` using its globally unique `ID`. */
  permissionPolicyByNodeId?: Maybe<PermissionPolicy>;
  /** Reads a single `Review` using its globally unique `ID`. */
  reviewByNodeId?: Maybe<Review>;
  /** Reads a single `ReviewAssignment` using its globally unique `ID`. */
  reviewAssignmentByNodeId?: Maybe<ReviewAssignment>;
  /** Reads a single `ReviewQuestionAssignment` using its globally unique `ID`. */
  reviewQuestionAssignmentByNodeId?: Maybe<ReviewQuestionAssignment>;
  /** Reads a single `ReviewResponse` using its globally unique `ID`. */
  reviewResponseByNodeId?: Maybe<ReviewResponse>;
  /** Reads a single `ReviewStatusHistory` using its globally unique `ID`. */
  reviewStatusHistoryByNodeId?: Maybe<ReviewStatusHistory>;
  /** Reads a single `Template` using its globally unique `ID`. */
  templateByNodeId?: Maybe<Template>;
  /** Reads a single `TemplateAction` using its globally unique `ID`. */
  templateActionByNodeId?: Maybe<TemplateAction>;
  /** Reads a single `TemplateElement` using its globally unique `ID`. */
  templateElementByNodeId?: Maybe<TemplateElement>;
  /** Reads a single `TemplatePermission` using its globally unique `ID`. */
  templatePermissionByNodeId?: Maybe<TemplatePermission>;
  /** Reads a single `TemplateSection` using its globally unique `ID`. */
  templateSectionByNodeId?: Maybe<TemplateSection>;
  /** Reads a single `TemplateStage` using its globally unique `ID`. */
  templateStageByNodeId?: Maybe<TemplateStage>;
  /** Reads a single `TriggerQueue` using its globally unique `ID`. */
  triggerQueueByNodeId?: Maybe<TriggerQueue>;
  /** Reads a single `User` using its globally unique `ID`. */
  userByNodeId?: Maybe<User>;
  /** Reads a single `UserOrganisation` using its globally unique `ID`. */
  userOrganisationByNodeId?: Maybe<UserOrganisation>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryActionPluginsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ActionPluginsOrderBy>>;
  condition?: Maybe<ActionPluginCondition>;
  filter?: Maybe<ActionPluginFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryActionQueuesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
  condition?: Maybe<ActionQueueCondition>;
  filter?: Maybe<ActionQueueFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPermissionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<AllPermissionsOrderBy>>;
  condition?: Maybe<AllPermissionCondition>;
  filter?: Maybe<AllPermissionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
  filter?: Maybe<ApplicationFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationListsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationListsOrderBy>>;
  condition?: Maybe<ApplicationListCondition>;
  filter?: Maybe<ApplicationListFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
  condition?: Maybe<ApplicationResponseCondition>;
  filter?: Maybe<ApplicationResponseFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
  condition?: Maybe<ApplicationSectionCondition>;
  filter?: Maybe<ApplicationSectionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStageHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStageHistoryCondition>;
  filter?: Maybe<ApplicationStageHistoryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStageStatusAllsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStageStatusAllsOrderBy>>;
  condition?: Maybe<ApplicationStageStatusAllCondition>;
  filter?: Maybe<ApplicationStageStatusAllFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStatusHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStatusHistoryCondition>;
  filter?: Maybe<ApplicationStatusHistoryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationTriggerStatesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationTriggerStatesOrderBy>>;
  condition?: Maybe<ApplicationTriggerStateCondition>;
  filter?: Maybe<ApplicationTriggerStateFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryElementTypePluginsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ElementTypePluginsOrderBy>>;
  condition?: Maybe<ElementTypePluginCondition>;
  filter?: Maybe<ElementTypePluginFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryFilesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<FilesOrderBy>>;
  condition?: Maybe<FileCondition>;
  filter?: Maybe<FileFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNotificationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
  filter?: Maybe<NotificationFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganisationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<OrganisationsOrderBy>>;
  condition?: Maybe<OrganisationCondition>;
  filter?: Maybe<OrganisationFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
  filter?: Maybe<PermissionJoinFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionNamesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionNamesOrderBy>>;
  condition?: Maybe<PermissionNameCondition>;
  filter?: Maybe<PermissionNameFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionPoliciesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionPoliciesOrderBy>>;
  condition?: Maybe<PermissionPolicyCondition>;
  filter?: Maybe<PermissionPolicyFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
  condition?: Maybe<ReviewCondition>;
  filter?: Maybe<ReviewFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewAssignmentsOrderBy>>;
  condition?: Maybe<ReviewAssignmentCondition>;
  filter?: Maybe<ReviewAssignmentFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewQuestionAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewQuestionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewQuestionAssignmentCondition>;
  filter?: Maybe<ReviewQuestionAssignmentFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
  condition?: Maybe<ReviewResponseCondition>;
  filter?: Maybe<ReviewResponseFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewStatusHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewStatusHistoriesOrderBy>>;
  condition?: Maybe<ReviewStatusHistoryCondition>;
  filter?: Maybe<ReviewStatusHistoryFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplatesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatesOrderBy>>;
  condition?: Maybe<TemplateCondition>;
  filter?: Maybe<TemplateFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateActionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
  condition?: Maybe<TemplateActionCondition>;
  filter?: Maybe<TemplateActionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateElementsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
  condition?: Maybe<TemplateElementCondition>;
  filter?: Maybe<TemplateElementFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplatePermissionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
  filter?: Maybe<TemplatePermissionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
  condition?: Maybe<TemplateSectionCondition>;
  filter?: Maybe<TemplateSectionFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateStagesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
  condition?: Maybe<TemplateStageCondition>;
  filter?: Maybe<TemplateStageFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryTriggerQueuesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TriggerQueuesOrderBy>>;
  condition?: Maybe<TriggerQueueCondition>;
  filter?: Maybe<TriggerQueueFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UsersOrderBy>>;
  condition?: Maybe<UserCondition>;
  filter?: Maybe<UserFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrgJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrgJoinsOrderBy>>;
  condition?: Maybe<UserOrgJoinCondition>;
  filter?: Maybe<UserOrgJoinFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganisationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
  condition?: Maybe<UserOrganisationCondition>;
  filter?: Maybe<UserOrganisationFilter>;
};


/** The root query type which gives access points into the data universe. */
export type QueryActionPluginArgs = {
  code: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryActionQueueArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationBySerialArgs = {
  serial: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationResponseArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationSectionArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStageHistoryArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStatusHistoryArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryElementTypePluginArgs = {
  code: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFileArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNotificationArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganisationArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionJoinArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionNameArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionPolicyArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewAssignmentArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewQuestionAssignmentArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewResponseArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewStatusHistoryArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateActionArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateElementArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplatePermissionArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateSectionArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateStageArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTriggerQueueArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByUsernameArgs = {
  username: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganisationArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStatusHistoryApplicationIdArgs = {
  applicationStageHistoryId?: Maybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtGetBigintArgs = {
  jwtKey?: Maybe<Scalars['String']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtGetBooleanArgs = {
  jwtKey?: Maybe<Scalars['String']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtGetTextArgs = {
  jwtKey?: Maybe<Scalars['String']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewApplicationIdArgs = {
  reviewAssignmentId?: Maybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewReviewerIdArgs = {
  reviewAssignmentId?: Maybe<Scalars['Int']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryActionPluginByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryActionQueueByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationResponseByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationSectionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStageHistoryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStatusHistoryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryElementTypePluginByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryFileByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNotificationByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganisationByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionJoinByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionNameByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionPolicyByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewAssignmentByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewQuestionAssignmentByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewResponseByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewStatusHistoryByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateActionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateElementByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplatePermissionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateSectionByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateStageByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTriggerQueueByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByNodeIdArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganisationByNodeIdArgs = {
  nodeId: Scalars['ID'];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};


/** Methods to use when ordering `ActionPlugin`. */
export enum ActionPluginsOrderBy {
  Natural = 'NATURAL',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  PathAsc = 'PATH_ASC',
  PathDesc = 'PATH_DESC',
  FunctionNameAsc = 'FUNCTION_NAME_ASC',
  FunctionNameDesc = 'FUNCTION_NAME_DESC',
  RequiredParametersAsc = 'REQUIRED_PARAMETERS_ASC',
  RequiredParametersDesc = 'REQUIRED_PARAMETERS_DESC',
  OutputPropertiesAsc = 'OUTPUT_PROPERTIES_ASC',
  OutputPropertiesDesc = 'OUTPUT_PROPERTIES_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ActionPlugin` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ActionPluginCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `path` field. */
  path?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `functionName` field. */
  functionName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `requiredParameters` field. */
  requiredParameters?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Checks for equality with the object’s `outputProperties` field. */
  outputProperties?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** A filter to be used against `ActionPlugin` object types. All fields are combined with a logical ‘and.’ */
export type ActionPluginFilter = {
  /** Filter by the object’s `code` field. */
  code?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: Maybe<StringFilter>;
  /** Filter by the object’s `path` field. */
  path?: Maybe<StringFilter>;
  /** Filter by the object’s `functionName` field. */
  functionName?: Maybe<StringFilter>;
  /** Filter by the object’s `requiredParameters` field. */
  requiredParameters?: Maybe<StringListFilter>;
  /** Filter by the object’s `outputProperties` field. */
  outputProperties?: Maybe<StringListFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ActionPluginFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ActionPluginFilter>>;
  /** Negates the expression. */
  not?: Maybe<ActionPluginFilter>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['String']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-sensitive). */
  includes?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: Maybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: Maybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: Maybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: Maybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: Maybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: Maybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: Maybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: Maybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: Maybe<Scalars['String']>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: Maybe<Array<Scalars['String']>>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: Maybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: Maybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: Maybe<Scalars['String']>;
};

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Contains the specified list of values. */
  contains?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Contained by the specified list of values. */
  containedBy?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: Maybe<Array<Maybe<Scalars['String']>>>;
  /** Any array item is equal to the specified value. */
  anyEqualTo?: Maybe<Scalars['String']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: Maybe<Scalars['String']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: Maybe<Scalars['String']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: Maybe<Scalars['String']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: Maybe<Scalars['String']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: Maybe<Scalars['String']>;
};

/** A connection to a list of `ActionPlugin` values. */
export type ActionPluginsConnection = {
  __typename?: 'ActionPluginsConnection';
  /** A list of `ActionPlugin` objects. */
  nodes: Array<Maybe<ActionPlugin>>;
  /** A list of edges which contains the `ActionPlugin` and cursor to aid in pagination. */
  edges: Array<ActionPluginsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ActionPlugin` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ActionPlugin = Node & {
  __typename?: 'ActionPlugin';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  code: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  functionName?: Maybe<Scalars['String']>;
  requiredParameters?: Maybe<Array<Maybe<Scalars['String']>>>;
  outputProperties?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** A `ActionPlugin` edge in the connection. */
export type ActionPluginsEdge = {
  __typename?: 'ActionPluginsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ActionPlugin` at the end of the edge. */
  node?: Maybe<ActionPlugin>;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
};

/** Methods to use when ordering `ActionQueue`. */
export enum ActionQueuesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TriggerEventAsc = 'TRIGGER_EVENT_ASC',
  TriggerEventDesc = 'TRIGGER_EVENT_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  SequenceAsc = 'SEQUENCE_ASC',
  SequenceDesc = 'SEQUENCE_DESC',
  ActionCodeAsc = 'ACTION_CODE_ASC',
  ActionCodeDesc = 'ACTION_CODE_DESC',
  ApplicationDataAsc = 'APPLICATION_DATA_ASC',
  ApplicationDataDesc = 'APPLICATION_DATA_DESC',
  ParameterQueriesAsc = 'PARAMETER_QUERIES_ASC',
  ParameterQueriesDesc = 'PARAMETER_QUERIES_DESC',
  ParametersEvaluatedAsc = 'PARAMETERS_EVALUATED_ASC',
  ParametersEvaluatedDesc = 'PARAMETERS_EVALUATED_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  OutputAsc = 'OUTPUT_ASC',
  OutputDesc = 'OUTPUT_DESC',
  TimeQueuedAsc = 'TIME_QUEUED_ASC',
  TimeQueuedDesc = 'TIME_QUEUED_DESC',
  TimeCompletedAsc = 'TIME_COMPLETED_ASC',
  TimeCompletedDesc = 'TIME_COMPLETED_DESC',
  TimeScheduledAsc = 'TIME_SCHEDULED_ASC',
  TimeScheduledDesc = 'TIME_SCHEDULED_DESC',
  ErrorLogAsc = 'ERROR_LOG_ASC',
  ErrorLogDesc = 'ERROR_LOG_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ActionQueue` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ActionQueueCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `triggerEvent` field. */
  triggerEvent?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sequence` field. */
  sequence?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `actionCode` field. */
  actionCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicationData` field. */
  applicationData?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `parameterQueries` field. */
  parameterQueries?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `parametersEvaluated` field. */
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ActionQueueStatus>;
  /** Checks for equality with the object’s `output` field. */
  output?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `timeQueued` field. */
  timeQueued?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `timeCompleted` field. */
  timeCompleted?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `timeScheduled` field. */
  timeScheduled?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `errorLog` field. */
  errorLog?: Maybe<Scalars['String']>;
};


export enum ActionQueueStatus {
  Scheduled = 'SCHEDULED',
  Queued = 'QUEUED',
  Processing = 'PROCESSING',
  Success = 'SUCCESS',
  Fail = 'FAIL'
}


/** A filter to be used against `ActionQueue` object types. All fields are combined with a logical ‘and.’ */
export type ActionQueueFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `triggerEvent` field. */
  triggerEvent?: Maybe<IntFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `sequence` field. */
  sequence?: Maybe<IntFilter>;
  /** Filter by the object’s `actionCode` field. */
  actionCode?: Maybe<StringFilter>;
  /** Filter by the object’s `applicationData` field. */
  applicationData?: Maybe<JsonFilter>;
  /** Filter by the object’s `parameterQueries` field. */
  parameterQueries?: Maybe<JsonFilter>;
  /** Filter by the object’s `parametersEvaluated` field. */
  parametersEvaluated?: Maybe<JsonFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ActionQueueStatusFilter>;
  /** Filter by the object’s `output` field. */
  output?: Maybe<JsonFilter>;
  /** Filter by the object’s `timeQueued` field. */
  timeQueued?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `timeCompleted` field. */
  timeCompleted?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `timeScheduled` field. */
  timeScheduled?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `errorLog` field. */
  errorLog?: Maybe<StringFilter>;
  /** Filter by the object’s `triggerQueueByTriggerEvent` relation. */
  triggerQueueByTriggerEvent?: Maybe<TriggerQueueFilter>;
  /** A related `triggerQueueByTriggerEvent` exists. */
  triggerQueueByTriggerEventExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `template` relation. */
  template?: Maybe<TemplateFilter>;
  /** A related `template` exists. */
  templateExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ActionQueueFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ActionQueueFilter>>;
  /** Negates the expression. */
  not?: Maybe<ActionQueueFilter>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Int']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Int']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Int']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Int']>;
};

/** A filter to be used against JSON fields. All fields are combined with a logical ‘and.’ */
export type JsonFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['JSON']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['JSON']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['JSON']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['JSON']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['JSON']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['JSON']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['JSON']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['JSON']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['JSON']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['JSON']>;
  /** Contains the specified JSON. */
  contains?: Maybe<Scalars['JSON']>;
  /** Contains the specified key. */
  containsKey?: Maybe<Scalars['String']>;
  /** Contains all of the specified keys. */
  containsAllKeys?: Maybe<Array<Scalars['String']>>;
  /** Contains any of the specified keys. */
  containsAnyKeys?: Maybe<Array<Scalars['String']>>;
  /** Contained by the specified JSON. */
  containedBy?: Maybe<Scalars['JSON']>;
};

/** A filter to be used against ActionQueueStatus fields. All fields are combined with a logical ‘and.’ */
export type ActionQueueStatusFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ActionQueueStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ActionQueueStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ActionQueueStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ActionQueueStatus>;
  /** Included in the specified list. */
  in?: Maybe<Array<ActionQueueStatus>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<ActionQueueStatus>>;
  /** Less than the specified value. */
  lessThan?: Maybe<ActionQueueStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<ActionQueueStatus>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<ActionQueueStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<ActionQueueStatus>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Datetime']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Datetime']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Datetime']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Datetime']>;
};

/** A filter to be used against `TriggerQueue` object types. All fields are combined with a logical ‘and.’ */
export type TriggerQueueFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `triggerType` field. */
  triggerType?: Maybe<TriggerFilter>;
  /** Filter by the object’s `table` field. */
  table?: Maybe<StringFilter>;
  /** Filter by the object’s `recordId` field. */
  recordId?: Maybe<IntFilter>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<TriggerQueueStatusFilter>;
  /** Filter by the object’s `log` field. */
  log?: Maybe<JsonFilter>;
  /** Filter by the object’s `actionQueuesByTriggerEvent` relation. */
  actionQueuesByTriggerEvent?: Maybe<TriggerQueueToManyActionQueueFilter>;
  /** Some related `actionQueuesByTriggerEvent` exist. */
  actionQueuesByTriggerEventExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TriggerQueueFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TriggerQueueFilter>>;
  /** Negates the expression. */
  not?: Maybe<TriggerQueueFilter>;
};

/** A filter to be used against Trigger fields. All fields are combined with a logical ‘and.’ */
export type TriggerFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Trigger>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Trigger>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Trigger>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Trigger>;
  /** Included in the specified list. */
  in?: Maybe<Array<Trigger>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Trigger>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Trigger>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Trigger>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Trigger>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Trigger>;
};

export enum Trigger {
  OnApplicationCreate = 'ON_APPLICATION_CREATE',
  OnApplicationSubmit = 'ON_APPLICATION_SUBMIT',
  OnApplicationSave = 'ON_APPLICATION_SAVE',
  OnApplicationWithdrawn = 'ON_APPLICATION_WITHDRAWN',
  OnReviewCreate = 'ON_REVIEW_CREATE',
  OnReviewSubmit = 'ON_REVIEW_SUBMIT',
  OnReviewStart = 'ON_REVIEW_START',
  OnReviewAssign = 'ON_REVIEW_ASSIGN',
  OnApprovalSubmit = 'ON_APPROVAL_SUBMIT',
  OnScheduleTime = 'ON_SCHEDULE_TIME',
  Processing = 'PROCESSING',
  Error = 'ERROR'
}

/** A filter to be used against TriggerQueueStatus fields. All fields are combined with a logical ‘and.’ */
export type TriggerQueueStatusFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<TriggerQueueStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<TriggerQueueStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<TriggerQueueStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<TriggerQueueStatus>;
  /** Included in the specified list. */
  in?: Maybe<Array<TriggerQueueStatus>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<TriggerQueueStatus>>;
  /** Less than the specified value. */
  lessThan?: Maybe<TriggerQueueStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<TriggerQueueStatus>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<TriggerQueueStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<TriggerQueueStatus>;
};

export enum TriggerQueueStatus {
  Triggered = 'TRIGGERED',
  ActionsDispatched = 'ACTIONS_DISPATCHED',
  Error = 'ERROR'
}

/** A filter to be used against many `ActionQueue` object types. All fields are combined with a logical ‘and.’ */
export type TriggerQueueToManyActionQueueFilter = {
  /** Every related `ActionQueue` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ActionQueueFilter>;
  /** Some related `ActionQueue` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ActionQueueFilter>;
  /** No related `ActionQueue` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ActionQueueFilter>;
};

/** A filter to be used against `Template` object types. All fields are combined with a logical ‘and.’ */
export type TemplateFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `code` field. */
  code?: Maybe<StringFilter>;
  /** Filter by the object’s `isLinear` field. */
  isLinear?: Maybe<BooleanFilter>;
  /** Filter by the object’s `startMessage` field. */
  startMessage?: Maybe<JsonFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<TemplateStatusFilter>;
  /** Filter by the object’s `submissionMessage` field. */
  submissionMessage?: Maybe<JsonFilter>;
  /** Filter by the object’s `versionTimestamp` field. */
  versionTimestamp?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `templateStages` relation. */
  templateStages?: Maybe<TemplateToManyTemplateStageFilter>;
  /** Some related `templateStages` exist. */
  templateStagesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateSections` relation. */
  templateSections?: Maybe<TemplateToManyTemplateSectionFilter>;
  /** Some related `templateSections` exist. */
  templateSectionsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templatePermissions` relation. */
  templatePermissions?: Maybe<TemplateToManyTemplatePermissionFilter>;
  /** Some related `templatePermissions` exist. */
  templatePermissionsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applications` relation. */
  applications?: Maybe<TemplateToManyApplicationFilter>;
  /** Some related `applications` exist. */
  applicationsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `actionQueues` relation. */
  actionQueues?: Maybe<TemplateToManyActionQueueFilter>;
  /** Some related `actionQueues` exist. */
  actionQueuesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateActions` relation. */
  templateActions?: Maybe<TemplateToManyTemplateActionFilter>;
  /** Some related `templateActions` exist. */
  templateActionsExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TemplateFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TemplateFilter>>;
  /** Negates the expression. */
  not?: Maybe<TemplateFilter>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Boolean']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Boolean']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Boolean']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Boolean']>;
};

/** A filter to be used against TemplateStatus fields. All fields are combined with a logical ‘and.’ */
export type TemplateStatusFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<TemplateStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<TemplateStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<TemplateStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<TemplateStatus>;
  /** Included in the specified list. */
  in?: Maybe<Array<TemplateStatus>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<TemplateStatus>>;
  /** Less than the specified value. */
  lessThan?: Maybe<TemplateStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<TemplateStatus>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<TemplateStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<TemplateStatus>;
};

export enum TemplateStatus {
  Draft = 'DRAFT',
  Available = 'AVAILABLE',
  Disabled = 'DISABLED'
}

/** A filter to be used against many `TemplateStage` object types. All fields are combined with a logical ‘and.’ */
export type TemplateToManyTemplateStageFilter = {
  /** Every related `TemplateStage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplateStageFilter>;
  /** Some related `TemplateStage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplateStageFilter>;
  /** No related `TemplateStage` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplateStageFilter>;
};

/** A filter to be used against `TemplateStage` object types. All fields are combined with a logical ‘and.’ */
export type TemplateStageFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `number` field. */
  number?: Maybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: Maybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: Maybe<StringFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationStageHistoriesByStageId` relation. */
  applicationStageHistoriesByStageId?: Maybe<TemplateStageToManyApplicationStageHistoryFilter>;
  /** Some related `applicationStageHistoriesByStageId` exist. */
  applicationStageHistoriesByStageIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewAssignmentsByStageId` relation. */
  reviewAssignmentsByStageId?: Maybe<TemplateStageToManyReviewAssignmentFilter>;
  /** Some related `reviewAssignmentsByStageId` exist. */
  reviewAssignmentsByStageIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `template` relation. */
  template?: Maybe<TemplateFilter>;
  /** A related `template` exists. */
  templateExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TemplateStageFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TemplateStageFilter>>;
  /** Negates the expression. */
  not?: Maybe<TemplateStageFilter>;
};

/** A filter to be used against many `ApplicationStageHistory` object types. All fields are combined with a logical ‘and.’ */
export type TemplateStageToManyApplicationStageHistoryFilter = {
  /** Every related `ApplicationStageHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationStageHistoryFilter>;
  /** Some related `ApplicationStageHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationStageHistoryFilter>;
  /** No related `ApplicationStageHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationStageHistoryFilter>;
};

/** A filter to be used against `ApplicationStageHistory` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationStageHistoryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `stageId` field. */
  stageId?: Maybe<IntFilter>;
  /** Filter by the object’s `timeCreated` field. */
  timeCreated?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `isCurrent` field. */
  isCurrent?: Maybe<BooleanFilter>;
  /** Filter by the object’s `applicationStatusHistories` relation. */
  applicationStatusHistories?: Maybe<ApplicationStageHistoryToManyApplicationStatusHistoryFilter>;
  /** Some related `applicationStatusHistories` exist. */
  applicationStatusHistoriesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `stage` relation. */
  stage?: Maybe<TemplateStageFilter>;
  /** A related `stage` exists. */
  stageExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationStageHistoryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationStageHistoryFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationStageHistoryFilter>;
};

/** A filter to be used against many `ApplicationStatusHistory` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationStageHistoryToManyApplicationStatusHistoryFilter = {
  /** Every related `ApplicationStatusHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationStatusHistoryFilter>;
  /** Some related `ApplicationStatusHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationStatusHistoryFilter>;
  /** No related `ApplicationStatusHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationStatusHistoryFilter>;
};

/** A filter to be used against `ApplicationStatusHistory` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationStatusHistoryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationStageHistoryId` field. */
  applicationStageHistoryId?: Maybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ApplicationStatusFilter>;
  /** Filter by the object’s `timeCreated` field. */
  timeCreated?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `isCurrent` field. */
  isCurrent?: Maybe<BooleanFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationStageHistory` relation. */
  applicationStageHistory?: Maybe<ApplicationStageHistoryFilter>;
  /** A related `applicationStageHistory` exists. */
  applicationStageHistoryExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationStatusHistoryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationStatusHistoryFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationStatusHistoryFilter>;
};

/** A filter to be used against ApplicationStatus fields. All fields are combined with a logical ‘and.’ */
export type ApplicationStatusFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ApplicationStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ApplicationStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ApplicationStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ApplicationStatus>;
  /** Included in the specified list. */
  in?: Maybe<Array<ApplicationStatus>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<ApplicationStatus>>;
  /** Less than the specified value. */
  lessThan?: Maybe<ApplicationStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<ApplicationStatus>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<ApplicationStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<ApplicationStatus>;
};

export enum ApplicationStatus {
  Draft = 'DRAFT',
  Withdrawn = 'WITHDRAWN',
  Submitted = 'SUBMITTED',
  ChangesRequired = 'CHANGES_REQUIRED',
  ReSubmitted = 'RE_SUBMITTED',
  Completed = 'COMPLETED',
  Expired = 'EXPIRED'
}

/** A filter to be used against `Application` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `orgId` field. */
  orgId?: Maybe<IntFilter>;
  /** Filter by the object’s `serial` field. */
  serial?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `outcome` field. */
  outcome?: Maybe<ApplicationOutcomeFilter>;
  /** Filter by the object’s `isActive` field. */
  isActive?: Maybe<BooleanFilter>;
  /** Filter by the object’s `trigger` field. */
  trigger?: Maybe<TriggerFilter>;
  /** Filter by the object’s `stage` field. */
  stage?: Maybe<StringFilter>;
  /** Filter by the object’s `stageNumber` field. */
  stageNumber?: Maybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ApplicationStatusFilter>;
  /** Filter by the object’s `applicationSections` relation. */
  applicationSections?: Maybe<ApplicationToManyApplicationSectionFilter>;
  /** Some related `applicationSections` exist. */
  applicationSectionsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applicationStageHistories` relation. */
  applicationStageHistories?: Maybe<ApplicationToManyApplicationStageHistoryFilter>;
  /** Some related `applicationStageHistories` exist. */
  applicationStageHistoriesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applicationResponses` relation. */
  applicationResponses?: Maybe<ApplicationToManyApplicationResponseFilter>;
  /** Some related `applicationResponses` exist. */
  applicationResponsesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewAssignments` relation. */
  reviewAssignments?: Maybe<ApplicationToManyReviewAssignmentFilter>;
  /** Some related `reviewAssignments` exist. */
  reviewAssignmentsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviews` relation. */
  reviews?: Maybe<ApplicationToManyReviewFilter>;
  /** Some related `reviews` exist. */
  reviewsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `files` relation. */
  files?: Maybe<ApplicationToManyFileFilter>;
  /** Some related `files` exist. */
  filesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `notifications` relation. */
  notifications?: Maybe<ApplicationToManyNotificationFilter>;
  /** Some related `notifications` exist. */
  notificationsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `template` relation. */
  template?: Maybe<TemplateFilter>;
  /** A related `template` exists. */
  templateExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `user` relation. */
  user?: Maybe<UserFilter>;
  /** A related `user` exists. */
  userExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `org` relation. */
  org?: Maybe<OrganisationFilter>;
  /** A related `org` exists. */
  orgExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationFilter>;
};

/** A filter to be used against ApplicationOutcome fields. All fields are combined with a logical ‘and.’ */
export type ApplicationOutcomeFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ApplicationOutcome>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ApplicationOutcome>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ApplicationOutcome>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ApplicationOutcome>;
  /** Included in the specified list. */
  in?: Maybe<Array<ApplicationOutcome>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<ApplicationOutcome>>;
  /** Less than the specified value. */
  lessThan?: Maybe<ApplicationOutcome>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<ApplicationOutcome>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<ApplicationOutcome>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<ApplicationOutcome>;
};

export enum ApplicationOutcome {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}

/** A filter to be used against many `ApplicationSection` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyApplicationSectionFilter = {
  /** Every related `ApplicationSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationSectionFilter>;
  /** Some related `ApplicationSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationSectionFilter>;
  /** No related `ApplicationSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationSectionFilter>;
};

/** A filter to be used against `ApplicationSection` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationSectionFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `templateSectionId` field. */
  templateSectionId?: Maybe<IntFilter>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateSection` relation. */
  templateSection?: Maybe<TemplateSectionFilter>;
  /** A related `templateSection` exists. */
  templateSectionExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationSectionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationSectionFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationSectionFilter>;
};

/** A filter to be used against `TemplateSection` object types. All fields are combined with a logical ‘and.’ */
export type TemplateSectionFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: Maybe<StringFilter>;
  /** Filter by the object’s `code` field. */
  code?: Maybe<StringFilter>;
  /** Filter by the object’s `index` field. */
  index?: Maybe<IntFilter>;
  /** Filter by the object’s `templatePermissions` relation. */
  templatePermissions?: Maybe<TemplateSectionToManyTemplatePermissionFilter>;
  /** Some related `templatePermissions` exist. */
  templatePermissionsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateElementsBySectionId` relation. */
  templateElementsBySectionId?: Maybe<TemplateSectionToManyTemplateElementFilter>;
  /** Some related `templateElementsBySectionId` exist. */
  templateElementsBySectionIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applicationSections` relation. */
  applicationSections?: Maybe<TemplateSectionToManyApplicationSectionFilter>;
  /** Some related `applicationSections` exist. */
  applicationSectionsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `template` relation. */
  template?: Maybe<TemplateFilter>;
  /** A related `template` exists. */
  templateExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TemplateSectionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TemplateSectionFilter>>;
  /** Negates the expression. */
  not?: Maybe<TemplateSectionFilter>;
};

/** A filter to be used against many `TemplatePermission` object types. All fields are combined with a logical ‘and.’ */
export type TemplateSectionToManyTemplatePermissionFilter = {
  /** Every related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplatePermissionFilter>;
  /** Some related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplatePermissionFilter>;
  /** No related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplatePermissionFilter>;
};

/** A filter to be used against `TemplatePermission` object types. All fields are combined with a logical ‘and.’ */
export type TemplatePermissionFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `permissionNameId` field. */
  permissionNameId?: Maybe<IntFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `templateSectionId` field. */
  templateSectionId?: Maybe<IntFilter>;
  /** Filter by the object’s `restrictions` field. */
  restrictions?: Maybe<JsonFilter>;
  /** Filter by the object’s `permissionName` relation. */
  permissionName?: Maybe<PermissionNameFilter>;
  /** A related `permissionName` exists. */
  permissionNameExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `template` relation. */
  template?: Maybe<TemplateFilter>;
  /** A related `template` exists. */
  templateExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateSection` relation. */
  templateSection?: Maybe<TemplateSectionFilter>;
  /** A related `templateSection` exists. */
  templateSectionExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TemplatePermissionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TemplatePermissionFilter>>;
  /** Negates the expression. */
  not?: Maybe<TemplatePermissionFilter>;
};

/** A filter to be used against `PermissionName` object types. All fields are combined with a logical ‘and.’ */
export type PermissionNameFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `permissionPolicyId` field. */
  permissionPolicyId?: Maybe<IntFilter>;
  /** Filter by the object’s `permissionJoins` relation. */
  permissionJoins?: Maybe<PermissionNameToManyPermissionJoinFilter>;
  /** Some related `permissionJoins` exist. */
  permissionJoinsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templatePermissions` relation. */
  templatePermissions?: Maybe<PermissionNameToManyTemplatePermissionFilter>;
  /** Some related `templatePermissions` exist. */
  templatePermissionsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `permissionPolicy` relation. */
  permissionPolicy?: Maybe<PermissionPolicyFilter>;
  /** A related `permissionPolicy` exists. */
  permissionPolicyExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PermissionNameFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PermissionNameFilter>>;
  /** Negates the expression. */
  not?: Maybe<PermissionNameFilter>;
};

/** A filter to be used against many `PermissionJoin` object types. All fields are combined with a logical ‘and.’ */
export type PermissionNameToManyPermissionJoinFilter = {
  /** Every related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PermissionJoinFilter>;
  /** Some related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PermissionJoinFilter>;
  /** No related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PermissionJoinFilter>;
};

/** A filter to be used against `PermissionJoin` object types. All fields are combined with a logical ‘and.’ */
export type PermissionJoinFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `userOrganisationId` field. */
  userOrganisationId?: Maybe<IntFilter>;
  /** Filter by the object’s `permissionNameId` field. */
  permissionNameId?: Maybe<IntFilter>;
  /** Filter by the object’s `user` relation. */
  user?: Maybe<UserFilter>;
  /** A related `user` exists. */
  userExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `userOrganisation` relation. */
  userOrganisation?: Maybe<UserOrganisationFilter>;
  /** A related `userOrganisation` exists. */
  userOrganisationExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `permissionName` relation. */
  permissionName?: Maybe<PermissionNameFilter>;
  /** A related `permissionName` exists. */
  permissionNameExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PermissionJoinFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PermissionJoinFilter>>;
  /** Negates the expression. */
  not?: Maybe<PermissionJoinFilter>;
};

/** A filter to be used against `User` object types. All fields are combined with a logical ‘and.’ */
export type UserFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `firstName` field. */
  firstName?: Maybe<StringFilter>;
  /** Filter by the object’s `lastName` field. */
  lastName?: Maybe<StringFilter>;
  /** Filter by the object’s `username` field. */
  username?: Maybe<StringFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `dateOfBirth` field. */
  dateOfBirth?: Maybe<DateFilter>;
  /** Filter by the object’s `passwordHash` field. */
  passwordHash?: Maybe<StringFilter>;
  /** Filter by the object’s `userOrganisations` relation. */
  userOrganisations?: Maybe<UserToManyUserOrganisationFilter>;
  /** Some related `userOrganisations` exist. */
  userOrganisationsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `permissionJoins` relation. */
  permissionJoins?: Maybe<UserToManyPermissionJoinFilter>;
  /** Some related `permissionJoins` exist. */
  permissionJoinsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applications` relation. */
  applications?: Maybe<UserToManyApplicationFilter>;
  /** Some related `applications` exist. */
  applicationsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewAssignmentsByAssignerId` relation. */
  reviewAssignmentsByAssignerId?: Maybe<UserToManyReviewAssignmentFilter>;
  /** Some related `reviewAssignmentsByAssignerId` exist. */
  reviewAssignmentsByAssignerIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewedReviewAssignments` relation. */
  reviewedReviewAssignments?: Maybe<UserToManyReviewAssignmentFilter>;
  /** Some related `reviewedReviewAssignments` exist. */
  reviewedReviewAssignmentsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewedReviews` relation. */
  reviewedReviews?: Maybe<UserToManyReviewFilter>;
  /** Some related `reviewedReviews` exist. */
  reviewedReviewsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `files` relation. */
  files?: Maybe<UserToManyFileFilter>;
  /** Some related `files` exist. */
  filesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `notifications` relation. */
  notifications?: Maybe<UserToManyNotificationFilter>;
  /** Some related `notifications` exist. */
  notificationsExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<UserFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<UserFilter>>;
  /** Negates the expression. */
  not?: Maybe<UserFilter>;
};

/** A filter to be used against Date fields. All fields are combined with a logical ‘and.’ */
export type DateFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<Scalars['Date']>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<Scalars['Date']>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<Scalars['Date']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<Scalars['Date']>;
  /** Included in the specified list. */
  in?: Maybe<Array<Scalars['Date']>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<Scalars['Date']>>;
  /** Less than the specified value. */
  lessThan?: Maybe<Scalars['Date']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<Scalars['Date']>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<Scalars['Date']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<Scalars['Date']>;
};


/** A filter to be used against many `UserOrganisation` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyUserOrganisationFilter = {
  /** Every related `UserOrganisation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<UserOrganisationFilter>;
  /** Some related `UserOrganisation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<UserOrganisationFilter>;
  /** No related `UserOrganisation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<UserOrganisationFilter>;
};

/** A filter to be used against `UserOrganisation` object types. All fields are combined with a logical ‘and.’ */
export type UserOrganisationFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `organisationId` field. */
  organisationId?: Maybe<IntFilter>;
  /** Filter by the object’s `userRole` field. */
  userRole?: Maybe<StringFilter>;
  /** Filter by the object’s `permissionJoins` relation. */
  permissionJoins?: Maybe<UserOrganisationToManyPermissionJoinFilter>;
  /** Some related `permissionJoins` exist. */
  permissionJoinsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `user` relation. */
  user?: Maybe<UserFilter>;
  /** A related `user` exists. */
  userExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `organisation` relation. */
  organisation?: Maybe<OrganisationFilter>;
  /** A related `organisation` exists. */
  organisationExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<UserOrganisationFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<UserOrganisationFilter>>;
  /** Negates the expression. */
  not?: Maybe<UserOrganisationFilter>;
};

/** A filter to be used against many `PermissionJoin` object types. All fields are combined with a logical ‘and.’ */
export type UserOrganisationToManyPermissionJoinFilter = {
  /** Every related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PermissionJoinFilter>;
  /** Some related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PermissionJoinFilter>;
  /** No related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PermissionJoinFilter>;
};

/** A filter to be used against `Organisation` object types. All fields are combined with a logical ‘and.’ */
export type OrganisationFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `licenceNumber` field. */
  licenceNumber?: Maybe<StringFilter>;
  /** Filter by the object’s `address` field. */
  address?: Maybe<StringFilter>;
  /** Filter by the object’s `userOrganisations` relation. */
  userOrganisations?: Maybe<OrganisationToManyUserOrganisationFilter>;
  /** Some related `userOrganisations` exist. */
  userOrganisationsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applicationsByOrgId` relation. */
  applicationsByOrgId?: Maybe<OrganisationToManyApplicationFilter>;
  /** Some related `applicationsByOrgId` exist. */
  applicationsByOrgIdExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<OrganisationFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<OrganisationFilter>>;
  /** Negates the expression. */
  not?: Maybe<OrganisationFilter>;
};

/** A filter to be used against many `UserOrganisation` object types. All fields are combined with a logical ‘and.’ */
export type OrganisationToManyUserOrganisationFilter = {
  /** Every related `UserOrganisation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<UserOrganisationFilter>;
  /** Some related `UserOrganisation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<UserOrganisationFilter>;
  /** No related `UserOrganisation` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<UserOrganisationFilter>;
};

/** A filter to be used against many `Application` object types. All fields are combined with a logical ‘and.’ */
export type OrganisationToManyApplicationFilter = {
  /** Every related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationFilter>;
  /** Some related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationFilter>;
  /** No related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationFilter>;
};

/** A filter to be used against many `PermissionJoin` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyPermissionJoinFilter = {
  /** Every related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PermissionJoinFilter>;
  /** Some related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PermissionJoinFilter>;
  /** No related `PermissionJoin` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PermissionJoinFilter>;
};

/** A filter to be used against many `Application` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyApplicationFilter = {
  /** Every related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationFilter>;
  /** Some related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationFilter>;
  /** No related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationFilter>;
};

/** A filter to be used against many `ReviewAssignment` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyReviewAssignmentFilter = {
  /** Every related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewAssignmentFilter>;
  /** Some related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewAssignmentFilter>;
  /** No related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewAssignmentFilter>;
};

/** A filter to be used against `ReviewAssignment` object types. All fields are combined with a logical ‘and.’ */
export type ReviewAssignmentFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `assignerId` field. */
  assignerId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewerId` field. */
  reviewerId?: Maybe<IntFilter>;
  /** Filter by the object’s `stageId` field. */
  stageId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `trigger` field. */
  trigger?: Maybe<TriggerFilter>;
  /** Filter by the object’s `reviews` relation. */
  reviews?: Maybe<ReviewAssignmentToManyReviewFilter>;
  /** Some related `reviews` exist. */
  reviewsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewQuestionAssignments` relation. */
  reviewQuestionAssignments?: Maybe<ReviewAssignmentToManyReviewQuestionAssignmentFilter>;
  /** Some related `reviewQuestionAssignments` exist. */
  reviewQuestionAssignmentsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `assigner` relation. */
  assigner?: Maybe<UserFilter>;
  /** A related `assigner` exists. */
  assignerExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewer` relation. */
  reviewer?: Maybe<UserFilter>;
  /** A related `reviewer` exists. */
  reviewerExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `stage` relation. */
  stage?: Maybe<TemplateStageFilter>;
  /** A related `stage` exists. */
  stageExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ReviewAssignmentFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ReviewAssignmentFilter>>;
  /** Negates the expression. */
  not?: Maybe<ReviewAssignmentFilter>;
};

/** A filter to be used against many `Review` object types. All fields are combined with a logical ‘and.’ */
export type ReviewAssignmentToManyReviewFilter = {
  /** Every related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewFilter>;
  /** Some related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewFilter>;
  /** No related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewFilter>;
};

/** A filter to be used against `Review` object types. All fields are combined with a logical ‘and.’ */
export type ReviewFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewAssignmentId` field. */
  reviewAssignmentId?: Maybe<IntFilter>;
  /** Filter by the object’s `trigger` field. */
  trigger?: Maybe<TriggerFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewerId` field. */
  reviewerId?: Maybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<StringFilter>;
  /** Filter by the object’s `reviewResponses` relation. */
  reviewResponses?: Maybe<ReviewToManyReviewResponseFilter>;
  /** Some related `reviewResponses` exist. */
  reviewResponsesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewStatusHistories` relation. */
  reviewStatusHistories?: Maybe<ReviewToManyReviewStatusHistoryFilter>;
  /** Some related `reviewStatusHistories` exist. */
  reviewStatusHistoriesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `notifications` relation. */
  notifications?: Maybe<ReviewToManyNotificationFilter>;
  /** Some related `notifications` exist. */
  notificationsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewAssignment` relation. */
  reviewAssignment?: Maybe<ReviewAssignmentFilter>;
  /** A related `reviewAssignment` exists. */
  reviewAssignmentExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewer` relation. */
  reviewer?: Maybe<UserFilter>;
  /** A related `reviewer` exists. */
  reviewerExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ReviewFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ReviewFilter>>;
  /** Negates the expression. */
  not?: Maybe<ReviewFilter>;
};

/** A filter to be used against many `ReviewResponse` object types. All fields are combined with a logical ‘and.’ */
export type ReviewToManyReviewResponseFilter = {
  /** Every related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewResponseFilter>;
  /** Some related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewResponseFilter>;
  /** No related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewResponseFilter>;
};

/** A filter to be used against `ReviewResponse` object types. All fields are combined with a logical ‘and.’ */
export type ReviewResponseFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `comment` field. */
  comment?: Maybe<StringFilter>;
  /** Filter by the object’s `decision` field. */
  decision?: Maybe<ReviewResponseDecisionFilter>;
  /** Filter by the object’s `reviewQuestionAssignmentId` field. */
  reviewQuestionAssignmentId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationResponseId` field. */
  applicationResponseId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewId` field. */
  reviewId?: Maybe<IntFilter>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `reviewQuestionAssignment` relation. */
  reviewQuestionAssignment?: Maybe<ReviewQuestionAssignmentFilter>;
  /** A related `reviewQuestionAssignment` exists. */
  reviewQuestionAssignmentExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applicationResponse` relation. */
  applicationResponse?: Maybe<ApplicationResponseFilter>;
  /** A related `applicationResponse` exists. */
  applicationResponseExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `review` relation. */
  review?: Maybe<ReviewFilter>;
  /** A related `review` exists. */
  reviewExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ReviewResponseFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ReviewResponseFilter>>;
  /** Negates the expression. */
  not?: Maybe<ReviewResponseFilter>;
};

/** A filter to be used against ReviewResponseDecision fields. All fields are combined with a logical ‘and.’ */
export type ReviewResponseDecisionFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ReviewResponseDecision>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ReviewResponseDecision>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ReviewResponseDecision>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ReviewResponseDecision>;
  /** Included in the specified list. */
  in?: Maybe<Array<ReviewResponseDecision>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<ReviewResponseDecision>>;
  /** Less than the specified value. */
  lessThan?: Maybe<ReviewResponseDecision>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<ReviewResponseDecision>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<ReviewResponseDecision>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<ReviewResponseDecision>;
};

export enum ReviewResponseDecision {
  Approve = 'APPROVE',
  Decline = 'DECLINE'
}

/** A filter to be used against `ReviewQuestionAssignment` object types. All fields are combined with a logical ‘and.’ */
export type ReviewQuestionAssignmentFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `templateElementId` field. */
  templateElementId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewAssignmentId` field. */
  reviewAssignmentId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewResponses` relation. */
  reviewResponses?: Maybe<ReviewQuestionAssignmentToManyReviewResponseFilter>;
  /** Some related `reviewResponses` exist. */
  reviewResponsesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateElement` relation. */
  templateElement?: Maybe<TemplateElementFilter>;
  /** A related `templateElement` exists. */
  templateElementExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewAssignment` relation. */
  reviewAssignment?: Maybe<ReviewAssignmentFilter>;
  /** A related `reviewAssignment` exists. */
  reviewAssignmentExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ReviewQuestionAssignmentFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ReviewQuestionAssignmentFilter>>;
  /** Negates the expression. */
  not?: Maybe<ReviewQuestionAssignmentFilter>;
};

/** A filter to be used against many `ReviewResponse` object types. All fields are combined with a logical ‘and.’ */
export type ReviewQuestionAssignmentToManyReviewResponseFilter = {
  /** Every related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewResponseFilter>;
  /** Some related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewResponseFilter>;
  /** No related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewResponseFilter>;
};

/** A filter to be used against `TemplateElement` object types. All fields are combined with a logical ‘and.’ */
export type TemplateElementFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `sectionId` field. */
  sectionId?: Maybe<IntFilter>;
  /** Filter by the object’s `code` field. */
  code?: Maybe<StringFilter>;
  /** Filter by the object’s `index` field. */
  index?: Maybe<IntFilter>;
  /** Filter by the object’s `title` field. */
  title?: Maybe<StringFilter>;
  /** Filter by the object’s `category` field. */
  category?: Maybe<TemplateElementCategoryFilter>;
  /** Filter by the object’s `elementTypePluginCode` field. */
  elementTypePluginCode?: Maybe<StringFilter>;
  /** Filter by the object’s `visibilityCondition` field. */
  visibilityCondition?: Maybe<JsonFilter>;
  /** Filter by the object’s `isRequired` field. */
  isRequired?: Maybe<JsonFilter>;
  /** Filter by the object’s `isEditable` field. */
  isEditable?: Maybe<JsonFilter>;
  /** Filter by the object’s `validation` field. */
  validation?: Maybe<JsonFilter>;
  /** Filter by the object’s `validationMessage` field. */
  validationMessage?: Maybe<StringFilter>;
  /** Filter by the object’s `parameters` field. */
  parameters?: Maybe<JsonFilter>;
  /** Filter by the object’s `applicationResponses` relation. */
  applicationResponses?: Maybe<TemplateElementToManyApplicationResponseFilter>;
  /** Some related `applicationResponses` exist. */
  applicationResponsesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `reviewQuestionAssignments` relation. */
  reviewQuestionAssignments?: Maybe<TemplateElementToManyReviewQuestionAssignmentFilter>;
  /** Some related `reviewQuestionAssignments` exist. */
  reviewQuestionAssignmentsExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `section` relation. */
  section?: Maybe<TemplateSectionFilter>;
  /** A related `section` exists. */
  sectionExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TemplateElementFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TemplateElementFilter>>;
  /** Negates the expression. */
  not?: Maybe<TemplateElementFilter>;
};

/** A filter to be used against TemplateElementCategory fields. All fields are combined with a logical ‘and.’ */
export type TemplateElementCategoryFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<TemplateElementCategory>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<TemplateElementCategory>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<TemplateElementCategory>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<TemplateElementCategory>;
  /** Included in the specified list. */
  in?: Maybe<Array<TemplateElementCategory>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<TemplateElementCategory>>;
  /** Less than the specified value. */
  lessThan?: Maybe<TemplateElementCategory>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<TemplateElementCategory>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<TemplateElementCategory>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<TemplateElementCategory>;
};

export enum TemplateElementCategory {
  Question = 'QUESTION',
  Information = 'INFORMATION'
}

/** A filter to be used against many `ApplicationResponse` object types. All fields are combined with a logical ‘and.’ */
export type TemplateElementToManyApplicationResponseFilter = {
  /** Every related `ApplicationResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationResponseFilter>;
  /** Some related `ApplicationResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationResponseFilter>;
  /** No related `ApplicationResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationResponseFilter>;
};

/** A filter to be used against `ApplicationResponse` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationResponseFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `templateElementId` field. */
  templateElementId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `value` field. */
  value?: Maybe<JsonFilter>;
  /** Filter by the object’s `isValid` field. */
  isValid?: Maybe<BooleanFilter>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `reviewResponses` relation. */
  reviewResponses?: Maybe<ApplicationResponseToManyReviewResponseFilter>;
  /** Some related `reviewResponses` exist. */
  reviewResponsesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `files` relation. */
  files?: Maybe<ApplicationResponseToManyFileFilter>;
  /** Some related `files` exist. */
  filesExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `templateElement` relation. */
  templateElement?: Maybe<TemplateElementFilter>;
  /** A related `templateElement` exists. */
  templateElementExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationResponseFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationResponseFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationResponseFilter>;
};

/** A filter to be used against many `ReviewResponse` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationResponseToManyReviewResponseFilter = {
  /** Every related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewResponseFilter>;
  /** Some related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewResponseFilter>;
  /** No related `ReviewResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewResponseFilter>;
};

/** A filter to be used against many `File` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationResponseToManyFileFilter = {
  /** Every related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<FileFilter>;
  /** Some related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<FileFilter>;
  /** No related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<FileFilter>;
};

/** A filter to be used against `File` object types. All fields are combined with a logical ‘and.’ */
export type FileFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `originalFilename` field. */
  originalFilename?: Maybe<StringFilter>;
  /** Filter by the object’s `path` field. */
  path?: Maybe<StringFilter>;
  /** Filter by the object’s `mimetype` field. */
  mimetype?: Maybe<StringFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationResponseId` field. */
  applicationResponseId?: Maybe<IntFilter>;
  /** Filter by the object’s `notificationsByDocumentId` relation. */
  notificationsByDocumentId?: Maybe<FileToManyNotificationFilter>;
  /** Some related `notificationsByDocumentId` exist. */
  notificationsByDocumentIdExist?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `user` relation. */
  user?: Maybe<UserFilter>;
  /** A related `user` exists. */
  userExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `applicationResponse` relation. */
  applicationResponse?: Maybe<ApplicationResponseFilter>;
  /** A related `applicationResponse` exists. */
  applicationResponseExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<FileFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<FileFilter>>;
  /** Negates the expression. */
  not?: Maybe<FileFilter>;
};

/** A filter to be used against many `Notification` object types. All fields are combined with a logical ‘and.’ */
export type FileToManyNotificationFilter = {
  /** Every related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<NotificationFilter>;
  /** Some related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<NotificationFilter>;
  /** No related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<NotificationFilter>;
};

/** A filter to be used against `Notification` object types. All fields are combined with a logical ‘and.’ */
export type NotificationFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewId` field. */
  reviewId?: Maybe<IntFilter>;
  /** Filter by the object’s `subject` field. */
  subject?: Maybe<StringFilter>;
  /** Filter by the object’s `message` field. */
  message?: Maybe<StringFilter>;
  /** Filter by the object’s `documentId` field. */
  documentId?: Maybe<IntFilter>;
  /** Filter by the object’s `isRead` field. */
  isRead?: Maybe<BooleanFilter>;
  /** Filter by the object’s `user` relation. */
  user?: Maybe<UserFilter>;
  /** A related `user` exists. */
  userExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `application` relation. */
  application?: Maybe<ApplicationFilter>;
  /** A related `application` exists. */
  applicationExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `review` relation. */
  review?: Maybe<ReviewFilter>;
  /** A related `review` exists. */
  reviewExists?: Maybe<Scalars['Boolean']>;
  /** Filter by the object’s `document` relation. */
  document?: Maybe<FileFilter>;
  /** A related `document` exists. */
  documentExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<NotificationFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<NotificationFilter>>;
  /** Negates the expression. */
  not?: Maybe<NotificationFilter>;
};

/** A filter to be used against many `ReviewQuestionAssignment` object types. All fields are combined with a logical ‘and.’ */
export type TemplateElementToManyReviewQuestionAssignmentFilter = {
  /** Every related `ReviewQuestionAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewQuestionAssignmentFilter>;
  /** Some related `ReviewQuestionAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewQuestionAssignmentFilter>;
  /** No related `ReviewQuestionAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewQuestionAssignmentFilter>;
};

/** A filter to be used against many `ReviewStatusHistory` object types. All fields are combined with a logical ‘and.’ */
export type ReviewToManyReviewStatusHistoryFilter = {
  /** Every related `ReviewStatusHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewStatusHistoryFilter>;
  /** Some related `ReviewStatusHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewStatusHistoryFilter>;
  /** No related `ReviewStatusHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewStatusHistoryFilter>;
};

/** A filter to be used against `ReviewStatusHistory` object types. All fields are combined with a logical ‘and.’ */
export type ReviewStatusHistoryFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewId` field. */
  reviewId?: Maybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ReviewStatusFilter>;
  /** Filter by the object’s `timestamp` field. */
  timestamp?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `isCurrent` field. */
  isCurrent?: Maybe<BooleanFilter>;
  /** Filter by the object’s `review` relation. */
  review?: Maybe<ReviewFilter>;
  /** A related `review` exists. */
  reviewExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ReviewStatusHistoryFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ReviewStatusHistoryFilter>>;
  /** Negates the expression. */
  not?: Maybe<ReviewStatusHistoryFilter>;
};

/** A filter to be used against ReviewStatus fields. All fields are combined with a logical ‘and.’ */
export type ReviewStatusFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<ReviewStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<ReviewStatus>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<ReviewStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<ReviewStatus>;
  /** Included in the specified list. */
  in?: Maybe<Array<ReviewStatus>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<ReviewStatus>>;
  /** Less than the specified value. */
  lessThan?: Maybe<ReviewStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<ReviewStatus>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<ReviewStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<ReviewStatus>;
};

export enum ReviewStatus {
  Draft = 'DRAFT',
  Submitted = 'SUBMITTED',
  ChangesRequired = 'CHANGES_REQUIRED',
  ReviewPending = 'REVIEW_PENDING'
}

/** A filter to be used against many `Notification` object types. All fields are combined with a logical ‘and.’ */
export type ReviewToManyNotificationFilter = {
  /** Every related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<NotificationFilter>;
  /** Some related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<NotificationFilter>;
  /** No related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<NotificationFilter>;
};

/** A filter to be used against many `ReviewQuestionAssignment` object types. All fields are combined with a logical ‘and.’ */
export type ReviewAssignmentToManyReviewQuestionAssignmentFilter = {
  /** Every related `ReviewQuestionAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewQuestionAssignmentFilter>;
  /** Some related `ReviewQuestionAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewQuestionAssignmentFilter>;
  /** No related `ReviewQuestionAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewQuestionAssignmentFilter>;
};

/** A filter to be used against many `Review` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyReviewFilter = {
  /** Every related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewFilter>;
  /** Some related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewFilter>;
  /** No related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewFilter>;
};

/** A filter to be used against many `File` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyFileFilter = {
  /** Every related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<FileFilter>;
  /** Some related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<FileFilter>;
  /** No related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<FileFilter>;
};

/** A filter to be used against many `Notification` object types. All fields are combined with a logical ‘and.’ */
export type UserToManyNotificationFilter = {
  /** Every related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<NotificationFilter>;
  /** Some related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<NotificationFilter>;
  /** No related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<NotificationFilter>;
};

/** A filter to be used against many `TemplatePermission` object types. All fields are combined with a logical ‘and.’ */
export type PermissionNameToManyTemplatePermissionFilter = {
  /** Every related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplatePermissionFilter>;
  /** Some related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplatePermissionFilter>;
  /** No related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplatePermissionFilter>;
};

/** A filter to be used against `PermissionPolicy` object types. All fields are combined with a logical ‘and.’ */
export type PermissionPolicyFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: Maybe<StringFilter>;
  /** Filter by the object’s `rules` field. */
  rules?: Maybe<JsonFilter>;
  /** Filter by the object’s `type` field. */
  type?: Maybe<PermissionPolicyTypeFilter>;
  /** Filter by the object’s `defaultRestrictions` field. */
  defaultRestrictions?: Maybe<JsonFilter>;
  /** Filter by the object’s `permissionNames` relation. */
  permissionNames?: Maybe<PermissionPolicyToManyPermissionNameFilter>;
  /** Some related `permissionNames` exist. */
  permissionNamesExist?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<PermissionPolicyFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<PermissionPolicyFilter>>;
  /** Negates the expression. */
  not?: Maybe<PermissionPolicyFilter>;
};

/** A filter to be used against PermissionPolicyType fields. All fields are combined with a logical ‘and.’ */
export type PermissionPolicyTypeFilter = {
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: Maybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: Maybe<PermissionPolicyType>;
  /** Not equal to the specified value. */
  notEqualTo?: Maybe<PermissionPolicyType>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: Maybe<PermissionPolicyType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: Maybe<PermissionPolicyType>;
  /** Included in the specified list. */
  in?: Maybe<Array<PermissionPolicyType>>;
  /** Not included in the specified list. */
  notIn?: Maybe<Array<PermissionPolicyType>>;
  /** Less than the specified value. */
  lessThan?: Maybe<PermissionPolicyType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: Maybe<PermissionPolicyType>;
  /** Greater than the specified value. */
  greaterThan?: Maybe<PermissionPolicyType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: Maybe<PermissionPolicyType>;
};

export enum PermissionPolicyType {
  Review = 'REVIEW',
  Apply = 'APPLY',
  Assign = 'ASSIGN'
}

/** A filter to be used against many `PermissionName` object types. All fields are combined with a logical ‘and.’ */
export type PermissionPolicyToManyPermissionNameFilter = {
  /** Every related `PermissionName` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<PermissionNameFilter>;
  /** Some related `PermissionName` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<PermissionNameFilter>;
  /** No related `PermissionName` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<PermissionNameFilter>;
};

/** A filter to be used against many `TemplateElement` object types. All fields are combined with a logical ‘and.’ */
export type TemplateSectionToManyTemplateElementFilter = {
  /** Every related `TemplateElement` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplateElementFilter>;
  /** Some related `TemplateElement` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplateElementFilter>;
  /** No related `TemplateElement` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplateElementFilter>;
};

/** A filter to be used against many `ApplicationSection` object types. All fields are combined with a logical ‘and.’ */
export type TemplateSectionToManyApplicationSectionFilter = {
  /** Every related `ApplicationSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationSectionFilter>;
  /** Some related `ApplicationSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationSectionFilter>;
  /** No related `ApplicationSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationSectionFilter>;
};

/** A filter to be used against many `ApplicationStageHistory` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyApplicationStageHistoryFilter = {
  /** Every related `ApplicationStageHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationStageHistoryFilter>;
  /** Some related `ApplicationStageHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationStageHistoryFilter>;
  /** No related `ApplicationStageHistory` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationStageHistoryFilter>;
};

/** A filter to be used against many `ApplicationResponse` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyApplicationResponseFilter = {
  /** Every related `ApplicationResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationResponseFilter>;
  /** Some related `ApplicationResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationResponseFilter>;
  /** No related `ApplicationResponse` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationResponseFilter>;
};

/** A filter to be used against many `ReviewAssignment` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyReviewAssignmentFilter = {
  /** Every related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewAssignmentFilter>;
  /** Some related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewAssignmentFilter>;
  /** No related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewAssignmentFilter>;
};

/** A filter to be used against many `Review` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyReviewFilter = {
  /** Every related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewFilter>;
  /** Some related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewFilter>;
  /** No related `Review` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewFilter>;
};

/** A filter to be used against many `File` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyFileFilter = {
  /** Every related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<FileFilter>;
  /** Some related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<FileFilter>;
  /** No related `File` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<FileFilter>;
};

/** A filter to be used against many `Notification` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationToManyNotificationFilter = {
  /** Every related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<NotificationFilter>;
  /** Some related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<NotificationFilter>;
  /** No related `Notification` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<NotificationFilter>;
};

/** A filter to be used against many `ReviewAssignment` object types. All fields are combined with a logical ‘and.’ */
export type TemplateStageToManyReviewAssignmentFilter = {
  /** Every related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ReviewAssignmentFilter>;
  /** Some related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ReviewAssignmentFilter>;
  /** No related `ReviewAssignment` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ReviewAssignmentFilter>;
};

/** A filter to be used against many `TemplateSection` object types. All fields are combined with a logical ‘and.’ */
export type TemplateToManyTemplateSectionFilter = {
  /** Every related `TemplateSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplateSectionFilter>;
  /** Some related `TemplateSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplateSectionFilter>;
  /** No related `TemplateSection` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplateSectionFilter>;
};

/** A filter to be used against many `TemplatePermission` object types. All fields are combined with a logical ‘and.’ */
export type TemplateToManyTemplatePermissionFilter = {
  /** Every related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplatePermissionFilter>;
  /** Some related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplatePermissionFilter>;
  /** No related `TemplatePermission` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplatePermissionFilter>;
};

/** A filter to be used against many `Application` object types. All fields are combined with a logical ‘and.’ */
export type TemplateToManyApplicationFilter = {
  /** Every related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ApplicationFilter>;
  /** Some related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ApplicationFilter>;
  /** No related `Application` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ApplicationFilter>;
};

/** A filter to be used against many `ActionQueue` object types. All fields are combined with a logical ‘and.’ */
export type TemplateToManyActionQueueFilter = {
  /** Every related `ActionQueue` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<ActionQueueFilter>;
  /** Some related `ActionQueue` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<ActionQueueFilter>;
  /** No related `ActionQueue` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<ActionQueueFilter>;
};

/** A filter to be used against many `TemplateAction` object types. All fields are combined with a logical ‘and.’ */
export type TemplateToManyTemplateActionFilter = {
  /** Every related `TemplateAction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: Maybe<TemplateActionFilter>;
  /** Some related `TemplateAction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: Maybe<TemplateActionFilter>;
  /** No related `TemplateAction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: Maybe<TemplateActionFilter>;
};

/** A filter to be used against `TemplateAction` object types. All fields are combined with a logical ‘and.’ */
export type TemplateActionFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `actionCode` field. */
  actionCode?: Maybe<StringFilter>;
  /** Filter by the object’s `trigger` field. */
  trigger?: Maybe<TriggerFilter>;
  /** Filter by the object’s `sequence` field. */
  sequence?: Maybe<IntFilter>;
  /** Filter by the object’s `condition` field. */
  condition?: Maybe<JsonFilter>;
  /** Filter by the object’s `parameterQueries` field. */
  parameterQueries?: Maybe<JsonFilter>;
  /** Filter by the object’s `template` relation. */
  template?: Maybe<TemplateFilter>;
  /** A related `template` exists. */
  templateExists?: Maybe<Scalars['Boolean']>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<TemplateActionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<TemplateActionFilter>>;
  /** Negates the expression. */
  not?: Maybe<TemplateActionFilter>;
};

/** A connection to a list of `ActionQueue` values. */
export type ActionQueuesConnection = {
  __typename?: 'ActionQueuesConnection';
  /** A list of `ActionQueue` objects. */
  nodes: Array<Maybe<ActionQueue>>;
  /** A list of edges which contains the `ActionQueue` and cursor to aid in pagination. */
  edges: Array<ActionQueuesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ActionQueue` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ActionQueue = Node & {
  __typename?: 'ActionQueue';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  triggerEvent?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  applicationData?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  output?: Maybe<Scalars['JSON']>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeCompleted?: Maybe<Scalars['Datetime']>;
  timeScheduled?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
  /** Reads a single `TriggerQueue` that is related to this `ActionQueue`. */
  triggerQueueByTriggerEvent?: Maybe<TriggerQueue>;
  /** Reads a single `Template` that is related to this `ActionQueue`. */
  template?: Maybe<Template>;
};

export type TriggerQueue = Node & {
  __typename?: 'TriggerQueue';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  triggerType?: Maybe<Trigger>;
  table?: Maybe<Scalars['String']>;
  recordId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  status?: Maybe<TriggerQueueStatus>;
  log?: Maybe<Scalars['JSON']>;
  /** Reads and enables pagination through a set of `ActionQueue`. */
  actionQueuesByTriggerEvent: ActionQueuesConnection;
};


export type TriggerQueueActionQueuesByTriggerEventArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
  condition?: Maybe<ActionQueueCondition>;
  filter?: Maybe<ActionQueueFilter>;
};

export type Template = Node & {
  __typename?: 'Template';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  /** Reads and enables pagination through a set of `TemplateStage`. */
  templateStages: TemplateStagesConnection;
  /** Reads and enables pagination through a set of `TemplateSection`. */
  templateSections: TemplateSectionsConnection;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissions: TemplatePermissionsConnection;
  /** Reads and enables pagination through a set of `Application`. */
  applications: ApplicationsConnection;
  /** Reads and enables pagination through a set of `ActionQueue`. */
  actionQueues: ActionQueuesConnection;
  /** Reads and enables pagination through a set of `TemplateAction`. */
  templateActions: TemplateActionsConnection;
};


export type TemplateTemplateStagesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
  condition?: Maybe<TemplateStageCondition>;
  filter?: Maybe<TemplateStageFilter>;
};


export type TemplateTemplateSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
  condition?: Maybe<TemplateSectionCondition>;
  filter?: Maybe<TemplateSectionFilter>;
};


export type TemplateTemplatePermissionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
  filter?: Maybe<TemplatePermissionFilter>;
};


export type TemplateApplicationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
  filter?: Maybe<ApplicationFilter>;
};


export type TemplateActionQueuesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
  condition?: Maybe<ActionQueueCondition>;
  filter?: Maybe<ActionQueueFilter>;
};


export type TemplateTemplateActionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
  condition?: Maybe<TemplateActionCondition>;
  filter?: Maybe<TemplateActionFilter>;
};

/** Methods to use when ordering `TemplateStage`. */
export enum TemplateStagesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NumberAsc = 'NUMBER_ASC',
  NumberDesc = 'NUMBER_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateStage` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateStageCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `number` field. */
  number?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `TemplateStage` values. */
export type TemplateStagesConnection = {
  __typename?: 'TemplateStagesConnection';
  /** A list of `TemplateStage` objects. */
  nodes: Array<Maybe<TemplateStage>>;
  /** A list of edges which contains the `TemplateStage` and cursor to aid in pagination. */
  edges: Array<TemplateStagesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateStage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplateStage = Node & {
  __typename?: 'TemplateStage';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  number?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  templateId?: Maybe<Scalars['Int']>;
  /** Reads a single `Template` that is related to this `TemplateStage`. */
  template?: Maybe<Template>;
  /** Reads and enables pagination through a set of `ApplicationStageHistory`. */
  applicationStageHistoriesByStageId: ApplicationStageHistoriesConnection;
  /** Reads and enables pagination through a set of `ReviewAssignment`. */
  reviewAssignmentsByStageId: ReviewAssignmentsConnection;
};


export type TemplateStageApplicationStageHistoriesByStageIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStageHistoryCondition>;
  filter?: Maybe<ApplicationStageHistoryFilter>;
};


export type TemplateStageReviewAssignmentsByStageIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewAssignmentsOrderBy>>;
  condition?: Maybe<ReviewAssignmentCondition>;
  filter?: Maybe<ReviewAssignmentFilter>;
};

/** Methods to use when ordering `ApplicationStageHistory`. */
export enum ApplicationStageHistoriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  StageIdAsc = 'STAGE_ID_ASC',
  StageIdDesc = 'STAGE_ID_DESC',
  TimeCreatedAsc = 'TIME_CREATED_ASC',
  TimeCreatedDesc = 'TIME_CREATED_DESC',
  IsCurrentAsc = 'IS_CURRENT_ASC',
  IsCurrentDesc = 'IS_CURRENT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ApplicationStageHistory` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationStageHistoryCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `stageId` field. */
  stageId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `timeCreated` field. */
  timeCreated?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `isCurrent` field. */
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `ApplicationStageHistory` values. */
export type ApplicationStageHistoriesConnection = {
  __typename?: 'ApplicationStageHistoriesConnection';
  /** A list of `ApplicationStageHistory` objects. */
  nodes: Array<Maybe<ApplicationStageHistory>>;
  /** A list of edges which contains the `ApplicationStageHistory` and cursor to aid in pagination. */
  edges: Array<ApplicationStageHistoriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationStageHistory` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationStageHistory = Node & {
  __typename?: 'ApplicationStageHistory';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  applicationId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  /** Reads a single `Application` that is related to this `ApplicationStageHistory`. */
  application?: Maybe<Application>;
  /** Reads a single `TemplateStage` that is related to this `ApplicationStageHistory`. */
  stage?: Maybe<TemplateStage>;
  /** Reads and enables pagination through a set of `ApplicationStatusHistory`. */
  applicationStatusHistories: ApplicationStatusHistoriesConnection;
};


export type ApplicationStageHistoryApplicationStatusHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStatusHistoryCondition>;
  filter?: Maybe<ApplicationStatusHistoryFilter>;
};

export type Application = Node & {
  __typename?: 'Application';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  /** Reads a single `Template` that is related to this `Application`. */
  template?: Maybe<Template>;
  /** Reads a single `User` that is related to this `Application`. */
  user?: Maybe<User>;
  /** Reads a single `Organisation` that is related to this `Application`. */
  org?: Maybe<Organisation>;
  /** Reads and enables pagination through a set of `ApplicationSection`. */
  applicationSections: ApplicationSectionsConnection;
  /** Reads and enables pagination through a set of `ApplicationStageHistory`. */
  applicationStageHistories: ApplicationStageHistoriesConnection;
  /** Reads and enables pagination through a set of `ApplicationResponse`. */
  applicationResponses: ApplicationResponsesConnection;
  /** Reads and enables pagination through a set of `ReviewAssignment`. */
  reviewAssignments: ReviewAssignmentsConnection;
  /** Reads and enables pagination through a set of `Review`. */
  reviews: ReviewsConnection;
  /** Reads and enables pagination through a set of `File`. */
  files: FilesConnection;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications: NotificationsConnection;
  stage?: Maybe<Scalars['String']>;
  stageNumber?: Maybe<Scalars['Int']>;
  status?: Maybe<ApplicationStatus>;
};


export type ApplicationApplicationSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
  condition?: Maybe<ApplicationSectionCondition>;
  filter?: Maybe<ApplicationSectionFilter>;
};


export type ApplicationApplicationStageHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStageHistoryCondition>;
  filter?: Maybe<ApplicationStageHistoryFilter>;
};


export type ApplicationApplicationResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
  condition?: Maybe<ApplicationResponseCondition>;
  filter?: Maybe<ApplicationResponseFilter>;
};


export type ApplicationReviewAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewAssignmentsOrderBy>>;
  condition?: Maybe<ReviewAssignmentCondition>;
  filter?: Maybe<ReviewAssignmentFilter>;
};


export type ApplicationReviewsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
  condition?: Maybe<ReviewCondition>;
  filter?: Maybe<ReviewFilter>;
};


export type ApplicationFilesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<FilesOrderBy>>;
  condition?: Maybe<FileCondition>;
  filter?: Maybe<FileFilter>;
};


export type ApplicationNotificationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
  filter?: Maybe<NotificationFilter>;
};

export type User = Node & {
  __typename?: 'User';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `UserOrganisation`. */
  userOrganisations: UserOrganisationsConnection;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoins: PermissionJoinsConnection;
  /** Reads and enables pagination through a set of `Application`. */
  applications: ApplicationsConnection;
  /** Reads and enables pagination through a set of `ReviewAssignment`. */
  reviewAssignmentsByAssignerId: ReviewAssignmentsConnection;
  /** Reads and enables pagination through a set of `ReviewAssignment`. */
  reviewedReviewAssignments: ReviewAssignmentsConnection;
  /** Reads and enables pagination through a set of `Review`. */
  reviewedReviews: ReviewsConnection;
  /** Reads and enables pagination through a set of `File`. */
  files: FilesConnection;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications: NotificationsConnection;
};


export type UserUserOrganisationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
  condition?: Maybe<UserOrganisationCondition>;
  filter?: Maybe<UserOrganisationFilter>;
};


export type UserPermissionJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
  filter?: Maybe<PermissionJoinFilter>;
};


export type UserApplicationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
  filter?: Maybe<ApplicationFilter>;
};


export type UserReviewAssignmentsByAssignerIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewAssignmentsOrderBy>>;
  condition?: Maybe<ReviewAssignmentCondition>;
  filter?: Maybe<ReviewAssignmentFilter>;
};


export type UserReviewedReviewAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewAssignmentsOrderBy>>;
  condition?: Maybe<ReviewAssignmentCondition>;
  filter?: Maybe<ReviewAssignmentFilter>;
};


export type UserReviewedReviewsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
  condition?: Maybe<ReviewCondition>;
  filter?: Maybe<ReviewFilter>;
};


export type UserFilesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<FilesOrderBy>>;
  condition?: Maybe<FileCondition>;
  filter?: Maybe<FileFilter>;
};


export type UserNotificationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
  filter?: Maybe<NotificationFilter>;
};

/** Methods to use when ordering `UserOrganisation`. */
export enum UserOrganisationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  OrganisationIdAsc = 'ORGANISATION_ID_ASC',
  OrganisationIdDesc = 'ORGANISATION_ID_DESC',
  UserRoleAsc = 'USER_ROLE_ASC',
  UserRoleDesc = 'USER_ROLE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `UserOrganisation` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserOrganisationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `organisationId` field. */
  organisationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userRole` field. */
  userRole?: Maybe<Scalars['String']>;
};

/** A connection to a list of `UserOrganisation` values. */
export type UserOrganisationsConnection = {
  __typename?: 'UserOrganisationsConnection';
  /** A list of `UserOrganisation` objects. */
  nodes: Array<Maybe<UserOrganisation>>;
  /** A list of edges which contains the `UserOrganisation` and cursor to aid in pagination. */
  edges: Array<UserOrganisationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserOrganisation` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type UserOrganisation = Node & {
  __typename?: 'UserOrganisation';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  userId?: Maybe<Scalars['Int']>;
  organisationId?: Maybe<Scalars['Int']>;
  userRole?: Maybe<Scalars['String']>;
  /** Reads a single `User` that is related to this `UserOrganisation`. */
  user?: Maybe<User>;
  /** Reads a single `Organisation` that is related to this `UserOrganisation`. */
  organisation?: Maybe<Organisation>;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoins: PermissionJoinsConnection;
};


export type UserOrganisationPermissionJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
  filter?: Maybe<PermissionJoinFilter>;
};

export type Organisation = Node & {
  __typename?: 'Organisation';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `UserOrganisation`. */
  userOrganisations: UserOrganisationsConnection;
  /** Reads and enables pagination through a set of `Application`. */
  applicationsByOrgId: ApplicationsConnection;
};


export type OrganisationUserOrganisationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
  condition?: Maybe<UserOrganisationCondition>;
  filter?: Maybe<UserOrganisationFilter>;
};


export type OrganisationApplicationsByOrgIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
  filter?: Maybe<ApplicationFilter>;
};

/** Methods to use when ordering `Application`. */
export enum ApplicationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  OrgIdAsc = 'ORG_ID_ASC',
  OrgIdDesc = 'ORG_ID_DESC',
  SerialAsc = 'SERIAL_ASC',
  SerialDesc = 'SERIAL_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OutcomeAsc = 'OUTCOME_ASC',
  OutcomeDesc = 'OUTCOME_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
  TriggerAsc = 'TRIGGER_ASC',
  TriggerDesc = 'TRIGGER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Application` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `orgId` field. */
  orgId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `serial` field. */
  serial?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `outcome` field. */
  outcome?: Maybe<ApplicationOutcome>;
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `trigger` field. */
  trigger?: Maybe<Trigger>;
};

/** A connection to a list of `Application` values. */
export type ApplicationsConnection = {
  __typename?: 'ApplicationsConnection';
  /** A list of `Application` objects. */
  nodes: Array<Maybe<Application>>;
  /** A list of edges which contains the `Application` and cursor to aid in pagination. */
  edges: Array<ApplicationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Application` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Application` edge in the connection. */
export type ApplicationsEdge = {
  __typename?: 'ApplicationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Application` at the end of the edge. */
  node?: Maybe<Application>;
};

/** Methods to use when ordering `PermissionJoin`. */
export enum PermissionJoinsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  UserOrganisationIdAsc = 'USER_ORGANISATION_ID_ASC',
  UserOrganisationIdDesc = 'USER_ORGANISATION_ID_DESC',
  PermissionNameIdAsc = 'PERMISSION_NAME_ID_ASC',
  PermissionNameIdDesc = 'PERMISSION_NAME_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `PermissionJoin` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PermissionJoinCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userOrganisationId` field. */
  userOrganisationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `permissionNameId` field. */
  permissionNameId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `PermissionJoin` values. */
export type PermissionJoinsConnection = {
  __typename?: 'PermissionJoinsConnection';
  /** A list of `PermissionJoin` objects. */
  nodes: Array<Maybe<PermissionJoin>>;
  /** A list of edges which contains the `PermissionJoin` and cursor to aid in pagination. */
  edges: Array<PermissionJoinsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PermissionJoin` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type PermissionJoin = Node & {
  __typename?: 'PermissionJoin';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  userId?: Maybe<Scalars['Int']>;
  userOrganisationId?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
  /** Reads a single `User` that is related to this `PermissionJoin`. */
  user?: Maybe<User>;
  /** Reads a single `UserOrganisation` that is related to this `PermissionJoin`. */
  userOrganisation?: Maybe<UserOrganisation>;
  /** Reads a single `PermissionName` that is related to this `PermissionJoin`. */
  permissionName?: Maybe<PermissionName>;
};

export type PermissionName = Node & {
  __typename?: 'PermissionName';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  /** Reads a single `PermissionPolicy` that is related to this `PermissionName`. */
  permissionPolicy?: Maybe<PermissionPolicy>;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoins: PermissionJoinsConnection;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissions: TemplatePermissionsConnection;
};


export type PermissionNamePermissionJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
  filter?: Maybe<PermissionJoinFilter>;
};


export type PermissionNameTemplatePermissionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
  filter?: Maybe<TemplatePermissionFilter>;
};

export type PermissionPolicy = Node & {
  __typename?: 'PermissionPolicy';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  rules?: Maybe<Scalars['JSON']>;
  type?: Maybe<PermissionPolicyType>;
  defaultRestrictions?: Maybe<Scalars['JSON']>;
  /** Reads and enables pagination through a set of `PermissionName`. */
  permissionNames: PermissionNamesConnection;
};


export type PermissionPolicyPermissionNamesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionNamesOrderBy>>;
  condition?: Maybe<PermissionNameCondition>;
  filter?: Maybe<PermissionNameFilter>;
};

/** Methods to use when ordering `PermissionName`. */
export enum PermissionNamesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  PermissionPolicyIdAsc = 'PERMISSION_POLICY_ID_ASC',
  PermissionPolicyIdDesc = 'PERMISSION_POLICY_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `PermissionName` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PermissionNameCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `permissionPolicyId` field. */
  permissionPolicyId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `PermissionName` values. */
export type PermissionNamesConnection = {
  __typename?: 'PermissionNamesConnection';
  /** A list of `PermissionName` objects. */
  nodes: Array<Maybe<PermissionName>>;
  /** A list of edges which contains the `PermissionName` and cursor to aid in pagination. */
  edges: Array<PermissionNamesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PermissionName` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PermissionName` edge in the connection. */
export type PermissionNamesEdge = {
  __typename?: 'PermissionNamesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PermissionName` at the end of the edge. */
  node?: Maybe<PermissionName>;
};

/** Methods to use when ordering `TemplatePermission`. */
export enum TemplatePermissionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  PermissionNameIdAsc = 'PERMISSION_NAME_ID_ASC',
  PermissionNameIdDesc = 'PERMISSION_NAME_ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  TemplateSectionIdAsc = 'TEMPLATE_SECTION_ID_ASC',
  TemplateSectionIdDesc = 'TEMPLATE_SECTION_ID_DESC',
  RestrictionsAsc = 'RESTRICTIONS_ASC',
  RestrictionsDesc = 'RESTRICTIONS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplatePermission` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplatePermissionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `permissionNameId` field. */
  permissionNameId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateSectionId` field. */
  templateSectionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `restrictions` field. */
  restrictions?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TemplatePermission` values. */
export type TemplatePermissionsConnection = {
  __typename?: 'TemplatePermissionsConnection';
  /** A list of `TemplatePermission` objects. */
  nodes: Array<Maybe<TemplatePermission>>;
  /** A list of edges which contains the `TemplatePermission` and cursor to aid in pagination. */
  edges: Array<TemplatePermissionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplatePermission` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplatePermission = Node & {
  __typename?: 'TemplatePermission';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  permissionNameId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
  /** Reads a single `PermissionName` that is related to this `TemplatePermission`. */
  permissionName?: Maybe<PermissionName>;
  /** Reads a single `Template` that is related to this `TemplatePermission`. */
  template?: Maybe<Template>;
  /** Reads a single `TemplateSection` that is related to this `TemplatePermission`. */
  templateSection?: Maybe<TemplateSection>;
};

export type TemplateSection = Node & {
  __typename?: 'TemplateSection';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  /** Reads a single `Template` that is related to this `TemplateSection`. */
  template?: Maybe<Template>;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissions: TemplatePermissionsConnection;
  /** Reads and enables pagination through a set of `TemplateElement`. */
  templateElementsBySectionId: TemplateElementsConnection;
  /** Reads and enables pagination through a set of `ApplicationSection`. */
  applicationSections: ApplicationSectionsConnection;
};


export type TemplateSectionTemplatePermissionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
  filter?: Maybe<TemplatePermissionFilter>;
};


export type TemplateSectionTemplateElementsBySectionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
  condition?: Maybe<TemplateElementCondition>;
  filter?: Maybe<TemplateElementFilter>;
};


export type TemplateSectionApplicationSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
  condition?: Maybe<ApplicationSectionCondition>;
  filter?: Maybe<ApplicationSectionFilter>;
};

/** Methods to use when ordering `TemplateElement`. */
export enum TemplateElementsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SectionIdAsc = 'SECTION_ID_ASC',
  SectionIdDesc = 'SECTION_ID_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  CategoryAsc = 'CATEGORY_ASC',
  CategoryDesc = 'CATEGORY_DESC',
  ElementTypePluginCodeAsc = 'ELEMENT_TYPE_PLUGIN_CODE_ASC',
  ElementTypePluginCodeDesc = 'ELEMENT_TYPE_PLUGIN_CODE_DESC',
  VisibilityConditionAsc = 'VISIBILITY_CONDITION_ASC',
  VisibilityConditionDesc = 'VISIBILITY_CONDITION_DESC',
  IsRequiredAsc = 'IS_REQUIRED_ASC',
  IsRequiredDesc = 'IS_REQUIRED_DESC',
  IsEditableAsc = 'IS_EDITABLE_ASC',
  IsEditableDesc = 'IS_EDITABLE_DESC',
  ValidationAsc = 'VALIDATION_ASC',
  ValidationDesc = 'VALIDATION_DESC',
  ValidationMessageAsc = 'VALIDATION_MESSAGE_ASC',
  ValidationMessageDesc = 'VALIDATION_MESSAGE_DESC',
  ParametersAsc = 'PARAMETERS_ASC',
  ParametersDesc = 'PARAMETERS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateElement` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateElementCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sectionId` field. */
  sectionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `index` field. */
  index?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `category` field. */
  category?: Maybe<TemplateElementCategory>;
  /** Checks for equality with the object’s `elementTypePluginCode` field. */
  elementTypePluginCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `visibilityCondition` field. */
  visibilityCondition?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `isRequired` field. */
  isRequired?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `isEditable` field. */
  isEditable?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `validation` field. */
  validation?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `validationMessage` field. */
  validationMessage?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `parameters` field. */
  parameters?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TemplateElement` values. */
export type TemplateElementsConnection = {
  __typename?: 'TemplateElementsConnection';
  /** A list of `TemplateElement` objects. */
  nodes: Array<Maybe<TemplateElement>>;
  /** A list of edges which contains the `TemplateElement` and cursor to aid in pagination. */
  edges: Array<TemplateElementsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateElement` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplateElement = Node & {
  __typename?: 'TemplateElement';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  sectionId?: Maybe<Scalars['Int']>;
  code: Scalars['String'];
  index?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  elementTypePluginCode?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  isRequired?: Maybe<Scalars['JSON']>;
  isEditable?: Maybe<Scalars['JSON']>;
  validation?: Maybe<Scalars['JSON']>;
  validationMessage?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  /** Reads a single `TemplateSection` that is related to this `TemplateElement`. */
  section?: Maybe<TemplateSection>;
  /** Reads and enables pagination through a set of `ApplicationResponse`. */
  applicationResponses: ApplicationResponsesConnection;
  /** Reads and enables pagination through a set of `ReviewQuestionAssignment`. */
  reviewQuestionAssignments: ReviewQuestionAssignmentsConnection;
};


export type TemplateElementApplicationResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
  condition?: Maybe<ApplicationResponseCondition>;
  filter?: Maybe<ApplicationResponseFilter>;
};


export type TemplateElementReviewQuestionAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewQuestionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewQuestionAssignmentCondition>;
  filter?: Maybe<ReviewQuestionAssignmentFilter>;
};

/** Methods to use when ordering `ApplicationResponse`. */
export enum ApplicationResponsesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateElementIdAsc = 'TEMPLATE_ELEMENT_ID_ASC',
  TemplateElementIdDesc = 'TEMPLATE_ELEMENT_ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
  IsValidAsc = 'IS_VALID_ASC',
  IsValidDesc = 'IS_VALID_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ApplicationResponse` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationResponseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateElementId` field. */
  templateElementId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `value` field. */
  value?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `isValid` field. */
  isValid?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: Maybe<Scalars['Datetime']>;
};

/** A connection to a list of `ApplicationResponse` values. */
export type ApplicationResponsesConnection = {
  __typename?: 'ApplicationResponsesConnection';
  /** A list of `ApplicationResponse` objects. */
  nodes: Array<Maybe<ApplicationResponse>>;
  /** A list of edges which contains the `ApplicationResponse` and cursor to aid in pagination. */
  edges: Array<ApplicationResponsesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationResponse` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationResponse = Node & {
  __typename?: 'ApplicationResponse';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateElementId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  /** Reads a single `TemplateElement` that is related to this `ApplicationResponse`. */
  templateElement?: Maybe<TemplateElement>;
  /** Reads a single `Application` that is related to this `ApplicationResponse`. */
  application?: Maybe<Application>;
  /** Reads and enables pagination through a set of `ReviewResponse`. */
  reviewResponses: ReviewResponsesConnection;
  /** Reads and enables pagination through a set of `File`. */
  files: FilesConnection;
};


export type ApplicationResponseReviewResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
  condition?: Maybe<ReviewResponseCondition>;
  filter?: Maybe<ReviewResponseFilter>;
};


export type ApplicationResponseFilesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<FilesOrderBy>>;
  condition?: Maybe<FileCondition>;
  filter?: Maybe<FileFilter>;
};

/** Methods to use when ordering `ReviewResponse`. */
export enum ReviewResponsesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CommentAsc = 'COMMENT_ASC',
  CommentDesc = 'COMMENT_DESC',
  DecisionAsc = 'DECISION_ASC',
  DecisionDesc = 'DECISION_DESC',
  ReviewQuestionAssignmentIdAsc = 'REVIEW_QUESTION_ASSIGNMENT_ID_ASC',
  ReviewQuestionAssignmentIdDesc = 'REVIEW_QUESTION_ASSIGNMENT_ID_DESC',
  ApplicationResponseIdAsc = 'APPLICATION_RESPONSE_ID_ASC',
  ApplicationResponseIdDesc = 'APPLICATION_RESPONSE_ID_DESC',
  ReviewIdAsc = 'REVIEW_ID_ASC',
  ReviewIdDesc = 'REVIEW_ID_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewResponse` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewResponseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `comment` field. */
  comment?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `decision` field. */
  decision?: Maybe<ReviewResponseDecision>;
  /** Checks for equality with the object’s `reviewQuestionAssignmentId` field. */
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationResponseId` field. */
  applicationResponseId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewId` field. */
  reviewId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: Maybe<Scalars['Datetime']>;
};

/** A connection to a list of `ReviewResponse` values. */
export type ReviewResponsesConnection = {
  __typename?: 'ReviewResponsesConnection';
  /** A list of `ReviewResponse` objects. */
  nodes: Array<Maybe<ReviewResponse>>;
  /** A list of edges which contains the `ReviewResponse` and cursor to aid in pagination. */
  edges: Array<ReviewResponsesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewResponse` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ReviewResponse = Node & {
  __typename?: 'ReviewResponse';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  /** Reads a single `ReviewQuestionAssignment` that is related to this `ReviewResponse`. */
  reviewQuestionAssignment?: Maybe<ReviewQuestionAssignment>;
  /** Reads a single `ApplicationResponse` that is related to this `ReviewResponse`. */
  applicationResponse?: Maybe<ApplicationResponse>;
  /** Reads a single `Review` that is related to this `ReviewResponse`. */
  review?: Maybe<Review>;
};

export type ReviewQuestionAssignment = Node & {
  __typename?: 'ReviewQuestionAssignment';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateElementId?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  /** Reads a single `TemplateElement` that is related to this `ReviewQuestionAssignment`. */
  templateElement?: Maybe<TemplateElement>;
  /** Reads a single `ReviewAssignment` that is related to this `ReviewQuestionAssignment`. */
  reviewAssignment?: Maybe<ReviewAssignment>;
  /** Reads and enables pagination through a set of `ReviewResponse`. */
  reviewResponses: ReviewResponsesConnection;
};


export type ReviewQuestionAssignmentReviewResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
  condition?: Maybe<ReviewResponseCondition>;
  filter?: Maybe<ReviewResponseFilter>;
};

export type ReviewAssignment = Node & {
  __typename?: 'ReviewAssignment';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  /** Reads a single `User` that is related to this `ReviewAssignment`. */
  assigner?: Maybe<User>;
  /** Reads a single `User` that is related to this `ReviewAssignment`. */
  reviewer?: Maybe<User>;
  /** Reads a single `TemplateStage` that is related to this `ReviewAssignment`. */
  stage?: Maybe<TemplateStage>;
  /** Reads a single `Application` that is related to this `ReviewAssignment`. */
  application?: Maybe<Application>;
  /** Reads and enables pagination through a set of `Review`. */
  reviews: ReviewsConnection;
  /** Reads and enables pagination through a set of `ReviewQuestionAssignment`. */
  reviewQuestionAssignments: ReviewQuestionAssignmentsConnection;
};


export type ReviewAssignmentReviewsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
  condition?: Maybe<ReviewCondition>;
  filter?: Maybe<ReviewFilter>;
};


export type ReviewAssignmentReviewQuestionAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewQuestionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewQuestionAssignmentCondition>;
  filter?: Maybe<ReviewQuestionAssignmentFilter>;
};

/** Methods to use when ordering `Review`. */
export enum ReviewsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReviewAssignmentIdAsc = 'REVIEW_ASSIGNMENT_ID_ASC',
  ReviewAssignmentIdDesc = 'REVIEW_ASSIGNMENT_ID_DESC',
  TriggerAsc = 'TRIGGER_ASC',
  TriggerDesc = 'TRIGGER_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  ReviewerIdAsc = 'REVIEWER_ID_ASC',
  ReviewerIdDesc = 'REVIEWER_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Review` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewAssignmentId` field. */
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `trigger` field. */
  trigger?: Maybe<Trigger>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewerId` field. */
  reviewerId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `Review` values. */
export type ReviewsConnection = {
  __typename?: 'ReviewsConnection';
  /** A list of `Review` objects. */
  nodes: Array<Maybe<Review>>;
  /** A list of edges which contains the `Review` and cursor to aid in pagination. */
  edges: Array<ReviewsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Review` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Review = Node & {
  __typename?: 'Review';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  /** Reads a single `ReviewAssignment` that is related to this `Review`. */
  reviewAssignment?: Maybe<ReviewAssignment>;
  /** Reads a single `Application` that is related to this `Review`. */
  application?: Maybe<Application>;
  /** Reads a single `User` that is related to this `Review`. */
  reviewer?: Maybe<User>;
  /** Reads and enables pagination through a set of `ReviewResponse`. */
  reviewResponses: ReviewResponsesConnection;
  /** Reads and enables pagination through a set of `ReviewStatusHistory`. */
  reviewStatusHistories: ReviewStatusHistoriesConnection;
  /** Reads and enables pagination through a set of `Notification`. */
  notifications: NotificationsConnection;
  status?: Maybe<Scalars['String']>;
};


export type ReviewReviewResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
  condition?: Maybe<ReviewResponseCondition>;
  filter?: Maybe<ReviewResponseFilter>;
};


export type ReviewReviewStatusHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewStatusHistoriesOrderBy>>;
  condition?: Maybe<ReviewStatusHistoryCondition>;
  filter?: Maybe<ReviewStatusHistoryFilter>;
};


export type ReviewNotificationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
  filter?: Maybe<NotificationFilter>;
};

/** Methods to use when ordering `ReviewStatusHistory`. */
export enum ReviewStatusHistoriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReviewIdAsc = 'REVIEW_ID_ASC',
  ReviewIdDesc = 'REVIEW_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  IsCurrentAsc = 'IS_CURRENT_ASC',
  IsCurrentDesc = 'IS_CURRENT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewStatusHistory` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewStatusHistoryCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewId` field. */
  reviewId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ReviewStatus>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `isCurrent` field. */
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `ReviewStatusHistory` values. */
export type ReviewStatusHistoriesConnection = {
  __typename?: 'ReviewStatusHistoriesConnection';
  /** A list of `ReviewStatusHistory` objects. */
  nodes: Array<Maybe<ReviewStatusHistory>>;
  /** A list of edges which contains the `ReviewStatusHistory` and cursor to aid in pagination. */
  edges: Array<ReviewStatusHistoriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewStatusHistory` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ReviewStatusHistory = Node & {
  __typename?: 'ReviewStatusHistory';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  reviewId?: Maybe<Scalars['Int']>;
  status?: Maybe<ReviewStatus>;
  timestamp?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  /** Reads a single `Review` that is related to this `ReviewStatusHistory`. */
  review?: Maybe<Review>;
};

/** A `ReviewStatusHistory` edge in the connection. */
export type ReviewStatusHistoriesEdge = {
  __typename?: 'ReviewStatusHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewStatusHistory` at the end of the edge. */
  node?: Maybe<ReviewStatusHistory>;
};

/** Methods to use when ordering `Notification`. */
export enum NotificationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  ReviewIdAsc = 'REVIEW_ID_ASC',
  ReviewIdDesc = 'REVIEW_ID_DESC',
  SubjectAsc = 'SUBJECT_ASC',
  SubjectDesc = 'SUBJECT_DESC',
  MessageAsc = 'MESSAGE_ASC',
  MessageDesc = 'MESSAGE_DESC',
  DocumentIdAsc = 'DOCUMENT_ID_ASC',
  DocumentIdDesc = 'DOCUMENT_ID_DESC',
  IsReadAsc = 'IS_READ_ASC',
  IsReadDesc = 'IS_READ_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Notification` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type NotificationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewId` field. */
  reviewId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `subject` field. */
  subject?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `message` field. */
  message?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `documentId` field. */
  documentId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `isRead` field. */
  isRead?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `Notification` values. */
export type NotificationsConnection = {
  __typename?: 'NotificationsConnection';
  /** A list of `Notification` objects. */
  nodes: Array<Maybe<Notification>>;
  /** A list of edges which contains the `Notification` and cursor to aid in pagination. */
  edges: Array<NotificationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Notification` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Notification = Node & {
  __typename?: 'Notification';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  userId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  /** Reads a single `User` that is related to this `Notification`. */
  user?: Maybe<User>;
  /** Reads a single `Application` that is related to this `Notification`. */
  application?: Maybe<Application>;
  /** Reads a single `Review` that is related to this `Notification`. */
  review?: Maybe<Review>;
  /** Reads a single `File` that is related to this `Notification`. */
  document?: Maybe<File>;
};

export type File = Node & {
  __typename?: 'File';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  /** Reads a single `User` that is related to this `File`. */
  user?: Maybe<User>;
  /** Reads a single `Application` that is related to this `File`. */
  application?: Maybe<Application>;
  /** Reads a single `ApplicationResponse` that is related to this `File`. */
  applicationResponse?: Maybe<ApplicationResponse>;
  /** Reads and enables pagination through a set of `Notification`. */
  notificationsByDocumentId: NotificationsConnection;
};


export type FileNotificationsByDocumentIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<NotificationsOrderBy>>;
  condition?: Maybe<NotificationCondition>;
  filter?: Maybe<NotificationFilter>;
};

/** A `Notification` edge in the connection. */
export type NotificationsEdge = {
  __typename?: 'NotificationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Notification` at the end of the edge. */
  node?: Maybe<Notification>;
};

/** A `Review` edge in the connection. */
export type ReviewsEdge = {
  __typename?: 'ReviewsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Review` at the end of the edge. */
  node?: Maybe<Review>;
};

/** Methods to use when ordering `ReviewQuestionAssignment`. */
export enum ReviewQuestionAssignmentsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateElementIdAsc = 'TEMPLATE_ELEMENT_ID_ASC',
  TemplateElementIdDesc = 'TEMPLATE_ELEMENT_ID_DESC',
  ReviewAssignmentIdAsc = 'REVIEW_ASSIGNMENT_ID_ASC',
  ReviewAssignmentIdDesc = 'REVIEW_ASSIGNMENT_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewQuestionAssignment` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewQuestionAssignmentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateElementId` field. */
  templateElementId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewAssignmentId` field. */
  reviewAssignmentId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `ReviewQuestionAssignment` values. */
export type ReviewQuestionAssignmentsConnection = {
  __typename?: 'ReviewQuestionAssignmentsConnection';
  /** A list of `ReviewQuestionAssignment` objects. */
  nodes: Array<Maybe<ReviewQuestionAssignment>>;
  /** A list of edges which contains the `ReviewQuestionAssignment` and cursor to aid in pagination. */
  edges: Array<ReviewQuestionAssignmentsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewQuestionAssignment` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ReviewQuestionAssignment` edge in the connection. */
export type ReviewQuestionAssignmentsEdge = {
  __typename?: 'ReviewQuestionAssignmentsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewQuestionAssignment` at the end of the edge. */
  node?: Maybe<ReviewQuestionAssignment>;
};

/** A `ReviewResponse` edge in the connection. */
export type ReviewResponsesEdge = {
  __typename?: 'ReviewResponsesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewResponse` at the end of the edge. */
  node?: Maybe<ReviewResponse>;
};

/** Methods to use when ordering `File`. */
export enum FilesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  OriginalFilenameAsc = 'ORIGINAL_FILENAME_ASC',
  OriginalFilenameDesc = 'ORIGINAL_FILENAME_DESC',
  PathAsc = 'PATH_ASC',
  PathDesc = 'PATH_DESC',
  MimetypeAsc = 'MIMETYPE_ASC',
  MimetypeDesc = 'MIMETYPE_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  ApplicationResponseIdAsc = 'APPLICATION_RESPONSE_ID_ASC',
  ApplicationResponseIdDesc = 'APPLICATION_RESPONSE_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `File` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type FileCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `originalFilename` field. */
  originalFilename?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `path` field. */
  path?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `mimetype` field. */
  mimetype?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationResponseId` field. */
  applicationResponseId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `File` values. */
export type FilesConnection = {
  __typename?: 'FilesConnection';
  /** A list of `File` objects. */
  nodes: Array<Maybe<File>>;
  /** A list of edges which contains the `File` and cursor to aid in pagination. */
  edges: Array<FilesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `File` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `File` edge in the connection. */
export type FilesEdge = {
  __typename?: 'FilesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `File` at the end of the edge. */
  node?: Maybe<File>;
};

/** A `ApplicationResponse` edge in the connection. */
export type ApplicationResponsesEdge = {
  __typename?: 'ApplicationResponsesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationResponse` at the end of the edge. */
  node?: Maybe<ApplicationResponse>;
};

/** A `TemplateElement` edge in the connection. */
export type TemplateElementsEdge = {
  __typename?: 'TemplateElementsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateElement` at the end of the edge. */
  node?: Maybe<TemplateElement>;
};

/** Methods to use when ordering `ApplicationSection`. */
export enum ApplicationSectionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  TemplateSectionIdAsc = 'TEMPLATE_SECTION_ID_ASC',
  TemplateSectionIdDesc = 'TEMPLATE_SECTION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ApplicationSection` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationSectionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateSectionId` field. */
  templateSectionId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `ApplicationSection` values. */
export type ApplicationSectionsConnection = {
  __typename?: 'ApplicationSectionsConnection';
  /** A list of `ApplicationSection` objects. */
  nodes: Array<Maybe<ApplicationSection>>;
  /** A list of edges which contains the `ApplicationSection` and cursor to aid in pagination. */
  edges: Array<ApplicationSectionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationSection` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationSection = Node & {
  __typename?: 'ApplicationSection';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  applicationId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  /** Reads a single `Application` that is related to this `ApplicationSection`. */
  application?: Maybe<Application>;
  /** Reads a single `TemplateSection` that is related to this `ApplicationSection`. */
  templateSection?: Maybe<TemplateSection>;
};

/** A `ApplicationSection` edge in the connection. */
export type ApplicationSectionsEdge = {
  __typename?: 'ApplicationSectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationSection` at the end of the edge. */
  node?: Maybe<ApplicationSection>;
};

/** A `TemplatePermission` edge in the connection. */
export type TemplatePermissionsEdge = {
  __typename?: 'TemplatePermissionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplatePermission` at the end of the edge. */
  node?: Maybe<TemplatePermission>;
};

/** A `PermissionJoin` edge in the connection. */
export type PermissionJoinsEdge = {
  __typename?: 'PermissionJoinsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PermissionJoin` at the end of the edge. */
  node?: Maybe<PermissionJoin>;
};

/** A `UserOrganisation` edge in the connection. */
export type UserOrganisationsEdge = {
  __typename?: 'UserOrganisationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `UserOrganisation` at the end of the edge. */
  node?: Maybe<UserOrganisation>;
};

/** Methods to use when ordering `ReviewAssignment`. */
export enum ReviewAssignmentsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  AssignerIdAsc = 'ASSIGNER_ID_ASC',
  AssignerIdDesc = 'ASSIGNER_ID_DESC',
  ReviewerIdAsc = 'REVIEWER_ID_ASC',
  ReviewerIdDesc = 'REVIEWER_ID_DESC',
  StageIdAsc = 'STAGE_ID_ASC',
  StageIdDesc = 'STAGE_ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  TriggerAsc = 'TRIGGER_ASC',
  TriggerDesc = 'TRIGGER_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewAssignment` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewAssignmentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `assignerId` field. */
  assignerId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewerId` field. */
  reviewerId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `stageId` field. */
  stageId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `trigger` field. */
  trigger?: Maybe<Trigger>;
};

/** A connection to a list of `ReviewAssignment` values. */
export type ReviewAssignmentsConnection = {
  __typename?: 'ReviewAssignmentsConnection';
  /** A list of `ReviewAssignment` objects. */
  nodes: Array<Maybe<ReviewAssignment>>;
  /** A list of edges which contains the `ReviewAssignment` and cursor to aid in pagination. */
  edges: Array<ReviewAssignmentsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewAssignment` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ReviewAssignment` edge in the connection. */
export type ReviewAssignmentsEdge = {
  __typename?: 'ReviewAssignmentsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewAssignment` at the end of the edge. */
  node?: Maybe<ReviewAssignment>;
};

/** Methods to use when ordering `ApplicationStatusHistory`. */
export enum ApplicationStatusHistoriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ApplicationStageHistoryIdAsc = 'APPLICATION_STAGE_HISTORY_ID_ASC',
  ApplicationStageHistoryIdDesc = 'APPLICATION_STAGE_HISTORY_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TimeCreatedAsc = 'TIME_CREATED_ASC',
  TimeCreatedDesc = 'TIME_CREATED_DESC',
  IsCurrentAsc = 'IS_CURRENT_ASC',
  IsCurrentDesc = 'IS_CURRENT_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ApplicationStatusHistory` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationStatusHistoryCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationStageHistoryId` field. */
  applicationStageHistoryId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ApplicationStatus>;
  /** Checks for equality with the object’s `timeCreated` field. */
  timeCreated?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `isCurrent` field. */
  isCurrent?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `ApplicationStatusHistory` values. */
export type ApplicationStatusHistoriesConnection = {
  __typename?: 'ApplicationStatusHistoriesConnection';
  /** A list of `ApplicationStatusHistory` objects. */
  nodes: Array<Maybe<ApplicationStatusHistory>>;
  /** A list of edges which contains the `ApplicationStatusHistory` and cursor to aid in pagination. */
  edges: Array<ApplicationStatusHistoriesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationStatusHistory` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationStatusHistory = Node & {
  __typename?: 'ApplicationStatusHistory';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  applicationStageHistoryId?: Maybe<Scalars['Int']>;
  status?: Maybe<ApplicationStatus>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  applicationId?: Maybe<Scalars['Int']>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ApplicationStatusHistory`. */
  applicationStageHistory?: Maybe<ApplicationStageHistory>;
};

/** A `ApplicationStatusHistory` edge in the connection. */
export type ApplicationStatusHistoriesEdge = {
  __typename?: 'ApplicationStatusHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationStatusHistory` at the end of the edge. */
  node?: Maybe<ApplicationStatusHistory>;
};

/** A `ApplicationStageHistory` edge in the connection. */
export type ApplicationStageHistoriesEdge = {
  __typename?: 'ApplicationStageHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationStageHistory` at the end of the edge. */
  node?: Maybe<ApplicationStageHistory>;
};

/** A `TemplateStage` edge in the connection. */
export type TemplateStagesEdge = {
  __typename?: 'TemplateStagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateStage` at the end of the edge. */
  node?: Maybe<TemplateStage>;
};

/** Methods to use when ordering `TemplateSection`. */
export enum TemplateSectionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  IndexAsc = 'INDEX_ASC',
  IndexDesc = 'INDEX_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateSection` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateSectionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `index` field. */
  index?: Maybe<Scalars['Int']>;
};

/** A connection to a list of `TemplateSection` values. */
export type TemplateSectionsConnection = {
  __typename?: 'TemplateSectionsConnection';
  /** A list of `TemplateSection` objects. */
  nodes: Array<Maybe<TemplateSection>>;
  /** A list of edges which contains the `TemplateSection` and cursor to aid in pagination. */
  edges: Array<TemplateSectionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateSection` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TemplateSection` edge in the connection. */
export type TemplateSectionsEdge = {
  __typename?: 'TemplateSectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateSection` at the end of the edge. */
  node?: Maybe<TemplateSection>;
};

/** Methods to use when ordering `TemplateAction`. */
export enum TemplateActionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  ActionCodeAsc = 'ACTION_CODE_ASC',
  ActionCodeDesc = 'ACTION_CODE_DESC',
  TriggerAsc = 'TRIGGER_ASC',
  TriggerDesc = 'TRIGGER_DESC',
  SequenceAsc = 'SEQUENCE_ASC',
  SequenceDesc = 'SEQUENCE_DESC',
  ConditionAsc = 'CONDITION_ASC',
  ConditionDesc = 'CONDITION_DESC',
  ParameterQueriesAsc = 'PARAMETER_QUERIES_ASC',
  ParameterQueriesDesc = 'PARAMETER_QUERIES_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateAction` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateActionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `actionCode` field. */
  actionCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `trigger` field. */
  trigger?: Maybe<Trigger>;
  /** Checks for equality with the object’s `sequence` field. */
  sequence?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `condition` field. */
  condition?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `parameterQueries` field. */
  parameterQueries?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TemplateAction` values. */
export type TemplateActionsConnection = {
  __typename?: 'TemplateActionsConnection';
  /** A list of `TemplateAction` objects. */
  nodes: Array<Maybe<TemplateAction>>;
  /** A list of edges which contains the `TemplateAction` and cursor to aid in pagination. */
  edges: Array<TemplateActionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateAction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplateAction = Node & {
  __typename?: 'TemplateAction';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateId?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  trigger?: Maybe<Trigger>;
  sequence?: Maybe<Scalars['Int']>;
  condition?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  /** Reads a single `Template` that is related to this `TemplateAction`. */
  template?: Maybe<Template>;
};

/** A `TemplateAction` edge in the connection. */
export type TemplateActionsEdge = {
  __typename?: 'TemplateActionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateAction` at the end of the edge. */
  node?: Maybe<TemplateAction>;
};

/** A `ActionQueue` edge in the connection. */
export type ActionQueuesEdge = {
  __typename?: 'ActionQueuesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ActionQueue` at the end of the edge. */
  node?: Maybe<ActionQueue>;
};

/** Methods to use when ordering `AllPermission`. */
export enum AllPermissionsOrderBy {
  Natural = 'NATURAL',
  PermissionTypeAsc = 'PERMISSION_TYPE_ASC',
  PermissionTypeDesc = 'PERMISSION_TYPE_DESC',
  PermissionPolicyIdAsc = 'PERMISSION_POLICY_ID_ASC',
  PermissionPolicyIdDesc = 'PERMISSION_POLICY_ID_DESC',
  PermissionPolicyRulesAsc = 'PERMISSION_POLICY_RULES_ASC',
  PermissionPolicyRulesDesc = 'PERMISSION_POLICY_RULES_DESC',
  PermissionNameIdAsc = 'PERMISSION_NAME_ID_ASC',
  PermissionNameIdDesc = 'PERMISSION_NAME_ID_DESC',
  TemplatePermissionIdAsc = 'TEMPLATE_PERMISSION_ID_ASC',
  TemplatePermissionIdDesc = 'TEMPLATE_PERMISSION_ID_DESC',
  TemplatePermissionRestrictionsAsc = 'TEMPLATE_PERMISSION_RESTRICTIONS_ASC',
  TemplatePermissionRestrictionsDesc = 'TEMPLATE_PERMISSION_RESTRICTIONS_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  TemplateCodeAsc = 'TEMPLATE_CODE_ASC',
  TemplateCodeDesc = 'TEMPLATE_CODE_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC'
}

/** A condition to be used against `AllPermission` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type AllPermissionCondition = {
  /** Checks for equality with the object’s `permissionType` field. */
  permissionType?: Maybe<PermissionPolicyType>;
  /** Checks for equality with the object’s `permissionPolicyId` field. */
  permissionPolicyId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `permissionPolicyRules` field. */
  permissionPolicyRules?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `permissionNameId` field. */
  permissionNameId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templatePermissionId` field. */
  templatePermissionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templatePermissionRestrictions` field. */
  templatePermissionRestrictions?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateCode` field. */
  templateCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>;
};

/** A filter to be used against `AllPermission` object types. All fields are combined with a logical ‘and.’ */
export type AllPermissionFilter = {
  /** Filter by the object’s `permissionType` field. */
  permissionType?: Maybe<PermissionPolicyTypeFilter>;
  /** Filter by the object’s `permissionPolicyId` field. */
  permissionPolicyId?: Maybe<IntFilter>;
  /** Filter by the object’s `permissionPolicyRules` field. */
  permissionPolicyRules?: Maybe<JsonFilter>;
  /** Filter by the object’s `permissionNameId` field. */
  permissionNameId?: Maybe<IntFilter>;
  /** Filter by the object’s `templatePermissionId` field. */
  templatePermissionId?: Maybe<IntFilter>;
  /** Filter by the object’s `templatePermissionRestrictions` field. */
  templatePermissionRestrictions?: Maybe<JsonFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `templateCode` field. */
  templateCode?: Maybe<StringFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `username` field. */
  username?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<AllPermissionFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<AllPermissionFilter>>;
  /** Negates the expression. */
  not?: Maybe<AllPermissionFilter>;
};

/** A connection to a list of `AllPermission` values. */
export type AllPermissionsConnection = {
  __typename?: 'AllPermissionsConnection';
  /** A list of `AllPermission` objects. */
  nodes: Array<Maybe<AllPermission>>;
  /** A list of edges which contains the `AllPermission` and cursor to aid in pagination. */
  edges: Array<AllPermissionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `AllPermission` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type AllPermission = {
  __typename?: 'AllPermission';
  permissionType?: Maybe<PermissionPolicyType>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  permissionPolicyRules?: Maybe<Scalars['JSON']>;
  permissionNameId?: Maybe<Scalars['Int']>;
  templatePermissionId?: Maybe<Scalars['Int']>;
  templatePermissionRestrictions?: Maybe<Scalars['JSON']>;
  templateId?: Maybe<Scalars['Int']>;
  templateCode?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
};

/** A `AllPermission` edge in the connection. */
export type AllPermissionsEdge = {
  __typename?: 'AllPermissionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `AllPermission` at the end of the edge. */
  node?: Maybe<AllPermission>;
};

/** Methods to use when ordering `ApplicationList`. */
export enum ApplicationListsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SerialAsc = 'SERIAL_ASC',
  SerialDesc = 'SERIAL_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  TemplateCodeAsc = 'TEMPLATE_CODE_ASC',
  TemplateCodeDesc = 'TEMPLATE_CODE_DESC',
  TemplateNameAsc = 'TEMPLATE_NAME_ASC',
  TemplateNameDesc = 'TEMPLATE_NAME_DESC',
  ApplicantUsernameAsc = 'APPLICANT_USERNAME_ASC',
  ApplicantUsernameDesc = 'APPLICANT_USERNAME_DESC',
  ApplicantFirstNameAsc = 'APPLICANT_FIRST_NAME_ASC',
  ApplicantFirstNameDesc = 'APPLICANT_FIRST_NAME_DESC',
  ApplicantLastNameAsc = 'APPLICANT_LAST_NAME_ASC',
  ApplicantLastNameDesc = 'APPLICANT_LAST_NAME_DESC',
  ApplicantAsc = 'APPLICANT_ASC',
  ApplicantDesc = 'APPLICANT_DESC',
  OrgNameAsc = 'ORG_NAME_ASC',
  OrgNameDesc = 'ORG_NAME_DESC',
  StageAsc = 'STAGE_ASC',
  StageDesc = 'STAGE_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  OutcomeAsc = 'OUTCOME_ASC',
  OutcomeDesc = 'OUTCOME_DESC',
  LastActiveDateAsc = 'LAST_ACTIVE_DATE_ASC',
  LastActiveDateDesc = 'LAST_ACTIVE_DATE_DESC'
}

/** A condition to be used against `ApplicationList` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationListCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `serial` field. */
  serial?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `templateCode` field. */
  templateCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `templateName` field. */
  templateName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicantUsername` field. */
  applicantUsername?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicantFirstName` field. */
  applicantFirstName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicantLastName` field. */
  applicantLastName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicant` field. */
  applicant?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `orgName` field. */
  orgName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `stage` field. */
  stage?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ApplicationStatus>;
  /** Checks for equality with the object’s `outcome` field. */
  outcome?: Maybe<ApplicationOutcome>;
  /** Checks for equality with the object’s `lastActiveDate` field. */
  lastActiveDate?: Maybe<Scalars['Datetime']>;
};

/** A filter to be used against `ApplicationList` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationListFilter = {
  /** Filter by the object’s `id` field. */
  id?: Maybe<IntFilter>;
  /** Filter by the object’s `serial` field. */
  serial?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `templateCode` field. */
  templateCode?: Maybe<StringFilter>;
  /** Filter by the object’s `templateName` field. */
  templateName?: Maybe<StringFilter>;
  /** Filter by the object’s `applicantUsername` field. */
  applicantUsername?: Maybe<StringFilter>;
  /** Filter by the object’s `applicantFirstName` field. */
  applicantFirstName?: Maybe<StringFilter>;
  /** Filter by the object’s `applicantLastName` field. */
  applicantLastName?: Maybe<StringFilter>;
  /** Filter by the object’s `applicant` field. */
  applicant?: Maybe<StringFilter>;
  /** Filter by the object’s `orgName` field. */
  orgName?: Maybe<StringFilter>;
  /** Filter by the object’s `stage` field. */
  stage?: Maybe<StringFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ApplicationStatusFilter>;
  /** Filter by the object’s `outcome` field. */
  outcome?: Maybe<ApplicationOutcomeFilter>;
  /** Filter by the object’s `lastActiveDate` field. */
  lastActiveDate?: Maybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationListFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationListFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationListFilter>;
};

/** A connection to a list of `ApplicationList` values. */
export type ApplicationListsConnection = {
  __typename?: 'ApplicationListsConnection';
  /** A list of `ApplicationList` objects. */
  nodes: Array<Maybe<ApplicationList>>;
  /** A list of edges which contains the `ApplicationList` and cursor to aid in pagination. */
  edges: Array<ApplicationListsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationList` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationList = {
  __typename?: 'ApplicationList';
  id?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  templateCode?: Maybe<Scalars['String']>;
  templateName?: Maybe<Scalars['String']>;
  applicantUsername?: Maybe<Scalars['String']>;
  applicantFirstName?: Maybe<Scalars['String']>;
  applicantLastName?: Maybe<Scalars['String']>;
  applicant?: Maybe<Scalars['String']>;
  orgName?: Maybe<Scalars['String']>;
  stage?: Maybe<Scalars['String']>;
  status?: Maybe<ApplicationStatus>;
  outcome?: Maybe<ApplicationOutcome>;
  lastActiveDate?: Maybe<Scalars['Datetime']>;
};

/** A `ApplicationList` edge in the connection. */
export type ApplicationListsEdge = {
  __typename?: 'ApplicationListsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationList` at the end of the edge. */
  node?: Maybe<ApplicationList>;
};

/** Methods to use when ordering `ApplicationStageStatusAll`. */
export enum ApplicationStageStatusAllsOrderBy {
  Natural = 'NATURAL',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  SerialAsc = 'SERIAL_ASC',
  SerialDesc = 'SERIAL_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  StageIdAsc = 'STAGE_ID_ASC',
  StageIdDesc = 'STAGE_ID_DESC',
  StageNumberAsc = 'STAGE_NUMBER_ASC',
  StageNumberDesc = 'STAGE_NUMBER_DESC',
  StageAsc = 'STAGE_ASC',
  StageDesc = 'STAGE_DESC',
  StageHistoryIdAsc = 'STAGE_HISTORY_ID_ASC',
  StageHistoryIdDesc = 'STAGE_HISTORY_ID_DESC',
  StageHistoryTimeCreatedAsc = 'STAGE_HISTORY_TIME_CREATED_ASC',
  StageHistoryTimeCreatedDesc = 'STAGE_HISTORY_TIME_CREATED_DESC',
  StageIsCurrentAsc = 'STAGE_IS_CURRENT_ASC',
  StageIsCurrentDesc = 'STAGE_IS_CURRENT_DESC',
  StatusHistoryIdAsc = 'STATUS_HISTORY_ID_ASC',
  StatusHistoryIdDesc = 'STATUS_HISTORY_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  StatusHistoryTimeCreatedAsc = 'STATUS_HISTORY_TIME_CREATED_ASC',
  StatusHistoryTimeCreatedDesc = 'STATUS_HISTORY_TIME_CREATED_DESC',
  StatusIsCurrentAsc = 'STATUS_IS_CURRENT_ASC',
  StatusIsCurrentDesc = 'STATUS_IS_CURRENT_DESC'
}

/** A condition to be used against `ApplicationStageStatusAll` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationStageStatusAllCondition = {
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `serial` field. */
  serial?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `stageId` field. */
  stageId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `stageNumber` field. */
  stageNumber?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `stage` field. */
  stage?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `stageHistoryId` field. */
  stageHistoryId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `stageHistoryTimeCreated` field. */
  stageHistoryTimeCreated?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `stageIsCurrent` field. */
  stageIsCurrent?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `statusHistoryId` field. */
  statusHistoryId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ApplicationStatus>;
  /** Checks for equality with the object’s `statusHistoryTimeCreated` field. */
  statusHistoryTimeCreated?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `statusIsCurrent` field. */
  statusIsCurrent?: Maybe<Scalars['Boolean']>;
};

/** A filter to be used against `ApplicationStageStatusAll` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationStageStatusAllFilter = {
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `templateId` field. */
  templateId?: Maybe<IntFilter>;
  /** Filter by the object’s `serial` field. */
  serial?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `stageId` field. */
  stageId?: Maybe<IntFilter>;
  /** Filter by the object’s `stageNumber` field. */
  stageNumber?: Maybe<IntFilter>;
  /** Filter by the object’s `stage` field. */
  stage?: Maybe<StringFilter>;
  /** Filter by the object’s `stageHistoryId` field. */
  stageHistoryId?: Maybe<IntFilter>;
  /** Filter by the object’s `stageHistoryTimeCreated` field. */
  stageHistoryTimeCreated?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `stageIsCurrent` field. */
  stageIsCurrent?: Maybe<BooleanFilter>;
  /** Filter by the object’s `statusHistoryId` field. */
  statusHistoryId?: Maybe<IntFilter>;
  /** Filter by the object’s `status` field. */
  status?: Maybe<ApplicationStatusFilter>;
  /** Filter by the object’s `statusHistoryTimeCreated` field. */
  statusHistoryTimeCreated?: Maybe<DatetimeFilter>;
  /** Filter by the object’s `statusIsCurrent` field. */
  statusIsCurrent?: Maybe<BooleanFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationStageStatusAllFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationStageStatusAllFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationStageStatusAllFilter>;
};

/** A connection to a list of `ApplicationStageStatusAll` values. */
export type ApplicationStageStatusAllsConnection = {
  __typename?: 'ApplicationStageStatusAllsConnection';
  /** A list of `ApplicationStageStatusAll` objects. */
  nodes: Array<Maybe<ApplicationStageStatusAll>>;
  /** A list of edges which contains the `ApplicationStageStatusAll` and cursor to aid in pagination. */
  edges: Array<ApplicationStageStatusAllsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationStageStatusAll` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationStageStatusAll = {
  __typename?: 'ApplicationStageStatusAll';
  applicationId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  stageNumber?: Maybe<Scalars['Int']>;
  stage?: Maybe<Scalars['String']>;
  stageHistoryId?: Maybe<Scalars['Int']>;
  stageHistoryTimeCreated?: Maybe<Scalars['Datetime']>;
  stageIsCurrent?: Maybe<Scalars['Boolean']>;
  statusHistoryId?: Maybe<Scalars['Int']>;
  status?: Maybe<ApplicationStatus>;
  statusHistoryTimeCreated?: Maybe<Scalars['Datetime']>;
  statusIsCurrent?: Maybe<Scalars['Boolean']>;
};

/** A `ApplicationStageStatusAll` edge in the connection. */
export type ApplicationStageStatusAllsEdge = {
  __typename?: 'ApplicationStageStatusAllsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationStageStatusAll` at the end of the edge. */
  node?: Maybe<ApplicationStageStatusAll>;
};

/** Methods to use when ordering `ApplicationTriggerState`. */
export enum ApplicationTriggerStatesOrderBy {
  Natural = 'NATURAL',
  SerialAsc = 'SERIAL_ASC',
  SerialDesc = 'SERIAL_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  ApplicationTriggerAsc = 'APPLICATION_TRIGGER_ASC',
  ApplicationTriggerDesc = 'APPLICATION_TRIGGER_DESC',
  ReviewAssignmentIdAsc = 'REVIEW_ASSIGNMENT_ID_ASC',
  ReviewAssignmentIdDesc = 'REVIEW_ASSIGNMENT_ID_DESC',
  ReviewAssignmentTriggerAsc = 'REVIEW_ASSIGNMENT_TRIGGER_ASC',
  ReviewAssignmentTriggerDesc = 'REVIEW_ASSIGNMENT_TRIGGER_DESC',
  ReviewIdAsc = 'REVIEW_ID_ASC',
  ReviewIdDesc = 'REVIEW_ID_DESC',
  ReviewTriggerAsc = 'REVIEW_TRIGGER_ASC',
  ReviewTriggerDesc = 'REVIEW_TRIGGER_DESC'
}

/** A condition to be used against `ApplicationTriggerState` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationTriggerStateCondition = {
  /** Checks for equality with the object’s `serial` field. */
  serial?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationTrigger` field. */
  applicationTrigger?: Maybe<Trigger>;
  /** Checks for equality with the object’s `reviewAssignmentId` field. */
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewAssignmentTrigger` field. */
  reviewAssignmentTrigger?: Maybe<Trigger>;
  /** Checks for equality with the object’s `reviewId` field. */
  reviewId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `reviewTrigger` field. */
  reviewTrigger?: Maybe<Trigger>;
};

/** A filter to be used against `ApplicationTriggerState` object types. All fields are combined with a logical ‘and.’ */
export type ApplicationTriggerStateFilter = {
  /** Filter by the object’s `serial` field. */
  serial?: Maybe<StringFilter>;
  /** Filter by the object’s `applicationId` field. */
  applicationId?: Maybe<IntFilter>;
  /** Filter by the object’s `applicationTrigger` field. */
  applicationTrigger?: Maybe<TriggerFilter>;
  /** Filter by the object’s `reviewAssignmentId` field. */
  reviewAssignmentId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewAssignmentTrigger` field. */
  reviewAssignmentTrigger?: Maybe<TriggerFilter>;
  /** Filter by the object’s `reviewId` field. */
  reviewId?: Maybe<IntFilter>;
  /** Filter by the object’s `reviewTrigger` field. */
  reviewTrigger?: Maybe<TriggerFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ApplicationTriggerStateFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ApplicationTriggerStateFilter>>;
  /** Negates the expression. */
  not?: Maybe<ApplicationTriggerStateFilter>;
};

/** A connection to a list of `ApplicationTriggerState` values. */
export type ApplicationTriggerStatesConnection = {
  __typename?: 'ApplicationTriggerStatesConnection';
  /** A list of `ApplicationTriggerState` objects. */
  nodes: Array<Maybe<ApplicationTriggerState>>;
  /** A list of edges which contains the `ApplicationTriggerState` and cursor to aid in pagination. */
  edges: Array<ApplicationTriggerStatesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ApplicationTriggerState` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ApplicationTriggerState = {
  __typename?: 'ApplicationTriggerState';
  serial?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationTrigger?: Maybe<Trigger>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  reviewAssignmentTrigger?: Maybe<Trigger>;
  reviewId?: Maybe<Scalars['Int']>;
  reviewTrigger?: Maybe<Trigger>;
};

/** A `ApplicationTriggerState` edge in the connection. */
export type ApplicationTriggerStatesEdge = {
  __typename?: 'ApplicationTriggerStatesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationTriggerState` at the end of the edge. */
  node?: Maybe<ApplicationTriggerState>;
};

/** Methods to use when ordering `ElementTypePlugin`. */
export enum ElementTypePluginsOrderBy {
  Natural = 'NATURAL',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  CategoryAsc = 'CATEGORY_ASC',
  CategoryDesc = 'CATEGORY_DESC',
  PathAsc = 'PATH_ASC',
  PathDesc = 'PATH_DESC',
  DisplayComponentNameAsc = 'DISPLAY_COMPONENT_NAME_ASC',
  DisplayComponentNameDesc = 'DISPLAY_COMPONENT_NAME_DESC',
  ConfigComponentNameAsc = 'CONFIG_COMPONENT_NAME_ASC',
  ConfigComponentNameDesc = 'CONFIG_COMPONENT_NAME_DESC',
  RequiredParametersAsc = 'REQUIRED_PARAMETERS_ASC',
  RequiredParametersDesc = 'REQUIRED_PARAMETERS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ElementTypePlugin` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ElementTypePluginCondition = {
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `category` field. */
  category?: Maybe<TemplateElementCategory>;
  /** Checks for equality with the object’s `path` field. */
  path?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `displayComponentName` field. */
  displayComponentName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `configComponentName` field. */
  configComponentName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `requiredParameters` field. */
  requiredParameters?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** A filter to be used against `ElementTypePlugin` object types. All fields are combined with a logical ‘and.’ */
export type ElementTypePluginFilter = {
  /** Filter by the object’s `code` field. */
  code?: Maybe<StringFilter>;
  /** Filter by the object’s `name` field. */
  name?: Maybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: Maybe<StringFilter>;
  /** Filter by the object’s `category` field. */
  category?: Maybe<TemplateElementCategoryFilter>;
  /** Filter by the object’s `path` field. */
  path?: Maybe<StringFilter>;
  /** Filter by the object’s `displayComponentName` field. */
  displayComponentName?: Maybe<StringFilter>;
  /** Filter by the object’s `configComponentName` field. */
  configComponentName?: Maybe<StringFilter>;
  /** Filter by the object’s `requiredParameters` field. */
  requiredParameters?: Maybe<StringListFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<ElementTypePluginFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<ElementTypePluginFilter>>;
  /** Negates the expression. */
  not?: Maybe<ElementTypePluginFilter>;
};

/** A connection to a list of `ElementTypePlugin` values. */
export type ElementTypePluginsConnection = {
  __typename?: 'ElementTypePluginsConnection';
  /** A list of `ElementTypePlugin` objects. */
  nodes: Array<Maybe<ElementTypePlugin>>;
  /** A list of edges which contains the `ElementTypePlugin` and cursor to aid in pagination. */
  edges: Array<ElementTypePluginsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ElementTypePlugin` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ElementTypePlugin = Node & {
  __typename?: 'ElementTypePlugin';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  code: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  path?: Maybe<Scalars['String']>;
  displayComponentName?: Maybe<Scalars['String']>;
  configComponentName?: Maybe<Scalars['String']>;
  requiredParameters?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** A `ElementTypePlugin` edge in the connection. */
export type ElementTypePluginsEdge = {
  __typename?: 'ElementTypePluginsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ElementTypePlugin` at the end of the edge. */
  node?: Maybe<ElementTypePlugin>;
};

/** Methods to use when ordering `Organisation`. */
export enum OrganisationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  LicenceNumberAsc = 'LICENCE_NUMBER_ASC',
  LicenceNumberDesc = 'LICENCE_NUMBER_DESC',
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Organisation` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type OrganisationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `licenceNumber` field. */
  licenceNumber?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address` field. */
  address?: Maybe<Scalars['String']>;
};

/** A connection to a list of `Organisation` values. */
export type OrganisationsConnection = {
  __typename?: 'OrganisationsConnection';
  /** A list of `Organisation` objects. */
  nodes: Array<Maybe<Organisation>>;
  /** A list of edges which contains the `Organisation` and cursor to aid in pagination. */
  edges: Array<OrganisationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Organisation` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Organisation` edge in the connection. */
export type OrganisationsEdge = {
  __typename?: 'OrganisationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Organisation` at the end of the edge. */
  node?: Maybe<Organisation>;
};

/** Methods to use when ordering `PermissionPolicy`. */
export enum PermissionPoliciesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  RulesAsc = 'RULES_ASC',
  RulesDesc = 'RULES_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  DefaultRestrictionsAsc = 'DEFAULT_RESTRICTIONS_ASC',
  DefaultRestrictionsDesc = 'DEFAULT_RESTRICTIONS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `PermissionPolicy` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PermissionPolicyCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `rules` field. */
  rules?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `type` field. */
  type?: Maybe<PermissionPolicyType>;
  /** Checks for equality with the object’s `defaultRestrictions` field. */
  defaultRestrictions?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `PermissionPolicy` values. */
export type PermissionPoliciesConnection = {
  __typename?: 'PermissionPoliciesConnection';
  /** A list of `PermissionPolicy` objects. */
  nodes: Array<Maybe<PermissionPolicy>>;
  /** A list of edges which contains the `PermissionPolicy` and cursor to aid in pagination. */
  edges: Array<PermissionPoliciesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PermissionPolicy` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PermissionPolicy` edge in the connection. */
export type PermissionPoliciesEdge = {
  __typename?: 'PermissionPoliciesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PermissionPolicy` at the end of the edge. */
  node?: Maybe<PermissionPolicy>;
};

/** Methods to use when ordering `Template`. */
export enum TemplatesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  IsLinearAsc = 'IS_LINEAR_ASC',
  IsLinearDesc = 'IS_LINEAR_DESC',
  StartMessageAsc = 'START_MESSAGE_ASC',
  StartMessageDesc = 'START_MESSAGE_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  SubmissionMessageAsc = 'SUBMISSION_MESSAGE_ASC',
  SubmissionMessageDesc = 'SUBMISSION_MESSAGE_DESC',
  VersionTimestampAsc = 'VERSION_TIMESTAMP_ASC',
  VersionTimestampDesc = 'VERSION_TIMESTAMP_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Template` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `isLinear` field. */
  isLinear?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `startMessage` field. */
  startMessage?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<TemplateStatus>;
  /** Checks for equality with the object’s `submissionMessage` field. */
  submissionMessage?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `versionTimestamp` field. */
  versionTimestamp?: Maybe<Scalars['Datetime']>;
};

/** A connection to a list of `Template` values. */
export type TemplatesConnection = {
  __typename?: 'TemplatesConnection';
  /** A list of `Template` objects. */
  nodes: Array<Maybe<Template>>;
  /** A list of edges which contains the `Template` and cursor to aid in pagination. */
  edges: Array<TemplatesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Template` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `Template` edge in the connection. */
export type TemplatesEdge = {
  __typename?: 'TemplatesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Template` at the end of the edge. */
  node?: Maybe<Template>;
};

/** Methods to use when ordering `TriggerQueue`. */
export enum TriggerQueuesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TriggerTypeAsc = 'TRIGGER_TYPE_ASC',
  TriggerTypeDesc = 'TRIGGER_TYPE_DESC',
  TableAsc = 'TABLE_ASC',
  TableDesc = 'TABLE_DESC',
  RecordIdAsc = 'RECORD_ID_ASC',
  RecordIdDesc = 'RECORD_ID_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  LogAsc = 'LOG_ASC',
  LogDesc = 'LOG_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TriggerQueue` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TriggerQueueCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `triggerType` field. */
  triggerType?: Maybe<Trigger>;
  /** Checks for equality with the object’s `table` field. */
  table?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `recordId` field. */
  recordId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<TriggerQueueStatus>;
  /** Checks for equality with the object’s `log` field. */
  log?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TriggerQueue` values. */
export type TriggerQueuesConnection = {
  __typename?: 'TriggerQueuesConnection';
  /** A list of `TriggerQueue` objects. */
  nodes: Array<Maybe<TriggerQueue>>;
  /** A list of edges which contains the `TriggerQueue` and cursor to aid in pagination. */
  edges: Array<TriggerQueuesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TriggerQueue` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TriggerQueue` edge in the connection. */
export type TriggerQueuesEdge = {
  __typename?: 'TriggerQueuesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TriggerQueue` at the end of the edge. */
  node?: Maybe<TriggerQueue>;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  FirstNameAsc = 'FIRST_NAME_ASC',
  FirstNameDesc = 'FIRST_NAME_DESC',
  LastNameAsc = 'LAST_NAME_ASC',
  LastNameDesc = 'LAST_NAME_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  DateOfBirthAsc = 'DATE_OF_BIRTH_ASC',
  DateOfBirthDesc = 'DATE_OF_BIRTH_DESC',
  PasswordHashAsc = 'PASSWORD_HASH_ASC',
  PasswordHashDesc = 'PASSWORD_HASH_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `firstName` field. */
  firstName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `lastName` field. */
  lastName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `dateOfBirth` field. */
  dateOfBirth?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `passwordHash` field. */
  passwordHash?: Maybe<Scalars['String']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of `User` objects. */
  nodes: Array<Maybe<User>>;
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `User` at the end of the edge. */
  node?: Maybe<User>;
};

/** Methods to use when ordering `UserOrgJoin`. */
export enum UserOrgJoinsOrderBy {
  Natural = 'NATURAL',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  FirstNameAsc = 'FIRST_NAME_ASC',
  FirstNameDesc = 'FIRST_NAME_DESC',
  LastNameAsc = 'LAST_NAME_ASC',
  LastNameDesc = 'LAST_NAME_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  DateOfBirthAsc = 'DATE_OF_BIRTH_ASC',
  DateOfBirthDesc = 'DATE_OF_BIRTH_DESC',
  PasswordHashAsc = 'PASSWORD_HASH_ASC',
  PasswordHashDesc = 'PASSWORD_HASH_DESC',
  OrgIdAsc = 'ORG_ID_ASC',
  OrgIdDesc = 'ORG_ID_DESC',
  OrgNameAsc = 'ORG_NAME_ASC',
  OrgNameDesc = 'ORG_NAME_DESC',
  UserRoleAsc = 'USER_ROLE_ASC',
  UserRoleDesc = 'USER_ROLE_DESC',
  LicenceNumberAsc = 'LICENCE_NUMBER_ASC',
  LicenceNumberDesc = 'LICENCE_NUMBER_DESC',
  AddressAsc = 'ADDRESS_ASC',
  AddressDesc = 'ADDRESS_DESC'
}

/** A condition to be used against `UserOrgJoin` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserOrgJoinCondition = {
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `firstName` field. */
  firstName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `lastName` field. */
  lastName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `dateOfBirth` field. */
  dateOfBirth?: Maybe<Scalars['Date']>;
  /** Checks for equality with the object’s `passwordHash` field. */
  passwordHash?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `orgId` field. */
  orgId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `orgName` field. */
  orgName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `userRole` field. */
  userRole?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `licenceNumber` field. */
  licenceNumber?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `address` field. */
  address?: Maybe<Scalars['String']>;
};

/** A filter to be used against `UserOrgJoin` object types. All fields are combined with a logical ‘and.’ */
export type UserOrgJoinFilter = {
  /** Filter by the object’s `userId` field. */
  userId?: Maybe<IntFilter>;
  /** Filter by the object’s `username` field. */
  username?: Maybe<StringFilter>;
  /** Filter by the object’s `firstName` field. */
  firstName?: Maybe<StringFilter>;
  /** Filter by the object’s `lastName` field. */
  lastName?: Maybe<StringFilter>;
  /** Filter by the object’s `email` field. */
  email?: Maybe<StringFilter>;
  /** Filter by the object’s `dateOfBirth` field. */
  dateOfBirth?: Maybe<DateFilter>;
  /** Filter by the object’s `passwordHash` field. */
  passwordHash?: Maybe<StringFilter>;
  /** Filter by the object’s `orgId` field. */
  orgId?: Maybe<IntFilter>;
  /** Filter by the object’s `orgName` field. */
  orgName?: Maybe<StringFilter>;
  /** Filter by the object’s `userRole` field. */
  userRole?: Maybe<StringFilter>;
  /** Filter by the object’s `licenceNumber` field. */
  licenceNumber?: Maybe<StringFilter>;
  /** Filter by the object’s `address` field. */
  address?: Maybe<StringFilter>;
  /** Checks for all expressions in this list. */
  and?: Maybe<Array<UserOrgJoinFilter>>;
  /** Checks for any expressions in this list. */
  or?: Maybe<Array<UserOrgJoinFilter>>;
  /** Negates the expression. */
  not?: Maybe<UserOrgJoinFilter>;
};

/** A connection to a list of `UserOrgJoin` values. */
export type UserOrgJoinsConnection = {
  __typename?: 'UserOrgJoinsConnection';
  /** A list of `UserOrgJoin` objects. */
  nodes: Array<Maybe<UserOrgJoin>>;
  /** A list of edges which contains the `UserOrgJoin` and cursor to aid in pagination. */
  edges: Array<UserOrgJoinsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `UserOrgJoin` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type UserOrgJoin = {
  __typename?: 'UserOrgJoin';
  userId?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  orgId?: Maybe<Scalars['Int']>;
  orgName?: Maybe<Scalars['String']>;
  userRole?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

/** A `UserOrgJoin` edge in the connection. */
export type UserOrgJoinsEdge = {
  __typename?: 'UserOrgJoinsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `UserOrgJoin` at the end of the edge. */
  node?: Maybe<UserOrgJoin>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `ActionPlugin`. */
  createActionPlugin?: Maybe<CreateActionPluginPayload>;
  /** Creates a single `ActionQueue`. */
  createActionQueue?: Maybe<CreateActionQueuePayload>;
  /** Creates a single `Application`. */
  createApplication?: Maybe<CreateApplicationPayload>;
  /** Creates a single `ApplicationResponse`. */
  createApplicationResponse?: Maybe<CreateApplicationResponsePayload>;
  /** Creates a single `ApplicationSection`. */
  createApplicationSection?: Maybe<CreateApplicationSectionPayload>;
  /** Creates a single `ApplicationStageHistory`. */
  createApplicationStageHistory?: Maybe<CreateApplicationStageHistoryPayload>;
  /** Creates a single `ApplicationStatusHistory`. */
  createApplicationStatusHistory?: Maybe<CreateApplicationStatusHistoryPayload>;
  /** Creates a single `ElementTypePlugin`. */
  createElementTypePlugin?: Maybe<CreateElementTypePluginPayload>;
  /** Creates a single `File`. */
  createFile?: Maybe<CreateFilePayload>;
  /** Creates a single `Notification`. */
  createNotification?: Maybe<CreateNotificationPayload>;
  /** Creates a single `Organisation`. */
  createOrganisation?: Maybe<CreateOrganisationPayload>;
  /** Creates a single `PermissionJoin`. */
  createPermissionJoin?: Maybe<CreatePermissionJoinPayload>;
  /** Creates a single `PermissionName`. */
  createPermissionName?: Maybe<CreatePermissionNamePayload>;
  /** Creates a single `PermissionPolicy`. */
  createPermissionPolicy?: Maybe<CreatePermissionPolicyPayload>;
  /** Creates a single `Review`. */
  createReview?: Maybe<CreateReviewPayload>;
  /** Creates a single `ReviewAssignment`. */
  createReviewAssignment?: Maybe<CreateReviewAssignmentPayload>;
  /** Creates a single `ReviewQuestionAssignment`. */
  createReviewQuestionAssignment?: Maybe<CreateReviewQuestionAssignmentPayload>;
  /** Creates a single `ReviewResponse`. */
  createReviewResponse?: Maybe<CreateReviewResponsePayload>;
  /** Creates a single `ReviewStatusHistory`. */
  createReviewStatusHistory?: Maybe<CreateReviewStatusHistoryPayload>;
  /** Creates a single `Template`. */
  createTemplate?: Maybe<CreateTemplatePayload>;
  /** Creates a single `TemplateAction`. */
  createTemplateAction?: Maybe<CreateTemplateActionPayload>;
  /** Creates a single `TemplateElement`. */
  createTemplateElement?: Maybe<CreateTemplateElementPayload>;
  /** Creates a single `TemplatePermission`. */
  createTemplatePermission?: Maybe<CreateTemplatePermissionPayload>;
  /** Creates a single `TemplateSection`. */
  createTemplateSection?: Maybe<CreateTemplateSectionPayload>;
  /** Creates a single `TemplateStage`. */
  createTemplateStage?: Maybe<CreateTemplateStagePayload>;
  /** Creates a single `TriggerQueue`. */
  createTriggerQueue?: Maybe<CreateTriggerQueuePayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `UserOrganisation`. */
  createUserOrganisation?: Maybe<CreateUserOrganisationPayload>;
  /** Updates a single `ActionPlugin` using its globally unique id and a patch. */
  updateActionPluginByNodeId?: Maybe<UpdateActionPluginPayload>;
  /** Updates a single `ActionPlugin` using a unique key and a patch. */
  updateActionPlugin?: Maybe<UpdateActionPluginPayload>;
  /** Updates a single `ActionQueue` using its globally unique id and a patch. */
  updateActionQueueByNodeId?: Maybe<UpdateActionQueuePayload>;
  /** Updates a single `ActionQueue` using a unique key and a patch. */
  updateActionQueue?: Maybe<UpdateActionQueuePayload>;
  /** Updates a single `Application` using its globally unique id and a patch. */
  updateApplicationByNodeId?: Maybe<UpdateApplicationPayload>;
  /** Updates a single `Application` using a unique key and a patch. */
  updateApplication?: Maybe<UpdateApplicationPayload>;
  /** Updates a single `Application` using a unique key and a patch. */
  updateApplicationBySerial?: Maybe<UpdateApplicationPayload>;
  /** Updates a single `ApplicationResponse` using its globally unique id and a patch. */
  updateApplicationResponseByNodeId?: Maybe<UpdateApplicationResponsePayload>;
  /** Updates a single `ApplicationResponse` using a unique key and a patch. */
  updateApplicationResponse?: Maybe<UpdateApplicationResponsePayload>;
  /** Updates a single `ApplicationSection` using its globally unique id and a patch. */
  updateApplicationSectionByNodeId?: Maybe<UpdateApplicationSectionPayload>;
  /** Updates a single `ApplicationSection` using a unique key and a patch. */
  updateApplicationSection?: Maybe<UpdateApplicationSectionPayload>;
  /** Updates a single `ApplicationStageHistory` using its globally unique id and a patch. */
  updateApplicationStageHistoryByNodeId?: Maybe<UpdateApplicationStageHistoryPayload>;
  /** Updates a single `ApplicationStageHistory` using a unique key and a patch. */
  updateApplicationStageHistory?: Maybe<UpdateApplicationStageHistoryPayload>;
  /** Updates a single `ApplicationStatusHistory` using its globally unique id and a patch. */
  updateApplicationStatusHistoryByNodeId?: Maybe<UpdateApplicationStatusHistoryPayload>;
  /** Updates a single `ApplicationStatusHistory` using a unique key and a patch. */
  updateApplicationStatusHistory?: Maybe<UpdateApplicationStatusHistoryPayload>;
  /** Updates a single `ElementTypePlugin` using its globally unique id and a patch. */
  updateElementTypePluginByNodeId?: Maybe<UpdateElementTypePluginPayload>;
  /** Updates a single `ElementTypePlugin` using a unique key and a patch. */
  updateElementTypePlugin?: Maybe<UpdateElementTypePluginPayload>;
  /** Updates a single `File` using its globally unique id and a patch. */
  updateFileByNodeId?: Maybe<UpdateFilePayload>;
  /** Updates a single `File` using a unique key and a patch. */
  updateFile?: Maybe<UpdateFilePayload>;
  /** Updates a single `Notification` using its globally unique id and a patch. */
  updateNotificationByNodeId?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Notification` using a unique key and a patch. */
  updateNotification?: Maybe<UpdateNotificationPayload>;
  /** Updates a single `Organisation` using its globally unique id and a patch. */
  updateOrganisationByNodeId?: Maybe<UpdateOrganisationPayload>;
  /** Updates a single `Organisation` using a unique key and a patch. */
  updateOrganisation?: Maybe<UpdateOrganisationPayload>;
  /** Updates a single `PermissionJoin` using its globally unique id and a patch. */
  updatePermissionJoinByNodeId?: Maybe<UpdatePermissionJoinPayload>;
  /** Updates a single `PermissionJoin` using a unique key and a patch. */
  updatePermissionJoin?: Maybe<UpdatePermissionJoinPayload>;
  /** Updates a single `PermissionName` using its globally unique id and a patch. */
  updatePermissionNameByNodeId?: Maybe<UpdatePermissionNamePayload>;
  /** Updates a single `PermissionName` using a unique key and a patch. */
  updatePermissionName?: Maybe<UpdatePermissionNamePayload>;
  /** Updates a single `PermissionPolicy` using its globally unique id and a patch. */
  updatePermissionPolicyByNodeId?: Maybe<UpdatePermissionPolicyPayload>;
  /** Updates a single `PermissionPolicy` using a unique key and a patch. */
  updatePermissionPolicy?: Maybe<UpdatePermissionPolicyPayload>;
  /** Updates a single `Review` using its globally unique id and a patch. */
  updateReviewByNodeId?: Maybe<UpdateReviewPayload>;
  /** Updates a single `Review` using a unique key and a patch. */
  updateReview?: Maybe<UpdateReviewPayload>;
  /** Updates a single `ReviewAssignment` using its globally unique id and a patch. */
  updateReviewAssignmentByNodeId?: Maybe<UpdateReviewAssignmentPayload>;
  /** Updates a single `ReviewAssignment` using a unique key and a patch. */
  updateReviewAssignment?: Maybe<UpdateReviewAssignmentPayload>;
  /** Updates a single `ReviewQuestionAssignment` using its globally unique id and a patch. */
  updateReviewQuestionAssignmentByNodeId?: Maybe<UpdateReviewQuestionAssignmentPayload>;
  /** Updates a single `ReviewQuestionAssignment` using a unique key and a patch. */
  updateReviewQuestionAssignment?: Maybe<UpdateReviewQuestionAssignmentPayload>;
  /** Updates a single `ReviewResponse` using its globally unique id and a patch. */
  updateReviewResponseByNodeId?: Maybe<UpdateReviewResponsePayload>;
  /** Updates a single `ReviewResponse` using a unique key and a patch. */
  updateReviewResponse?: Maybe<UpdateReviewResponsePayload>;
  /** Updates a single `ReviewStatusHistory` using its globally unique id and a patch. */
  updateReviewStatusHistoryByNodeId?: Maybe<UpdateReviewStatusHistoryPayload>;
  /** Updates a single `ReviewStatusHistory` using a unique key and a patch. */
  updateReviewStatusHistory?: Maybe<UpdateReviewStatusHistoryPayload>;
  /** Updates a single `Template` using its globally unique id and a patch. */
  updateTemplateByNodeId?: Maybe<UpdateTemplatePayload>;
  /** Updates a single `Template` using a unique key and a patch. */
  updateTemplate?: Maybe<UpdateTemplatePayload>;
  /** Updates a single `TemplateAction` using its globally unique id and a patch. */
  updateTemplateActionByNodeId?: Maybe<UpdateTemplateActionPayload>;
  /** Updates a single `TemplateAction` using a unique key and a patch. */
  updateTemplateAction?: Maybe<UpdateTemplateActionPayload>;
  /** Updates a single `TemplateElement` using its globally unique id and a patch. */
  updateTemplateElementByNodeId?: Maybe<UpdateTemplateElementPayload>;
  /** Updates a single `TemplateElement` using a unique key and a patch. */
  updateTemplateElement?: Maybe<UpdateTemplateElementPayload>;
  /** Updates a single `TemplatePermission` using its globally unique id and a patch. */
  updateTemplatePermissionByNodeId?: Maybe<UpdateTemplatePermissionPayload>;
  /** Updates a single `TemplatePermission` using a unique key and a patch. */
  updateTemplatePermission?: Maybe<UpdateTemplatePermissionPayload>;
  /** Updates a single `TemplateSection` using its globally unique id and a patch. */
  updateTemplateSectionByNodeId?: Maybe<UpdateTemplateSectionPayload>;
  /** Updates a single `TemplateSection` using a unique key and a patch. */
  updateTemplateSection?: Maybe<UpdateTemplateSectionPayload>;
  /** Updates a single `TemplateStage` using its globally unique id and a patch. */
  updateTemplateStageByNodeId?: Maybe<UpdateTemplateStagePayload>;
  /** Updates a single `TemplateStage` using a unique key and a patch. */
  updateTemplateStage?: Maybe<UpdateTemplateStagePayload>;
  /** Updates a single `TriggerQueue` using its globally unique id and a patch. */
  updateTriggerQueueByNodeId?: Maybe<UpdateTriggerQueuePayload>;
  /** Updates a single `TriggerQueue` using a unique key and a patch. */
  updateTriggerQueue?: Maybe<UpdateTriggerQueuePayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserByNodeId?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByUsername?: Maybe<UpdateUserPayload>;
  /** Updates a single `UserOrganisation` using its globally unique id and a patch. */
  updateUserOrganisationByNodeId?: Maybe<UpdateUserOrganisationPayload>;
  /** Updates a single `UserOrganisation` using a unique key and a patch. */
  updateUserOrganisation?: Maybe<UpdateUserOrganisationPayload>;
  /** Deletes a single `ActionPlugin` using its globally unique id. */
  deleteActionPluginByNodeId?: Maybe<DeleteActionPluginPayload>;
  /** Deletes a single `ActionPlugin` using a unique key. */
  deleteActionPlugin?: Maybe<DeleteActionPluginPayload>;
  /** Deletes a single `ActionQueue` using its globally unique id. */
  deleteActionQueueByNodeId?: Maybe<DeleteActionQueuePayload>;
  /** Deletes a single `ActionQueue` using a unique key. */
  deleteActionQueue?: Maybe<DeleteActionQueuePayload>;
  /** Deletes a single `Application` using its globally unique id. */
  deleteApplicationByNodeId?: Maybe<DeleteApplicationPayload>;
  /** Deletes a single `Application` using a unique key. */
  deleteApplication?: Maybe<DeleteApplicationPayload>;
  /** Deletes a single `Application` using a unique key. */
  deleteApplicationBySerial?: Maybe<DeleteApplicationPayload>;
  /** Deletes a single `ApplicationResponse` using its globally unique id. */
  deleteApplicationResponseByNodeId?: Maybe<DeleteApplicationResponsePayload>;
  /** Deletes a single `ApplicationResponse` using a unique key. */
  deleteApplicationResponse?: Maybe<DeleteApplicationResponsePayload>;
  /** Deletes a single `ApplicationSection` using its globally unique id. */
  deleteApplicationSectionByNodeId?: Maybe<DeleteApplicationSectionPayload>;
  /** Deletes a single `ApplicationSection` using a unique key. */
  deleteApplicationSection?: Maybe<DeleteApplicationSectionPayload>;
  /** Deletes a single `ApplicationStageHistory` using its globally unique id. */
  deleteApplicationStageHistoryByNodeId?: Maybe<DeleteApplicationStageHistoryPayload>;
  /** Deletes a single `ApplicationStageHistory` using a unique key. */
  deleteApplicationStageHistory?: Maybe<DeleteApplicationStageHistoryPayload>;
  /** Deletes a single `ApplicationStatusHistory` using its globally unique id. */
  deleteApplicationStatusHistoryByNodeId?: Maybe<DeleteApplicationStatusHistoryPayload>;
  /** Deletes a single `ApplicationStatusHistory` using a unique key. */
  deleteApplicationStatusHistory?: Maybe<DeleteApplicationStatusHistoryPayload>;
  /** Deletes a single `ElementTypePlugin` using its globally unique id. */
  deleteElementTypePluginByNodeId?: Maybe<DeleteElementTypePluginPayload>;
  /** Deletes a single `ElementTypePlugin` using a unique key. */
  deleteElementTypePlugin?: Maybe<DeleteElementTypePluginPayload>;
  /** Deletes a single `File` using its globally unique id. */
  deleteFileByNodeId?: Maybe<DeleteFilePayload>;
  /** Deletes a single `File` using a unique key. */
  deleteFile?: Maybe<DeleteFilePayload>;
  /** Deletes a single `Notification` using its globally unique id. */
  deleteNotificationByNodeId?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Notification` using a unique key. */
  deleteNotification?: Maybe<DeleteNotificationPayload>;
  /** Deletes a single `Organisation` using its globally unique id. */
  deleteOrganisationByNodeId?: Maybe<DeleteOrganisationPayload>;
  /** Deletes a single `Organisation` using a unique key. */
  deleteOrganisation?: Maybe<DeleteOrganisationPayload>;
  /** Deletes a single `PermissionJoin` using its globally unique id. */
  deletePermissionJoinByNodeId?: Maybe<DeletePermissionJoinPayload>;
  /** Deletes a single `PermissionJoin` using a unique key. */
  deletePermissionJoin?: Maybe<DeletePermissionJoinPayload>;
  /** Deletes a single `PermissionName` using its globally unique id. */
  deletePermissionNameByNodeId?: Maybe<DeletePermissionNamePayload>;
  /** Deletes a single `PermissionName` using a unique key. */
  deletePermissionName?: Maybe<DeletePermissionNamePayload>;
  /** Deletes a single `PermissionPolicy` using its globally unique id. */
  deletePermissionPolicyByNodeId?: Maybe<DeletePermissionPolicyPayload>;
  /** Deletes a single `PermissionPolicy` using a unique key. */
  deletePermissionPolicy?: Maybe<DeletePermissionPolicyPayload>;
  /** Deletes a single `Review` using its globally unique id. */
  deleteReviewByNodeId?: Maybe<DeleteReviewPayload>;
  /** Deletes a single `Review` using a unique key. */
  deleteReview?: Maybe<DeleteReviewPayload>;
  /** Deletes a single `ReviewAssignment` using its globally unique id. */
  deleteReviewAssignmentByNodeId?: Maybe<DeleteReviewAssignmentPayload>;
  /** Deletes a single `ReviewAssignment` using a unique key. */
  deleteReviewAssignment?: Maybe<DeleteReviewAssignmentPayload>;
  /** Deletes a single `ReviewQuestionAssignment` using its globally unique id. */
  deleteReviewQuestionAssignmentByNodeId?: Maybe<DeleteReviewQuestionAssignmentPayload>;
  /** Deletes a single `ReviewQuestionAssignment` using a unique key. */
  deleteReviewQuestionAssignment?: Maybe<DeleteReviewQuestionAssignmentPayload>;
  /** Deletes a single `ReviewResponse` using its globally unique id. */
  deleteReviewResponseByNodeId?: Maybe<DeleteReviewResponsePayload>;
  /** Deletes a single `ReviewResponse` using a unique key. */
  deleteReviewResponse?: Maybe<DeleteReviewResponsePayload>;
  /** Deletes a single `ReviewStatusHistory` using its globally unique id. */
  deleteReviewStatusHistoryByNodeId?: Maybe<DeleteReviewStatusHistoryPayload>;
  /** Deletes a single `ReviewStatusHistory` using a unique key. */
  deleteReviewStatusHistory?: Maybe<DeleteReviewStatusHistoryPayload>;
  /** Deletes a single `Template` using its globally unique id. */
  deleteTemplateByNodeId?: Maybe<DeleteTemplatePayload>;
  /** Deletes a single `Template` using a unique key. */
  deleteTemplate?: Maybe<DeleteTemplatePayload>;
  /** Deletes a single `TemplateAction` using its globally unique id. */
  deleteTemplateActionByNodeId?: Maybe<DeleteTemplateActionPayload>;
  /** Deletes a single `TemplateAction` using a unique key. */
  deleteTemplateAction?: Maybe<DeleteTemplateActionPayload>;
  /** Deletes a single `TemplateElement` using its globally unique id. */
  deleteTemplateElementByNodeId?: Maybe<DeleteTemplateElementPayload>;
  /** Deletes a single `TemplateElement` using a unique key. */
  deleteTemplateElement?: Maybe<DeleteTemplateElementPayload>;
  /** Deletes a single `TemplatePermission` using its globally unique id. */
  deleteTemplatePermissionByNodeId?: Maybe<DeleteTemplatePermissionPayload>;
  /** Deletes a single `TemplatePermission` using a unique key. */
  deleteTemplatePermission?: Maybe<DeleteTemplatePermissionPayload>;
  /** Deletes a single `TemplateSection` using its globally unique id. */
  deleteTemplateSectionByNodeId?: Maybe<DeleteTemplateSectionPayload>;
  /** Deletes a single `TemplateSection` using a unique key. */
  deleteTemplateSection?: Maybe<DeleteTemplateSectionPayload>;
  /** Deletes a single `TemplateStage` using its globally unique id. */
  deleteTemplateStageByNodeId?: Maybe<DeleteTemplateStagePayload>;
  /** Deletes a single `TemplateStage` using a unique key. */
  deleteTemplateStage?: Maybe<DeleteTemplateStagePayload>;
  /** Deletes a single `TriggerQueue` using its globally unique id. */
  deleteTriggerQueueByNodeId?: Maybe<DeleteTriggerQueuePayload>;
  /** Deletes a single `TriggerQueue` using a unique key. */
  deleteTriggerQueue?: Maybe<DeleteTriggerQueuePayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUserByNodeId?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByUsername?: Maybe<DeleteUserPayload>;
  /** Deletes a single `UserOrganisation` using its globally unique id. */
  deleteUserOrganisationByNodeId?: Maybe<DeleteUserOrganisationPayload>;
  /** Deletes a single `UserOrganisation` using a unique key. */
  deleteUserOrganisation?: Maybe<DeleteUserOrganisationPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateActionPluginArgs = {
  input: CreateActionPluginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateActionQueueArgs = {
  input: CreateActionQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateApplicationResponseArgs = {
  input: CreateApplicationResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateApplicationSectionArgs = {
  input: CreateApplicationSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateApplicationStageHistoryArgs = {
  input: CreateApplicationStageHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateApplicationStatusHistoryArgs = {
  input: CreateApplicationStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateElementTypePluginArgs = {
  input: CreateElementTypePluginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateFileArgs = {
  input: CreateFileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateOrganisationArgs = {
  input: CreateOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePermissionJoinArgs = {
  input: CreatePermissionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePermissionNameArgs = {
  input: CreatePermissionNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePermissionPolicyArgs = {
  input: CreatePermissionPolicyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewArgs = {
  input: CreateReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewAssignmentArgs = {
  input: CreateReviewAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewQuestionAssignmentArgs = {
  input: CreateReviewQuestionAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewResponseArgs = {
  input: CreateReviewResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewStatusHistoryArgs = {
  input: CreateReviewStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateArgs = {
  input: CreateTemplateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateActionArgs = {
  input: CreateTemplateActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateElementArgs = {
  input: CreateTemplateElementInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplatePermissionArgs = {
  input: CreateTemplatePermissionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateSectionArgs = {
  input: CreateTemplateSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateStageArgs = {
  input: CreateTemplateStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTriggerQueueArgs = {
  input: CreateTriggerQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserOrganisationArgs = {
  input: CreateUserOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionPluginByNodeIdArgs = {
  input: UpdateActionPluginByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionPluginArgs = {
  input: UpdateActionPluginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionQueueByNodeIdArgs = {
  input: UpdateActionQueueByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionQueueArgs = {
  input: UpdateActionQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationByNodeIdArgs = {
  input: UpdateApplicationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationBySerialArgs = {
  input: UpdateApplicationBySerialInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationResponseByNodeIdArgs = {
  input: UpdateApplicationResponseByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationResponseArgs = {
  input: UpdateApplicationResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationSectionByNodeIdArgs = {
  input: UpdateApplicationSectionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationSectionArgs = {
  input: UpdateApplicationSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStageHistoryByNodeIdArgs = {
  input: UpdateApplicationStageHistoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStageHistoryArgs = {
  input: UpdateApplicationStageHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStatusHistoryByNodeIdArgs = {
  input: UpdateApplicationStatusHistoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStatusHistoryArgs = {
  input: UpdateApplicationStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateElementTypePluginByNodeIdArgs = {
  input: UpdateElementTypePluginByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateElementTypePluginArgs = {
  input: UpdateElementTypePluginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFileByNodeIdArgs = {
  input: UpdateFileByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateFileArgs = {
  input: UpdateFileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationByNodeIdArgs = {
  input: UpdateNotificationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOrganisationByNodeIdArgs = {
  input: UpdateOrganisationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOrganisationArgs = {
  input: UpdateOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionJoinByNodeIdArgs = {
  input: UpdatePermissionJoinByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionJoinArgs = {
  input: UpdatePermissionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionNameByNodeIdArgs = {
  input: UpdatePermissionNameByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionNameArgs = {
  input: UpdatePermissionNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionPolicyByNodeIdArgs = {
  input: UpdatePermissionPolicyByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionPolicyArgs = {
  input: UpdatePermissionPolicyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewByNodeIdArgs = {
  input: UpdateReviewByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewAssignmentByNodeIdArgs = {
  input: UpdateReviewAssignmentByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewAssignmentArgs = {
  input: UpdateReviewAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewQuestionAssignmentByNodeIdArgs = {
  input: UpdateReviewQuestionAssignmentByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewQuestionAssignmentArgs = {
  input: UpdateReviewQuestionAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewResponseByNodeIdArgs = {
  input: UpdateReviewResponseByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewResponseArgs = {
  input: UpdateReviewResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewStatusHistoryByNodeIdArgs = {
  input: UpdateReviewStatusHistoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewStatusHistoryArgs = {
  input: UpdateReviewStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateByNodeIdArgs = {
  input: UpdateTemplateByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateActionByNodeIdArgs = {
  input: UpdateTemplateActionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateActionArgs = {
  input: UpdateTemplateActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateElementByNodeIdArgs = {
  input: UpdateTemplateElementByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateElementArgs = {
  input: UpdateTemplateElementInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplatePermissionByNodeIdArgs = {
  input: UpdateTemplatePermissionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplatePermissionArgs = {
  input: UpdateTemplatePermissionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateSectionByNodeIdArgs = {
  input: UpdateTemplateSectionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateSectionArgs = {
  input: UpdateTemplateSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateStageByNodeIdArgs = {
  input: UpdateTemplateStageByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateStageArgs = {
  input: UpdateTemplateStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTriggerQueueByNodeIdArgs = {
  input: UpdateTriggerQueueByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTriggerQueueArgs = {
  input: UpdateTriggerQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByNodeIdArgs = {
  input: UpdateUserByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByUsernameArgs = {
  input: UpdateUserByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserOrganisationByNodeIdArgs = {
  input: UpdateUserOrganisationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserOrganisationArgs = {
  input: UpdateUserOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionPluginByNodeIdArgs = {
  input: DeleteActionPluginByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionPluginArgs = {
  input: DeleteActionPluginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionQueueByNodeIdArgs = {
  input: DeleteActionQueueByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionQueueArgs = {
  input: DeleteActionQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationByNodeIdArgs = {
  input: DeleteApplicationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationArgs = {
  input: DeleteApplicationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationBySerialArgs = {
  input: DeleteApplicationBySerialInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationResponseByNodeIdArgs = {
  input: DeleteApplicationResponseByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationResponseArgs = {
  input: DeleteApplicationResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationSectionByNodeIdArgs = {
  input: DeleteApplicationSectionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationSectionArgs = {
  input: DeleteApplicationSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStageHistoryByNodeIdArgs = {
  input: DeleteApplicationStageHistoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStageHistoryArgs = {
  input: DeleteApplicationStageHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStatusHistoryByNodeIdArgs = {
  input: DeleteApplicationStatusHistoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStatusHistoryArgs = {
  input: DeleteApplicationStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteElementTypePluginByNodeIdArgs = {
  input: DeleteElementTypePluginByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteElementTypePluginArgs = {
  input: DeleteElementTypePluginInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFileByNodeIdArgs = {
  input: DeleteFileByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteFileArgs = {
  input: DeleteFileInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationByNodeIdArgs = {
  input: DeleteNotificationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOrganisationByNodeIdArgs = {
  input: DeleteOrganisationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOrganisationArgs = {
  input: DeleteOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionJoinByNodeIdArgs = {
  input: DeletePermissionJoinByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionJoinArgs = {
  input: DeletePermissionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionNameByNodeIdArgs = {
  input: DeletePermissionNameByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionNameArgs = {
  input: DeletePermissionNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionPolicyByNodeIdArgs = {
  input: DeletePermissionPolicyByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionPolicyArgs = {
  input: DeletePermissionPolicyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewByNodeIdArgs = {
  input: DeleteReviewByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewArgs = {
  input: DeleteReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewAssignmentByNodeIdArgs = {
  input: DeleteReviewAssignmentByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewAssignmentArgs = {
  input: DeleteReviewAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewQuestionAssignmentByNodeIdArgs = {
  input: DeleteReviewQuestionAssignmentByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewQuestionAssignmentArgs = {
  input: DeleteReviewQuestionAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewResponseByNodeIdArgs = {
  input: DeleteReviewResponseByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewResponseArgs = {
  input: DeleteReviewResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewStatusHistoryByNodeIdArgs = {
  input: DeleteReviewStatusHistoryByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewStatusHistoryArgs = {
  input: DeleteReviewStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateByNodeIdArgs = {
  input: DeleteTemplateByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateArgs = {
  input: DeleteTemplateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateActionByNodeIdArgs = {
  input: DeleteTemplateActionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateActionArgs = {
  input: DeleteTemplateActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateElementByNodeIdArgs = {
  input: DeleteTemplateElementByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateElementArgs = {
  input: DeleteTemplateElementInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplatePermissionByNodeIdArgs = {
  input: DeleteTemplatePermissionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplatePermissionArgs = {
  input: DeleteTemplatePermissionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateSectionByNodeIdArgs = {
  input: DeleteTemplateSectionByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateSectionArgs = {
  input: DeleteTemplateSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateStageByNodeIdArgs = {
  input: DeleteTemplateStageByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateStageArgs = {
  input: DeleteTemplateStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTriggerQueueByNodeIdArgs = {
  input: DeleteTriggerQueueByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTriggerQueueArgs = {
  input: DeleteTriggerQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByNodeIdArgs = {
  input: DeleteUserByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByUsernameArgs = {
  input: DeleteUserByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserOrganisationByNodeIdArgs = {
  input: DeleteUserOrganisationByNodeIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserOrganisationArgs = {
  input: DeleteUserOrganisationInput;
};

/** All input for the create `ActionPlugin` mutation. */
export type CreateActionPluginInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ActionPlugin` to be created by this mutation. */
  actionPlugin: ActionPluginInput;
};

/** An input for mutations affecting `ActionPlugin` */
export type ActionPluginInput = {
  code: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  functionName?: Maybe<Scalars['String']>;
  requiredParameters?: Maybe<Array<Maybe<Scalars['String']>>>;
  outputProperties?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** The output of our create `ActionPlugin` mutation. */
export type CreateActionPluginPayload = {
  __typename?: 'CreateActionPluginPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ActionPlugin` that was created by this mutation. */
  actionPlugin?: Maybe<ActionPlugin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ActionPlugin`. May be used by Relay 1. */
  actionPluginEdge?: Maybe<ActionPluginsEdge>;
};


/** The output of our create `ActionPlugin` mutation. */
export type CreateActionPluginPayloadActionPluginEdgeArgs = {
  orderBy?: Maybe<Array<ActionPluginsOrderBy>>;
};

/** All input for the create `ActionQueue` mutation. */
export type CreateActionQueueInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ActionQueue` to be created by this mutation. */
  actionQueue: ActionQueueInput;
};

/** An input for mutations affecting `ActionQueue` */
export type ActionQueueInput = {
  id?: Maybe<Scalars['Int']>;
  triggerEvent?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  applicationData?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  output?: Maybe<Scalars['JSON']>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeCompleted?: Maybe<Scalars['Datetime']>;
  timeScheduled?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
  triggerQueueToTriggerEvent?: Maybe<ActionQueueTriggerEventFkeyInput>;
  templateToTemplateId?: Maybe<ActionQueueTemplateIdFkeyInput>;
};

/** Input for the nested mutation of `triggerQueue` in the `ActionQueueInput` mutation. */
export type ActionQueueTriggerEventFkeyInput = {
  /** The primary key(s) for `triggerQueue` for the far side of the relationship. */
  connectById?: Maybe<TriggerQueueTriggerQueuePkeyConnect>;
  /** The primary key(s) for `triggerQueue` for the far side of the relationship. */
  connectByNodeId?: Maybe<TriggerQueueNodeIdConnect>;
  /** The primary key(s) for `triggerQueue` for the far side of the relationship. */
  deleteById?: Maybe<TriggerQueueTriggerQueuePkeyDelete>;
  /** The primary key(s) for `triggerQueue` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TriggerQueueNodeIdDelete>;
  /** The primary key(s) and patch data for `triggerQueue` for the far side of the relationship. */
  updateById?: Maybe<TriggerQueueOnActionQueueForActionQueueTriggerEventFkeyUsingTriggerQueuePkeyUpdate>;
  /** The primary key(s) and patch data for `triggerQueue` for the far side of the relationship. */
  updateByNodeId?: Maybe<ActionQueueOnActionQueueForActionQueueTriggerEventFkeyNodeIdUpdate>;
  /** A `TriggerQueueInput` object that will be created and connected to this object. */
  create?: Maybe<ActionQueueTriggerEventFkeyTriggerQueueCreateInput>;
};

/** The fields on `triggerQueue` to look up the row to connect. */
export type TriggerQueueTriggerQueuePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TriggerQueueNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `triggerQueue` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `triggerQueue` to look up the row to delete. */
export type TriggerQueueTriggerQueuePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TriggerQueueNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `triggerQueue` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `triggerQueue` to look up the row to update. */
export type TriggerQueueOnActionQueueForActionQueueTriggerEventFkeyUsingTriggerQueuePkeyUpdate = {
  /** An object where the defined keys will be set on the `triggerQueue` being updated. */
  patch: UpdateTriggerQueueOnActionQueueForActionQueueTriggerEventFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `triggerQueue` being updated. */
export type UpdateTriggerQueueOnActionQueueForActionQueueTriggerEventFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  triggerType?: Maybe<Trigger>;
  table?: Maybe<Scalars['String']>;
  recordId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  status?: Maybe<TriggerQueueStatus>;
  log?: Maybe<Scalars['JSON']>;
  actionQueuesUsingId?: Maybe<ActionQueueTriggerEventFkeyInverseInput>;
};

/** Input for the nested mutation of `actionQueue` in the `TriggerQueueInput` mutation. */
export type ActionQueueTriggerEventFkeyInverseInput = {
  /** Flag indicating whether all other `actionQueue` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  connectById?: Maybe<Array<ActionQueueActionQueuePkeyConnect>>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ActionQueueNodeIdConnect>>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  deleteById?: Maybe<Array<ActionQueueActionQueuePkeyDelete>>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ActionQueueNodeIdDelete>>;
  /** The primary key(s) and patch data for `actionQueue` for the far side of the relationship. */
  updateById?: Maybe<Array<ActionQueueOnActionQueueForActionQueueTriggerEventFkeyUsingActionQueuePkeyUpdate>>;
  /** The primary key(s) and patch data for `actionQueue` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TriggerQueueOnActionQueueForActionQueueTriggerEventFkeyNodeIdUpdate>>;
  /** A `ActionQueueInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ActionQueueTriggerEventFkeyActionQueueCreateInput>>;
};

/** The fields on `actionQueue` to look up the row to connect. */
export type ActionQueueActionQueuePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ActionQueueNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `actionQueue` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `actionQueue` to look up the row to delete. */
export type ActionQueueActionQueuePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ActionQueueNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `actionQueue` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `actionQueue` to look up the row to update. */
export type ActionQueueOnActionQueueForActionQueueTriggerEventFkeyUsingActionQueuePkeyUpdate = {
  /** An object where the defined keys will be set on the `actionQueue` being updated. */
  patch: UpdateActionQueueOnActionQueueForActionQueueTriggerEventFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `actionQueue` being updated. */
export type UpdateActionQueueOnActionQueueForActionQueueTriggerEventFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  applicationData?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  output?: Maybe<Scalars['JSON']>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeCompleted?: Maybe<Scalars['Datetime']>;
  timeScheduled?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
  triggerQueueToTriggerEvent?: Maybe<ActionQueueTriggerEventFkeyInput>;
  templateToTemplateId?: Maybe<ActionQueueTemplateIdFkeyInput>;
};

/** Input for the nested mutation of `template` in the `ActionQueueInput` mutation. */
export type ActionQueueTemplateIdFkeyInput = {
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectById?: Maybe<TemplateTemplatePkeyConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateNodeIdConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteById?: Maybe<TemplateTemplatePkeyDelete>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateNodeIdDelete>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateById?: Maybe<TemplateOnActionQueueForActionQueueTemplateIdFkeyUsingTemplatePkeyUpdate>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateByNodeId?: Maybe<ActionQueueOnActionQueueForActionQueueTemplateIdFkeyNodeIdUpdate>;
  /** A `TemplateInput` object that will be created and connected to this object. */
  create?: Maybe<ActionQueueTemplateIdFkeyTemplateCreateInput>;
};

/** The fields on `template` to look up the row to connect. */
export type TemplateTemplatePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TemplateNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `template` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `template` to look up the row to delete. */
export type TemplateTemplatePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TemplateNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `template` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `template` to look up the row to update. */
export type TemplateOnActionQueueForActionQueueTemplateIdFkeyUsingTemplatePkeyUpdate = {
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: UpdateTemplateOnActionQueueForActionQueueTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `template` being updated. */
export type UpdateTemplateOnActionQueueForActionQueueTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateStage` in the `TemplateInput` mutation. */
export type TemplateStageTemplateIdFkeyInverseInput = {
  /** Flag indicating whether all other `templateStage` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplateStageTemplateStagePkeyConnect>>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplateStageNodeIdConnect>>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplateStageTemplateStagePkeyDelete>>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplateStageNodeIdDelete>>;
  /** The primary key(s) and patch data for `templateStage` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplateStageOnTemplateStageForTemplateStageTemplateIdFkeyUsingTemplateStagePkeyUpdate>>;
  /** The primary key(s) and patch data for `templateStage` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateOnTemplateStageForTemplateStageTemplateIdFkeyNodeIdUpdate>>;
  /** A `TemplateStageInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplateStageTemplateIdFkeyTemplateStageCreateInput>>;
};

/** The fields on `templateStage` to look up the row to connect. */
export type TemplateStageTemplateStagePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TemplateStageNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `templateStage` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateStage` to look up the row to delete. */
export type TemplateStageTemplateStagePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TemplateStageNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `templateStage` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateStage` to look up the row to update. */
export type TemplateStageOnTemplateStageForTemplateStageTemplateIdFkeyUsingTemplateStagePkeyUpdate = {
  /** An object where the defined keys will be set on the `templateStage` being updated. */
  patch: UpdateTemplateStageOnTemplateStageForTemplateStageTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateStage` being updated. */
export type UpdateTemplateStageOnTemplateStageForTemplateStageTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  templateToTemplateId?: Maybe<TemplateStageTemplateIdFkeyInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryStageIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentStageIdFkeyInverseInput>;
};

/** Input for the nested mutation of `template` in the `TemplateStageInput` mutation. */
export type TemplateStageTemplateIdFkeyInput = {
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectById?: Maybe<TemplateTemplatePkeyConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateNodeIdConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteById?: Maybe<TemplateTemplatePkeyDelete>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateNodeIdDelete>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateById?: Maybe<TemplateOnTemplateStageForTemplateStageTemplateIdFkeyUsingTemplatePkeyUpdate>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplateStageOnTemplateStageForTemplateStageTemplateIdFkeyNodeIdUpdate>;
  /** A `TemplateInput` object that will be created and connected to this object. */
  create?: Maybe<TemplateStageTemplateIdFkeyTemplateCreateInput>;
};

/** The fields on `template` to look up the row to update. */
export type TemplateOnTemplateStageForTemplateStageTemplateIdFkeyUsingTemplatePkeyUpdate = {
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: UpdateTemplateOnTemplateStageForTemplateStageTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `template` being updated. */
export type UpdateTemplateOnTemplateStageForTemplateStageTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateSection` in the `TemplateInput` mutation. */
export type TemplateSectionTemplateIdFkeyInverseInput = {
  /** Flag indicating whether all other `templateSection` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplateSectionTemplateSectionPkeyConnect>>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplateSectionNodeIdConnect>>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplateSectionTemplateSectionPkeyDelete>>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplateSectionNodeIdDelete>>;
  /** The primary key(s) and patch data for `templateSection` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplateSectionOnTemplateSectionForTemplateSectionTemplateIdFkeyUsingTemplateSectionPkeyUpdate>>;
  /** The primary key(s) and patch data for `templateSection` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateOnTemplateSectionForTemplateSectionTemplateIdFkeyNodeIdUpdate>>;
  /** A `TemplateSectionInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplateSectionTemplateIdFkeyTemplateSectionCreateInput>>;
};

/** The fields on `templateSection` to look up the row to connect. */
export type TemplateSectionTemplateSectionPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TemplateSectionNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `templateSection` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateSection` to look up the row to delete. */
export type TemplateSectionTemplateSectionPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TemplateSectionNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `templateSection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateSection` to look up the row to update. */
export type TemplateSectionOnTemplateSectionForTemplateSectionTemplateIdFkeyUsingTemplateSectionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateSection` being updated. */
  patch: UpdateTemplateSectionOnTemplateSectionForTemplateSectionTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateSection` being updated. */
export type UpdateTemplateSectionOnTemplateSectionForTemplateSectionTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  templateToTemplateId?: Maybe<TemplateSectionTemplateIdFkeyInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateSectionIdFkeyInverseInput>;
  templateElementsUsingId?: Maybe<TemplateElementSectionIdFkeyInverseInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionTemplateSectionIdFkeyInverseInput>;
};

/** Input for the nested mutation of `template` in the `TemplateSectionInput` mutation. */
export type TemplateSectionTemplateIdFkeyInput = {
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectById?: Maybe<TemplateTemplatePkeyConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateNodeIdConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteById?: Maybe<TemplateTemplatePkeyDelete>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateNodeIdDelete>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateById?: Maybe<TemplateOnTemplateSectionForTemplateSectionTemplateIdFkeyUsingTemplatePkeyUpdate>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplateSectionOnTemplateSectionForTemplateSectionTemplateIdFkeyNodeIdUpdate>;
  /** A `TemplateInput` object that will be created and connected to this object. */
  create?: Maybe<TemplateSectionTemplateIdFkeyTemplateCreateInput>;
};

/** The fields on `template` to look up the row to update. */
export type TemplateOnTemplateSectionForTemplateSectionTemplateIdFkeyUsingTemplatePkeyUpdate = {
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: UpdateTemplateOnTemplateSectionForTemplateSectionTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `template` being updated. */
export type UpdateTemplateOnTemplateSectionForTemplateSectionTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templatePermission` in the `TemplateInput` mutation. */
export type TemplatePermissionTemplateIdFkeyInverseInput = {
  /** Flag indicating whether all other `templatePermission` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplatePermissionTemplatePermissionPkeyConnect>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplatePermissionNodeIdConnect>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplatePermissionTemplatePermissionPkeyDelete>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplatePermissionNodeIdDelete>>;
  /** The primary key(s) and patch data for `templatePermission` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateIdFkeyUsingTemplatePermissionPkeyUpdate>>;
  /** The primary key(s) and patch data for `templatePermission` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateOnTemplatePermissionForTemplatePermissionTemplateIdFkeyNodeIdUpdate>>;
  /** A `TemplatePermissionInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplatePermissionTemplateIdFkeyTemplatePermissionCreateInput>>;
};

/** The fields on `templatePermission` to look up the row to connect. */
export type TemplatePermissionTemplatePermissionPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TemplatePermissionNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `templatePermission` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `templatePermission` to look up the row to delete. */
export type TemplatePermissionTemplatePermissionPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TemplatePermissionNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `templatePermission` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `templatePermission` to look up the row to update. */
export type TemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateIdFkeyUsingTemplatePermissionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templatePermission` being updated. */
  patch: UpdateTemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templatePermission` being updated. */
export type UpdateTemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
  permissionNameToPermissionNameId?: Maybe<TemplatePermissionPermissionNameIdFkeyInput>;
  templateToTemplateId?: Maybe<TemplatePermissionTemplateIdFkeyInput>;
  templateSectionToTemplateSectionId?: Maybe<TemplatePermissionTemplateSectionIdFkeyInput>;
};

/** Input for the nested mutation of `permissionName` in the `TemplatePermissionInput` mutation. */
export type TemplatePermissionPermissionNameIdFkeyInput = {
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  connectById?: Maybe<PermissionNamePermissionNamePkeyConnect>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  connectByNodeId?: Maybe<PermissionNameNodeIdConnect>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  deleteById?: Maybe<PermissionNamePermissionNamePkeyDelete>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PermissionNameNodeIdDelete>;
  /** The primary key(s) and patch data for `permissionName` for the far side of the relationship. */
  updateById?: Maybe<PermissionNameOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyUsingPermissionNamePkeyUpdate>;
  /** The primary key(s) and patch data for `permissionName` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplatePermissionOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyNodeIdUpdate>;
  /** A `PermissionNameInput` object that will be created and connected to this object. */
  create?: Maybe<TemplatePermissionPermissionNameIdFkeyPermissionNameCreateInput>;
};

/** The fields on `permissionName` to look up the row to connect. */
export type PermissionNamePermissionNamePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PermissionNameNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `permissionName` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `permissionName` to look up the row to delete. */
export type PermissionNamePermissionNamePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PermissionNameNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `permissionName` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `permissionName` to look up the row to update. */
export type PermissionNameOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyUsingPermissionNamePkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionName` being updated. */
  patch: UpdatePermissionNameOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionName` being updated. */
export type UpdatePermissionNameOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  permissionPolicyToPermissionPolicyId?: Maybe<PermissionNamePermissionPolicyIdFkeyInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinPermissionNameIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionPermissionNameIdFkeyInverseInput>;
};

/** Input for the nested mutation of `permissionPolicy` in the `PermissionNameInput` mutation. */
export type PermissionNamePermissionPolicyIdFkeyInput = {
  /** The primary key(s) for `permissionPolicy` for the far side of the relationship. */
  connectById?: Maybe<PermissionPolicyPermissionPolicyPkeyConnect>;
  /** The primary key(s) for `permissionPolicy` for the far side of the relationship. */
  connectByNodeId?: Maybe<PermissionPolicyNodeIdConnect>;
  /** The primary key(s) for `permissionPolicy` for the far side of the relationship. */
  deleteById?: Maybe<PermissionPolicyPermissionPolicyPkeyDelete>;
  /** The primary key(s) for `permissionPolicy` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PermissionPolicyNodeIdDelete>;
  /** The primary key(s) and patch data for `permissionPolicy` for the far side of the relationship. */
  updateById?: Maybe<PermissionPolicyOnPermissionNameForPermissionNamePermissionPolicyIdFkeyUsingPermissionPolicyPkeyUpdate>;
  /** The primary key(s) and patch data for `permissionPolicy` for the far side of the relationship. */
  updateByNodeId?: Maybe<PermissionNameOnPermissionNameForPermissionNamePermissionPolicyIdFkeyNodeIdUpdate>;
  /** A `PermissionPolicyInput` object that will be created and connected to this object. */
  create?: Maybe<PermissionNamePermissionPolicyIdFkeyPermissionPolicyCreateInput>;
};

/** The fields on `permissionPolicy` to look up the row to connect. */
export type PermissionPolicyPermissionPolicyPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PermissionPolicyNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `permissionPolicy` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `permissionPolicy` to look up the row to delete. */
export type PermissionPolicyPermissionPolicyPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PermissionPolicyNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `permissionPolicy` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `permissionPolicy` to look up the row to update. */
export type PermissionPolicyOnPermissionNameForPermissionNamePermissionPolicyIdFkeyUsingPermissionPolicyPkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionPolicy` being updated. */
  patch: UpdatePermissionPolicyOnPermissionNameForPermissionNamePermissionPolicyIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionPolicy` being updated. */
export type UpdatePermissionPolicyOnPermissionNameForPermissionNamePermissionPolicyIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  rules?: Maybe<Scalars['JSON']>;
  type?: Maybe<PermissionPolicyType>;
  defaultRestrictions?: Maybe<Scalars['JSON']>;
  permissionNamesUsingId?: Maybe<PermissionNamePermissionPolicyIdFkeyInverseInput>;
};

/** Input for the nested mutation of `permissionName` in the `PermissionPolicyInput` mutation. */
export type PermissionNamePermissionPolicyIdFkeyInverseInput = {
  /** Flag indicating whether all other `permissionName` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  connectById?: Maybe<Array<PermissionNamePermissionNamePkeyConnect>>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PermissionNameNodeIdConnect>>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  deleteById?: Maybe<Array<PermissionNamePermissionNamePkeyDelete>>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PermissionNameNodeIdDelete>>;
  /** The primary key(s) and patch data for `permissionName` for the far side of the relationship. */
  updateById?: Maybe<Array<PermissionNameOnPermissionNameForPermissionNamePermissionPolicyIdFkeyUsingPermissionNamePkeyUpdate>>;
  /** The primary key(s) and patch data for `permissionName` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PermissionPolicyOnPermissionNameForPermissionNamePermissionPolicyIdFkeyNodeIdUpdate>>;
  /** A `PermissionNameInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PermissionNamePermissionPolicyIdFkeyPermissionNameCreateInput>>;
};

/** The fields on `permissionName` to look up the row to update. */
export type PermissionNameOnPermissionNameForPermissionNamePermissionPolicyIdFkeyUsingPermissionNamePkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionName` being updated. */
  patch: UpdatePermissionNameOnPermissionNameForPermissionNamePermissionPolicyIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionName` being updated. */
export type UpdatePermissionNameOnPermissionNameForPermissionNamePermissionPolicyIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  permissionPolicyToPermissionPolicyId?: Maybe<PermissionNamePermissionPolicyIdFkeyInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinPermissionNameIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionPermissionNameIdFkeyInverseInput>;
};

/** Input for the nested mutation of `permissionJoin` in the `PermissionNameInput` mutation. */
export type PermissionJoinPermissionNameIdFkeyInverseInput = {
  /** Flag indicating whether all other `permissionJoin` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  connectById?: Maybe<Array<PermissionJoinPermissionJoinPkeyConnect>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PermissionJoinNodeIdConnect>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  deleteById?: Maybe<Array<PermissionJoinPermissionJoinPkeyDelete>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PermissionJoinNodeIdDelete>>;
  /** The primary key(s) and patch data for `permissionJoin` for the far side of the relationship. */
  updateById?: Maybe<Array<PermissionJoinOnPermissionJoinForPermissionJoinPermissionNameIdFkeyUsingPermissionJoinPkeyUpdate>>;
  /** The primary key(s) and patch data for `permissionJoin` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PermissionNameOnPermissionJoinForPermissionJoinPermissionNameIdFkeyNodeIdUpdate>>;
  /** A `PermissionJoinInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PermissionJoinPermissionNameIdFkeyPermissionJoinCreateInput>>;
};

/** The fields on `permissionJoin` to look up the row to connect. */
export type PermissionJoinPermissionJoinPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type PermissionJoinNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `permissionJoin` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `permissionJoin` to look up the row to delete. */
export type PermissionJoinPermissionJoinPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type PermissionJoinNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `permissionJoin` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `permissionJoin` to look up the row to update. */
export type PermissionJoinOnPermissionJoinForPermissionJoinPermissionNameIdFkeyUsingPermissionJoinPkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionJoin` being updated. */
  patch: UpdatePermissionJoinOnPermissionJoinForPermissionJoinPermissionNameIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionJoin` being updated. */
export type UpdatePermissionJoinOnPermissionJoinForPermissionJoinPermissionNameIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  userOrganisationId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<PermissionJoinUserIdFkeyInput>;
  userOrganisationToUserOrganisationId?: Maybe<PermissionJoinUserOrganisationIdFkeyInput>;
  permissionNameToPermissionNameId?: Maybe<PermissionJoinPermissionNameIdFkeyInput>;
};

/** Input for the nested mutation of `user` in the `PermissionJoinInput` mutation. */
export type PermissionJoinUserIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnPermissionJoinForPermissionJoinUserIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnPermissionJoinForPermissionJoinUserIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<PermissionJoinOnPermissionJoinForPermissionJoinUserIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<PermissionJoinUserIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to connect. */
export type UserUserPkeyConnect = {
  id: Scalars['Int'];
};

/** The fields on `user` to look up the row to connect. */
export type UserUserUsernameKeyConnect = {
  username: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type UserNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `user` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `user` to look up the row to delete. */
export type UserUserPkeyDelete = {
  id: Scalars['Int'];
};

/** The fields on `user` to look up the row to delete. */
export type UserUserUsernameKeyDelete = {
  username: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type UserNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `user` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `user` to look up the row to update. */
export type UserOnPermissionJoinForPermissionJoinUserIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnPermissionJoinForPermissionJoinUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnPermissionJoinForPermissionJoinUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `userOrganisation` in the `UserInput` mutation. */
export type UserOrganisationUserIdFkeyInverseInput = {
  /** Flag indicating whether all other `userOrganisation` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  connectById?: Maybe<Array<UserOrganisationUserOrganisationPkeyConnect>>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<UserOrganisationNodeIdConnect>>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  deleteById?: Maybe<Array<UserOrganisationUserOrganisationPkeyDelete>>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<UserOrganisationNodeIdDelete>>;
  /** The primary key(s) and patch data for `userOrganisation` for the far side of the relationship. */
  updateById?: Maybe<Array<UserOrganisationOnUserOrganisationForUserOrganisationUserIdFkeyUsingUserOrganisationPkeyUpdate>>;
  /** The primary key(s) and patch data for `userOrganisation` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnUserOrganisationForUserOrganisationUserIdFkeyNodeIdUpdate>>;
  /** A `UserOrganisationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<UserOrganisationUserIdFkeyUserOrganisationCreateInput>>;
};

/** The fields on `userOrganisation` to look up the row to connect. */
export type UserOrganisationUserOrganisationPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type UserOrganisationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `userOrganisation` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `userOrganisation` to look up the row to delete. */
export type UserOrganisationUserOrganisationPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type UserOrganisationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `userOrganisation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `userOrganisation` to look up the row to update. */
export type UserOrganisationOnUserOrganisationForUserOrganisationUserIdFkeyUsingUserOrganisationPkeyUpdate = {
  /** An object where the defined keys will be set on the `userOrganisation` being updated. */
  patch: UpdateUserOrganisationOnUserOrganisationForUserOrganisationUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `userOrganisation` being updated. */
export type UpdateUserOrganisationOnUserOrganisationForUserOrganisationUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  organisationId?: Maybe<Scalars['Int']>;
  userRole?: Maybe<Scalars['String']>;
  userToUserId?: Maybe<UserOrganisationUserIdFkeyInput>;
  organisationToOrganisationId?: Maybe<UserOrganisationOrganisationIdFkeyInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserOrganisationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `UserOrganisationInput` mutation. */
export type UserOrganisationUserIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnUserOrganisationForUserOrganisationUserIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnUserOrganisationForUserOrganisationUserIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<UserOrganisationOnUserOrganisationForUserOrganisationUserIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<UserOrganisationUserIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnUserOrganisationForUserOrganisationUserIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnUserOrganisationForUserOrganisationUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnUserOrganisationForUserOrganisationUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `permissionJoin` in the `UserInput` mutation. */
export type PermissionJoinUserIdFkeyInverseInput = {
  /** Flag indicating whether all other `permissionJoin` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  connectById?: Maybe<Array<PermissionJoinPermissionJoinPkeyConnect>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PermissionJoinNodeIdConnect>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  deleteById?: Maybe<Array<PermissionJoinPermissionJoinPkeyDelete>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PermissionJoinNodeIdDelete>>;
  /** The primary key(s) and patch data for `permissionJoin` for the far side of the relationship. */
  updateById?: Maybe<Array<PermissionJoinOnPermissionJoinForPermissionJoinUserIdFkeyUsingPermissionJoinPkeyUpdate>>;
  /** The primary key(s) and patch data for `permissionJoin` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnPermissionJoinForPermissionJoinUserIdFkeyNodeIdUpdate>>;
  /** A `PermissionJoinInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PermissionJoinUserIdFkeyPermissionJoinCreateInput>>;
};

/** The fields on `permissionJoin` to look up the row to update. */
export type PermissionJoinOnPermissionJoinForPermissionJoinUserIdFkeyUsingPermissionJoinPkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionJoin` being updated. */
  patch: UpdatePermissionJoinOnPermissionJoinForPermissionJoinUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionJoin` being updated. */
export type UpdatePermissionJoinOnPermissionJoinForPermissionJoinUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userOrganisationId?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<PermissionJoinUserIdFkeyInput>;
  userOrganisationToUserOrganisationId?: Maybe<PermissionJoinUserOrganisationIdFkeyInput>;
  permissionNameToPermissionNameId?: Maybe<PermissionJoinPermissionNameIdFkeyInput>;
};

/** Input for the nested mutation of `userOrganisation` in the `PermissionJoinInput` mutation. */
export type PermissionJoinUserOrganisationIdFkeyInput = {
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  connectById?: Maybe<UserOrganisationUserOrganisationPkeyConnect>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserOrganisationNodeIdConnect>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  deleteById?: Maybe<UserOrganisationUserOrganisationPkeyDelete>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserOrganisationNodeIdDelete>;
  /** The primary key(s) and patch data for `userOrganisation` for the far side of the relationship. */
  updateById?: Maybe<UserOrganisationOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyUsingUserOrganisationPkeyUpdate>;
  /** The primary key(s) and patch data for `userOrganisation` for the far side of the relationship. */
  updateByNodeId?: Maybe<PermissionJoinOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyNodeIdUpdate>;
  /** A `UserOrganisationInput` object that will be created and connected to this object. */
  create?: Maybe<PermissionJoinUserOrganisationIdFkeyUserOrganisationCreateInput>;
};

/** The fields on `userOrganisation` to look up the row to update. */
export type UserOrganisationOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyUsingUserOrganisationPkeyUpdate = {
  /** An object where the defined keys will be set on the `userOrganisation` being updated. */
  patch: UpdateUserOrganisationOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `userOrganisation` being updated. */
export type UpdateUserOrganisationOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  organisationId?: Maybe<Scalars['Int']>;
  userRole?: Maybe<Scalars['String']>;
  userToUserId?: Maybe<UserOrganisationUserIdFkeyInput>;
  organisationToOrganisationId?: Maybe<UserOrganisationOrganisationIdFkeyInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserOrganisationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `organisation` in the `UserOrganisationInput` mutation. */
export type UserOrganisationOrganisationIdFkeyInput = {
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  connectById?: Maybe<OrganisationOrganisationPkeyConnect>;
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  connectByNodeId?: Maybe<OrganisationNodeIdConnect>;
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  deleteById?: Maybe<OrganisationOrganisationPkeyDelete>;
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  deleteByNodeId?: Maybe<OrganisationNodeIdDelete>;
  /** The primary key(s) and patch data for `organisation` for the far side of the relationship. */
  updateById?: Maybe<OrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyUsingOrganisationPkeyUpdate>;
  /** The primary key(s) and patch data for `organisation` for the far side of the relationship. */
  updateByNodeId?: Maybe<UserOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyNodeIdUpdate>;
  /** A `OrganisationInput` object that will be created and connected to this object. */
  create?: Maybe<UserOrganisationOrganisationIdFkeyOrganisationCreateInput>;
};

/** The fields on `organisation` to look up the row to connect. */
export type OrganisationOrganisationPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type OrganisationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `organisation` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `organisation` to look up the row to delete. */
export type OrganisationOrganisationPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type OrganisationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `organisation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `organisation` to look up the row to update. */
export type OrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyUsingOrganisationPkeyUpdate = {
  /** An object where the defined keys will be set on the `organisation` being updated. */
  patch: UpdateOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `organisation` being updated. */
export type UpdateOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationOrganisationIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationOrgIdFkeyInverseInput>;
};

/** Input for the nested mutation of `userOrganisation` in the `OrganisationInput` mutation. */
export type UserOrganisationOrganisationIdFkeyInverseInput = {
  /** Flag indicating whether all other `userOrganisation` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  connectById?: Maybe<Array<UserOrganisationUserOrganisationPkeyConnect>>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<UserOrganisationNodeIdConnect>>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  deleteById?: Maybe<Array<UserOrganisationUserOrganisationPkeyDelete>>;
  /** The primary key(s) for `userOrganisation` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<UserOrganisationNodeIdDelete>>;
  /** The primary key(s) and patch data for `userOrganisation` for the far side of the relationship. */
  updateById?: Maybe<Array<UserOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyUsingUserOrganisationPkeyUpdate>>;
  /** The primary key(s) and patch data for `userOrganisation` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<OrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyNodeIdUpdate>>;
  /** A `UserOrganisationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<UserOrganisationOrganisationIdFkeyUserOrganisationCreateInput>>;
};

/** The fields on `userOrganisation` to look up the row to update. */
export type UserOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyUsingUserOrganisationPkeyUpdate = {
  /** An object where the defined keys will be set on the `userOrganisation` being updated. */
  patch: UpdateUserOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `userOrganisation` being updated. */
export type UpdateUserOrganisationOnUserOrganisationForUserOrganisationOrganisationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  userRole?: Maybe<Scalars['String']>;
  userToUserId?: Maybe<UserOrganisationUserIdFkeyInput>;
  organisationToOrganisationId?: Maybe<UserOrganisationOrganisationIdFkeyInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserOrganisationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `permissionJoin` in the `UserOrganisationInput` mutation. */
export type PermissionJoinUserOrganisationIdFkeyInverseInput = {
  /** Flag indicating whether all other `permissionJoin` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  connectById?: Maybe<Array<PermissionJoinPermissionJoinPkeyConnect>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<PermissionJoinNodeIdConnect>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  deleteById?: Maybe<Array<PermissionJoinPermissionJoinPkeyDelete>>;
  /** The primary key(s) for `permissionJoin` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<PermissionJoinNodeIdDelete>>;
  /** The primary key(s) and patch data for `permissionJoin` for the far side of the relationship. */
  updateById?: Maybe<Array<PermissionJoinOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyUsingPermissionJoinPkeyUpdate>>;
  /** The primary key(s) and patch data for `permissionJoin` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOrganisationOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyNodeIdUpdate>>;
  /** A `PermissionJoinInput` object that will be created and connected to this object. */
  create?: Maybe<Array<PermissionJoinUserOrganisationIdFkeyPermissionJoinCreateInput>>;
};

/** The fields on `permissionJoin` to look up the row to update. */
export type PermissionJoinOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyUsingPermissionJoinPkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionJoin` being updated. */
  patch: UpdatePermissionJoinOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionJoin` being updated. */
export type UpdatePermissionJoinOnPermissionJoinForPermissionJoinUserOrganisationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<PermissionJoinUserIdFkeyInput>;
  userOrganisationToUserOrganisationId?: Maybe<PermissionJoinUserOrganisationIdFkeyInput>;
  permissionNameToPermissionNameId?: Maybe<PermissionJoinPermissionNameIdFkeyInput>;
};

/** Input for the nested mutation of `permissionName` in the `PermissionJoinInput` mutation. */
export type PermissionJoinPermissionNameIdFkeyInput = {
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  connectById?: Maybe<PermissionNamePermissionNamePkeyConnect>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  connectByNodeId?: Maybe<PermissionNameNodeIdConnect>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  deleteById?: Maybe<PermissionNamePermissionNamePkeyDelete>;
  /** The primary key(s) for `permissionName` for the far side of the relationship. */
  deleteByNodeId?: Maybe<PermissionNameNodeIdDelete>;
  /** The primary key(s) and patch data for `permissionName` for the far side of the relationship. */
  updateById?: Maybe<PermissionNameOnPermissionJoinForPermissionJoinPermissionNameIdFkeyUsingPermissionNamePkeyUpdate>;
  /** The primary key(s) and patch data for `permissionName` for the far side of the relationship. */
  updateByNodeId?: Maybe<PermissionJoinOnPermissionJoinForPermissionJoinPermissionNameIdFkeyNodeIdUpdate>;
  /** A `PermissionNameInput` object that will be created and connected to this object. */
  create?: Maybe<PermissionJoinPermissionNameIdFkeyPermissionNameCreateInput>;
};

/** The fields on `permissionName` to look up the row to update. */
export type PermissionNameOnPermissionJoinForPermissionJoinPermissionNameIdFkeyUsingPermissionNamePkeyUpdate = {
  /** An object where the defined keys will be set on the `permissionName` being updated. */
  patch: UpdatePermissionNameOnPermissionJoinForPermissionJoinPermissionNameIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `permissionName` being updated. */
export type UpdatePermissionNameOnPermissionJoinForPermissionJoinPermissionNameIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  permissionPolicyToPermissionPolicyId?: Maybe<PermissionNamePermissionPolicyIdFkeyInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinPermissionNameIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionPermissionNameIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templatePermission` in the `PermissionNameInput` mutation. */
export type TemplatePermissionPermissionNameIdFkeyInverseInput = {
  /** Flag indicating whether all other `templatePermission` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplatePermissionTemplatePermissionPkeyConnect>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplatePermissionNodeIdConnect>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplatePermissionTemplatePermissionPkeyDelete>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplatePermissionNodeIdDelete>>;
  /** The primary key(s) and patch data for `templatePermission` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplatePermissionOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyUsingTemplatePermissionPkeyUpdate>>;
  /** The primary key(s) and patch data for `templatePermission` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<PermissionNameOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyNodeIdUpdate>>;
  /** A `TemplatePermissionInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplatePermissionPermissionNameIdFkeyTemplatePermissionCreateInput>>;
};

/** The fields on `templatePermission` to look up the row to update. */
export type TemplatePermissionOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyUsingTemplatePermissionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templatePermission` being updated. */
  patch: UpdateTemplatePermissionOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templatePermission` being updated. */
export type UpdateTemplatePermissionOnTemplatePermissionForTemplatePermissionPermissionNameIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
  permissionNameToPermissionNameId?: Maybe<TemplatePermissionPermissionNameIdFkeyInput>;
  templateToTemplateId?: Maybe<TemplatePermissionTemplateIdFkeyInput>;
  templateSectionToTemplateSectionId?: Maybe<TemplatePermissionTemplateSectionIdFkeyInput>;
};

/** Input for the nested mutation of `template` in the `TemplatePermissionInput` mutation. */
export type TemplatePermissionTemplateIdFkeyInput = {
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectById?: Maybe<TemplateTemplatePkeyConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateNodeIdConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteById?: Maybe<TemplateTemplatePkeyDelete>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateNodeIdDelete>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateById?: Maybe<TemplateOnTemplatePermissionForTemplatePermissionTemplateIdFkeyUsingTemplatePkeyUpdate>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateIdFkeyNodeIdUpdate>;
  /** A `TemplateInput` object that will be created and connected to this object. */
  create?: Maybe<TemplatePermissionTemplateIdFkeyTemplateCreateInput>;
};

/** The fields on `template` to look up the row to update. */
export type TemplateOnTemplatePermissionForTemplatePermissionTemplateIdFkeyUsingTemplatePkeyUpdate = {
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: UpdateTemplateOnTemplatePermissionForTemplatePermissionTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `template` being updated. */
export type UpdateTemplateOnTemplatePermissionForTemplatePermissionTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `TemplateInput` mutation. */
export type ApplicationTemplateIdFkeyInverseInput = {
  /** Flag indicating whether all other `application` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationApplicationPkeyConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<Array<ApplicationApplicationSerialKeyConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationNodeIdConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationApplicationPkeyDelete>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<Array<ApplicationApplicationSerialKeyDelete>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationNodeIdDelete>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationOnApplicationForApplicationTemplateIdFkeyUsingApplicationPkeyUpdate>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<Array<ApplicationOnApplicationForApplicationTemplateIdFkeyUsingApplicationSerialKeyUpdate>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateOnApplicationForApplicationTemplateIdFkeyNodeIdUpdate>>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationTemplateIdFkeyApplicationCreateInput>>;
};

/** The fields on `application` to look up the row to connect. */
export type ApplicationApplicationPkeyConnect = {
  id: Scalars['Int'];
};

/** The fields on `application` to look up the row to connect. */
export type ApplicationApplicationSerialKeyConnect = {
  serial: Scalars['String'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ApplicationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `application` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `application` to look up the row to delete. */
export type ApplicationApplicationPkeyDelete = {
  id: Scalars['Int'];
};

/** The fields on `application` to look up the row to delete. */
export type ApplicationApplicationSerialKeyDelete = {
  serial: Scalars['String'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ApplicationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `application` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnApplicationForApplicationTemplateIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnApplicationForApplicationTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnApplicationForApplicationTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `template` in the `ApplicationInput` mutation. */
export type ApplicationTemplateIdFkeyInput = {
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectById?: Maybe<TemplateTemplatePkeyConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateNodeIdConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteById?: Maybe<TemplateTemplatePkeyDelete>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateNodeIdDelete>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateById?: Maybe<TemplateOnApplicationForApplicationTemplateIdFkeyUsingTemplatePkeyUpdate>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationOnApplicationForApplicationTemplateIdFkeyNodeIdUpdate>;
  /** A `TemplateInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationTemplateIdFkeyTemplateCreateInput>;
};

/** The fields on `template` to look up the row to update. */
export type TemplateOnApplicationForApplicationTemplateIdFkeyUsingTemplatePkeyUpdate = {
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: UpdateTemplateOnApplicationForApplicationTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `template` being updated. */
export type UpdateTemplateOnApplicationForApplicationTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** Input for the nested mutation of `actionQueue` in the `TemplateInput` mutation. */
export type ActionQueueTemplateIdFkeyInverseInput = {
  /** Flag indicating whether all other `actionQueue` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  connectById?: Maybe<Array<ActionQueueActionQueuePkeyConnect>>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ActionQueueNodeIdConnect>>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  deleteById?: Maybe<Array<ActionQueueActionQueuePkeyDelete>>;
  /** The primary key(s) for `actionQueue` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ActionQueueNodeIdDelete>>;
  /** The primary key(s) and patch data for `actionQueue` for the far side of the relationship. */
  updateById?: Maybe<Array<ActionQueueOnActionQueueForActionQueueTemplateIdFkeyUsingActionQueuePkeyUpdate>>;
  /** The primary key(s) and patch data for `actionQueue` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateOnActionQueueForActionQueueTemplateIdFkeyNodeIdUpdate>>;
  /** A `ActionQueueInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ActionQueueTemplateIdFkeyActionQueueCreateInput>>;
};

/** The fields on `actionQueue` to look up the row to update. */
export type ActionQueueOnActionQueueForActionQueueTemplateIdFkeyUsingActionQueuePkeyUpdate = {
  /** An object where the defined keys will be set on the `actionQueue` being updated. */
  patch: UpdateActionQueueOnActionQueueForActionQueueTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `actionQueue` being updated. */
export type UpdateActionQueueOnActionQueueForActionQueueTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  triggerEvent?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  applicationData?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  output?: Maybe<Scalars['JSON']>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeCompleted?: Maybe<Scalars['Datetime']>;
  timeScheduled?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
  triggerQueueToTriggerEvent?: Maybe<ActionQueueTriggerEventFkeyInput>;
  templateToTemplateId?: Maybe<ActionQueueTemplateIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type TemplateOnActionQueueForActionQueueTemplateIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `actionQueue` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `actionQueue` being updated. */
  patch: ActionQueuePatch;
};

/** Represents an update to a `ActionQueue`. Fields that are set will be updated. */
export type ActionQueuePatch = {
  id?: Maybe<Scalars['Int']>;
  triggerEvent?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  applicationData?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  output?: Maybe<Scalars['JSON']>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeCompleted?: Maybe<Scalars['Datetime']>;
  timeScheduled?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
  triggerQueueToTriggerEvent?: Maybe<ActionQueueTriggerEventFkeyInput>;
  templateToTemplateId?: Maybe<ActionQueueTemplateIdFkeyInput>;
};

/** The `actionQueue` to be created by this mutation. */
export type ActionQueueTemplateIdFkeyActionQueueCreateInput = {
  id?: Maybe<Scalars['Int']>;
  triggerEvent?: Maybe<Scalars['Int']>;
  sequence?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  applicationData?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  parametersEvaluated?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  output?: Maybe<Scalars['JSON']>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeCompleted?: Maybe<Scalars['Datetime']>;
  timeScheduled?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
  triggerQueueToTriggerEvent?: Maybe<ActionQueueTriggerEventFkeyInput>;
  templateToTemplateId?: Maybe<ActionQueueTemplateIdFkeyInput>;
};

/** Input for the nested mutation of `templateAction` in the `TemplateInput` mutation. */
export type TemplateActionTemplateIdFkeyInverseInput = {
  /** Flag indicating whether all other `templateAction` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templateAction` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplateActionTemplateActionPkeyConnect>>;
  /** The primary key(s) for `templateAction` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplateActionNodeIdConnect>>;
  /** The primary key(s) for `templateAction` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplateActionTemplateActionPkeyDelete>>;
  /** The primary key(s) for `templateAction` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplateActionNodeIdDelete>>;
  /** The primary key(s) and patch data for `templateAction` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplateActionOnTemplateActionForTemplateActionTemplateIdFkeyUsingTemplateActionPkeyUpdate>>;
  /** The primary key(s) and patch data for `templateAction` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateOnTemplateActionForTemplateActionTemplateIdFkeyNodeIdUpdate>>;
  /** A `TemplateActionInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplateActionTemplateIdFkeyTemplateActionCreateInput>>;
};

/** The fields on `templateAction` to look up the row to connect. */
export type TemplateActionTemplateActionPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TemplateActionNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `templateAction` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateAction` to look up the row to delete. */
export type TemplateActionTemplateActionPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TemplateActionNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `templateAction` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateAction` to look up the row to update. */
export type TemplateActionOnTemplateActionForTemplateActionTemplateIdFkeyUsingTemplateActionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateAction` being updated. */
  patch: UpdateTemplateActionOnTemplateActionForTemplateActionTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateAction` being updated. */
export type UpdateTemplateActionOnTemplateActionForTemplateActionTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  trigger?: Maybe<Trigger>;
  sequence?: Maybe<Scalars['Int']>;
  condition?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  templateToTemplateId?: Maybe<TemplateActionTemplateIdFkeyInput>;
};

/** Input for the nested mutation of `template` in the `TemplateActionInput` mutation. */
export type TemplateActionTemplateIdFkeyInput = {
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectById?: Maybe<TemplateTemplatePkeyConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateNodeIdConnect>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteById?: Maybe<TemplateTemplatePkeyDelete>;
  /** The primary key(s) for `template` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateNodeIdDelete>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateById?: Maybe<TemplateOnTemplateActionForTemplateActionTemplateIdFkeyUsingTemplatePkeyUpdate>;
  /** The primary key(s) and patch data for `template` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplateActionOnTemplateActionForTemplateActionTemplateIdFkeyNodeIdUpdate>;
  /** A `TemplateInput` object that will be created and connected to this object. */
  create?: Maybe<TemplateActionTemplateIdFkeyTemplateCreateInput>;
};

/** The fields on `template` to look up the row to update. */
export type TemplateOnTemplateActionForTemplateActionTemplateIdFkeyUsingTemplatePkeyUpdate = {
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: UpdateTemplateOnTemplateActionForTemplateActionTemplateIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `template` being updated. */
export type UpdateTemplateOnTemplateActionForTemplateActionTemplateIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type TemplateActionOnTemplateActionForTemplateActionTemplateIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `template` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: TemplatePatch;
};

/** Represents an update to a `Template`. Fields that are set will be updated. */
export type TemplatePatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** The `template` to be created by this mutation. */
export type TemplateActionTemplateIdFkeyTemplateCreateInput = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type TemplateOnTemplateActionForTemplateActionTemplateIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `templateAction` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `templateAction` being updated. */
  patch: TemplateActionPatch;
};

/** Represents an update to a `TemplateAction`. Fields that are set will be updated. */
export type TemplateActionPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  trigger?: Maybe<Trigger>;
  sequence?: Maybe<Scalars['Int']>;
  condition?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  templateToTemplateId?: Maybe<TemplateActionTemplateIdFkeyInput>;
};

/** The `templateAction` to be created by this mutation. */
export type TemplateActionTemplateIdFkeyTemplateActionCreateInput = {
  id?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  trigger?: Maybe<Trigger>;
  sequence?: Maybe<Scalars['Int']>;
  condition?: Maybe<Scalars['JSON']>;
  parameterQueries?: Maybe<Scalars['JSON']>;
  templateToTemplateId?: Maybe<TemplateActionTemplateIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ApplicationOnApplicationForApplicationTemplateIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `template` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `template` being updated. */
  patch: TemplatePatch;
};

/** The `template` to be created by this mutation. */
export type ApplicationTemplateIdFkeyTemplateCreateInput = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  code: Scalars['String'];
  isLinear?: Maybe<Scalars['Boolean']>;
  startMessage?: Maybe<Scalars['JSON']>;
  status?: Maybe<TemplateStatus>;
  submissionMessage?: Maybe<Scalars['JSON']>;
  versionTimestamp?: Maybe<Scalars['Datetime']>;
  templateStagesUsingId?: Maybe<TemplateStageTemplateIdFkeyInverseInput>;
  templateSectionsUsingId?: Maybe<TemplateSectionTemplateIdFkeyInverseInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationTemplateIdFkeyInverseInput>;
  actionQueuesUsingId?: Maybe<ActionQueueTemplateIdFkeyInverseInput>;
  templateActionsUsingId?: Maybe<TemplateActionTemplateIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `ApplicationInput` mutation. */
export type ApplicationUserIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnApplicationForApplicationUserIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnApplicationForApplicationUserIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationOnApplicationForApplicationUserIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationUserIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnApplicationForApplicationUserIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnApplicationForApplicationUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnApplicationForApplicationUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `UserInput` mutation. */
export type ApplicationUserIdFkeyInverseInput = {
  /** Flag indicating whether all other `application` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationApplicationPkeyConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<Array<ApplicationApplicationSerialKeyConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationNodeIdConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationApplicationPkeyDelete>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<Array<ApplicationApplicationSerialKeyDelete>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationNodeIdDelete>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationOnApplicationForApplicationUserIdFkeyUsingApplicationPkeyUpdate>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<Array<ApplicationOnApplicationForApplicationUserIdFkeyUsingApplicationSerialKeyUpdate>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnApplicationForApplicationUserIdFkeyNodeIdUpdate>>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationUserIdFkeyApplicationCreateInput>>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnApplicationForApplicationUserIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnApplicationForApplicationUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnApplicationForApplicationUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `organisation` in the `ApplicationInput` mutation. */
export type ApplicationOrgIdFkeyInput = {
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  connectById?: Maybe<OrganisationOrganisationPkeyConnect>;
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  connectByNodeId?: Maybe<OrganisationNodeIdConnect>;
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  deleteById?: Maybe<OrganisationOrganisationPkeyDelete>;
  /** The primary key(s) for `organisation` for the far side of the relationship. */
  deleteByNodeId?: Maybe<OrganisationNodeIdDelete>;
  /** The primary key(s) and patch data for `organisation` for the far side of the relationship. */
  updateById?: Maybe<OrganisationOnApplicationForApplicationOrgIdFkeyUsingOrganisationPkeyUpdate>;
  /** The primary key(s) and patch data for `organisation` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationOnApplicationForApplicationOrgIdFkeyNodeIdUpdate>;
  /** A `OrganisationInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationOrgIdFkeyOrganisationCreateInput>;
};

/** The fields on `organisation` to look up the row to update. */
export type OrganisationOnApplicationForApplicationOrgIdFkeyUsingOrganisationPkeyUpdate = {
  /** An object where the defined keys will be set on the `organisation` being updated. */
  patch: UpdateOrganisationOnApplicationForApplicationOrgIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `organisation` being updated. */
export type UpdateOrganisationOnApplicationForApplicationOrgIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationOrganisationIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationOrgIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `OrganisationInput` mutation. */
export type ApplicationOrgIdFkeyInverseInput = {
  /** Flag indicating whether all other `application` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationApplicationPkeyConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<Array<ApplicationApplicationSerialKeyConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationNodeIdConnect>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationApplicationPkeyDelete>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<Array<ApplicationApplicationSerialKeyDelete>>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationNodeIdDelete>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationOnApplicationForApplicationOrgIdFkeyUsingApplicationPkeyUpdate>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<Array<ApplicationOnApplicationForApplicationOrgIdFkeyUsingApplicationSerialKeyUpdate>>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<OrganisationOnApplicationForApplicationOrgIdFkeyNodeIdUpdate>>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationOrgIdFkeyApplicationCreateInput>>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnApplicationForApplicationOrgIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnApplicationForApplicationOrgIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnApplicationForApplicationOrgIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `applicationSection` in the `ApplicationInput` mutation. */
export type ApplicationSectionApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `applicationSection` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `applicationSection` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationSectionApplicationSectionPkeyConnect>>;
  /** The primary key(s) for `applicationSection` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationSectionNodeIdConnect>>;
  /** The primary key(s) for `applicationSection` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationSectionApplicationSectionPkeyDelete>>;
  /** The primary key(s) for `applicationSection` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationSectionNodeIdDelete>>;
  /** The primary key(s) and patch data for `applicationSection` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationSectionOnApplicationSectionForApplicationSectionApplicationIdFkeyUsingApplicationSectionPkeyUpdate>>;
  /** The primary key(s) and patch data for `applicationSection` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnApplicationSectionForApplicationSectionApplicationIdFkeyNodeIdUpdate>>;
  /** A `ApplicationSectionInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationSectionApplicationIdFkeyApplicationSectionCreateInput>>;
};

/** The fields on `applicationSection` to look up the row to connect. */
export type ApplicationSectionApplicationSectionPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ApplicationSectionNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `applicationSection` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `applicationSection` to look up the row to delete. */
export type ApplicationSectionApplicationSectionPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ApplicationSectionNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `applicationSection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `applicationSection` to look up the row to update. */
export type ApplicationSectionOnApplicationSectionForApplicationSectionApplicationIdFkeyUsingApplicationSectionPkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationSection` being updated. */
  patch: UpdateApplicationSectionOnApplicationSectionForApplicationSectionApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationSection` being updated. */
export type UpdateApplicationSectionOnApplicationSectionForApplicationSectionApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  applicationToApplicationId?: Maybe<ApplicationSectionApplicationIdFkeyInput>;
  templateSectionToTemplateSectionId?: Maybe<ApplicationSectionTemplateSectionIdFkeyInput>;
};

/** Input for the nested mutation of `application` in the `ApplicationSectionInput` mutation. */
export type ApplicationSectionApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnApplicationSectionForApplicationSectionApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnApplicationSectionForApplicationSectionApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationSectionOnApplicationSectionForApplicationSectionApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationSectionApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnApplicationSectionForApplicationSectionApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnApplicationSectionForApplicationSectionApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnApplicationSectionForApplicationSectionApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `applicationStageHistory` in the `ApplicationInput` mutation. */
export type ApplicationStageHistoryApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `applicationStageHistory` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationStageHistoryApplicationStageHistoryPkeyConnect>>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationStageHistoryNodeIdConnect>>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationStageHistoryApplicationStageHistoryPkeyDelete>>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationStageHistoryNodeIdDelete>>;
  /** The primary key(s) and patch data for `applicationStageHistory` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyUsingApplicationStageHistoryPkeyUpdate>>;
  /** The primary key(s) and patch data for `applicationStageHistory` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyNodeIdUpdate>>;
  /** A `ApplicationStageHistoryInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationStageHistoryApplicationIdFkeyApplicationStageHistoryCreateInput>>;
};

/** The fields on `applicationStageHistory` to look up the row to connect. */
export type ApplicationStageHistoryApplicationStageHistoryPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ApplicationStageHistoryNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `applicationStageHistory` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `applicationStageHistory` to look up the row to delete. */
export type ApplicationStageHistoryApplicationStageHistoryPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ApplicationStageHistoryNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `applicationStageHistory` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `applicationStageHistory` to look up the row to update. */
export type ApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyUsingApplicationStageHistoryPkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationStageHistory` being updated. */
  patch: UpdateApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationStageHistory` being updated. */
export type UpdateApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  applicationToApplicationId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInput>;
  templateStageToStageId?: Maybe<ApplicationStageHistoryStageIdFkeyInput>;
  applicationStatusHistoriesUsingId?: Maybe<ApplicationStatusHistoryApplicationStageHistoryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `ApplicationStageHistoryInput` mutation. */
export type ApplicationStageHistoryApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationStageHistoryApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnApplicationStageHistoryForApplicationStageHistoryApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `applicationResponse` in the `ApplicationInput` mutation. */
export type ApplicationResponseApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `applicationResponse` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationResponseApplicationResponsePkeyConnect>>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationResponseNodeIdConnect>>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationResponseApplicationResponsePkeyDelete>>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationResponseNodeIdDelete>>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationResponseOnApplicationResponseForApplicationResponseApplicationIdFkeyUsingApplicationResponsePkeyUpdate>>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnApplicationResponseForApplicationResponseApplicationIdFkeyNodeIdUpdate>>;
  /** A `ApplicationResponseInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationResponseApplicationIdFkeyApplicationResponseCreateInput>>;
};

/** The fields on `applicationResponse` to look up the row to connect. */
export type ApplicationResponseApplicationResponsePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ApplicationResponseNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `applicationResponse` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `applicationResponse` to look up the row to delete. */
export type ApplicationResponseApplicationResponsePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ApplicationResponseNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `applicationResponse` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `applicationResponse` to look up the row to update. */
export type ApplicationResponseOnApplicationResponseForApplicationResponseApplicationIdFkeyUsingApplicationResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationResponse` being updated. */
  patch: UpdateApplicationResponseOnApplicationResponseForApplicationResponseApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationResponse` being updated. */
export type UpdateApplicationResponseOnApplicationResponseForApplicationResponseApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateElement` in the `ApplicationResponseInput` mutation. */
export type ApplicationResponseTemplateElementIdFkeyInput = {
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  connectById?: Maybe<TemplateElementTemplateElementPkeyConnect>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateElementNodeIdConnect>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  deleteById?: Maybe<TemplateElementTemplateElementPkeyDelete>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateElementNodeIdDelete>;
  /** The primary key(s) and patch data for `templateElement` for the far side of the relationship. */
  updateById?: Maybe<TemplateElementOnApplicationResponseForApplicationResponseTemplateElementIdFkeyUsingTemplateElementPkeyUpdate>;
  /** The primary key(s) and patch data for `templateElement` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationResponseOnApplicationResponseForApplicationResponseTemplateElementIdFkeyNodeIdUpdate>;
  /** A `TemplateElementInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationResponseTemplateElementIdFkeyTemplateElementCreateInput>;
};

/** The fields on `templateElement` to look up the row to connect. */
export type TemplateElementTemplateElementPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type TemplateElementNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `templateElement` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateElement` to look up the row to delete. */
export type TemplateElementTemplateElementPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type TemplateElementNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `templateElement` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `templateElement` to look up the row to update. */
export type TemplateElementOnApplicationResponseForApplicationResponseTemplateElementIdFkeyUsingTemplateElementPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateElement` being updated. */
  patch: UpdateTemplateElementOnApplicationResponseForApplicationResponseTemplateElementIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateElement` being updated. */
export type UpdateTemplateElementOnApplicationResponseForApplicationResponseTemplateElementIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  elementTypePluginCode?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  isRequired?: Maybe<Scalars['JSON']>;
  isEditable?: Maybe<Scalars['JSON']>;
  validation?: Maybe<Scalars['JSON']>;
  validationMessage?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  templateSectionToSectionId?: Maybe<TemplateElementSectionIdFkeyInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseTemplateElementIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateSection` in the `TemplateElementInput` mutation. */
export type TemplateElementSectionIdFkeyInput = {
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  connectById?: Maybe<TemplateSectionTemplateSectionPkeyConnect>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateSectionNodeIdConnect>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  deleteById?: Maybe<TemplateSectionTemplateSectionPkeyDelete>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateSectionNodeIdDelete>;
  /** The primary key(s) and patch data for `templateSection` for the far side of the relationship. */
  updateById?: Maybe<TemplateSectionOnTemplateElementForTemplateElementSectionIdFkeyUsingTemplateSectionPkeyUpdate>;
  /** The primary key(s) and patch data for `templateSection` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplateElementOnTemplateElementForTemplateElementSectionIdFkeyNodeIdUpdate>;
  /** A `TemplateSectionInput` object that will be created and connected to this object. */
  create?: Maybe<TemplateElementSectionIdFkeyTemplateSectionCreateInput>;
};

/** The fields on `templateSection` to look up the row to update. */
export type TemplateSectionOnTemplateElementForTemplateElementSectionIdFkeyUsingTemplateSectionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateSection` being updated. */
  patch: UpdateTemplateSectionOnTemplateElementForTemplateElementSectionIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateSection` being updated. */
export type UpdateTemplateSectionOnTemplateElementForTemplateElementSectionIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  templateToTemplateId?: Maybe<TemplateSectionTemplateIdFkeyInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateSectionIdFkeyInverseInput>;
  templateElementsUsingId?: Maybe<TemplateElementSectionIdFkeyInverseInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionTemplateSectionIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templatePermission` in the `TemplateSectionInput` mutation. */
export type TemplatePermissionTemplateSectionIdFkeyInverseInput = {
  /** Flag indicating whether all other `templatePermission` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplatePermissionTemplatePermissionPkeyConnect>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplatePermissionNodeIdConnect>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplatePermissionTemplatePermissionPkeyDelete>>;
  /** The primary key(s) for `templatePermission` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplatePermissionNodeIdDelete>>;
  /** The primary key(s) and patch data for `templatePermission` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyUsingTemplatePermissionPkeyUpdate>>;
  /** The primary key(s) and patch data for `templatePermission` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateSectionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyNodeIdUpdate>>;
  /** A `TemplatePermissionInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplatePermissionTemplateSectionIdFkeyTemplatePermissionCreateInput>>;
};

/** The fields on `templatePermission` to look up the row to update. */
export type TemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyUsingTemplatePermissionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templatePermission` being updated. */
  patch: UpdateTemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templatePermission` being updated. */
export type UpdateTemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
  permissionNameToPermissionNameId?: Maybe<TemplatePermissionPermissionNameIdFkeyInput>;
  templateToTemplateId?: Maybe<TemplatePermissionTemplateIdFkeyInput>;
  templateSectionToTemplateSectionId?: Maybe<TemplatePermissionTemplateSectionIdFkeyInput>;
};

/** Input for the nested mutation of `templateSection` in the `TemplatePermissionInput` mutation. */
export type TemplatePermissionTemplateSectionIdFkeyInput = {
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  connectById?: Maybe<TemplateSectionTemplateSectionPkeyConnect>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateSectionNodeIdConnect>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  deleteById?: Maybe<TemplateSectionTemplateSectionPkeyDelete>;
  /** The primary key(s) for `templateSection` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateSectionNodeIdDelete>;
  /** The primary key(s) and patch data for `templateSection` for the far side of the relationship. */
  updateById?: Maybe<TemplateSectionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyUsingTemplateSectionPkeyUpdate>;
  /** The primary key(s) and patch data for `templateSection` for the far side of the relationship. */
  updateByNodeId?: Maybe<TemplatePermissionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyNodeIdUpdate>;
  /** A `TemplateSectionInput` object that will be created and connected to this object. */
  create?: Maybe<TemplatePermissionTemplateSectionIdFkeyTemplateSectionCreateInput>;
};

/** The fields on `templateSection` to look up the row to update. */
export type TemplateSectionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyUsingTemplateSectionPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateSection` being updated. */
  patch: UpdateTemplateSectionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateSection` being updated. */
export type UpdateTemplateSectionOnTemplatePermissionForTemplatePermissionTemplateSectionIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  templateToTemplateId?: Maybe<TemplateSectionTemplateIdFkeyInput>;
  templatePermissionsUsingId?: Maybe<TemplatePermissionTemplateSectionIdFkeyInverseInput>;
  templateElementsUsingId?: Maybe<TemplateElementSectionIdFkeyInverseInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionTemplateSectionIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateElement` in the `TemplateSectionInput` mutation. */
export type TemplateElementSectionIdFkeyInverseInput = {
  /** Flag indicating whether all other `templateElement` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  connectById?: Maybe<Array<TemplateElementTemplateElementPkeyConnect>>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<TemplateElementNodeIdConnect>>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  deleteById?: Maybe<Array<TemplateElementTemplateElementPkeyDelete>>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<TemplateElementNodeIdDelete>>;
  /** The primary key(s) and patch data for `templateElement` for the far side of the relationship. */
  updateById?: Maybe<Array<TemplateElementOnTemplateElementForTemplateElementSectionIdFkeyUsingTemplateElementPkeyUpdate>>;
  /** The primary key(s) and patch data for `templateElement` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateSectionOnTemplateElementForTemplateElementSectionIdFkeyNodeIdUpdate>>;
  /** A `TemplateElementInput` object that will be created and connected to this object. */
  create?: Maybe<Array<TemplateElementSectionIdFkeyTemplateElementCreateInput>>;
};

/** The fields on `templateElement` to look up the row to update. */
export type TemplateElementOnTemplateElementForTemplateElementSectionIdFkeyUsingTemplateElementPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateElement` being updated. */
  patch: UpdateTemplateElementOnTemplateElementForTemplateElementSectionIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateElement` being updated. */
export type UpdateTemplateElementOnTemplateElementForTemplateElementSectionIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  elementTypePluginCode?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  isRequired?: Maybe<Scalars['JSON']>;
  isEditable?: Maybe<Scalars['JSON']>;
  validation?: Maybe<Scalars['JSON']>;
  validationMessage?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  templateSectionToSectionId?: Maybe<TemplateElementSectionIdFkeyInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseTemplateElementIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInverseInput>;
};

/** Input for the nested mutation of `applicationResponse` in the `TemplateElementInput` mutation. */
export type ApplicationResponseTemplateElementIdFkeyInverseInput = {
  /** Flag indicating whether all other `applicationResponse` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationResponseApplicationResponsePkeyConnect>>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationResponseNodeIdConnect>>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationResponseApplicationResponsePkeyDelete>>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationResponseNodeIdDelete>>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationResponseOnApplicationResponseForApplicationResponseTemplateElementIdFkeyUsingApplicationResponsePkeyUpdate>>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateElementOnApplicationResponseForApplicationResponseTemplateElementIdFkeyNodeIdUpdate>>;
  /** A `ApplicationResponseInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationResponseTemplateElementIdFkeyApplicationResponseCreateInput>>;
};

/** The fields on `applicationResponse` to look up the row to update. */
export type ApplicationResponseOnApplicationResponseForApplicationResponseTemplateElementIdFkeyUsingApplicationResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationResponse` being updated. */
  patch: UpdateApplicationResponseOnApplicationResponseForApplicationResponseTemplateElementIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationResponse` being updated. */
export type UpdateApplicationResponseOnApplicationResponseForApplicationResponseTemplateElementIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `ApplicationResponseInput` mutation. */
export type ApplicationResponseApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnApplicationResponseForApplicationResponseApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnApplicationResponseForApplicationResponseApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationResponseOnApplicationResponseForApplicationResponseApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationResponseApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnApplicationResponseForApplicationResponseApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnApplicationResponseForApplicationResponseApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnApplicationResponseForApplicationResponseApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewAssignment` in the `ApplicationInput` mutation. */
export type ReviewAssignmentApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewAssignment` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewAssignmentNodeIdConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyDelete>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewAssignmentNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewAssignmentOnReviewAssignmentForReviewAssignmentApplicationIdFkeyUsingReviewAssignmentPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyNodeIdUpdate>>;
  /** A `ReviewAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewAssignmentApplicationIdFkeyReviewAssignmentCreateInput>>;
};

/** The fields on `reviewAssignment` to look up the row to connect. */
export type ReviewAssignmentReviewAssignmentPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ReviewAssignmentNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `reviewAssignment` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewAssignment` to look up the row to delete. */
export type ReviewAssignmentReviewAssignmentPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ReviewAssignmentNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `reviewAssignment` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewAssignment` to look up the row to update. */
export type ReviewAssignmentOnReviewAssignmentForReviewAssignmentApplicationIdFkeyUsingReviewAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewAssignment` being updated. */
export type UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `ReviewAssignmentInput` mutation. */
export type ReviewAssignmentAssignerIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnReviewAssignmentForReviewAssignmentAssignerIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnReviewAssignmentForReviewAssignmentAssignerIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewAssignmentOnReviewAssignmentForReviewAssignmentAssignerIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewAssignmentAssignerIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnReviewAssignmentForReviewAssignmentAssignerIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnReviewAssignmentForReviewAssignmentAssignerIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnReviewAssignmentForReviewAssignmentAssignerIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewAssignment` in the `UserInput` mutation. */
export type ReviewAssignmentAssignerIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewAssignment` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewAssignmentNodeIdConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyDelete>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewAssignmentNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewAssignmentOnReviewAssignmentForReviewAssignmentAssignerIdFkeyUsingReviewAssignmentPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnReviewAssignmentForReviewAssignmentAssignerIdFkeyNodeIdUpdate>>;
  /** A `ReviewAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewAssignmentAssignerIdFkeyReviewAssignmentCreateInput>>;
};

/** The fields on `reviewAssignment` to look up the row to update. */
export type ReviewAssignmentOnReviewAssignmentForReviewAssignmentAssignerIdFkeyUsingReviewAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentAssignerIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewAssignment` being updated. */
export type UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentAssignerIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `ReviewAssignmentInput` mutation. */
export type ReviewAssignmentReviewerIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnReviewAssignmentForReviewAssignmentReviewerIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnReviewAssignmentForReviewAssignmentReviewerIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewAssignmentOnReviewAssignmentForReviewAssignmentReviewerIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewAssignmentReviewerIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnReviewAssignmentForReviewAssignmentReviewerIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnReviewAssignmentForReviewAssignmentReviewerIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnReviewAssignmentForReviewAssignmentReviewerIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewAssignment` in the `UserInput` mutation. */
export type ReviewAssignmentReviewerIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewAssignment` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewAssignmentNodeIdConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyDelete>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewAssignmentNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewAssignmentOnReviewAssignmentForReviewAssignmentReviewerIdFkeyUsingReviewAssignmentPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnReviewAssignmentForReviewAssignmentReviewerIdFkeyNodeIdUpdate>>;
  /** A `ReviewAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewAssignmentReviewerIdFkeyReviewAssignmentCreateInput>>;
};

/** The fields on `reviewAssignment` to look up the row to update. */
export type ReviewAssignmentOnReviewAssignmentForReviewAssignmentReviewerIdFkeyUsingReviewAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentReviewerIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewAssignment` being updated. */
export type UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentReviewerIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateStage` in the `ReviewAssignmentInput` mutation. */
export type ReviewAssignmentStageIdFkeyInput = {
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  connectById?: Maybe<TemplateStageTemplateStagePkeyConnect>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateStageNodeIdConnect>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  deleteById?: Maybe<TemplateStageTemplateStagePkeyDelete>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateStageNodeIdDelete>;
  /** The primary key(s) and patch data for `templateStage` for the far side of the relationship. */
  updateById?: Maybe<TemplateStageOnReviewAssignmentForReviewAssignmentStageIdFkeyUsingTemplateStagePkeyUpdate>;
  /** The primary key(s) and patch data for `templateStage` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewAssignmentOnReviewAssignmentForReviewAssignmentStageIdFkeyNodeIdUpdate>;
  /** A `TemplateStageInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewAssignmentStageIdFkeyTemplateStageCreateInput>;
};

/** The fields on `templateStage` to look up the row to update. */
export type TemplateStageOnReviewAssignmentForReviewAssignmentStageIdFkeyUsingTemplateStagePkeyUpdate = {
  /** An object where the defined keys will be set on the `templateStage` being updated. */
  patch: UpdateTemplateStageOnReviewAssignmentForReviewAssignmentStageIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateStage` being updated. */
export type UpdateTemplateStageOnReviewAssignmentForReviewAssignmentStageIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  templateId?: Maybe<Scalars['Int']>;
  templateToTemplateId?: Maybe<TemplateStageTemplateIdFkeyInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryStageIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentStageIdFkeyInverseInput>;
};

/** Input for the nested mutation of `applicationStageHistory` in the `TemplateStageInput` mutation. */
export type ApplicationStageHistoryStageIdFkeyInverseInput = {
  /** Flag indicating whether all other `applicationStageHistory` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  connectById?: Maybe<Array<ApplicationStageHistoryApplicationStageHistoryPkeyConnect>>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ApplicationStageHistoryNodeIdConnect>>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  deleteById?: Maybe<Array<ApplicationStageHistoryApplicationStageHistoryPkeyDelete>>;
  /** The primary key(s) for `applicationStageHistory` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ApplicationStageHistoryNodeIdDelete>>;
  /** The primary key(s) and patch data for `applicationStageHistory` for the far side of the relationship. */
  updateById?: Maybe<Array<ApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyUsingApplicationStageHistoryPkeyUpdate>>;
  /** The primary key(s) and patch data for `applicationStageHistory` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateStageOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyNodeIdUpdate>>;
  /** A `ApplicationStageHistoryInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ApplicationStageHistoryStageIdFkeyApplicationStageHistoryCreateInput>>;
};

/** The fields on `applicationStageHistory` to look up the row to update. */
export type ApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyUsingApplicationStageHistoryPkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationStageHistory` being updated. */
  patch: UpdateApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationStageHistory` being updated. */
export type UpdateApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  applicationToApplicationId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInput>;
  templateStageToStageId?: Maybe<ApplicationStageHistoryStageIdFkeyInput>;
  applicationStatusHistoriesUsingId?: Maybe<ApplicationStatusHistoryApplicationStageHistoryIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateStage` in the `ApplicationStageHistoryInput` mutation. */
export type ApplicationStageHistoryStageIdFkeyInput = {
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  connectById?: Maybe<TemplateStageTemplateStagePkeyConnect>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateStageNodeIdConnect>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  deleteById?: Maybe<TemplateStageTemplateStagePkeyDelete>;
  /** The primary key(s) for `templateStage` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateStageNodeIdDelete>;
  /** The primary key(s) and patch data for `templateStage` for the far side of the relationship. */
  updateById?: Maybe<TemplateStageOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyUsingTemplateStagePkeyUpdate>;
  /** The primary key(s) and patch data for `templateStage` for the far side of the relationship. */
  updateByNodeId?: Maybe<ApplicationStageHistoryOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyNodeIdUpdate>;
  /** A `TemplateStageInput` object that will be created and connected to this object. */
  create?: Maybe<ApplicationStageHistoryStageIdFkeyTemplateStageCreateInput>;
};

/** The fields on `templateStage` to look up the row to update. */
export type TemplateStageOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyUsingTemplateStagePkeyUpdate = {
  /** An object where the defined keys will be set on the `templateStage` being updated. */
  patch: UpdateTemplateStageOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateStage` being updated. */
export type UpdateTemplateStageOnApplicationStageHistoryForApplicationStageHistoryStageIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  templateId?: Maybe<Scalars['Int']>;
  templateToTemplateId?: Maybe<TemplateStageTemplateIdFkeyInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryStageIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentStageIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewAssignment` in the `TemplateStageInput` mutation. */
export type ReviewAssignmentStageIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewAssignment` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewAssignmentNodeIdConnect>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewAssignmentReviewAssignmentPkeyDelete>>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewAssignmentNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewAssignmentOnReviewAssignmentForReviewAssignmentStageIdFkeyUsingReviewAssignmentPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateStageOnReviewAssignmentForReviewAssignmentStageIdFkeyNodeIdUpdate>>;
  /** A `ReviewAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewAssignmentStageIdFkeyReviewAssignmentCreateInput>>;
};

/** The fields on `reviewAssignment` to look up the row to update. */
export type ReviewAssignmentOnReviewAssignmentForReviewAssignmentStageIdFkeyUsingReviewAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentStageIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewAssignment` being updated. */
export type UpdateReviewAssignmentOnReviewAssignmentForReviewAssignmentStageIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `ReviewAssignmentInput` mutation. */
export type ReviewAssignmentApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewAssignmentOnReviewAssignmentForReviewAssignmentApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewAssignmentApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `review` in the `ApplicationInput` mutation. */
export type ReviewApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `review` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewReviewPkeyConnect>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewNodeIdConnect>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewReviewPkeyDelete>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewNodeIdDelete>>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewOnReviewForReviewApplicationIdFkeyUsingReviewPkeyUpdate>>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnReviewForReviewApplicationIdFkeyNodeIdUpdate>>;
  /** A `ReviewInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewApplicationIdFkeyReviewCreateInput>>;
};

/** The fields on `review` to look up the row to connect. */
export type ReviewReviewPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ReviewNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `review` to look up the row to delete. */
export type ReviewReviewPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ReviewNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `review` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `review` to look up the row to update. */
export type ReviewOnReviewForReviewApplicationIdFkeyUsingReviewPkeyUpdate = {
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: UpdateReviewOnReviewForReviewApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `review` being updated. */
export type UpdateReviewOnReviewForReviewApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewAssignment` in the `ReviewInput` mutation. */
export type ReviewReviewAssignmentIdFkeyInput = {
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectById?: Maybe<ReviewAssignmentReviewAssignmentPkeyConnect>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<ReviewAssignmentNodeIdConnect>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteById?: Maybe<ReviewAssignmentReviewAssignmentPkeyDelete>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ReviewAssignmentNodeIdDelete>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateById?: Maybe<ReviewAssignmentOnReviewForReviewReviewAssignmentIdFkeyUsingReviewAssignmentPkeyUpdate>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewOnReviewForReviewReviewAssignmentIdFkeyNodeIdUpdate>;
  /** A `ReviewAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewReviewAssignmentIdFkeyReviewAssignmentCreateInput>;
};

/** The fields on `reviewAssignment` to look up the row to update. */
export type ReviewAssignmentOnReviewForReviewReviewAssignmentIdFkeyUsingReviewAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: UpdateReviewAssignmentOnReviewForReviewReviewAssignmentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewAssignment` being updated. */
export type UpdateReviewAssignmentOnReviewForReviewReviewAssignmentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `review` in the `ReviewAssignmentInput` mutation. */
export type ReviewReviewAssignmentIdFkeyInverseInput = {
  /** Flag indicating whether all other `review` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewReviewPkeyConnect>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewNodeIdConnect>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewReviewPkeyDelete>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewNodeIdDelete>>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewOnReviewForReviewReviewAssignmentIdFkeyUsingReviewPkeyUpdate>>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ReviewAssignmentOnReviewForReviewReviewAssignmentIdFkeyNodeIdUpdate>>;
  /** A `ReviewInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewReviewAssignmentIdFkeyReviewCreateInput>>;
};

/** The fields on `review` to look up the row to update. */
export type ReviewOnReviewForReviewReviewAssignmentIdFkeyUsingReviewPkeyUpdate = {
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: UpdateReviewOnReviewForReviewReviewAssignmentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `review` being updated. */
export type UpdateReviewOnReviewForReviewReviewAssignmentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `ReviewInput` mutation. */
export type ReviewApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnReviewForReviewApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnReviewForReviewApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewOnReviewForReviewApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnReviewForReviewApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnReviewForReviewApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnReviewForReviewApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `file` in the `ApplicationInput` mutation. */
export type FileApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `file` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectById?: Maybe<Array<FileFilePkeyConnect>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<FileNodeIdConnect>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteById?: Maybe<Array<FileFilePkeyDelete>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<FileNodeIdDelete>>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateById?: Maybe<Array<FileOnFileForFileApplicationIdFkeyUsingFilePkeyUpdate>>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnFileForFileApplicationIdFkeyNodeIdUpdate>>;
  /** A `FileInput` object that will be created and connected to this object. */
  create?: Maybe<Array<FileApplicationIdFkeyFileCreateInput>>;
};

/** The fields on `file` to look up the row to connect. */
export type FileFilePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type FileNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `file` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `file` to look up the row to delete. */
export type FileFilePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type FileNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `file` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `file` to look up the row to update. */
export type FileOnFileForFileApplicationIdFkeyUsingFilePkeyUpdate = {
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: UpdateFileOnFileForFileApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `file` being updated. */
export type UpdateFileOnFileForFileApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `FileInput` mutation. */
export type FileUserIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnFileForFileUserIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnFileForFileUserIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<FileOnFileForFileUserIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<FileUserIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnFileForFileUserIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnFileForFileUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnFileForFileUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `review` in the `UserInput` mutation. */
export type ReviewReviewerIdFkeyInverseInput = {
  /** Flag indicating whether all other `review` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewReviewPkeyConnect>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewNodeIdConnect>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewReviewPkeyDelete>>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewNodeIdDelete>>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewOnReviewForReviewReviewerIdFkeyUsingReviewPkeyUpdate>>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnReviewForReviewReviewerIdFkeyNodeIdUpdate>>;
  /** A `ReviewInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewReviewerIdFkeyReviewCreateInput>>;
};

/** The fields on `review` to look up the row to update. */
export type ReviewOnReviewForReviewReviewerIdFkeyUsingReviewPkeyUpdate = {
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: UpdateReviewOnReviewForReviewReviewerIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `review` being updated. */
export type UpdateReviewOnReviewForReviewReviewerIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** Input for the nested mutation of `user` in the `ReviewInput` mutation. */
export type ReviewReviewerIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnReviewForReviewReviewerIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnReviewForReviewReviewerIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewOnReviewForReviewReviewerIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewReviewerIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnReviewForReviewReviewerIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnReviewForReviewReviewerIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnReviewForReviewReviewerIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `file` in the `UserInput` mutation. */
export type FileUserIdFkeyInverseInput = {
  /** Flag indicating whether all other `file` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectById?: Maybe<Array<FileFilePkeyConnect>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<FileNodeIdConnect>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteById?: Maybe<Array<FileFilePkeyDelete>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<FileNodeIdDelete>>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateById?: Maybe<Array<FileOnFileForFileUserIdFkeyUsingFilePkeyUpdate>>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnFileForFileUserIdFkeyNodeIdUpdate>>;
  /** A `FileInput` object that will be created and connected to this object. */
  create?: Maybe<Array<FileUserIdFkeyFileCreateInput>>;
};

/** The fields on `file` to look up the row to update. */
export type FileOnFileForFileUserIdFkeyUsingFilePkeyUpdate = {
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: UpdateFileOnFileForFileUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `file` being updated. */
export type UpdateFileOnFileForFileUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `application` in the `FileInput` mutation. */
export type FileApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnFileForFileApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnFileForFileApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<FileOnFileForFileApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<FileApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnFileForFileApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnFileForFileApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnFileForFileApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `notification` in the `ApplicationInput` mutation. */
export type NotificationApplicationIdFkeyInverseInput = {
  /** Flag indicating whether all other `notification` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectById?: Maybe<Array<NotificationNotificationPkeyConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<NotificationNodeIdConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteById?: Maybe<Array<NotificationNotificationPkeyDelete>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<NotificationNodeIdDelete>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateById?: Maybe<Array<NotificationOnNotificationForNotificationApplicationIdFkeyUsingNotificationPkeyUpdate>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationOnNotificationForNotificationApplicationIdFkeyNodeIdUpdate>>;
  /** A `NotificationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<NotificationApplicationIdFkeyNotificationCreateInput>>;
};

/** The fields on `notification` to look up the row to connect. */
export type NotificationNotificationPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type NotificationNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `notification` to look up the row to delete. */
export type NotificationNotificationPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type NotificationNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `notification` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `notification` to look up the row to update. */
export type NotificationOnNotificationForNotificationApplicationIdFkeyUsingNotificationPkeyUpdate = {
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: UpdateNotificationOnNotificationForNotificationApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `notification` being updated. */
export type UpdateNotificationOnNotificationForNotificationApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** Input for the nested mutation of `user` in the `NotificationInput` mutation. */
export type NotificationUserIdFkeyInput = {
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectById?: Maybe<UserUserPkeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByUsername?: Maybe<UserUserUsernameKeyConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  connectByNodeId?: Maybe<UserNodeIdConnect>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteById?: Maybe<UserUserPkeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByUsername?: Maybe<UserUserUsernameKeyDelete>;
  /** The primary key(s) for `user` for the far side of the relationship. */
  deleteByNodeId?: Maybe<UserNodeIdDelete>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateById?: Maybe<UserOnNotificationForNotificationUserIdFkeyUsingUserPkeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByUsername?: Maybe<UserOnNotificationForNotificationUserIdFkeyUsingUserUsernameKeyUpdate>;
  /** The primary key(s) and patch data for `user` for the far side of the relationship. */
  updateByNodeId?: Maybe<NotificationOnNotificationForNotificationUserIdFkeyNodeIdUpdate>;
  /** A `UserInput` object that will be created and connected to this object. */
  create?: Maybe<NotificationUserIdFkeyUserCreateInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnNotificationForNotificationUserIdFkeyUsingUserPkeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnNotificationForNotificationUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `user` being updated. */
export type UpdateUserOnNotificationForNotificationUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** Input for the nested mutation of `notification` in the `UserInput` mutation. */
export type NotificationUserIdFkeyInverseInput = {
  /** Flag indicating whether all other `notification` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectById?: Maybe<Array<NotificationNotificationPkeyConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<NotificationNodeIdConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteById?: Maybe<Array<NotificationNotificationPkeyDelete>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<NotificationNodeIdDelete>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateById?: Maybe<Array<NotificationOnNotificationForNotificationUserIdFkeyUsingNotificationPkeyUpdate>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<UserOnNotificationForNotificationUserIdFkeyNodeIdUpdate>>;
  /** A `NotificationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<NotificationUserIdFkeyNotificationCreateInput>>;
};

/** The fields on `notification` to look up the row to update. */
export type NotificationOnNotificationForNotificationUserIdFkeyUsingNotificationPkeyUpdate = {
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: UpdateNotificationOnNotificationForNotificationUserIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `notification` being updated. */
export type UpdateNotificationOnNotificationForNotificationUserIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** Input for the nested mutation of `application` in the `NotificationInput` mutation. */
export type NotificationApplicationIdFkeyInput = {
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectById?: Maybe<ApplicationApplicationPkeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectBySerial?: Maybe<ApplicationApplicationSerialKeyConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationNodeIdConnect>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationApplicationPkeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteBySerial?: Maybe<ApplicationApplicationSerialKeyDelete>;
  /** The primary key(s) for `application` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationNodeIdDelete>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateById?: Maybe<ApplicationOnNotificationForNotificationApplicationIdFkeyUsingApplicationPkeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateBySerial?: Maybe<ApplicationOnNotificationForNotificationApplicationIdFkeyUsingApplicationSerialKeyUpdate>;
  /** The primary key(s) and patch data for `application` for the far side of the relationship. */
  updateByNodeId?: Maybe<NotificationOnNotificationForNotificationApplicationIdFkeyNodeIdUpdate>;
  /** A `ApplicationInput` object that will be created and connected to this object. */
  create?: Maybe<NotificationApplicationIdFkeyApplicationCreateInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnNotificationForNotificationApplicationIdFkeyUsingApplicationPkeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnNotificationForNotificationApplicationIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `application` being updated. */
export type UpdateApplicationOnNotificationForNotificationApplicationIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnNotificationForNotificationApplicationIdFkeyUsingApplicationSerialKeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnNotificationForNotificationApplicationIdFkeyPatch;
  serial: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type NotificationOnNotificationForNotificationApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `application` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: ApplicationPatch;
};

/** Represents an update to a `Application`. Fields that are set will be updated. */
export type ApplicationPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** The `application` to be created by this mutation. */
export type NotificationApplicationIdFkeyApplicationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** Input for the nested mutation of `review` in the `NotificationInput` mutation. */
export type NotificationReviewIdFkeyInput = {
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectById?: Maybe<ReviewReviewPkeyConnect>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectByNodeId?: Maybe<ReviewNodeIdConnect>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteById?: Maybe<ReviewReviewPkeyDelete>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ReviewNodeIdDelete>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateById?: Maybe<ReviewOnNotificationForNotificationReviewIdFkeyUsingReviewPkeyUpdate>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateByNodeId?: Maybe<NotificationOnNotificationForNotificationReviewIdFkeyNodeIdUpdate>;
  /** A `ReviewInput` object that will be created and connected to this object. */
  create?: Maybe<NotificationReviewIdFkeyReviewCreateInput>;
};

/** The fields on `review` to look up the row to update. */
export type ReviewOnNotificationForNotificationReviewIdFkeyUsingReviewPkeyUpdate = {
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: UpdateReviewOnNotificationForNotificationReviewIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `review` being updated. */
export type UpdateReviewOnNotificationForNotificationReviewIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewResponse` in the `ReviewInput` mutation. */
export type ReviewResponseReviewIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewResponse` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewResponseReviewResponsePkeyConnect>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewResponseNodeIdConnect>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewResponseReviewResponsePkeyDelete>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewResponseNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewResponse` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyUsingReviewResponsePkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ReviewOnReviewResponseForReviewResponseReviewIdFkeyNodeIdUpdate>>;
  /** A `ReviewResponseInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewResponseReviewIdFkeyReviewResponseCreateInput>>;
};

/** The fields on `reviewResponse` to look up the row to connect. */
export type ReviewResponseReviewResponsePkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ReviewResponseNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `reviewResponse` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewResponse` to look up the row to delete. */
export type ReviewResponseReviewResponsePkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ReviewResponseNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `reviewResponse` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewResponse` to look up the row to update. */
export type ReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyUsingReviewResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewResponse` being updated. */
  patch: UpdateReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewResponse` being updated. */
export type UpdateReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** Input for the nested mutation of `reviewQuestionAssignment` in the `ReviewResponseInput` mutation. */
export type ReviewResponseReviewQuestionAssignmentIdFkeyInput = {
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  connectById?: Maybe<ReviewQuestionAssignmentReviewQuestionAssignmentPkeyConnect>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<ReviewQuestionAssignmentNodeIdConnect>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  deleteById?: Maybe<ReviewQuestionAssignmentReviewQuestionAssignmentPkeyDelete>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ReviewQuestionAssignmentNodeIdDelete>;
  /** The primary key(s) and patch data for `reviewQuestionAssignment` for the far side of the relationship. */
  updateById?: Maybe<ReviewQuestionAssignmentOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyUsingReviewQuestionAssignmentPkeyUpdate>;
  /** The primary key(s) and patch data for `reviewQuestionAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewResponseOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyNodeIdUpdate>;
  /** A `ReviewQuestionAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyReviewQuestionAssignmentCreateInput>;
};

/** The fields on `reviewQuestionAssignment` to look up the row to connect. */
export type ReviewQuestionAssignmentReviewQuestionAssignmentPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ReviewQuestionAssignmentNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `reviewQuestionAssignment` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewQuestionAssignment` to look up the row to delete. */
export type ReviewQuestionAssignmentReviewQuestionAssignmentPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ReviewQuestionAssignmentNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `reviewQuestionAssignment` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewQuestionAssignment` to look up the row to update. */
export type ReviewQuestionAssignmentOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyUsingReviewQuestionAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
  patch: UpdateReviewQuestionAssignmentOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
export type UpdateReviewQuestionAssignmentOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `templateElement` in the `ReviewQuestionAssignmentInput` mutation. */
export type ReviewQuestionAssignmentTemplateElementIdFkeyInput = {
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  connectById?: Maybe<TemplateElementTemplateElementPkeyConnect>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  connectByNodeId?: Maybe<TemplateElementNodeIdConnect>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  deleteById?: Maybe<TemplateElementTemplateElementPkeyDelete>;
  /** The primary key(s) for `templateElement` for the far side of the relationship. */
  deleteByNodeId?: Maybe<TemplateElementNodeIdDelete>;
  /** The primary key(s) and patch data for `templateElement` for the far side of the relationship. */
  updateById?: Maybe<TemplateElementOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyUsingTemplateElementPkeyUpdate>;
  /** The primary key(s) and patch data for `templateElement` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyNodeIdUpdate>;
  /** A `TemplateElementInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyTemplateElementCreateInput>;
};

/** The fields on `templateElement` to look up the row to update. */
export type TemplateElementOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyUsingTemplateElementPkeyUpdate = {
  /** An object where the defined keys will be set on the `templateElement` being updated. */
  patch: UpdateTemplateElementOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `templateElement` being updated. */
export type UpdateTemplateElementOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  elementTypePluginCode?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  isRequired?: Maybe<Scalars['JSON']>;
  isEditable?: Maybe<Scalars['JSON']>;
  validation?: Maybe<Scalars['JSON']>;
  validationMessage?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  templateSectionToSectionId?: Maybe<TemplateElementSectionIdFkeyInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseTemplateElementIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewQuestionAssignment` in the `TemplateElementInput` mutation. */
export type ReviewQuestionAssignmentTemplateElementIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewQuestionAssignment` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewQuestionAssignmentReviewQuestionAssignmentPkeyConnect>>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewQuestionAssignmentNodeIdConnect>>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewQuestionAssignmentReviewQuestionAssignmentPkeyDelete>>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewQuestionAssignmentNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewQuestionAssignment` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyUsingReviewQuestionAssignmentPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewQuestionAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<TemplateElementOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyNodeIdUpdate>>;
  /** A `ReviewQuestionAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewQuestionAssignmentTemplateElementIdFkeyReviewQuestionAssignmentCreateInput>>;
};

/** The fields on `reviewQuestionAssignment` to look up the row to update. */
export type ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyUsingReviewQuestionAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
  patch: UpdateReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
export type UpdateReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewAssignment` in the `ReviewQuestionAssignmentInput` mutation. */
export type ReviewQuestionAssignmentReviewAssignmentIdFkeyInput = {
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectById?: Maybe<ReviewAssignmentReviewAssignmentPkeyConnect>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<ReviewAssignmentNodeIdConnect>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteById?: Maybe<ReviewAssignmentReviewAssignmentPkeyDelete>;
  /** The primary key(s) for `reviewAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ReviewAssignmentNodeIdDelete>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateById?: Maybe<ReviewAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyUsingReviewAssignmentPkeyUpdate>;
  /** The primary key(s) and patch data for `reviewAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyNodeIdUpdate>;
  /** A `ReviewAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyReviewAssignmentCreateInput>;
};

/** The fields on `reviewAssignment` to look up the row to update. */
export type ReviewAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyUsingReviewAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: UpdateReviewAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewAssignment` being updated. */
export type UpdateReviewAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewQuestionAssignment` in the `ReviewAssignmentInput` mutation. */
export type ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewQuestionAssignment` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewQuestionAssignmentReviewQuestionAssignmentPkeyConnect>>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewQuestionAssignmentNodeIdConnect>>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewQuestionAssignmentReviewQuestionAssignmentPkeyDelete>>;
  /** The primary key(s) for `reviewQuestionAssignment` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewQuestionAssignmentNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewQuestionAssignment` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyUsingReviewQuestionAssignmentPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewQuestionAssignment` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ReviewAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyNodeIdUpdate>>;
  /** A `ReviewQuestionAssignmentInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewQuestionAssignmentReviewAssignmentIdFkeyReviewQuestionAssignmentCreateInput>>;
};

/** The fields on `reviewQuestionAssignment` to look up the row to update. */
export type ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyUsingReviewQuestionAssignmentPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
  patch: UpdateReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
export type UpdateReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewResponse` in the `ReviewQuestionAssignmentInput` mutation. */
export type ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewResponse` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewResponseReviewResponsePkeyConnect>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewResponseNodeIdConnect>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewResponseReviewResponsePkeyDelete>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewResponseNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewResponse` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewResponseOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyUsingReviewResponsePkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ReviewQuestionAssignmentOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyNodeIdUpdate>>;
  /** A `ReviewResponseInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewResponseReviewQuestionAssignmentIdFkeyReviewResponseCreateInput>>;
};

/** The fields on `reviewResponse` to look up the row to update. */
export type ReviewResponseOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyUsingReviewResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewResponse` being updated. */
  patch: UpdateReviewResponseOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewResponse` being updated. */
export type UpdateReviewResponseOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** Input for the nested mutation of `applicationResponse` in the `ReviewResponseInput` mutation. */
export type ReviewResponseApplicationResponseIdFkeyInput = {
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectById?: Maybe<ApplicationResponseApplicationResponsePkeyConnect>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationResponseNodeIdConnect>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationResponseApplicationResponsePkeyDelete>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationResponseNodeIdDelete>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateById?: Maybe<ApplicationResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyUsingApplicationResponsePkeyUpdate>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyNodeIdUpdate>;
  /** A `ApplicationResponseInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewResponseApplicationResponseIdFkeyApplicationResponseCreateInput>;
};

/** The fields on `applicationResponse` to look up the row to update. */
export type ApplicationResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyUsingApplicationResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationResponse` being updated. */
  patch: UpdateApplicationResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationResponse` being updated. */
export type UpdateApplicationResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewResponse` in the `ApplicationResponseInput` mutation. */
export type ReviewResponseApplicationResponseIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewResponse` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewResponseReviewResponsePkeyConnect>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewResponseNodeIdConnect>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewResponseReviewResponsePkeyDelete>>;
  /** The primary key(s) for `reviewResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewResponseNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewResponse` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyUsingReviewResponsePkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyNodeIdUpdate>>;
  /** A `ReviewResponseInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewResponseApplicationResponseIdFkeyReviewResponseCreateInput>>;
};

/** The fields on `reviewResponse` to look up the row to update. */
export type ReviewResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyUsingReviewResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewResponse` being updated. */
  patch: UpdateReviewResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewResponse` being updated. */
export type UpdateReviewResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** Input for the nested mutation of `review` in the `ReviewResponseInput` mutation. */
export type ReviewResponseReviewIdFkeyInput = {
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectById?: Maybe<ReviewReviewPkeyConnect>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectByNodeId?: Maybe<ReviewNodeIdConnect>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteById?: Maybe<ReviewReviewPkeyDelete>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ReviewNodeIdDelete>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateById?: Maybe<ReviewOnReviewResponseForReviewResponseReviewIdFkeyUsingReviewPkeyUpdate>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyNodeIdUpdate>;
  /** A `ReviewInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewResponseReviewIdFkeyReviewCreateInput>;
};

/** The fields on `review` to look up the row to update. */
export type ReviewOnReviewResponseForReviewResponseReviewIdFkeyUsingReviewPkeyUpdate = {
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: UpdateReviewOnReviewResponseForReviewResponseReviewIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `review` being updated. */
export type UpdateReviewOnReviewResponseForReviewResponseReviewIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** Input for the nested mutation of `reviewStatusHistory` in the `ReviewInput` mutation. */
export type ReviewStatusHistoryReviewIdFkeyInverseInput = {
  /** Flag indicating whether all other `reviewStatusHistory` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `reviewStatusHistory` for the far side of the relationship. */
  connectById?: Maybe<Array<ReviewStatusHistoryReviewStatusHistoryPkeyConnect>>;
  /** The primary key(s) for `reviewStatusHistory` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<ReviewStatusHistoryNodeIdConnect>>;
  /** The primary key(s) for `reviewStatusHistory` for the far side of the relationship. */
  deleteById?: Maybe<Array<ReviewStatusHistoryReviewStatusHistoryPkeyDelete>>;
  /** The primary key(s) for `reviewStatusHistory` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<ReviewStatusHistoryNodeIdDelete>>;
  /** The primary key(s) and patch data for `reviewStatusHistory` for the far side of the relationship. */
  updateById?: Maybe<Array<ReviewStatusHistoryOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyUsingReviewStatusHistoryPkeyUpdate>>;
  /** The primary key(s) and patch data for `reviewStatusHistory` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ReviewOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyNodeIdUpdate>>;
  /** A `ReviewStatusHistoryInput` object that will be created and connected to this object. */
  create?: Maybe<Array<ReviewStatusHistoryReviewIdFkeyReviewStatusHistoryCreateInput>>;
};

/** The fields on `reviewStatusHistory` to look up the row to connect. */
export type ReviewStatusHistoryReviewStatusHistoryPkeyConnect = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to connect. */
export type ReviewStatusHistoryNodeIdConnect = {
  /** The globally unique `ID` which identifies a single `reviewStatusHistory` to be connected. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewStatusHistory` to look up the row to delete. */
export type ReviewStatusHistoryReviewStatusHistoryPkeyDelete = {
  id: Scalars['Int'];
};

/** The globally unique `ID` look up for the row to delete. */
export type ReviewStatusHistoryNodeIdDelete = {
  /** The globally unique `ID` which identifies a single `reviewStatusHistory` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The fields on `reviewStatusHistory` to look up the row to update. */
export type ReviewStatusHistoryOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyUsingReviewStatusHistoryPkeyUpdate = {
  /** An object where the defined keys will be set on the `reviewStatusHistory` being updated. */
  patch: UpdateReviewStatusHistoryOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `reviewStatusHistory` being updated. */
export type UpdateReviewStatusHistoryOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<ReviewStatus>;
  timestamp?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  reviewToReviewId?: Maybe<ReviewStatusHistoryReviewIdFkeyInput>;
};

/** Input for the nested mutation of `review` in the `ReviewStatusHistoryInput` mutation. */
export type ReviewStatusHistoryReviewIdFkeyInput = {
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectById?: Maybe<ReviewReviewPkeyConnect>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  connectByNodeId?: Maybe<ReviewNodeIdConnect>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteById?: Maybe<ReviewReviewPkeyDelete>;
  /** The primary key(s) for `review` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ReviewNodeIdDelete>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateById?: Maybe<ReviewOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyUsingReviewPkeyUpdate>;
  /** The primary key(s) and patch data for `review` for the far side of the relationship. */
  updateByNodeId?: Maybe<ReviewStatusHistoryOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyNodeIdUpdate>;
  /** A `ReviewInput` object that will be created and connected to this object. */
  create?: Maybe<ReviewStatusHistoryReviewIdFkeyReviewCreateInput>;
};

/** The fields on `review` to look up the row to update. */
export type ReviewOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyUsingReviewPkeyUpdate = {
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: UpdateReviewOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `review` being updated. */
export type UpdateReviewOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** Input for the nested mutation of `notification` in the `ReviewInput` mutation. */
export type NotificationReviewIdFkeyInverseInput = {
  /** Flag indicating whether all other `notification` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectById?: Maybe<Array<NotificationNotificationPkeyConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<NotificationNodeIdConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteById?: Maybe<Array<NotificationNotificationPkeyDelete>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<NotificationNodeIdDelete>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateById?: Maybe<Array<NotificationOnNotificationForNotificationReviewIdFkeyUsingNotificationPkeyUpdate>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ReviewOnNotificationForNotificationReviewIdFkeyNodeIdUpdate>>;
  /** A `NotificationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<NotificationReviewIdFkeyNotificationCreateInput>>;
};

/** The fields on `notification` to look up the row to update. */
export type NotificationOnNotificationForNotificationReviewIdFkeyUsingNotificationPkeyUpdate = {
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: UpdateNotificationOnNotificationForNotificationReviewIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `notification` being updated. */
export type UpdateNotificationOnNotificationForNotificationReviewIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** Input for the nested mutation of `file` in the `NotificationInput` mutation. */
export type NotificationDocumentIdFkeyInput = {
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectById?: Maybe<FileFilePkeyConnect>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectByNodeId?: Maybe<FileNodeIdConnect>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteById?: Maybe<FileFilePkeyDelete>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteByNodeId?: Maybe<FileNodeIdDelete>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateById?: Maybe<FileOnNotificationForNotificationDocumentIdFkeyUsingFilePkeyUpdate>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateByNodeId?: Maybe<NotificationOnNotificationForNotificationDocumentIdFkeyNodeIdUpdate>;
  /** A `FileInput` object that will be created and connected to this object. */
  create?: Maybe<NotificationDocumentIdFkeyFileCreateInput>;
};

/** The fields on `file` to look up the row to update. */
export type FileOnNotificationForNotificationDocumentIdFkeyUsingFilePkeyUpdate = {
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: UpdateFileOnNotificationForNotificationDocumentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `file` being updated. */
export type UpdateFileOnNotificationForNotificationDocumentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `applicationResponse` in the `FileInput` mutation. */
export type FileApplicationResponseIdFkeyInput = {
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectById?: Maybe<ApplicationResponseApplicationResponsePkeyConnect>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  connectByNodeId?: Maybe<ApplicationResponseNodeIdConnect>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteById?: Maybe<ApplicationResponseApplicationResponsePkeyDelete>;
  /** The primary key(s) for `applicationResponse` for the far side of the relationship. */
  deleteByNodeId?: Maybe<ApplicationResponseNodeIdDelete>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateById?: Maybe<ApplicationResponseOnFileForFileApplicationResponseIdFkeyUsingApplicationResponsePkeyUpdate>;
  /** The primary key(s) and patch data for `applicationResponse` for the far side of the relationship. */
  updateByNodeId?: Maybe<FileOnFileForFileApplicationResponseIdFkeyNodeIdUpdate>;
  /** A `ApplicationResponseInput` object that will be created and connected to this object. */
  create?: Maybe<FileApplicationResponseIdFkeyApplicationResponseCreateInput>;
};

/** The fields on `applicationResponse` to look up the row to update. */
export type ApplicationResponseOnFileForFileApplicationResponseIdFkeyUsingApplicationResponsePkeyUpdate = {
  /** An object where the defined keys will be set on the `applicationResponse` being updated. */
  patch: UpdateApplicationResponseOnFileForFileApplicationResponseIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `applicationResponse` being updated. */
export type UpdateApplicationResponseOnFileForFileApplicationResponseIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** Input for the nested mutation of `file` in the `ApplicationResponseInput` mutation. */
export type FileApplicationResponseIdFkeyInverseInput = {
  /** Flag indicating whether all other `file` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectById?: Maybe<Array<FileFilePkeyConnect>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<FileNodeIdConnect>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteById?: Maybe<Array<FileFilePkeyDelete>>;
  /** The primary key(s) for `file` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<FileNodeIdDelete>>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateById?: Maybe<Array<FileOnFileForFileApplicationResponseIdFkeyUsingFilePkeyUpdate>>;
  /** The primary key(s) and patch data for `file` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<ApplicationResponseOnFileForFileApplicationResponseIdFkeyNodeIdUpdate>>;
  /** A `FileInput` object that will be created and connected to this object. */
  create?: Maybe<Array<FileApplicationResponseIdFkeyFileCreateInput>>;
};

/** The fields on `file` to look up the row to update. */
export type FileOnFileForFileApplicationResponseIdFkeyUsingFilePkeyUpdate = {
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: UpdateFileOnFileForFileApplicationResponseIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `file` being updated. */
export type UpdateFileOnFileForFileApplicationResponseIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** Input for the nested mutation of `notification` in the `FileInput` mutation. */
export type NotificationDocumentIdFkeyInverseInput = {
  /** Flag indicating whether all other `notification` records that match this relationship should be removed. */
  deleteOthers?: Maybe<Scalars['Boolean']>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectById?: Maybe<Array<NotificationNotificationPkeyConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  connectByNodeId?: Maybe<Array<NotificationNodeIdConnect>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteById?: Maybe<Array<NotificationNotificationPkeyDelete>>;
  /** The primary key(s) for `notification` for the far side of the relationship. */
  deleteByNodeId?: Maybe<Array<NotificationNodeIdDelete>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateById?: Maybe<Array<NotificationOnNotificationForNotificationDocumentIdFkeyUsingNotificationPkeyUpdate>>;
  /** The primary key(s) and patch data for `notification` for the far side of the relationship. */
  updateByNodeId?: Maybe<Array<FileOnNotificationForNotificationDocumentIdFkeyNodeIdUpdate>>;
  /** A `NotificationInput` object that will be created and connected to this object. */
  create?: Maybe<Array<NotificationDocumentIdFkeyNotificationCreateInput>>;
};

/** The fields on `notification` to look up the row to update. */
export type NotificationOnNotificationForNotificationDocumentIdFkeyUsingNotificationPkeyUpdate = {
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: UpdateNotificationOnNotificationForNotificationDocumentIdFkeyPatch;
  id: Scalars['Int'];
};

/** An object where the defined keys will be set on the `notification` being updated. */
export type UpdateNotificationOnNotificationForNotificationDocumentIdFkeyPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type FileOnNotificationForNotificationDocumentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: NotificationPatch;
};

/** Represents an update to a `Notification`. Fields that are set will be updated. */
export type NotificationPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** The `notification` to be created by this mutation. */
export type NotificationDocumentIdFkeyNotificationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ApplicationResponseOnFileForFileApplicationResponseIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `file` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: FilePatch;
};

/** Represents an update to a `File`. Fields that are set will be updated. */
export type FilePatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** The `file` to be created by this mutation. */
export type FileApplicationResponseIdFkeyFileCreateInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type FileOnFileForFileApplicationResponseIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `applicationResponse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `applicationResponse` being updated. */
  patch: ApplicationResponsePatch;
};

/** Represents an update to a `ApplicationResponse`. Fields that are set will be updated. */
export type ApplicationResponsePatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** The `applicationResponse` to be created by this mutation. */
export type FileApplicationResponseIdFkeyApplicationResponseCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type NotificationOnNotificationForNotificationDocumentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `file` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: FilePatch;
};

/** The `file` to be created by this mutation. */
export type NotificationDocumentIdFkeyFileCreateInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewOnNotificationForNotificationReviewIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: NotificationPatch;
};

/** The `notification` to be created by this mutation. */
export type NotificationReviewIdFkeyNotificationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewStatusHistoryOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: ReviewPatch;
};

/** Represents an update to a `Review`. Fields that are set will be updated. */
export type ReviewPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The `review` to be created by this mutation. */
export type ReviewStatusHistoryReviewIdFkeyReviewCreateInput = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewOnReviewStatusHistoryForReviewStatusHistoryReviewIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewStatusHistory` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewStatusHistory` being updated. */
  patch: ReviewStatusHistoryPatch;
};

/** Represents an update to a `ReviewStatusHistory`. Fields that are set will be updated. */
export type ReviewStatusHistoryPatch = {
  id?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  status?: Maybe<ReviewStatus>;
  timestamp?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  reviewToReviewId?: Maybe<ReviewStatusHistoryReviewIdFkeyInput>;
};

/** The `reviewStatusHistory` to be created by this mutation. */
export type ReviewStatusHistoryReviewIdFkeyReviewStatusHistoryCreateInput = {
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<ReviewStatus>;
  timestamp?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  reviewToReviewId?: Maybe<ReviewStatusHistoryReviewIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewResponseOnReviewResponseForReviewResponseReviewIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: ReviewPatch;
};

/** The `review` to be created by this mutation. */
export type ReviewResponseReviewIdFkeyReviewCreateInput = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ApplicationResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewResponse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewResponse` being updated. */
  patch: ReviewResponsePatch;
};

/** Represents an update to a `ReviewResponse`. Fields that are set will be updated. */
export type ReviewResponsePatch = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** The `reviewResponse` to be created by this mutation. */
export type ReviewResponseApplicationResponseIdFkeyReviewResponseCreateInput = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewResponseOnReviewResponseForReviewResponseApplicationResponseIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `applicationResponse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `applicationResponse` being updated. */
  patch: ApplicationResponsePatch;
};

/** The `applicationResponse` to be created by this mutation. */
export type ReviewResponseApplicationResponseIdFkeyApplicationResponseCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  isValid?: Maybe<Scalars['Boolean']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  templateElementToTemplateElementId?: Maybe<ApplicationResponseTemplateElementIdFkeyInput>;
  applicationToApplicationId?: Maybe<ApplicationResponseApplicationIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseApplicationResponseIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationResponseIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewQuestionAssignmentOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewResponse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewResponse` being updated. */
  patch: ReviewResponsePatch;
};

/** The `reviewResponse` to be created by this mutation. */
export type ReviewResponseReviewQuestionAssignmentIdFkeyReviewResponseCreateInput = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewQuestionAssignment` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
  patch: ReviewQuestionAssignmentPatch;
};

/** Represents an update to a `ReviewQuestionAssignment`. Fields that are set will be updated. */
export type ReviewQuestionAssignmentPatch = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** The `reviewQuestionAssignment` to be created by this mutation. */
export type ReviewQuestionAssignmentReviewAssignmentIdFkeyReviewQuestionAssignmentCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentReviewAssignmentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewAssignment` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: ReviewAssignmentPatch;
};

/** Represents an update to a `ReviewAssignment`. Fields that are set will be updated. */
export type ReviewAssignmentPatch = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** The `reviewAssignment` to be created by this mutation. */
export type ReviewQuestionAssignmentReviewAssignmentIdFkeyReviewAssignmentCreateInput = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type TemplateElementOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewQuestionAssignment` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
  patch: ReviewQuestionAssignmentPatch;
};

/** The `reviewQuestionAssignment` to be created by this mutation. */
export type ReviewQuestionAssignmentTemplateElementIdFkeyReviewQuestionAssignmentCreateInput = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewQuestionAssignmentOnReviewQuestionAssignmentForReviewQuestionAssignmentTemplateElementIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `templateElement` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `templateElement` being updated. */
  patch: TemplateElementPatch;
};

/** Represents an update to a `TemplateElement`. Fields that are set will be updated. */
export type TemplateElementPatch = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  index?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  elementTypePluginCode?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  isRequired?: Maybe<Scalars['JSON']>;
  isEditable?: Maybe<Scalars['JSON']>;
  validation?: Maybe<Scalars['JSON']>;
  validationMessage?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  templateSectionToSectionId?: Maybe<TemplateElementSectionIdFkeyInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseTemplateElementIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInverseInput>;
};

/** The `templateElement` to be created by this mutation. */
export type ReviewQuestionAssignmentTemplateElementIdFkeyTemplateElementCreateInput = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  code: Scalars['String'];
  index?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  category?: Maybe<TemplateElementCategory>;
  elementTypePluginCode?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  isRequired?: Maybe<Scalars['JSON']>;
  isEditable?: Maybe<Scalars['JSON']>;
  validation?: Maybe<Scalars['JSON']>;
  validationMessage?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  templateSectionToSectionId?: Maybe<TemplateElementSectionIdFkeyInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseTemplateElementIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewResponseOnReviewResponseForReviewResponseReviewQuestionAssignmentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewQuestionAssignment` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewQuestionAssignment` being updated. */
  patch: ReviewQuestionAssignmentPatch;
};

/** The `reviewQuestionAssignment` to be created by this mutation. */
export type ReviewResponseReviewQuestionAssignmentIdFkeyReviewQuestionAssignmentCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateElementId?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  templateElementToTemplateElementId?: Maybe<ReviewQuestionAssignmentTemplateElementIdFkeyInput>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewOnReviewResponseForReviewResponseReviewIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewResponse` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewResponse` being updated. */
  patch: ReviewResponsePatch;
};

/** The `reviewResponse` to be created by this mutation. */
export type ReviewResponseReviewIdFkeyReviewResponseCreateInput = {
  id?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  decision?: Maybe<ReviewResponseDecision>;
  reviewQuestionAssignmentId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  timestamp?: Maybe<Scalars['Datetime']>;
  reviewQuestionAssignmentToReviewQuestionAssignmentId?: Maybe<ReviewResponseReviewQuestionAssignmentIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<ReviewResponseApplicationResponseIdFkeyInput>;
  reviewToReviewId?: Maybe<ReviewResponseReviewIdFkeyInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type NotificationOnNotificationForNotificationReviewIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: ReviewPatch;
};

/** The `review` to be created by this mutation. */
export type NotificationReviewIdFkeyReviewCreateInput = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type UserOnNotificationForNotificationUserIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: NotificationPatch;
};

/** The `notification` to be created by this mutation. */
export type NotificationUserIdFkeyNotificationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnNotificationForNotificationUserIdFkeyUsingUserUsernameKeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnNotificationForNotificationUserIdFkeyPatch;
  username: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type NotificationOnNotificationForNotificationUserIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `user` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UserPatch;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** The `user` to be created by this mutation. */
export type NotificationUserIdFkeyUserCreateInput = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ApplicationOnNotificationForNotificationApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `notification` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `notification` being updated. */
  patch: NotificationPatch;
};

/** The `notification` to be created by this mutation. */
export type NotificationApplicationIdFkeyNotificationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  reviewId?: Maybe<Scalars['Int']>;
  subject?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  documentId?: Maybe<Scalars['Int']>;
  isRead?: Maybe<Scalars['Boolean']>;
  userToUserId?: Maybe<NotificationUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<NotificationApplicationIdFkeyInput>;
  reviewToReviewId?: Maybe<NotificationReviewIdFkeyInput>;
  fileToDocumentId?: Maybe<NotificationDocumentIdFkeyInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnFileForFileApplicationIdFkeyUsingApplicationSerialKeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnFileForFileApplicationIdFkeyPatch;
  serial: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type FileOnFileForFileApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `application` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: ApplicationPatch;
};

/** The `application` to be created by this mutation. */
export type FileApplicationIdFkeyApplicationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type UserOnFileForFileUserIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `file` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: FilePatch;
};

/** The `file` to be created by this mutation. */
export type FileUserIdFkeyFileCreateInput = {
  id?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationId?: Maybe<Scalars['Int']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnReviewForReviewReviewerIdFkeyUsingUserUsernameKeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnReviewForReviewReviewerIdFkeyPatch;
  username: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewOnReviewForReviewReviewerIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `user` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UserPatch;
};

/** The `user` to be created by this mutation. */
export type ReviewReviewerIdFkeyUserCreateInput = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type UserOnReviewForReviewReviewerIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: ReviewPatch;
};

/** The `review` to be created by this mutation. */
export type ReviewReviewerIdFkeyReviewCreateInput = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The fields on `user` to look up the row to update. */
export type UserOnFileForFileUserIdFkeyUsingUserUsernameKeyUpdate = {
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UpdateUserOnFileForFileUserIdFkeyPatch;
  username: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type FileOnFileForFileUserIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `user` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `user` being updated. */
  patch: UserPatch;
};

/** The `user` to be created by this mutation. */
export type FileUserIdFkeyUserCreateInput = {
  id?: Maybe<Scalars['Int']>;
  firstName?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['Date']>;
  passwordHash?: Maybe<Scalars['String']>;
  userOrganisationsUsingId?: Maybe<UserOrganisationUserIdFkeyInverseInput>;
  permissionJoinsUsingId?: Maybe<PermissionJoinUserIdFkeyInverseInput>;
  applicationsUsingId?: Maybe<ApplicationUserIdFkeyInverseInput>;
  reviewAssignmentsToAssignerIdUsingId?: Maybe<ReviewAssignmentAssignerIdFkeyInverseInput>;
  reviewAssignmentsToReviewerIdUsingId?: Maybe<ReviewAssignmentReviewerIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewReviewerIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileUserIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationUserIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ApplicationOnFileForFileApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `file` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `file` being updated. */
  patch: FilePatch;
};

/** The `file` to be created by this mutation. */
export type FileApplicationIdFkeyFileCreateInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  originalFilename?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  mimetype?: Maybe<Scalars['String']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  userToUserId?: Maybe<FileUserIdFkeyInput>;
  applicationToApplicationId?: Maybe<FileApplicationIdFkeyInput>;
  applicationResponseToApplicationResponseId?: Maybe<FileApplicationResponseIdFkeyInput>;
  notificationsUsingId?: Maybe<NotificationDocumentIdFkeyInverseInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnReviewForReviewApplicationIdFkeyUsingApplicationSerialKeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnReviewForReviewApplicationIdFkeyPatch;
  serial: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewOnReviewForReviewApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `application` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: ApplicationPatch;
};

/** The `application` to be created by this mutation. */
export type ReviewApplicationIdFkeyApplicationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseInput>;
  applicationStageHistoriesUsingId?: Maybe<ApplicationStageHistoryApplicationIdFkeyInverseInput>;
  applicationResponsesUsingId?: Maybe<ApplicationResponseApplicationIdFkeyInverseInput>;
  reviewAssignmentsUsingId?: Maybe<ReviewAssignmentApplicationIdFkeyInverseInput>;
  reviewsUsingId?: Maybe<ReviewApplicationIdFkeyInverseInput>;
  filesUsingId?: Maybe<FileApplicationIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationApplicationIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewAssignmentOnReviewForReviewReviewAssignmentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: ReviewPatch;
};

/** The `review` to be created by this mutation. */
export type ReviewReviewAssignmentIdFkeyReviewCreateInput = {
  id?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  applicationId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewOnReviewForReviewReviewAssignmentIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `reviewAssignment` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `reviewAssignment` being updated. */
  patch: ReviewAssignmentPatch;
};

/** The `reviewAssignment` to be created by this mutation. */
export type ReviewReviewAssignmentIdFkeyReviewAssignmentCreateInput = {
  id?: Maybe<Scalars['Int']>;
  assignerId?: Maybe<Scalars['Int']>;
  reviewerId?: Maybe<Scalars['Int']>;
  stageId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  userToAssignerId?: Maybe<ReviewAssignmentAssignerIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewAssignmentReviewerIdFkeyInput>;
  templateStageToStageId?: Maybe<ReviewAssignmentStageIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewAssignmentApplicationIdFkeyInput>;
  reviewsUsingId?: Maybe<ReviewReviewAssignmentIdFkeyInverseInput>;
  reviewQuestionAssignmentsUsingId?: Maybe<ReviewQuestionAssignmentReviewAssignmentIdFkeyInverseInput>;
};

/** The globally unique `ID` look up for the row to update. */
export type ApplicationOnReviewForReviewApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `review` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `review` being updated. */
  patch: ReviewPatch;
};

/** The `review` to be created by this mutation. */
export type ReviewApplicationIdFkeyReviewCreateInput = {
  id?: Maybe<Scalars['Int']>;
  reviewAssignmentId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  reviewerId?: Maybe<Scalars['Int']>;
  reviewAssignmentToReviewAssignmentId?: Maybe<ReviewReviewAssignmentIdFkeyInput>;
  applicationToApplicationId?: Maybe<ReviewApplicationIdFkeyInput>;
  userToReviewerId?: Maybe<ReviewReviewerIdFkeyInput>;
  reviewResponsesUsingId?: Maybe<ReviewResponseReviewIdFkeyInverseInput>;
  reviewStatusHistoriesUsingId?: Maybe<ReviewStatusHistoryReviewIdFkeyInverseInput>;
  notificationsUsingId?: Maybe<NotificationReviewIdFkeyInverseInput>;
};

/** The fields on `application` to look up the row to update. */
export type ApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyUsingApplicationSerialKeyUpdate = {
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: UpdateApplicationOnReviewAssignmentForReviewAssignmentApplicationIdFkeyPatch;
  serial: Scalars['String'];
};

/** The globally unique `ID` look up for the row to update. */
export type ReviewAssignmentOnReviewAssignmentForReviewAssignmentApplicationIdFkeyNodeIdUpdate = {
  /** The globally unique `ID` which identifies a single `application` to be connected. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `application` being updated. */
  patch: ApplicationPatch;
};

/** The `application` to be created by this mutation. */
export type ReviewAssignmentApplicationIdFkeyApplicationCreateInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  orgId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  trigger?: Maybe<Trigger>;
  templateToTemplateId?: Maybe<ApplicationTemplateIdFkeyInput>;
  userToUserId?: Maybe<ApplicationUserIdFkeyInput>;
  organisationToOrgId?: Maybe<ApplicationOrgIdFkeyInput>;
  applicationSectionsUsingId?: Maybe<ApplicationSectionApplicationIdFkeyInverseIn