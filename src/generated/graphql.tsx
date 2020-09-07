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
  /** A signed eight-byte integer. The upper big integer values are greater than the max value for a JavaScript number. Therefore all big integers will be output as strings and not numbers. */
  BigInt: any;
  /** A floating point number that requires more precision than IEEE 754 binary 64 */
  BigFloat: any;
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
  /** Reads and enables pagination through a set of `Action`. */
  allActions?: Maybe<ActionsConnection>;
  /** Reads and enables pagination through a set of `ActionQueue`. */
  allActionQueues?: Maybe<ActionQueuesConnection>;
  /** Reads and enables pagination through a set of `Application`. */
  allApplications?: Maybe<ApplicationsConnection>;
  /** Reads and enables pagination through a set of `ApplicationResponse`. */
  allApplicationResponses?: Maybe<ApplicationResponsesConnection>;
  /** Reads and enables pagination through a set of `ApplicationSection`. */
  allApplicationSections?: Maybe<ApplicationSectionsConnection>;
  /** Reads and enables pagination through a set of `ApplicationStageHistory`. */
  allApplicationStageHistories?: Maybe<ApplicationStageHistoriesConnection>;
  /** Reads and enables pagination through a set of `ApplicationStatusHistory`. */
  allApplicationStatusHistories?: Maybe<ApplicationStatusHistoriesConnection>;
  /** Reads and enables pagination through a set of `Organisation`. */
  allOrganisations?: Maybe<OrganisationsConnection>;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  allPermissionJoins?: Maybe<PermissionJoinsConnection>;
  /** Reads and enables pagination through a set of `PermissionName`. */
  allPermissionNames?: Maybe<PermissionNamesConnection>;
  /** Reads and enables pagination through a set of `PermissionPolicy`. */
  allPermissionPolicies?: Maybe<PermissionPoliciesConnection>;
  /** Reads and enables pagination through a set of `Review`. */
  allReviews?: Maybe<ReviewsConnection>;
  /** Reads and enables pagination through a set of `ReviewResponse`. */
  allReviewResponses?: Maybe<ReviewResponsesConnection>;
  /** Reads and enables pagination through a set of `ReviewSection`. */
  allReviewSections?: Maybe<ReviewSectionsConnection>;
  /** Reads and enables pagination through a set of `ReviewSectionAssignment`. */
  allReviewSectionAssignments?: Maybe<ReviewSectionAssignmentsConnection>;
  /** Reads and enables pagination through a set of `ReviewSectionJoin`. */
  allReviewSectionJoins?: Maybe<ReviewSectionJoinsConnection>;
  /** Reads and enables pagination through a set of `ReviewSectionResponseJoin`. */
  allReviewSectionResponseJoins?: Maybe<ReviewSectionResponseJoinsConnection>;
  /** Reads and enables pagination through a set of `Template`. */
  allTemplates?: Maybe<TemplatesConnection>;
  /** Reads and enables pagination through a set of `TemplateAction`. */
  allTemplateActions?: Maybe<TemplateActionsConnection>;
  /** Reads and enables pagination through a set of `TemplateElement`. */
  allTemplateElements?: Maybe<TemplateElementsConnection>;
  /** Reads and enables pagination through a set of `TemplateInformation`. */
  allTemplateInformations?: Maybe<TemplateInformationsConnection>;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  allTemplatePermissions?: Maybe<TemplatePermissionsConnection>;
  /** Reads and enables pagination through a set of `TemplateQuestion`. */
  allTemplateQuestions?: Maybe<TemplateQuestionsConnection>;
  /** Reads and enables pagination through a set of `TemplateQuestionOption`. */
  allTemplateQuestionOptions?: Maybe<TemplateQuestionOptionsConnection>;
  /** Reads and enables pagination through a set of `TemplateQuestionType`. */
  allTemplateQuestionTypes?: Maybe<TemplateQuestionTypesConnection>;
  /** Reads and enables pagination through a set of `TemplateReviewStage`. */
  allTemplateReviewStages?: Maybe<TemplateReviewStagesConnection>;
  /** Reads and enables pagination through a set of `TemplateSection`. */
  allTemplateSections?: Maybe<TemplateSectionsConnection>;
  /** Reads and enables pagination through a set of `TemplateStage`. */
  allTemplateStages?: Maybe<TemplateStagesConnection>;
  /** Reads and enables pagination through a set of `TemplateVersion`. */
  allTemplateVersions?: Maybe<TemplateVersionsConnection>;
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<UsersConnection>;
  /** Reads and enables pagination through a set of `UserOrganisation`. */
  allUserOrganisations?: Maybe<UserOrganisationsConnection>;
  actionById?: Maybe<Action>;
  actionQueueById?: Maybe<ActionQueue>;
  applicationById?: Maybe<Application>;
  applicationResponseById?: Maybe<ApplicationResponse>;
  applicationSectionById?: Maybe<ApplicationSection>;
  applicationStageHistoryById?: Maybe<ApplicationStageHistory>;
  applicationStatusHistoryById?: Maybe<ApplicationStatusHistory>;
  organisationById?: Maybe<Organisation>;
  permissionJoinById?: Maybe<PermissionJoin>;
  permissionNameById?: Maybe<PermissionName>;
  permissionPolicyById?: Maybe<PermissionPolicy>;
  reviewById?: Maybe<Review>;
  reviewResponseById?: Maybe<ReviewResponse>;
  reviewSectionById?: Maybe<ReviewSection>;
  reviewSectionAssignmentById?: Maybe<ReviewSectionAssignment>;
  reviewSectionJoinById?: Maybe<ReviewSectionJoin>;
  reviewSectionResponseJoinById?: Maybe<ReviewSectionResponseJoin>;
  templateById?: Maybe<Template>;
  templateActionById?: Maybe<TemplateAction>;
  templateElementById?: Maybe<TemplateElement>;
  templateInformationById?: Maybe<TemplateInformation>;
  templatePermissionById?: Maybe<TemplatePermission>;
  templateQuestionById?: Maybe<TemplateQuestion>;
  templateQuestionOptionById?: Maybe<TemplateQuestionOption>;
  templateQuestionTypeById?: Maybe<TemplateQuestionType>;
  templateReviewStageById?: Maybe<TemplateReviewStage>;
  templateSectionById?: Maybe<TemplateSection>;
  templateStageById?: Maybe<TemplateStage>;
  templateVersionById?: Maybe<TemplateVersion>;
  userById?: Maybe<User>;
  userOrganisationById?: Maybe<UserOrganisation>;
  getEnumLabels: GetEnumLabelsConnection;
  jwtCheckPolicy?: Maybe<Scalars['Boolean']>;
  jwtGetKey?: Maybe<Scalars['String']>;
  jwtGetPolicyLinksAsSetofText: JwtGetPolicyLinksAsSetofTextConnection;
  jwtGetPolicyLinksAsText?: Maybe<Scalars['String']>;
  /** Reads a single `Action` using its globally unique `ID`. */
  action?: Maybe<Action>;
  /** Reads a single `ActionQueue` using its globally unique `ID`. */
  actionQueue?: Maybe<ActionQueue>;
  /** Reads a single `Application` using its globally unique `ID`. */
  application?: Maybe<Application>;
  /** Reads a single `ApplicationResponse` using its globally unique `ID`. */
  applicationResponse?: Maybe<ApplicationResponse>;
  /** Reads a single `ApplicationSection` using its globally unique `ID`. */
  applicationSection?: Maybe<ApplicationSection>;
  /** Reads a single `ApplicationStageHistory` using its globally unique `ID`. */
  applicationStageHistory?: Maybe<ApplicationStageHistory>;
  /** Reads a single `ApplicationStatusHistory` using its globally unique `ID`. */
  applicationStatusHistory?: Maybe<ApplicationStatusHistory>;
  /** Reads a single `Organisation` using its globally unique `ID`. */
  organisation?: Maybe<Organisation>;
  /** Reads a single `PermissionJoin` using its globally unique `ID`. */
  permissionJoin?: Maybe<PermissionJoin>;
  /** Reads a single `PermissionName` using its globally unique `ID`. */
  permissionName?: Maybe<PermissionName>;
  /** Reads a single `PermissionPolicy` using its globally unique `ID`. */
  permissionPolicy?: Maybe<PermissionPolicy>;
  /** Reads a single `Review` using its globally unique `ID`. */
  review?: Maybe<Review>;
  /** Reads a single `ReviewResponse` using its globally unique `ID`. */
  reviewResponse?: Maybe<ReviewResponse>;
  /** Reads a single `ReviewSection` using its globally unique `ID`. */
  reviewSection?: Maybe<ReviewSection>;
  /** Reads a single `ReviewSectionAssignment` using its globally unique `ID`. */
  reviewSectionAssignment?: Maybe<ReviewSectionAssignment>;
  /** Reads a single `ReviewSectionJoin` using its globally unique `ID`. */
  reviewSectionJoin?: Maybe<ReviewSectionJoin>;
  /** Reads a single `ReviewSectionResponseJoin` using its globally unique `ID`. */
  reviewSectionResponseJoin?: Maybe<ReviewSectionResponseJoin>;
  /** Reads a single `Template` using its globally unique `ID`. */
  template?: Maybe<Template>;
  /** Reads a single `TemplateAction` using its globally unique `ID`. */
  templateAction?: Maybe<TemplateAction>;
  /** Reads a single `TemplateElement` using its globally unique `ID`. */
  templateElement?: Maybe<TemplateElement>;
  /** Reads a single `TemplateInformation` using its globally unique `ID`. */
  templateInformation?: Maybe<TemplateInformation>;
  /** Reads a single `TemplatePermission` using its globally unique `ID`. */
  templatePermission?: Maybe<TemplatePermission>;
  /** Reads a single `TemplateQuestion` using its globally unique `ID`. */
  templateQuestion?: Maybe<TemplateQuestion>;
  /** Reads a single `TemplateQuestionOption` using its globally unique `ID`. */
  templateQuestionOption?: Maybe<TemplateQuestionOption>;
  /** Reads a single `TemplateQuestionType` using its globally unique `ID`. */
  templateQuestionType?: Maybe<TemplateQuestionType>;
  /** Reads a single `TemplateReviewStage` using its globally unique `ID`. */
  templateReviewStage?: Maybe<TemplateReviewStage>;
  /** Reads a single `TemplateSection` using its globally unique `ID`. */
  templateSection?: Maybe<TemplateSection>;
  /** Reads a single `TemplateStage` using its globally unique `ID`. */
  templateStage?: Maybe<TemplateStage>;
  /** Reads a single `TemplateVersion` using its globally unique `ID`. */
  templateVersion?: Maybe<TemplateVersion>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
  /** Reads a single `UserOrganisation` using its globally unique `ID`. */
  userOrganisation?: Maybe<UserOrganisation>;
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryAllActionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ActionsOrderBy>>;
  condition?: Maybe<ActionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllActionQueuesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
  condition?: Maybe<ActionQueueCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllApplicationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllApplicationResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
  condition?: Maybe<ApplicationResponseCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllApplicationSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
  condition?: Maybe<ApplicationSectionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllApplicationStageHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStageHistoryCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllApplicationStatusHistoriesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStatusHistoryCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllOrganisationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<OrganisationsOrderBy>>;
  condition?: Maybe<OrganisationCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPermissionJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPermissionNamesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionNamesOrderBy>>;
  condition?: Maybe<PermissionNameCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllPermissionPoliciesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionPoliciesOrderBy>>;
  condition?: Maybe<PermissionPolicyCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllReviewsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
  condition?: Maybe<ReviewCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllReviewResponsesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
  condition?: Maybe<ReviewResponseCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllReviewSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionsOrderBy>>;
  condition?: Maybe<ReviewSectionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllReviewSectionAssignmentsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewSectionAssignmentCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllReviewSectionJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionJoinCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllReviewSectionResponseJoinsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionResponseJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionResponseJoinCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplatesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatesOrderBy>>;
  condition?: Maybe<TemplateCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateActionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
  condition?: Maybe<TemplateActionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateElementsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
  condition?: Maybe<TemplateElementCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateInformationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateInformationsOrderBy>>;
  condition?: Maybe<TemplateInformationCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplatePermissionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateQuestionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateQuestionsOrderBy>>;
  condition?: Maybe<TemplateQuestionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateQuestionOptionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateQuestionOptionsOrderBy>>;
  condition?: Maybe<TemplateQuestionOptionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateQuestionTypesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateQuestionTypesOrderBy>>;
  condition?: Maybe<TemplateQuestionTypeCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateReviewStagesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
  condition?: Maybe<TemplateReviewStageCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateSectionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
  condition?: Maybe<TemplateSectionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateStagesArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
  condition?: Maybe<TemplateStageCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllTemplateVersionsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateVersionsOrderBy>>;
  condition?: Maybe<TemplateVersionCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UsersOrderBy>>;
  condition?: Maybe<UserCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllUserOrganisationsArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
  condition?: Maybe<UserOrganisationCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryActionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryActionQueueByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationResponseByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationSectionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStageHistoryByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStatusHistoryByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganisationByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionJoinByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionNameByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionPolicyByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewResponseByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionAssignmentByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionJoinByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionResponseJoinByIdArgs = {
  id: Scalars['BigInt'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateActionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateElementByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateInformationByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplatePermissionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateQuestionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateQuestionOptionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateQuestionTypeByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateReviewStageByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateSectionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateStageByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateVersionByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganisationByIdArgs = {
  id: Scalars['Int'];
};


/** The root query type which gives access points into the data universe. */
export type QueryGetEnumLabelsArgs = {
  enumName?: Maybe<Scalars['BigFloat']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtCheckPolicyArgs = {
  policyName?: Maybe<Scalars['String']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtGetKeyArgs = {
  jwtKey?: Maybe<Scalars['String']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtGetPolicyLinksAsSetofTextArgs = {
  policyName?: Maybe<Scalars['String']>;
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryJwtGetPolicyLinksAsTextArgs = {
  policyName?: Maybe<Scalars['String']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryActionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryActionQueueArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationResponseArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationSectionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStageHistoryArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryApplicationStatusHistoryArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryOrganisationArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionJoinArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionNameArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPermissionPolicyArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewResponseArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionAssignmentArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionJoinArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryReviewSectionResponseJoinArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateActionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateElementArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateInformationArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplatePermissionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateQuestionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateQuestionOptionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateQuestionTypeArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateReviewStageArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateSectionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateStageArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryTemplateVersionArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  nodeId: Scalars['ID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryUserOrganisationArgs = {
  nodeId: Scalars['ID'];
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
};


/** Methods to use when ordering `Action`. */
export enum ActionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  PathAsc = 'PATH_ASC',
  PathDesc = 'PATH_DESC',
  RequiredParametersAsc = 'REQUIRED_PARAMETERS_ASC',
  RequiredParametersDesc = 'REQUIRED_PARAMETERS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Action` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ActionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `path` field. */
  path?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `requiredParameters` field. */
  requiredParameters?: Maybe<Scalars['JSON']>;
};


/** A connection to a list of `Action` values. */
export type ActionsConnection = {
  __typename?: 'ActionsConnection';
  /** A list of `Action` objects. */
  nodes: Array<Maybe<Action>>;
  /** A list of edges which contains the `Action` and cursor to aid in pagination. */
  edges: Array<ActionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Action` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type Action = Node & {
  __typename?: 'Action';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  requiredParameters?: Maybe<Scalars['JSON']>;
  /** Reads and enables pagination through a set of `TemplateAction`. */
  templateActionsByActionId: TemplateActionsConnection;
  /** Reads and enables pagination through a set of `TemplateAction`. */
  templateActionsByPreviousActionId: TemplateActionsConnection;
};


export type ActionTemplateActionsByActionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
  condition?: Maybe<TemplateActionCondition>;
};


export type ActionTemplateActionsByPreviousActionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
  condition?: Maybe<TemplateActionCondition>;
};

/** Methods to use when ordering `TemplateAction`. */
export enum TemplateActionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  ActionIdAsc = 'ACTION_ID_ASC',
  ActionIdDesc = 'ACTION_ID_DESC',
  PreviousActionIdAsc = 'PREVIOUS_ACTION_ID_ASC',
  PreviousActionIdDesc = 'PREVIOUS_ACTION_ID_DESC',
  TriggerAsc = 'TRIGGER_ASC',
  TriggerDesc = 'TRIGGER_DESC',
  ConditionsAsc = 'CONDITIONS_ASC',
  ConditionsDesc = 'CONDITIONS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateAction` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateActionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `actionId` field. */
  actionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `previousActionId` field. */
  previousActionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `trigger` field. */
  trigger?: Maybe<Trigger>;
  /** Checks for equality with the object’s `conditions` field. */
  conditions?: Maybe<Scalars['JSON']>;
};

export enum Trigger {
  OnApplicationCreate = 'ON_APPLICATION_CREATE',
  OnApplicationSubmit = 'ON_APPLICATION_SUBMIT',
  OnApplicationSave = 'ON_APPLICATION_SAVE',
  OnApplicationWithdrawn = 'ON_APPLICATION_WITHDRAWN',
  OnReviewStart = 'ON_REVIEW_START',
  OnReviewEditComment = 'ON_REVIEW_EDIT_COMMENT',
  OnReviewSave = 'ON_REVIEW_SAVE',
  OnReviewAssign = 'ON_REVIEW_ASSIGN',
  OnApprovalSubmit = 'ON_APPROVAL_SUBMIT',
  OnScheduleTime = 'ON_SCHEDULE_TIME'
}

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
  actionId?: Maybe<Scalars['Int']>;
  previousActionId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  conditions?: Maybe<Scalars['JSON']>;
  /** Reads a single `Template` that is related to this `TemplateAction`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByActionId?: Maybe<Action>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByPreviousActionId?: Maybe<Action>;
};

export type Template = Node & {
  __typename?: 'Template';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  versionId?: Maybe<Scalars['Int']>;
  templateName?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  status?: Maybe<TemplateStatus>;
  /** Reads a single `TemplateVersion` that is related to this `Template`. */
  templateVersionByVersionId?: Maybe<TemplateVersion>;
  /** Reads and enables pagination through a set of `TemplateStage`. */
  templateStagesByTamplateId: TemplateStagesConnection;
  /** Reads and enables pagination through a set of `TemplateSection`. */
  templateSectionsByTemplateId: TemplateSectionsConnection;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissionsByTemplateId: TemplatePermissionsConnection;
  /** Reads and enables pagination through a set of `Application`. */
  applicationsByTemplateId: ApplicationsConnection;
  /** Reads and enables pagination through a set of `TemplateAction`. */
  templateActionsByTemplateId: TemplateActionsConnection;
};


export type TemplateTemplateStagesByTamplateIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
  condition?: Maybe<TemplateStageCondition>;
};


export type TemplateTemplateSectionsByTemplateIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
  condition?: Maybe<TemplateSectionCondition>;
};


export type TemplateTemplatePermissionsByTemplateIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
};


export type TemplateApplicationsByTemplateIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
};


export type TemplateTemplateActionsByTemplateIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
  condition?: Maybe<TemplateActionCondition>;
};

export enum TemplateStatus {
  Draft = 'DRAFT',
  Available = 'AVAILABLE',
  Disabled = 'DISABLED'
}

export type TemplateVersion = Node & {
  __typename?: 'TemplateVersion';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  number?: Maybe<Scalars['Int']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  /** Reads and enables pagination through a set of `Template`. */
  templatesByVersionId: TemplatesConnection;
};


export type TemplateVersionTemplatesByVersionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatesOrderBy>>;
  condition?: Maybe<TemplateCondition>;
};


/** Methods to use when ordering `Template`. */
export enum TemplatesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  VersionIdAsc = 'VERSION_ID_ASC',
  VersionIdDesc = 'VERSION_ID_DESC',
  TemplateNameAsc = 'TEMPLATE_NAME_ASC',
  TemplateNameDesc = 'TEMPLATE_NAME_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Template` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `versionId` field. */
  versionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateName` field. */
  templateName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<TemplateStatus>;
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

/** Methods to use when ordering `TemplateStage`. */
export enum TemplateStagesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TamplateIdAsc = 'TAMPLATE_ID_ASC',
  TamplateIdDesc = 'TAMPLATE_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateStage` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateStageCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `tamplateId` field. */
  tamplateId?: Maybe<Scalars['Int']>;
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
  tamplateId?: Maybe<Scalars['Int']>;
  /** Reads a single `Template` that is related to this `TemplateStage`. */
  templateByTamplateId?: Maybe<Template>;
  /** Reads and enables pagination through a set of `TemplateReviewStage`. */
  templateReviewStagesByTemplateStageId: TemplateReviewStagesConnection;
};


export type TemplateStageTemplateReviewStagesByTemplateStageIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
  condition?: Maybe<TemplateReviewStageCondition>;
};

/** Methods to use when ordering `TemplateReviewStage`. */
export enum TemplateReviewStagesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateStageIdAsc = 'TEMPLATE_STAGE_ID_ASC',
  TemplateStageIdDesc = 'TEMPLATE_STAGE_ID_DESC',
  PermissionJoinIdAsc = 'PERMISSION_JOIN_ID_ASC',
  PermissionJoinIdDesc = 'PERMISSION_JOIN_ID_DESC',
  NextReviewStageIdAsc = 'NEXT_REVIEW_STAGE_ID_ASC',
  NextReviewStageIdDesc = 'NEXT_REVIEW_STAGE_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateReviewStage` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateReviewStageCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateStageId` field. */
  templateStageId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `permissionJoinId` field. */
  permissionJoinId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `nextReviewStageId` field. */
  nextReviewStageId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
};

/** A connection to a list of `TemplateReviewStage` values. */
export type TemplateReviewStagesConnection = {
  __typename?: 'TemplateReviewStagesConnection';
  /** A list of `TemplateReviewStage` objects. */
  nodes: Array<Maybe<TemplateReviewStage>>;
  /** A list of edges which contains the `TemplateReviewStage` and cursor to aid in pagination. */
  edges: Array<TemplateReviewStagesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateReviewStage` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplateReviewStage = Node & {
  __typename?: 'TemplateReviewStage';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateStageId?: Maybe<Scalars['Int']>;
  permissionJoinId?: Maybe<Scalars['Int']>;
  nextReviewStageId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  /** Reads a single `TemplateStage` that is related to this `TemplateReviewStage`. */
  templateStageByTemplateStageId?: Maybe<TemplateStage>;
  /** Reads a single `PermissionJoin` that is related to this `TemplateReviewStage`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `TemplateReviewStage` that is related to this `TemplateReviewStage`. */
  templateReviewStageByNextReviewStageId?: Maybe<TemplateReviewStage>;
  /** Reads and enables pagination through a set of `TemplateReviewStage`. */
  templateReviewStagesByNextReviewStageId: TemplateReviewStagesConnection;
};


export type TemplateReviewStageTemplateReviewStagesByNextReviewStageIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
  condition?: Maybe<TemplateReviewStageCondition>;
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
  userByUserId?: Maybe<User>;
  /** Reads a single `UserOrganisation` that is related to this `PermissionJoin`. */
  userOrganisationByUserOrganisationId?: Maybe<UserOrganisation>;
  /** Reads a single `PermissionName` that is related to this `PermissionJoin`. */
  permissionNameByPermissionNameId?: Maybe<PermissionName>;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissionsByPermissionJoinId: TemplatePermissionsConnection;
  /** Reads and enables pagination through a set of `TemplateReviewStage`. */
  templateReviewStagesByPermissionJoinId: TemplateReviewStagesConnection;
};


export type PermissionJoinTemplatePermissionsByPermissionJoinIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
};


export type PermissionJoinTemplateReviewStagesByPermissionJoinIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
  condition?: Maybe<TemplateReviewStageCondition>;
};

export type User = Node & {
  __typename?: 'User';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
  /** Reads and enables pagination through a set of `UserOrganisation`. */
  userOrganisationsByUserId: UserOrganisationsConnection;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoinsByUserId: PermissionJoinsConnection;
  /** Reads and enables pagination through a set of `Application`. */
  applicationsByUserId: ApplicationsConnection;
  /** Reads and enables pagination through a set of `ReviewSectionAssignment`. */
  reviewSectionAssignmentsByReviewerId: ReviewSectionAssignmentsConnection;
  /** Reads and enables pagination through a set of `ReviewSectionAssignment`. */
  reviewSectionAssignmentsByAssignerId: ReviewSectionAssignmentsConnection;
};


export type UserUserOrganisationsByUserIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
  condition?: Maybe<UserOrganisationCondition>;
};


export type UserPermissionJoinsByUserIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
};


export type UserApplicationsByUserIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
  condition?: Maybe<ApplicationCondition>;
};


export type UserReviewSectionAssignmentsByReviewerIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewSectionAssignmentCondition>;
};


export type UserReviewSectionAssignmentsByAssignerIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewSectionAssignmentCondition>;
};

export enum UserRole {
  Applicant = 'APPLICANT',
  Reviewer = 'REVIEWER',
  Supervisor = 'SUPERVISOR',
  Chief = 'CHIEF',
  Director = 'DIRECTOR'
}

/** Methods to use when ordering `UserOrganisation`. */
export enum UserOrganisationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  OrganistionIdAsc = 'ORGANISTION_ID_ASC',
  OrganistionIdDesc = 'ORGANISTION_ID_DESC',
  JobAsc = 'JOB_ASC',
  JobDesc = 'JOB_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `UserOrganisation` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserOrganisationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `organistionId` field. */
  organistionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `job` field. */
  job?: Maybe<Scalars['String']>;
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
  organistionId?: Maybe<Scalars['Int']>;
  job?: Maybe<Scalars['String']>;
  /** Reads a single `User` that is related to this `UserOrganisation`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `Organisation` that is related to this `UserOrganisation`. */
  organisationByOrganistionId?: Maybe<Organisation>;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoinsByUserOrganisationId: PermissionJoinsConnection;
};


export type UserOrganisationPermissionJoinsByUserOrganisationIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
};

export type Organisation = Node & {
  __typename?: 'Organisation';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `UserOrganisation`. */
  userOrganisationsByOrganistionId: UserOrganisationsConnection;
};


export type OrganisationUserOrganisationsByOrganistionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
  condition?: Maybe<UserOrganisationCondition>;
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

/** Methods to use when ordering `Application`. */
export enum ApplicationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
  SerialAsc = 'SERIAL_ASC',
  SerialDesc = 'SERIAL_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  OutcomeAsc = 'OUTCOME_ASC',
  OutcomeDesc = 'OUTCOME_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
  TriggeringAsc = 'TRIGGERING_ASC',
  TriggeringDesc = 'TRIGGERING_DESC',
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
  /** Checks for equality with the object’s `serial` field. */
  serial?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `outcome` field. */
  outcome?: Maybe<ApplicationOutcome>;
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `triggering` field. */
  triggering?: Maybe<Scalars['String']>;
};

export enum ApplicationOutcome {
  Pending = 'PENDING',
  Approved = 'APPROVED',
  Rejected = 'REJECTED'
}

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

export type Application = Node & {
  __typename?: 'Application';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  triggering?: Maybe<Scalars['String']>;
  /** Reads a single `Template` that is related to this `Application`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `User` that is related to this `Application`. */
  userByUserId?: Maybe<User>;
  /** Reads and enables pagination through a set of `ApplicationSection`. */
  applicationSectionsByApplicationId: ApplicationSectionsConnection;
  /** Reads and enables pagination through a set of `ApplicationStageHistory`. */
  applicationStageHistoriesByApplicationId: ApplicationStageHistoriesConnection;
  /** Reads and enables pagination through a set of `ApplicationResponse`. */
  applicationResponsesByApplicationId: ApplicationResponsesConnection;
};


export type ApplicationApplicationSectionsByApplicationIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
  condition?: Maybe<ApplicationSectionCondition>;
};


export type ApplicationApplicationStageHistoriesByApplicationIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStageHistoryCondition>;
};


export type ApplicationApplicationResponsesByApplicationIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
  condition?: Maybe<ApplicationResponseCondition>;
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
  applicationByApplicationId?: Maybe<Application>;
  /** Reads a single `TemplateSection` that is related to this `ApplicationSection`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
};

export type TemplateSection = Node & {
  __typename?: 'TemplateSection';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  /** Reads a single `Template` that is related to this `TemplateSection`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissionsByTemplateSectionId: TemplatePermissionsConnection;
  /** Reads and enables pagination through a set of `TemplateElement`. */
  templateElementsBySectionId: TemplateElementsConnection;
  /** Reads and enables pagination through a set of `ApplicationSection`. */
  applicationSectionsByTemplateSectionId: ApplicationSectionsConnection;
};


export type TemplateSectionTemplatePermissionsByTemplateSectionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
};


export type TemplateSectionTemplateElementsBySectionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
  condition?: Maybe<TemplateElementCondition>;
};


export type TemplateSectionApplicationSectionsByTemplateSectionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
  condition?: Maybe<ApplicationSectionCondition>;
};

/** Methods to use when ordering `TemplatePermission`. */
export enum TemplatePermissionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  PermissionJoinIdAsc = 'PERMISSION_JOIN_ID_ASC',
  PermissionJoinIdDesc = 'PERMISSION_JOIN_ID_DESC',
  TemplateIdAsc = 'TEMPLATE_ID_ASC',
  TemplateIdDesc = 'TEMPLATE_ID_DESC',
  TemplateSectionIdAsc = 'TEMPLATE_SECTION_ID_ASC',
  TemplateSectionIdDesc = 'TEMPLATE_SECTION_ID_DESC',
  PermissionPolicyIdAsc = 'PERMISSION_POLICY_ID_ASC',
  PermissionPolicyIdDesc = 'PERMISSION_POLICY_ID_DESC',
  RestrictionsAsc = 'RESTRICTIONS_ASC',
  RestrictionsDesc = 'RESTRICTIONS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplatePermission` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplatePermissionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `permissionJoinId` field. */
  permissionJoinId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateId` field. */
  templateId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateSectionId` field. */
  templateSectionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `permissionPolicyId` field. */
  permissionPolicyId?: Maybe<Scalars['Int']>;
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
  permissionJoinId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
  /** Reads a single `PermissionJoin` that is related to this `TemplatePermission`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `Template` that is related to this `TemplatePermission`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `TemplateSection` that is related to this `TemplatePermission`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** Reads a single `PermissionPolicy` that is related to this `TemplatePermission`. */
  permissionPolicyByPermissionPolicyId?: Maybe<PermissionPolicy>;
};

export type PermissionPolicy = Node & {
  __typename?: 'PermissionPolicy';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  rules?: Maybe<Scalars['JSON']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<PermissionPolicyType>;
  /** Reads and enables pagination through a set of `TemplatePermission`. */
  templatePermissionsByPermissionPolicyId: TemplatePermissionsConnection;
};


export type PermissionPolicyTemplatePermissionsByPermissionPolicyIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
  condition?: Maybe<TemplatePermissionCondition>;
};

export enum PermissionPolicyType {
  Review = 'REVIEW',
  Apply = 'APPLY',
  Assign = 'ASSIGN'
}

/** A `TemplatePermission` edge in the connection. */
export type TemplatePermissionsEdge = {
  __typename?: 'TemplatePermissionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplatePermission` at the end of the edge. */
  node?: Maybe<TemplatePermission>;
};

/** Methods to use when ordering `TemplateElement`. */
export enum TemplateElementsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SectionIdAsc = 'SECTION_ID_ASC',
  SectionIdDesc = 'SECTION_ID_DESC',
  NextElementIdAsc = 'NEXT_ELEMENT_ID_ASC',
  NextElementIdDesc = 'NEXT_ELEMENT_ID_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  VisibilityConditionAsc = 'VISIBILITY_CONDITION_ASC',
  VisibilityConditionDesc = 'VISIBILITY_CONDITION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateElement` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateElementCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sectionId` field. */
  sectionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `nextElementId` field. */
  nextElementId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `visibilityCondition` field. */
  visibilityCondition?: Maybe<Scalars['JSON']>;
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
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  /** Reads a single `TemplateSection` that is related to this `TemplateElement`. */
  templateSectionBySectionId?: Maybe<TemplateSection>;
  /** Reads a single `TemplateElement` that is related to this `TemplateElement`. */
  templateElementByNextElementId?: Maybe<TemplateElement>;
  /** Reads and enables pagination through a set of `TemplateElement`. */
  templateElementsByNextElementId: TemplateElementsConnection;
};


export type TemplateElementTemplateElementsByNextElementIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
  condition?: Maybe<TemplateElementCondition>;
};

/** A `TemplateElement` edge in the connection. */
export type TemplateElementsEdge = {
  __typename?: 'TemplateElementsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateElement` at the end of the edge. */
  node?: Maybe<TemplateElement>;
};

/** A `ApplicationSection` edge in the connection. */
export type ApplicationSectionsEdge = {
  __typename?: 'ApplicationSectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationSection` at the end of the edge. */
  node?: Maybe<ApplicationSection>;
};

/** Methods to use when ordering `ApplicationStageHistory`. */
export enum ApplicationStageHistoriesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  StageAsc = 'STAGE_ASC',
  StageDesc = 'STAGE_DESC',
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
  /** Checks for equality with the object’s `stage` field. */
  stage?: Maybe<ApplicationStage>;
  /** Checks for equality with the object’s `timeCreated` field. */
  timeCreated?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `isCurrent` field. */
  isCurrent?: Maybe<Scalars['Boolean']>;
};

export enum ApplicationStage {
  Screening = 'SCREENING',
  Assessment = 'ASSESSMENT',
  FinalDecision = 'FINAL_DECISION'
}

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
  stage?: Maybe<ApplicationStage>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
  /** Reads a single `Application` that is related to this `ApplicationStageHistory`. */
  applicationByApplicationId?: Maybe<Application>;
  /** Reads and enables pagination through a set of `ApplicationStatusHistory`. */
  applicationStatusHistoriesByApplicationStageHistoryId: ApplicationStatusHistoriesConnection;
  /** Reads and enables pagination through a set of `ReviewSectionAssignment`. */
  reviewSectionAssignmentsByStageId: ReviewSectionAssignmentsConnection;
};


export type ApplicationStageHistoryApplicationStatusHistoriesByApplicationStageHistoryIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
  condition?: Maybe<ApplicationStatusHistoryCondition>;
};


export type ApplicationStageHistoryReviewSectionAssignmentsByStageIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
  condition?: Maybe<ReviewSectionAssignmentCondition>;
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
};

export enum ApplicationStatus {
  Draft = 'DRAFT',
  Withdrawn = 'WITHDRAWN',
  Submitted = 'SUBMITTED',
  ChangesRequired = 'CHANGES_REQUIRED',
  ReSubmitted = 'RE_SUBMITTED',
  Completed = 'COMPLETED'
}

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
  /** Reads a single `ApplicationStageHistory` that is related to this `ApplicationStatusHistory`. */
  applicationStageHistoryByApplicationStageHistoryId?: Maybe<ApplicationStageHistory>;
};

/** A `ApplicationStatusHistory` edge in the connection. */
export type ApplicationStatusHistoriesEdge = {
  __typename?: 'ApplicationStatusHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationStatusHistory` at the end of the edge. */
  node?: Maybe<ApplicationStatusHistory>;
};

/** Methods to use when ordering `ReviewSectionAssignment`. */
export enum ReviewSectionAssignmentsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReviewerIdAsc = 'REVIEWER_ID_ASC',
  ReviewerIdDesc = 'REVIEWER_ID_DESC',
  AssignerIdAsc = 'ASSIGNER_ID_ASC',
  AssignerIdDesc = 'ASSIGNER_ID_DESC',
  StageIdAsc = 'STAGE_ID_ASC',
  StageIdDesc = 'STAGE_ID_DESC',
  SectionIdAsc = 'SECTION_ID_ASC',
  SectionIdDesc = 'SECTION_ID_DESC',
  LevelAsc = 'LEVEL_ASC',
  LevelDesc = 'LEVEL_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewSectionAssignment` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewSectionAssignmentCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reviewerId` field. */
  reviewerId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `assignerId` field. */
  assignerId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `stageId` field. */
  stageId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `sectionId` field. */
  sectionId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `level` field. */
  level?: Maybe<Scalars['Int']>;
};


/** A connection to a list of `ReviewSectionAssignment` values. */
export type ReviewSectionAssignmentsConnection = {
  __typename?: 'ReviewSectionAssignmentsConnection';
  /** A list of `ReviewSectionAssignment` objects. */
  nodes: Array<Maybe<ReviewSectionAssignment>>;
  /** A list of edges which contains the `ReviewSectionAssignment` and cursor to aid in pagination. */
  edges: Array<ReviewSectionAssignmentsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewSectionAssignment` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ReviewSectionAssignment = Node & {
  __typename?: 'ReviewSectionAssignment';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  reviewerId?: Maybe<Scalars['BigInt']>;
  assignerId?: Maybe<Scalars['BigInt']>;
  stageId?: Maybe<Scalars['BigInt']>;
  sectionId: Scalars['BigInt'];
  level: Scalars['Int'];
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByReviewerId?: Maybe<User>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByAssignerId?: Maybe<User>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ReviewSectionAssignment`. */
  applicationStageHistoryByStageId?: Maybe<ApplicationStageHistory>;
  /** Reads and enables pagination through a set of `ReviewSectionJoin`. */
  reviewSectionJoinsBySectionAssignmentId: ReviewSectionJoinsConnection;
};


export type ReviewSectionAssignmentReviewSectionJoinsBySectionAssignmentIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionJoinCondition>;
};

/** Methods to use when ordering `ReviewSectionJoin`. */
export enum ReviewSectionJoinsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReviewIdAsc = 'REVIEW_ID_ASC',
  ReviewIdDesc = 'REVIEW_ID_DESC',
  SectionAssignmentIdAsc = 'SECTION_ASSIGNMENT_ID_ASC',
  SectionAssignmentIdDesc = 'SECTION_ASSIGNMENT_ID_DESC',
  ReviewSectionIdAsc = 'REVIEW_SECTION_ID_ASC',
  ReviewSectionIdDesc = 'REVIEW_SECTION_ID_DESC',
  SendToApplicantAsc = 'SEND_TO_APPLICANT_ASC',
  SendToApplicantDesc = 'SEND_TO_APPLICANT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewSectionJoin` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewSectionJoinCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reviewId` field. */
  reviewId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sectionAssignmentId` field. */
  sectionAssignmentId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reviewSectionId` field. */
  reviewSectionId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `sendToApplicant` field. */
  sendToApplicant?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `ReviewSectionJoin` values. */
export type ReviewSectionJoinsConnection = {
  __typename?: 'ReviewSectionJoinsConnection';
  /** A list of `ReviewSectionJoin` objects. */
  nodes: Array<Maybe<ReviewSectionJoin>>;
  /** A list of edges which contains the `ReviewSectionJoin` and cursor to aid in pagination. */
  edges: Array<ReviewSectionJoinsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewSectionJoin` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ReviewSectionJoin = Node & {
  __typename?: 'ReviewSectionJoin';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  reviewId: Scalars['Int'];
  sectionAssignmentId: Scalars['BigInt'];
  reviewSectionId: Scalars['BigInt'];
  sendToApplicant: Scalars['Boolean'];
  /** Reads a single `Review` that is related to this `ReviewSectionJoin`. */
  reviewByReviewId?: Maybe<Review>;
  /** Reads a single `ReviewSectionAssignment` that is related to this `ReviewSectionJoin`. */
  reviewSectionAssignmentBySectionAssignmentId?: Maybe<ReviewSectionAssignment>;
  /** Reads a single `ReviewSection` that is related to this `ReviewSectionJoin`. */
  reviewSectionByReviewSectionId?: Maybe<ReviewSection>;
  /** Reads and enables pagination through a set of `ReviewSectionResponseJoin`. */
  reviewSectionResponseJoinsByReviewSectionJoinId: ReviewSectionResponseJoinsConnection;
};


export type ReviewSectionJoinReviewSectionResponseJoinsByReviewSectionJoinIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionResponseJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionResponseJoinCondition>;
};

export type Review = Node & {
  __typename?: 'Review';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  applicationId?: Maybe<Scalars['BigInt']>;
  status?: Maybe<ReviewStatus>;
  comment?: Maybe<Scalars['String']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  /** Reads and enables pagination through a set of `ReviewSectionJoin`. */
  reviewSectionJoinsByReviewId: ReviewSectionJoinsConnection;
};


export type ReviewReviewSectionJoinsByReviewIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionJoinCondition>;
};

export enum ReviewStatus {
  AwaitingReview = 'AWAITING_REVIEW',
  InProgress = 'IN_PROGRESS',
  Ready = 'READY',
  Approvable = 'APPROVABLE',
  NonApprovable = 'NON_APPROVABLE'
}

export type ReviewSection = Node & {
  __typename?: 'ReviewSection';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  reviewDecision?: Maybe<ReviewDecision>;
  comment: Scalars['String'];
  /** Reads and enables pagination through a set of `ReviewSectionJoin`. */
  reviewSectionJoinsByReviewSectionId: ReviewSectionJoinsConnection;
};


export type ReviewSectionReviewSectionJoinsByReviewSectionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionJoinCondition>;
};

export enum ReviewDecision {
  Approved = 'APPROVED',
  Rejected = 'REJECTED',
  Observations = 'OBSERVATIONS'
}

/** Methods to use when ordering `ReviewSectionResponseJoin`. */
export enum ReviewSectionResponseJoinsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReviewSectionJoinIdAsc = 'REVIEW_SECTION_JOIN_ID_ASC',
  ReviewSectionJoinIdDesc = 'REVIEW_SECTION_JOIN_ID_DESC',
  ReviewResponseIdAsc = 'REVIEW_RESPONSE_ID_ASC',
  ReviewResponseIdDesc = 'REVIEW_RESPONSE_ID_DESC',
  SendToApplicantAsc = 'SEND_TO_APPLICANT_ASC',
  SendToApplicantDesc = 'SEND_TO_APPLICANT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewSectionResponseJoin` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewSectionResponseJoinCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reviewSectionJoinId` field. */
  reviewSectionJoinId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reviewResponseId` field. */
  reviewResponseId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `sendToApplicant` field. */
  sendToApplicant?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `ReviewSectionResponseJoin` values. */
export type ReviewSectionResponseJoinsConnection = {
  __typename?: 'ReviewSectionResponseJoinsConnection';
  /** A list of `ReviewSectionResponseJoin` objects. */
  nodes: Array<Maybe<ReviewSectionResponseJoin>>;
  /** A list of edges which contains the `ReviewSectionResponseJoin` and cursor to aid in pagination. */
  edges: Array<ReviewSectionResponseJoinsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewSectionResponseJoin` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type ReviewSectionResponseJoin = Node & {
  __typename?: 'ReviewSectionResponseJoin';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  reviewSectionJoinId: Scalars['BigInt'];
  reviewResponseId: Scalars['BigInt'];
  sendToApplicant: Scalars['Boolean'];
  /** Reads a single `ReviewSectionJoin` that is related to this `ReviewSectionResponseJoin`. */
  reviewSectionJoinByReviewSectionJoinId?: Maybe<ReviewSectionJoin>;
  /** Reads a single `ReviewResponse` that is related to this `ReviewSectionResponseJoin`. */
  reviewResponseByReviewResponseId?: Maybe<ReviewResponse>;
};

export type ReviewResponse = Node & {
  __typename?: 'ReviewResponse';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['BigInt'];
  applicationResponseId?: Maybe<Scalars['Int']>;
  comment: Scalars['String'];
  reviewDecision?: Maybe<ReviewDecision>;
  /** Reads a single `ApplicationResponse` that is related to this `ReviewResponse`. */
  applicationResponseByApplicationResponseId?: Maybe<ApplicationResponse>;
  /** Reads and enables pagination through a set of `ReviewSectionResponseJoin`. */
  reviewSectionResponseJoinsByReviewResponseId: ReviewSectionResponseJoinsConnection;
};


export type ReviewResponseReviewSectionResponseJoinsByReviewResponseIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewSectionResponseJoinsOrderBy>>;
  condition?: Maybe<ReviewSectionResponseJoinCondition>;
};

export type ApplicationResponse = Node & {
  __typename?: 'ApplicationResponse';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  templateQuestionId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  /** Reads a single `TemplateQuestion` that is related to this `ApplicationResponse`. */
  templateQuestionByTemplateQuestionId?: Maybe<TemplateQuestion>;
  /** Reads a single `Application` that is related to this `ApplicationResponse`. */
  applicationByApplicationId?: Maybe<Application>;
  /** Reads and enables pagination through a set of `ReviewResponse`. */
  reviewResponsesByApplicationResponseId: ReviewResponsesConnection;
};


export type ApplicationResponseReviewResponsesByApplicationResponseIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
  condition?: Maybe<ReviewResponseCondition>;
};

export type TemplateQuestion = Node & {
  __typename?: 'TemplateQuestion';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  questionTypeId?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  isEditable?: Maybe<Scalars['Boolean']>;
  parameters?: Maybe<Scalars['JSON']>;
  /** Reads a single `TemplateQuestionType` that is related to this `TemplateQuestion`. */
  templateQuestionTypeByQuestionTypeId?: Maybe<TemplateQuestionType>;
  /** Reads and enables pagination through a set of `TemplateQuestionOption`. */
  templateQuestionOptionsByQuestionId: TemplateQuestionOptionsConnection;
  /** Reads and enables pagination through a set of `ApplicationResponse`. */
  applicationResponsesByTemplateQuestionId: ApplicationResponsesConnection;
};


export type TemplateQuestionTemplateQuestionOptionsByQuestionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateQuestionOptionsOrderBy>>;
  condition?: Maybe<TemplateQuestionOptionCondition>;
};


export type TemplateQuestionApplicationResponsesByTemplateQuestionIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
  condition?: Maybe<ApplicationResponseCondition>;
};

export type TemplateQuestionType = Node & {
  __typename?: 'TemplateQuestionType';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  type?: Maybe<QuestionType>;
  defaultOptionName?: Maybe<Scalars['String']>;
  defaultOptionValue?: Maybe<Scalars['JSON']>;
  /** Reads and enables pagination through a set of `TemplateQuestion`. */
  templateQuestionsByQuestionTypeId: TemplateQuestionsConnection;
};


export type TemplateQuestionTypeTemplateQuestionsByQuestionTypeIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<TemplateQuestionsOrderBy>>;
  condition?: Maybe<TemplateQuestionCondition>;
};

export enum QuestionType {
  ShortText = 'SHORT_TEXT',
  LongText = 'LONG_TEXT',
  RadioChoice = 'RADIO_CHOICE',
  CheckboxChoice = 'CHECKBOX_CHOICE',
  Dropdown = 'DROPDOWN',
  List = 'LIST',
  AutoCompleteText = 'AUTO_COMPLETE_TEXT',
  FileUpload = 'FILE_UPLOAD'
}

/** Methods to use when ordering `TemplateQuestion`. */
export enum TemplateQuestionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SectionIdAsc = 'SECTION_ID_ASC',
  SectionIdDesc = 'SECTION_ID_DESC',
  NextElementIdAsc = 'NEXT_ELEMENT_ID_ASC',
  NextElementIdDesc = 'NEXT_ELEMENT_ID_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  VisibilityConditionAsc = 'VISIBILITY_CONDITION_ASC',
  VisibilityConditionDesc = 'VISIBILITY_CONDITION_DESC',
  QuestionTypeIdAsc = 'QUESTION_TYPE_ID_ASC',
  QuestionTypeIdDesc = 'QUESTION_TYPE_ID_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IsRequiredAsc = 'IS_REQUIRED_ASC',
  IsRequiredDesc = 'IS_REQUIRED_DESC',
  IsEditableAsc = 'IS_EDITABLE_ASC',
  IsEditableDesc = 'IS_EDITABLE_DESC',
  ParametersAsc = 'PARAMETERS_ASC',
  ParametersDesc = 'PARAMETERS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateQuestion` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateQuestionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sectionId` field. */
  sectionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `nextElementId` field. */
  nextElementId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `visibilityCondition` field. */
  visibilityCondition?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `questionTypeId` field. */
  questionTypeId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `isRequired` field. */
  isRequired?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `isEditable` field. */
  isEditable?: Maybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `parameters` field. */
  parameters?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TemplateQuestion` values. */
export type TemplateQuestionsConnection = {
  __typename?: 'TemplateQuestionsConnection';
  /** A list of `TemplateQuestion` objects. */
  nodes: Array<Maybe<TemplateQuestion>>;
  /** A list of edges which contains the `TemplateQuestion` and cursor to aid in pagination. */
  edges: Array<TemplateQuestionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateQuestion` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TemplateQuestion` edge in the connection. */
export type TemplateQuestionsEdge = {
  __typename?: 'TemplateQuestionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateQuestion` at the end of the edge. */
  node?: Maybe<TemplateQuestion>;
};

/** Methods to use when ordering `TemplateQuestionOption`. */
export enum TemplateQuestionOptionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  QuestionIdAsc = 'QUESTION_ID_ASC',
  QuestionIdDesc = 'QUESTION_ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateQuestionOption` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateQuestionOptionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `questionId` field. */
  questionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `value` field. */
  value?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TemplateQuestionOption` values. */
export type TemplateQuestionOptionsConnection = {
  __typename?: 'TemplateQuestionOptionsConnection';
  /** A list of `TemplateQuestionOption` objects. */
  nodes: Array<Maybe<TemplateQuestionOption>>;
  /** A list of edges which contains the `TemplateQuestionOption` and cursor to aid in pagination. */
  edges: Array<TemplateQuestionOptionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateQuestionOption` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplateQuestionOption = Node & {
  __typename?: 'TemplateQuestionOption';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  questionId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['JSON']>;
  /** Reads a single `TemplateQuestion` that is related to this `TemplateQuestionOption`. */
  templateQuestionByQuestionId?: Maybe<TemplateQuestion>;
};

/** A `TemplateQuestionOption` edge in the connection. */
export type TemplateQuestionOptionsEdge = {
  __typename?: 'TemplateQuestionOptionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateQuestionOption` at the end of the edge. */
  node?: Maybe<TemplateQuestionOption>;
};

/** Methods to use when ordering `ApplicationResponse`. */
export enum ApplicationResponsesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TemplateQuestionIdAsc = 'TEMPLATE_QUESTION_ID_ASC',
  TemplateQuestionIdDesc = 'TEMPLATE_QUESTION_ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  ValueAsc = 'VALUE_ASC',
  ValueDesc = 'VALUE_DESC',
  TimeCreatedAsc = 'TIME_CREATED_ASC',
  TimeCreatedDesc = 'TIME_CREATED_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ApplicationResponse` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ApplicationResponseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `templateQuestionId` field. */
  templateQuestionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `value` field. */
  value?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `timeCreated` field. */
  timeCreated?: Maybe<Scalars['Datetime']>;
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

/** A `ApplicationResponse` edge in the connection. */
export type ApplicationResponsesEdge = {
  __typename?: 'ApplicationResponsesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationResponse` at the end of the edge. */
  node?: Maybe<ApplicationResponse>;
};

/** Methods to use when ordering `ReviewResponse`. */
export enum ReviewResponsesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ApplicationResponseIdAsc = 'APPLICATION_RESPONSE_ID_ASC',
  ApplicationResponseIdDesc = 'APPLICATION_RESPONSE_ID_DESC',
  CommentAsc = 'COMMENT_ASC',
  CommentDesc = 'COMMENT_DESC',
  ReviewDecisionAsc = 'REVIEW_DECISION_ASC',
  ReviewDecisionDesc = 'REVIEW_DECISION_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewResponse` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewResponseCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `applicationResponseId` field. */
  applicationResponseId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `comment` field. */
  comment?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `reviewDecision` field. */
  reviewDecision?: Maybe<ReviewDecision>;
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

/** A `ReviewResponse` edge in the connection. */
export type ReviewResponsesEdge = {
  __typename?: 'ReviewResponsesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewResponse` at the end of the edge. */
  node?: Maybe<ReviewResponse>;
};

/** A `ReviewSectionResponseJoin` edge in the connection. */
export type ReviewSectionResponseJoinsEdge = {
  __typename?: 'ReviewSectionResponseJoinsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewSectionResponseJoin` at the end of the edge. */
  node?: Maybe<ReviewSectionResponseJoin>;
};

/** A `ReviewSectionJoin` edge in the connection. */
export type ReviewSectionJoinsEdge = {
  __typename?: 'ReviewSectionJoinsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewSectionJoin` at the end of the edge. */
  node?: Maybe<ReviewSectionJoin>;
};

/** A `ReviewSectionAssignment` edge in the connection. */
export type ReviewSectionAssignmentsEdge = {
  __typename?: 'ReviewSectionAssignmentsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewSectionAssignment` at the end of the edge. */
  node?: Maybe<ReviewSectionAssignment>;
};

/** A `ApplicationStageHistory` edge in the connection. */
export type ApplicationStageHistoriesEdge = {
  __typename?: 'ApplicationStageHistoriesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ApplicationStageHistory` at the end of the edge. */
  node?: Maybe<ApplicationStageHistory>;
};

/** A `Application` edge in the connection. */
export type ApplicationsEdge = {
  __typename?: 'ApplicationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Application` at the end of the edge. */
  node?: Maybe<Application>;
};

export type PermissionName = Node & {
  __typename?: 'PermissionName';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  /** Reads and enables pagination through a set of `PermissionJoin`. */
  permissionJoinsByPermissionNameId: PermissionJoinsConnection;
};


export type PermissionNamePermissionJoinsByPermissionNameIdArgs = {
  first?: Maybe<Scalars['Int']>;
  last?: Maybe<Scalars['Int']>;
  offset?: Maybe<Scalars['Int']>;
  before?: Maybe<Scalars['Cursor']>;
  after?: Maybe<Scalars['Cursor']>;
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
  condition?: Maybe<PermissionJoinCondition>;
};

/** A `TemplateReviewStage` edge in the connection. */
export type TemplateReviewStagesEdge = {
  __typename?: 'TemplateReviewStagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateReviewStage` at the end of the edge. */
  node?: Maybe<TemplateReviewStage>;
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

/** A `TemplateAction` edge in the connection. */
export type TemplateActionsEdge = {
  __typename?: 'TemplateActionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateAction` at the end of the edge. */
  node?: Maybe<TemplateAction>;
};

/** A `Action` edge in the connection. */
export type ActionsEdge = {
  __typename?: 'ActionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Action` at the end of the edge. */
  node?: Maybe<Action>;
};

/** Methods to use when ordering `ActionQueue`. */
export enum ActionQueuesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ActionCodeAsc = 'ACTION_CODE_ASC',
  ActionCodeDesc = 'ACTION_CODE_DESC',
  ParametersAsc = 'PARAMETERS_ASC',
  ParametersDesc = 'PARAMETERS_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  TimeQueuedAsc = 'TIME_QUEUED_ASC',
  TimeQueuedDesc = 'TIME_QUEUED_DESC',
  TimeExecutedAsc = 'TIME_EXECUTED_ASC',
  TimeExecutedDesc = 'TIME_EXECUTED_DESC',
  ErrorLogAsc = 'ERROR_LOG_ASC',
  ErrorLogDesc = 'ERROR_LOG_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ActionQueue` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ActionQueueCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `actionCode` field. */
  actionCode?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `parameters` field. */
  parameters?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ActionQueueStatus>;
  /** Checks for equality with the object’s `timeQueued` field. */
  timeQueued?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `timeExecuted` field. */
  timeExecuted?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `errorLog` field. */
  errorLog?: Maybe<Scalars['String']>;
};

export enum ActionQueueStatus {
  Scheduled = 'SCHEDULED',
  Queued = 'QUEUED',
  Success = 'SUCCESS',
  Fail = 'FAIL'
}

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
  actionCode?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeExecuted?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
};

/** A `ActionQueue` edge in the connection. */
export type ActionQueuesEdge = {
  __typename?: 'ActionQueuesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ActionQueue` at the end of the edge. */
  node?: Maybe<ActionQueue>;
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
  licenceNumber?: Maybe<Scalars['Int']>;
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

/** Methods to use when ordering `PermissionName`. */
export enum PermissionNamesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `PermissionName` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PermissionNameCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
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

/** Methods to use when ordering `PermissionPolicy`. */
export enum PermissionPoliciesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  RulesAsc = 'RULES_ASC',
  RulesDesc = 'RULES_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `PermissionPolicy` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PermissionPolicyCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `name` field. */
  name?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `rules` field. */
  rules?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `description` field. */
  description?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `type` field. */
  type?: Maybe<PermissionPolicyType>;
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

/** Methods to use when ordering `Review`. */
export enum ReviewsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ApplicationIdAsc = 'APPLICATION_ID_ASC',
  ApplicationIdDesc = 'APPLICATION_ID_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC',
  CommentAsc = 'COMMENT_ASC',
  CommentDesc = 'COMMENT_DESC',
  TimeCreatedAsc = 'TIME_CREATED_ASC',
  TimeCreatedDesc = 'TIME_CREATED_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `Review` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `applicationId` field. */
  applicationId?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `status` field. */
  status?: Maybe<ReviewStatus>;
  /** Checks for equality with the object’s `comment` field. */
  comment?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `timeCreated` field. */
  timeCreated?: Maybe<Scalars['Datetime']>;
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

/** A `Review` edge in the connection. */
export type ReviewsEdge = {
  __typename?: 'ReviewsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `Review` at the end of the edge. */
  node?: Maybe<Review>;
};

/** Methods to use when ordering `ReviewSection`. */
export enum ReviewSectionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ReviewDecisionAsc = 'REVIEW_DECISION_ASC',
  ReviewDecisionDesc = 'REVIEW_DECISION_DESC',
  CommentAsc = 'COMMENT_ASC',
  CommentDesc = 'COMMENT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `ReviewSection` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ReviewSectionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['BigInt']>;
  /** Checks for equality with the object’s `reviewDecision` field. */
  reviewDecision?: Maybe<ReviewDecision>;
  /** Checks for equality with the object’s `comment` field. */
  comment?: Maybe<Scalars['String']>;
};

/** A connection to a list of `ReviewSection` values. */
export type ReviewSectionsConnection = {
  __typename?: 'ReviewSectionsConnection';
  /** A list of `ReviewSection` objects. */
  nodes: Array<Maybe<ReviewSection>>;
  /** A list of edges which contains the `ReviewSection` and cursor to aid in pagination. */
  edges: Array<ReviewSectionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `ReviewSection` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `ReviewSection` edge in the connection. */
export type ReviewSectionsEdge = {
  __typename?: 'ReviewSectionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `ReviewSection` at the end of the edge. */
  node?: Maybe<ReviewSection>;
};

/** Methods to use when ordering `TemplateInformation`. */
export enum TemplateInformationsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  SectionIdAsc = 'SECTION_ID_ASC',
  SectionIdDesc = 'SECTION_ID_DESC',
  NextElementIdAsc = 'NEXT_ELEMENT_ID_ASC',
  NextElementIdDesc = 'NEXT_ELEMENT_ID_DESC',
  CodeAsc = 'CODE_ASC',
  CodeDesc = 'CODE_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC',
  VisibilityConditionAsc = 'VISIBILITY_CONDITION_ASC',
  VisibilityConditionDesc = 'VISIBILITY_CONDITION_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  ParametersAsc = 'PARAMETERS_ASC',
  ParametersDesc = 'PARAMETERS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateInformation` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateInformationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `sectionId` field. */
  sectionId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `nextElementId` field. */
  nextElementId?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `code` field. */
  code?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `visibilityCondition` field. */
  visibilityCondition?: Maybe<Scalars['JSON']>;
  /** Checks for equality with the object’s `type` field. */
  type?: Maybe<InformationType>;
  /** Checks for equality with the object’s `parameters` field. */
  parameters?: Maybe<Scalars['JSON']>;
};

export enum InformationType {
  GroupStart = 'GROUP_START',
  GroupEnd = 'GROUP_END',
  PageBreak = 'PAGE_BREAK',
  TextInfo = 'TEXT_INFO',
  Image = 'IMAGE'
}

/** A connection to a list of `TemplateInformation` values. */
export type TemplateInformationsConnection = {
  __typename?: 'TemplateInformationsConnection';
  /** A list of `TemplateInformation` objects. */
  nodes: Array<Maybe<TemplateInformation>>;
  /** A list of edges which contains the `TemplateInformation` and cursor to aid in pagination. */
  edges: Array<TemplateInformationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateInformation` you could get from the connection. */
  totalCount: Scalars['Int'];
};

export type TemplateInformation = Node & {
  __typename?: 'TemplateInformation';
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID'];
  id: Scalars['Int'];
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  type?: Maybe<InformationType>;
  parameters?: Maybe<Scalars['JSON']>;
};

/** A `TemplateInformation` edge in the connection. */
export type TemplateInformationsEdge = {
  __typename?: 'TemplateInformationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateInformation` at the end of the edge. */
  node?: Maybe<TemplateInformation>;
};

/** Methods to use when ordering `TemplateQuestionType`. */
export enum TemplateQuestionTypesOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  TypeAsc = 'TYPE_ASC',
  TypeDesc = 'TYPE_DESC',
  DefaultOptionNameAsc = 'DEFAULT_OPTION_NAME_ASC',
  DefaultOptionNameDesc = 'DEFAULT_OPTION_NAME_DESC',
  DefaultOptionValueAsc = 'DEFAULT_OPTION_VALUE_ASC',
  DefaultOptionValueDesc = 'DEFAULT_OPTION_VALUE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateQuestionType` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateQuestionTypeCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `type` field. */
  type?: Maybe<QuestionType>;
  /** Checks for equality with the object’s `defaultOptionName` field. */
  defaultOptionName?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `defaultOptionValue` field. */
  defaultOptionValue?: Maybe<Scalars['JSON']>;
};

/** A connection to a list of `TemplateQuestionType` values. */
export type TemplateQuestionTypesConnection = {
  __typename?: 'TemplateQuestionTypesConnection';
  /** A list of `TemplateQuestionType` objects. */
  nodes: Array<Maybe<TemplateQuestionType>>;
  /** A list of edges which contains the `TemplateQuestionType` and cursor to aid in pagination. */
  edges: Array<TemplateQuestionTypesEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateQuestionType` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TemplateQuestionType` edge in the connection. */
export type TemplateQuestionTypesEdge = {
  __typename?: 'TemplateQuestionTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateQuestionType` at the end of the edge. */
  node?: Maybe<TemplateQuestionType>;
};

/** Methods to use when ordering `TemplateVersion`. */
export enum TemplateVersionsOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NumberAsc = 'NUMBER_ASC',
  NumberDesc = 'NUMBER_DESC',
  TimeCreatedAsc = 'TIME_CREATED_ASC',
  TimeCreatedDesc = 'TIME_CREATED_DESC',
  IsCurrentAsc = 'IS_CURRENT_ASC',
  IsCurrentDesc = 'IS_CURRENT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `TemplateVersion` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type TemplateVersionCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `number` field. */
  number?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `timeCreated` field. */
  timeCreated?: Maybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `isCurrent` field. */
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** A connection to a list of `TemplateVersion` values. */
export type TemplateVersionsConnection = {
  __typename?: 'TemplateVersionsConnection';
  /** A list of `TemplateVersion` objects. */
  nodes: Array<Maybe<TemplateVersion>>;
  /** A list of edges which contains the `TemplateVersion` and cursor to aid in pagination. */
  edges: Array<TemplateVersionsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `TemplateVersion` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `TemplateVersion` edge in the connection. */
export type TemplateVersionsEdge = {
  __typename?: 'TemplateVersionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `TemplateVersion` at the end of the edge. */
  node?: Maybe<TemplateVersion>;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  Natural = 'NATURAL',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  UsernameAsc = 'USERNAME_ASC',
  UsernameDesc = 'USERNAME_DESC',
  PasswordAsc = 'PASSWORD_ASC',
  PasswordDesc = 'PASSWORD_DESC',
  EmailAsc = 'EMAIL_ASC',
  EmailDesc = 'EMAIL_DESC',
  RoleAsc = 'ROLE_ASC',
  RoleDesc = 'ROLE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: Maybe<Scalars['Int']>;
  /** Checks for equality with the object’s `username` field. */
  username?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `password` field. */
  password?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `email` field. */
  email?: Maybe<Scalars['String']>;
  /** Checks for equality with the object’s `role` field. */
  role?: Maybe<UserRole>;
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


/** A connection to a list of `String` values. */
export type GetEnumLabelsConnection = {
  __typename?: 'GetEnumLabelsConnection';
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<GetEnumLabelEdge>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type GetEnumLabelEdge = {
  __typename?: 'GetEnumLabelEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** A connection to a list of `String` values. */
export type JwtGetPolicyLinksAsSetofTextConnection = {
  __typename?: 'JwtGetPolicyLinksAsSetofTextConnection';
  /** A list of `String` objects. */
  nodes: Array<Maybe<Scalars['String']>>;
  /** A list of edges which contains the `String` and cursor to aid in pagination. */
  edges: Array<JwtGetPolicyLinksAsSetofTextEdge>;
  /** The count of *all* `String` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `String` edge in the connection. */
export type JwtGetPolicyLinksAsSetofTextEdge = {
  __typename?: 'JwtGetPolicyLinksAsSetofTextEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `String` at the end of the edge. */
  node?: Maybe<Scalars['String']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Action`. */
  createAction?: Maybe<CreateActionPayload>;
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
  /** Creates a single `ReviewResponse`. */
  createReviewResponse?: Maybe<CreateReviewResponsePayload>;
  /** Creates a single `ReviewSection`. */
  createReviewSection?: Maybe<CreateReviewSectionPayload>;
  /** Creates a single `ReviewSectionAssignment`. */
  createReviewSectionAssignment?: Maybe<CreateReviewSectionAssignmentPayload>;
  /** Creates a single `ReviewSectionJoin`. */
  createReviewSectionJoin?: Maybe<CreateReviewSectionJoinPayload>;
  /** Creates a single `ReviewSectionResponseJoin`. */
  createReviewSectionResponseJoin?: Maybe<CreateReviewSectionResponseJoinPayload>;
  /** Creates a single `Template`. */
  createTemplate?: Maybe<CreateTemplatePayload>;
  /** Creates a single `TemplateAction`. */
  createTemplateAction?: Maybe<CreateTemplateActionPayload>;
  /** Creates a single `TemplateElement`. */
  createTemplateElement?: Maybe<CreateTemplateElementPayload>;
  /** Creates a single `TemplateInformation`. */
  createTemplateInformation?: Maybe<CreateTemplateInformationPayload>;
  /** Creates a single `TemplatePermission`. */
  createTemplatePermission?: Maybe<CreateTemplatePermissionPayload>;
  /** Creates a single `TemplateQuestion`. */
  createTemplateQuestion?: Maybe<CreateTemplateQuestionPayload>;
  /** Creates a single `TemplateQuestionOption`. */
  createTemplateQuestionOption?: Maybe<CreateTemplateQuestionOptionPayload>;
  /** Creates a single `TemplateQuestionType`. */
  createTemplateQuestionType?: Maybe<CreateTemplateQuestionTypePayload>;
  /** Creates a single `TemplateReviewStage`. */
  createTemplateReviewStage?: Maybe<CreateTemplateReviewStagePayload>;
  /** Creates a single `TemplateSection`. */
  createTemplateSection?: Maybe<CreateTemplateSectionPayload>;
  /** Creates a single `TemplateStage`. */
  createTemplateStage?: Maybe<CreateTemplateStagePayload>;
  /** Creates a single `TemplateVersion`. */
  createTemplateVersion?: Maybe<CreateTemplateVersionPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Creates a single `UserOrganisation`. */
  createUserOrganisation?: Maybe<CreateUserOrganisationPayload>;
  /** Updates a single `Action` using its globally unique id and a patch. */
  updateAction?: Maybe<UpdateActionPayload>;
  /** Updates a single `Action` using a unique key and a patch. */
  updateActionById?: Maybe<UpdateActionPayload>;
  /** Updates a single `ActionQueue` using its globally unique id and a patch. */
  updateActionQueue?: Maybe<UpdateActionQueuePayload>;
  /** Updates a single `ActionQueue` using a unique key and a patch. */
  updateActionQueueById?: Maybe<UpdateActionQueuePayload>;
  /** Updates a single `Application` using its globally unique id and a patch. */
  updateApplication?: Maybe<UpdateApplicationPayload>;
  /** Updates a single `Application` using a unique key and a patch. */
  updateApplicationById?: Maybe<UpdateApplicationPayload>;
  /** Updates a single `ApplicationResponse` using its globally unique id and a patch. */
  updateApplicationResponse?: Maybe<UpdateApplicationResponsePayload>;
  /** Updates a single `ApplicationResponse` using a unique key and a patch. */
  updateApplicationResponseById?: Maybe<UpdateApplicationResponsePayload>;
  /** Updates a single `ApplicationSection` using its globally unique id and a patch. */
  updateApplicationSection?: Maybe<UpdateApplicationSectionPayload>;
  /** Updates a single `ApplicationSection` using a unique key and a patch. */
  updateApplicationSectionById?: Maybe<UpdateApplicationSectionPayload>;
  /** Updates a single `ApplicationStageHistory` using its globally unique id and a patch. */
  updateApplicationStageHistory?: Maybe<UpdateApplicationStageHistoryPayload>;
  /** Updates a single `ApplicationStageHistory` using a unique key and a patch. */
  updateApplicationStageHistoryById?: Maybe<UpdateApplicationStageHistoryPayload>;
  /** Updates a single `ApplicationStatusHistory` using its globally unique id and a patch. */
  updateApplicationStatusHistory?: Maybe<UpdateApplicationStatusHistoryPayload>;
  /** Updates a single `ApplicationStatusHistory` using a unique key and a patch. */
  updateApplicationStatusHistoryById?: Maybe<UpdateApplicationStatusHistoryPayload>;
  /** Updates a single `Organisation` using its globally unique id and a patch. */
  updateOrganisation?: Maybe<UpdateOrganisationPayload>;
  /** Updates a single `Organisation` using a unique key and a patch. */
  updateOrganisationById?: Maybe<UpdateOrganisationPayload>;
  /** Updates a single `PermissionJoin` using its globally unique id and a patch. */
  updatePermissionJoin?: Maybe<UpdatePermissionJoinPayload>;
  /** Updates a single `PermissionJoin` using a unique key and a patch. */
  updatePermissionJoinById?: Maybe<UpdatePermissionJoinPayload>;
  /** Updates a single `PermissionName` using its globally unique id and a patch. */
  updatePermissionName?: Maybe<UpdatePermissionNamePayload>;
  /** Updates a single `PermissionName` using a unique key and a patch. */
  updatePermissionNameById?: Maybe<UpdatePermissionNamePayload>;
  /** Updates a single `PermissionPolicy` using its globally unique id and a patch. */
  updatePermissionPolicy?: Maybe<UpdatePermissionPolicyPayload>;
  /** Updates a single `PermissionPolicy` using a unique key and a patch. */
  updatePermissionPolicyById?: Maybe<UpdatePermissionPolicyPayload>;
  /** Updates a single `Review` using its globally unique id and a patch. */
  updateReview?: Maybe<UpdateReviewPayload>;
  /** Updates a single `Review` using a unique key and a patch. */
  updateReviewById?: Maybe<UpdateReviewPayload>;
  /** Updates a single `ReviewResponse` using its globally unique id and a patch. */
  updateReviewResponse?: Maybe<UpdateReviewResponsePayload>;
  /** Updates a single `ReviewResponse` using a unique key and a patch. */
  updateReviewResponseById?: Maybe<UpdateReviewResponsePayload>;
  /** Updates a single `ReviewSection` using its globally unique id and a patch. */
  updateReviewSection?: Maybe<UpdateReviewSectionPayload>;
  /** Updates a single `ReviewSection` using a unique key and a patch. */
  updateReviewSectionById?: Maybe<UpdateReviewSectionPayload>;
  /** Updates a single `ReviewSectionAssignment` using its globally unique id and a patch. */
  updateReviewSectionAssignment?: Maybe<UpdateReviewSectionAssignmentPayload>;
  /** Updates a single `ReviewSectionAssignment` using a unique key and a patch. */
  updateReviewSectionAssignmentById?: Maybe<UpdateReviewSectionAssignmentPayload>;
  /** Updates a single `ReviewSectionJoin` using its globally unique id and a patch. */
  updateReviewSectionJoin?: Maybe<UpdateReviewSectionJoinPayload>;
  /** Updates a single `ReviewSectionJoin` using a unique key and a patch. */
  updateReviewSectionJoinById?: Maybe<UpdateReviewSectionJoinPayload>;
  /** Updates a single `ReviewSectionResponseJoin` using its globally unique id and a patch. */
  updateReviewSectionResponseJoin?: Maybe<UpdateReviewSectionResponseJoinPayload>;
  /** Updates a single `ReviewSectionResponseJoin` using a unique key and a patch. */
  updateReviewSectionResponseJoinById?: Maybe<UpdateReviewSectionResponseJoinPayload>;
  /** Updates a single `Template` using its globally unique id and a patch. */
  updateTemplate?: Maybe<UpdateTemplatePayload>;
  /** Updates a single `Template` using a unique key and a patch. */
  updateTemplateById?: Maybe<UpdateTemplatePayload>;
  /** Updates a single `TemplateAction` using its globally unique id and a patch. */
  updateTemplateAction?: Maybe<UpdateTemplateActionPayload>;
  /** Updates a single `TemplateAction` using a unique key and a patch. */
  updateTemplateActionById?: Maybe<UpdateTemplateActionPayload>;
  /** Updates a single `TemplateElement` using its globally unique id and a patch. */
  updateTemplateElement?: Maybe<UpdateTemplateElementPayload>;
  /** Updates a single `TemplateElement` using a unique key and a patch. */
  updateTemplateElementById?: Maybe<UpdateTemplateElementPayload>;
  /** Updates a single `TemplateInformation` using its globally unique id and a patch. */
  updateTemplateInformation?: Maybe<UpdateTemplateInformationPayload>;
  /** Updates a single `TemplateInformation` using a unique key and a patch. */
  updateTemplateInformationById?: Maybe<UpdateTemplateInformationPayload>;
  /** Updates a single `TemplatePermission` using its globally unique id and a patch. */
  updateTemplatePermission?: Maybe<UpdateTemplatePermissionPayload>;
  /** Updates a single `TemplatePermission` using a unique key and a patch. */
  updateTemplatePermissionById?: Maybe<UpdateTemplatePermissionPayload>;
  /** Updates a single `TemplateQuestion` using its globally unique id and a patch. */
  updateTemplateQuestion?: Maybe<UpdateTemplateQuestionPayload>;
  /** Updates a single `TemplateQuestion` using a unique key and a patch. */
  updateTemplateQuestionById?: Maybe<UpdateTemplateQuestionPayload>;
  /** Updates a single `TemplateQuestionOption` using its globally unique id and a patch. */
  updateTemplateQuestionOption?: Maybe<UpdateTemplateQuestionOptionPayload>;
  /** Updates a single `TemplateQuestionOption` using a unique key and a patch. */
  updateTemplateQuestionOptionById?: Maybe<UpdateTemplateQuestionOptionPayload>;
  /** Updates a single `TemplateQuestionType` using its globally unique id and a patch. */
  updateTemplateQuestionType?: Maybe<UpdateTemplateQuestionTypePayload>;
  /** Updates a single `TemplateQuestionType` using a unique key and a patch. */
  updateTemplateQuestionTypeById?: Maybe<UpdateTemplateQuestionTypePayload>;
  /** Updates a single `TemplateReviewStage` using its globally unique id and a patch. */
  updateTemplateReviewStage?: Maybe<UpdateTemplateReviewStagePayload>;
  /** Updates a single `TemplateReviewStage` using a unique key and a patch. */
  updateTemplateReviewStageById?: Maybe<UpdateTemplateReviewStagePayload>;
  /** Updates a single `TemplateSection` using its globally unique id and a patch. */
  updateTemplateSection?: Maybe<UpdateTemplateSectionPayload>;
  /** Updates a single `TemplateSection` using a unique key and a patch. */
  updateTemplateSectionById?: Maybe<UpdateTemplateSectionPayload>;
  /** Updates a single `TemplateStage` using its globally unique id and a patch. */
  updateTemplateStage?: Maybe<UpdateTemplateStagePayload>;
  /** Updates a single `TemplateStage` using a unique key and a patch. */
  updateTemplateStageById?: Maybe<UpdateTemplateStagePayload>;
  /** Updates a single `TemplateVersion` using its globally unique id and a patch. */
  updateTemplateVersion?: Maybe<UpdateTemplateVersionPayload>;
  /** Updates a single `TemplateVersion` using a unique key and a patch. */
  updateTemplateVersionById?: Maybe<UpdateTemplateVersionPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
  /** Updates a single `UserOrganisation` using its globally unique id and a patch. */
  updateUserOrganisation?: Maybe<UpdateUserOrganisationPayload>;
  /** Updates a single `UserOrganisation` using a unique key and a patch. */
  updateUserOrganisationById?: Maybe<UpdateUserOrganisationPayload>;
  /** Deletes a single `Action` using its globally unique id. */
  deleteAction?: Maybe<DeleteActionPayload>;
  /** Deletes a single `Action` using a unique key. */
  deleteActionById?: Maybe<DeleteActionPayload>;
  /** Deletes a single `ActionQueue` using its globally unique id. */
  deleteActionQueue?: Maybe<DeleteActionQueuePayload>;
  /** Deletes a single `ActionQueue` using a unique key. */
  deleteActionQueueById?: Maybe<DeleteActionQueuePayload>;
  /** Deletes a single `Application` using its globally unique id. */
  deleteApplication?: Maybe<DeleteApplicationPayload>;
  /** Deletes a single `Application` using a unique key. */
  deleteApplicationById?: Maybe<DeleteApplicationPayload>;
  /** Deletes a single `ApplicationResponse` using its globally unique id. */
  deleteApplicationResponse?: Maybe<DeleteApplicationResponsePayload>;
  /** Deletes a single `ApplicationResponse` using a unique key. */
  deleteApplicationResponseById?: Maybe<DeleteApplicationResponsePayload>;
  /** Deletes a single `ApplicationSection` using its globally unique id. */
  deleteApplicationSection?: Maybe<DeleteApplicationSectionPayload>;
  /** Deletes a single `ApplicationSection` using a unique key. */
  deleteApplicationSectionById?: Maybe<DeleteApplicationSectionPayload>;
  /** Deletes a single `ApplicationStageHistory` using its globally unique id. */
  deleteApplicationStageHistory?: Maybe<DeleteApplicationStageHistoryPayload>;
  /** Deletes a single `ApplicationStageHistory` using a unique key. */
  deleteApplicationStageHistoryById?: Maybe<DeleteApplicationStageHistoryPayload>;
  /** Deletes a single `ApplicationStatusHistory` using its globally unique id. */
  deleteApplicationStatusHistory?: Maybe<DeleteApplicationStatusHistoryPayload>;
  /** Deletes a single `ApplicationStatusHistory` using a unique key. */
  deleteApplicationStatusHistoryById?: Maybe<DeleteApplicationStatusHistoryPayload>;
  /** Deletes a single `Organisation` using its globally unique id. */
  deleteOrganisation?: Maybe<DeleteOrganisationPayload>;
  /** Deletes a single `Organisation` using a unique key. */
  deleteOrganisationById?: Maybe<DeleteOrganisationPayload>;
  /** Deletes a single `PermissionJoin` using its globally unique id. */
  deletePermissionJoin?: Maybe<DeletePermissionJoinPayload>;
  /** Deletes a single `PermissionJoin` using a unique key. */
  deletePermissionJoinById?: Maybe<DeletePermissionJoinPayload>;
  /** Deletes a single `PermissionName` using its globally unique id. */
  deletePermissionName?: Maybe<DeletePermissionNamePayload>;
  /** Deletes a single `PermissionName` using a unique key. */
  deletePermissionNameById?: Maybe<DeletePermissionNamePayload>;
  /** Deletes a single `PermissionPolicy` using its globally unique id. */
  deletePermissionPolicy?: Maybe<DeletePermissionPolicyPayload>;
  /** Deletes a single `PermissionPolicy` using a unique key. */
  deletePermissionPolicyById?: Maybe<DeletePermissionPolicyPayload>;
  /** Deletes a single `Review` using its globally unique id. */
  deleteReview?: Maybe<DeleteReviewPayload>;
  /** Deletes a single `Review` using a unique key. */
  deleteReviewById?: Maybe<DeleteReviewPayload>;
  /** Deletes a single `ReviewResponse` using its globally unique id. */
  deleteReviewResponse?: Maybe<DeleteReviewResponsePayload>;
  /** Deletes a single `ReviewResponse` using a unique key. */
  deleteReviewResponseById?: Maybe<DeleteReviewResponsePayload>;
  /** Deletes a single `ReviewSection` using its globally unique id. */
  deleteReviewSection?: Maybe<DeleteReviewSectionPayload>;
  /** Deletes a single `ReviewSection` using a unique key. */
  deleteReviewSectionById?: Maybe<DeleteReviewSectionPayload>;
  /** Deletes a single `ReviewSectionAssignment` using its globally unique id. */
  deleteReviewSectionAssignment?: Maybe<DeleteReviewSectionAssignmentPayload>;
  /** Deletes a single `ReviewSectionAssignment` using a unique key. */
  deleteReviewSectionAssignmentById?: Maybe<DeleteReviewSectionAssignmentPayload>;
  /** Deletes a single `ReviewSectionJoin` using its globally unique id. */
  deleteReviewSectionJoin?: Maybe<DeleteReviewSectionJoinPayload>;
  /** Deletes a single `ReviewSectionJoin` using a unique key. */
  deleteReviewSectionJoinById?: Maybe<DeleteReviewSectionJoinPayload>;
  /** Deletes a single `ReviewSectionResponseJoin` using its globally unique id. */
  deleteReviewSectionResponseJoin?: Maybe<DeleteReviewSectionResponseJoinPayload>;
  /** Deletes a single `ReviewSectionResponseJoin` using a unique key. */
  deleteReviewSectionResponseJoinById?: Maybe<DeleteReviewSectionResponseJoinPayload>;
  /** Deletes a single `Template` using its globally unique id. */
  deleteTemplate?: Maybe<DeleteTemplatePayload>;
  /** Deletes a single `Template` using a unique key. */
  deleteTemplateById?: Maybe<DeleteTemplatePayload>;
  /** Deletes a single `TemplateAction` using its globally unique id. */
  deleteTemplateAction?: Maybe<DeleteTemplateActionPayload>;
  /** Deletes a single `TemplateAction` using a unique key. */
  deleteTemplateActionById?: Maybe<DeleteTemplateActionPayload>;
  /** Deletes a single `TemplateElement` using its globally unique id. */
  deleteTemplateElement?: Maybe<DeleteTemplateElementPayload>;
  /** Deletes a single `TemplateElement` using a unique key. */
  deleteTemplateElementById?: Maybe<DeleteTemplateElementPayload>;
  /** Deletes a single `TemplateInformation` using its globally unique id. */
  deleteTemplateInformation?: Maybe<DeleteTemplateInformationPayload>;
  /** Deletes a single `TemplateInformation` using a unique key. */
  deleteTemplateInformationById?: Maybe<DeleteTemplateInformationPayload>;
  /** Deletes a single `TemplatePermission` using its globally unique id. */
  deleteTemplatePermission?: Maybe<DeleteTemplatePermissionPayload>;
  /** Deletes a single `TemplatePermission` using a unique key. */
  deleteTemplatePermissionById?: Maybe<DeleteTemplatePermissionPayload>;
  /** Deletes a single `TemplateQuestion` using its globally unique id. */
  deleteTemplateQuestion?: Maybe<DeleteTemplateQuestionPayload>;
  /** Deletes a single `TemplateQuestion` using a unique key. */
  deleteTemplateQuestionById?: Maybe<DeleteTemplateQuestionPayload>;
  /** Deletes a single `TemplateQuestionOption` using its globally unique id. */
  deleteTemplateQuestionOption?: Maybe<DeleteTemplateQuestionOptionPayload>;
  /** Deletes a single `TemplateQuestionOption` using a unique key. */
  deleteTemplateQuestionOptionById?: Maybe<DeleteTemplateQuestionOptionPayload>;
  /** Deletes a single `TemplateQuestionType` using its globally unique id. */
  deleteTemplateQuestionType?: Maybe<DeleteTemplateQuestionTypePayload>;
  /** Deletes a single `TemplateQuestionType` using a unique key. */
  deleteTemplateQuestionTypeById?: Maybe<DeleteTemplateQuestionTypePayload>;
  /** Deletes a single `TemplateReviewStage` using its globally unique id. */
  deleteTemplateReviewStage?: Maybe<DeleteTemplateReviewStagePayload>;
  /** Deletes a single `TemplateReviewStage` using a unique key. */
  deleteTemplateReviewStageById?: Maybe<DeleteTemplateReviewStagePayload>;
  /** Deletes a single `TemplateSection` using its globally unique id. */
  deleteTemplateSection?: Maybe<DeleteTemplateSectionPayload>;
  /** Deletes a single `TemplateSection` using a unique key. */
  deleteTemplateSectionById?: Maybe<DeleteTemplateSectionPayload>;
  /** Deletes a single `TemplateStage` using its globally unique id. */
  deleteTemplateStage?: Maybe<DeleteTemplateStagePayload>;
  /** Deletes a single `TemplateStage` using a unique key. */
  deleteTemplateStageById?: Maybe<DeleteTemplateStagePayload>;
  /** Deletes a single `TemplateVersion` using its globally unique id. */
  deleteTemplateVersion?: Maybe<DeleteTemplateVersionPayload>;
  /** Deletes a single `TemplateVersion` using a unique key. */
  deleteTemplateVersionById?: Maybe<DeleteTemplateVersionPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserById?: Maybe<DeleteUserPayload>;
  /** Deletes a single `UserOrganisation` using its globally unique id. */
  deleteUserOrganisation?: Maybe<DeleteUserOrganisationPayload>;
  /** Deletes a single `UserOrganisation` using a unique key. */
  deleteUserOrganisationById?: Maybe<DeleteUserOrganisationPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateActionArgs = {
  input: CreateActionInput;
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
export type MutationCreateReviewResponseArgs = {
  input: CreateReviewResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewSectionArgs = {
  input: CreateReviewSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewSectionAssignmentArgs = {
  input: CreateReviewSectionAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewSectionJoinArgs = {
  input: CreateReviewSectionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateReviewSectionResponseJoinArgs = {
  input: CreateReviewSectionResponseJoinInput;
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
export type MutationCreateTemplateInformationArgs = {
  input: CreateTemplateInformationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplatePermissionArgs = {
  input: CreateTemplatePermissionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateQuestionArgs = {
  input: CreateTemplateQuestionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateQuestionOptionArgs = {
  input: CreateTemplateQuestionOptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateQuestionTypeArgs = {
  input: CreateTemplateQuestionTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateTemplateReviewStageArgs = {
  input: CreateTemplateReviewStageInput;
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
export type MutationCreateTemplateVersionArgs = {
  input: CreateTemplateVersionInput;
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
export type MutationUpdateActionArgs = {
  input: UpdateActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionByIdArgs = {
  input: UpdateActionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionQueueArgs = {
  input: UpdateActionQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateActionQueueByIdArgs = {
  input: UpdateActionQueueByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationByIdArgs = {
  input: UpdateApplicationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationResponseArgs = {
  input: UpdateApplicationResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationResponseByIdArgs = {
  input: UpdateApplicationResponseByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationSectionArgs = {
  input: UpdateApplicationSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationSectionByIdArgs = {
  input: UpdateApplicationSectionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStageHistoryArgs = {
  input: UpdateApplicationStageHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStageHistoryByIdArgs = {
  input: UpdateApplicationStageHistoryByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStatusHistoryArgs = {
  input: UpdateApplicationStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateApplicationStatusHistoryByIdArgs = {
  input: UpdateApplicationStatusHistoryByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOrganisationArgs = {
  input: UpdateOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateOrganisationByIdArgs = {
  input: UpdateOrganisationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionJoinArgs = {
  input: UpdatePermissionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionJoinByIdArgs = {
  input: UpdatePermissionJoinByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionNameArgs = {
  input: UpdatePermissionNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionNameByIdArgs = {
  input: UpdatePermissionNameByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionPolicyArgs = {
  input: UpdatePermissionPolicyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePermissionPolicyByIdArgs = {
  input: UpdatePermissionPolicyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewArgs = {
  input: UpdateReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewByIdArgs = {
  input: UpdateReviewByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewResponseArgs = {
  input: UpdateReviewResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewResponseByIdArgs = {
  input: UpdateReviewResponseByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionArgs = {
  input: UpdateReviewSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionByIdArgs = {
  input: UpdateReviewSectionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionAssignmentArgs = {
  input: UpdateReviewSectionAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionAssignmentByIdArgs = {
  input: UpdateReviewSectionAssignmentByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionJoinArgs = {
  input: UpdateReviewSectionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionJoinByIdArgs = {
  input: UpdateReviewSectionJoinByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionResponseJoinArgs = {
  input: UpdateReviewSectionResponseJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateReviewSectionResponseJoinByIdArgs = {
  input: UpdateReviewSectionResponseJoinByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateArgs = {
  input: UpdateTemplateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateByIdArgs = {
  input: UpdateTemplateByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateActionArgs = {
  input: UpdateTemplateActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateActionByIdArgs = {
  input: UpdateTemplateActionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateElementArgs = {
  input: UpdateTemplateElementInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateElementByIdArgs = {
  input: UpdateTemplateElementByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateInformationArgs = {
  input: UpdateTemplateInformationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateInformationByIdArgs = {
  input: UpdateTemplateInformationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplatePermissionArgs = {
  input: UpdateTemplatePermissionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplatePermissionByIdArgs = {
  input: UpdateTemplatePermissionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateQuestionArgs = {
  input: UpdateTemplateQuestionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateQuestionByIdArgs = {
  input: UpdateTemplateQuestionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateQuestionOptionArgs = {
  input: UpdateTemplateQuestionOptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateQuestionOptionByIdArgs = {
  input: UpdateTemplateQuestionOptionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateQuestionTypeArgs = {
  input: UpdateTemplateQuestionTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateQuestionTypeByIdArgs = {
  input: UpdateTemplateQuestionTypeByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateReviewStageArgs = {
  input: UpdateTemplateReviewStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateReviewStageByIdArgs = {
  input: UpdateTemplateReviewStageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateSectionArgs = {
  input: UpdateTemplateSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateSectionByIdArgs = {
  input: UpdateTemplateSectionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateStageArgs = {
  input: UpdateTemplateStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateStageByIdArgs = {
  input: UpdateTemplateStageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateVersionArgs = {
  input: UpdateTemplateVersionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateTemplateVersionByIdArgs = {
  input: UpdateTemplateVersionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserOrganisationArgs = {
  input: UpdateUserOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserOrganisationByIdArgs = {
  input: UpdateUserOrganisationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionArgs = {
  input: DeleteActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionByIdArgs = {
  input: DeleteActionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionQueueArgs = {
  input: DeleteActionQueueInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteActionQueueByIdArgs = {
  input: DeleteActionQueueByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationArgs = {
  input: DeleteApplicationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationByIdArgs = {
  input: DeleteApplicationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationResponseArgs = {
  input: DeleteApplicationResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationResponseByIdArgs = {
  input: DeleteApplicationResponseByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationSectionArgs = {
  input: DeleteApplicationSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationSectionByIdArgs = {
  input: DeleteApplicationSectionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStageHistoryArgs = {
  input: DeleteApplicationStageHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStageHistoryByIdArgs = {
  input: DeleteApplicationStageHistoryByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStatusHistoryArgs = {
  input: DeleteApplicationStatusHistoryInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteApplicationStatusHistoryByIdArgs = {
  input: DeleteApplicationStatusHistoryByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOrganisationArgs = {
  input: DeleteOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteOrganisationByIdArgs = {
  input: DeleteOrganisationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionJoinArgs = {
  input: DeletePermissionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionJoinByIdArgs = {
  input: DeletePermissionJoinByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionNameArgs = {
  input: DeletePermissionNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionNameByIdArgs = {
  input: DeletePermissionNameByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionPolicyArgs = {
  input: DeletePermissionPolicyInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePermissionPolicyByIdArgs = {
  input: DeletePermissionPolicyByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewArgs = {
  input: DeleteReviewInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewByIdArgs = {
  input: DeleteReviewByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewResponseArgs = {
  input: DeleteReviewResponseInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewResponseByIdArgs = {
  input: DeleteReviewResponseByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionArgs = {
  input: DeleteReviewSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionByIdArgs = {
  input: DeleteReviewSectionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionAssignmentArgs = {
  input: DeleteReviewSectionAssignmentInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionAssignmentByIdArgs = {
  input: DeleteReviewSectionAssignmentByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionJoinArgs = {
  input: DeleteReviewSectionJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionJoinByIdArgs = {
  input: DeleteReviewSectionJoinByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionResponseJoinArgs = {
  input: DeleteReviewSectionResponseJoinInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteReviewSectionResponseJoinByIdArgs = {
  input: DeleteReviewSectionResponseJoinByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateArgs = {
  input: DeleteTemplateInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateByIdArgs = {
  input: DeleteTemplateByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateActionArgs = {
  input: DeleteTemplateActionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateActionByIdArgs = {
  input: DeleteTemplateActionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateElementArgs = {
  input: DeleteTemplateElementInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateElementByIdArgs = {
  input: DeleteTemplateElementByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateInformationArgs = {
  input: DeleteTemplateInformationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateInformationByIdArgs = {
  input: DeleteTemplateInformationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplatePermissionArgs = {
  input: DeleteTemplatePermissionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplatePermissionByIdArgs = {
  input: DeleteTemplatePermissionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateQuestionArgs = {
  input: DeleteTemplateQuestionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateQuestionByIdArgs = {
  input: DeleteTemplateQuestionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateQuestionOptionArgs = {
  input: DeleteTemplateQuestionOptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateQuestionOptionByIdArgs = {
  input: DeleteTemplateQuestionOptionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateQuestionTypeArgs = {
  input: DeleteTemplateQuestionTypeInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateQuestionTypeByIdArgs = {
  input: DeleteTemplateQuestionTypeByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateReviewStageArgs = {
  input: DeleteTemplateReviewStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateReviewStageByIdArgs = {
  input: DeleteTemplateReviewStageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateSectionArgs = {
  input: DeleteTemplateSectionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateSectionByIdArgs = {
  input: DeleteTemplateSectionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateStageArgs = {
  input: DeleteTemplateStageInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateStageByIdArgs = {
  input: DeleteTemplateStageByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateVersionArgs = {
  input: DeleteTemplateVersionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteTemplateVersionByIdArgs = {
  input: DeleteTemplateVersionByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserOrganisationArgs = {
  input: DeleteUserOrganisationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserOrganisationByIdArgs = {
  input: DeleteUserOrganisationByIdInput;
};

/** All input for the create `Action` mutation. */
export type CreateActionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Action` to be created by this mutation. */
  action: ActionInput;
};

/** An input for mutations affecting `Action` */
export type ActionInput = {
  id?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  requiredParameters?: Maybe<Scalars['JSON']>;
};

/** The output of our create `Action` mutation. */
export type CreateActionPayload = {
  __typename?: 'CreateActionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Action` that was created by this mutation. */
  action?: Maybe<Action>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Action`. May be used by Relay 1. */
  actionEdge?: Maybe<ActionsEdge>;
};


/** The output of our create `Action` mutation. */
export type CreateActionPayloadActionEdgeArgs = {
  orderBy?: Maybe<Array<ActionsOrderBy>>;
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
  actionCode?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeExecuted?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
};

/** The output of our create `ActionQueue` mutation. */
export type CreateActionQueuePayload = {
  __typename?: 'CreateActionQueuePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ActionQueue` that was created by this mutation. */
  actionQueue?: Maybe<ActionQueue>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ActionQueue`. May be used by Relay 1. */
  actionQueueEdge?: Maybe<ActionQueuesEdge>;
};


/** The output of our create `ActionQueue` mutation. */
export type CreateActionQueuePayloadActionQueueEdgeArgs = {
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
};

/** All input for the create `Application` mutation. */
export type CreateApplicationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Application` to be created by this mutation. */
  application: ApplicationInput;
};

/** An input for mutations affecting `Application` */
export type ApplicationInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  triggering?: Maybe<Scalars['String']>;
};

/** The output of our create `Application` mutation. */
export type CreateApplicationPayload = {
  __typename?: 'CreateApplicationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Application` that was created by this mutation. */
  application?: Maybe<Application>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `Application`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `User` that is related to this `Application`. */
  userByUserId?: Maybe<User>;
  /** An edge for our `Application`. May be used by Relay 1. */
  applicationEdge?: Maybe<ApplicationsEdge>;
};


/** The output of our create `Application` mutation. */
export type CreateApplicationPayloadApplicationEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
};

/** All input for the create `ApplicationResponse` mutation. */
export type CreateApplicationResponseInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationResponse` to be created by this mutation. */
  applicationResponse: ApplicationResponseInput;
};

/** An input for mutations affecting `ApplicationResponse` */
export type ApplicationResponseInput = {
  id?: Maybe<Scalars['Int']>;
  templateQuestionId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
};

/** The output of our create `ApplicationResponse` mutation. */
export type CreateApplicationResponsePayload = {
  __typename?: 'CreateApplicationResponsePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationResponse` that was created by this mutation. */
  applicationResponse?: Maybe<ApplicationResponse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestion` that is related to this `ApplicationResponse`. */
  templateQuestionByTemplateQuestionId?: Maybe<TemplateQuestion>;
  /** Reads a single `Application` that is related to this `ApplicationResponse`. */
  applicationByApplicationId?: Maybe<Application>;
  /** An edge for our `ApplicationResponse`. May be used by Relay 1. */
  applicationResponseEdge?: Maybe<ApplicationResponsesEdge>;
};


/** The output of our create `ApplicationResponse` mutation. */
export type CreateApplicationResponsePayloadApplicationResponseEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
};

/** All input for the create `ApplicationSection` mutation. */
export type CreateApplicationSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationSection` to be created by this mutation. */
  applicationSection: ApplicationSectionInput;
};

/** An input for mutations affecting `ApplicationSection` */
export type ApplicationSectionInput = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
};

/** The output of our create `ApplicationSection` mutation. */
export type CreateApplicationSectionPayload = {
  __typename?: 'CreateApplicationSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationSection` that was created by this mutation. */
  applicationSection?: Maybe<ApplicationSection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Application` that is related to this `ApplicationSection`. */
  applicationByApplicationId?: Maybe<Application>;
  /** Reads a single `TemplateSection` that is related to this `ApplicationSection`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** An edge for our `ApplicationSection`. May be used by Relay 1. */
  applicationSectionEdge?: Maybe<ApplicationSectionsEdge>;
};


/** The output of our create `ApplicationSection` mutation. */
export type CreateApplicationSectionPayloadApplicationSectionEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
};

/** All input for the create `ApplicationStageHistory` mutation. */
export type CreateApplicationStageHistoryInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStageHistory` to be created by this mutation. */
  applicationStageHistory: ApplicationStageHistoryInput;
};

/** An input for mutations affecting `ApplicationStageHistory` */
export type ApplicationStageHistoryInput = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  stage?: Maybe<ApplicationStage>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** The output of our create `ApplicationStageHistory` mutation. */
export type CreateApplicationStageHistoryPayload = {
  __typename?: 'CreateApplicationStageHistoryPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStageHistory` that was created by this mutation. */
  applicationStageHistory?: Maybe<ApplicationStageHistory>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Application` that is related to this `ApplicationStageHistory`. */
  applicationByApplicationId?: Maybe<Application>;
  /** An edge for our `ApplicationStageHistory`. May be used by Relay 1. */
  applicationStageHistoryEdge?: Maybe<ApplicationStageHistoriesEdge>;
};


/** The output of our create `ApplicationStageHistory` mutation. */
export type CreateApplicationStageHistoryPayloadApplicationStageHistoryEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
};

/** All input for the create `ApplicationStatusHistory` mutation. */
export type CreateApplicationStatusHistoryInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStatusHistory` to be created by this mutation. */
  applicationStatusHistory: ApplicationStatusHistoryInput;
};

/** An input for mutations affecting `ApplicationStatusHistory` */
export type ApplicationStatusHistoryInput = {
  id?: Maybe<Scalars['Int']>;
  applicationStageHistoryId?: Maybe<Scalars['Int']>;
  status?: Maybe<ApplicationStatus>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** The output of our create `ApplicationStatusHistory` mutation. */
export type CreateApplicationStatusHistoryPayload = {
  __typename?: 'CreateApplicationStatusHistoryPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStatusHistory` that was created by this mutation. */
  applicationStatusHistory?: Maybe<ApplicationStatusHistory>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ApplicationStatusHistory`. */
  applicationStageHistoryByApplicationStageHistoryId?: Maybe<ApplicationStageHistory>;
  /** An edge for our `ApplicationStatusHistory`. May be used by Relay 1. */
  applicationStatusHistoryEdge?: Maybe<ApplicationStatusHistoriesEdge>;
};


/** The output of our create `ApplicationStatusHistory` mutation. */
export type CreateApplicationStatusHistoryPayloadApplicationStatusHistoryEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
};

/** All input for the create `Organisation` mutation. */
export type CreateOrganisationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Organisation` to be created by this mutation. */
  organisation: OrganisationInput;
};

/** An input for mutations affecting `Organisation` */
export type OrganisationInput = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
};

/** The output of our create `Organisation` mutation. */
export type CreateOrganisationPayload = {
  __typename?: 'CreateOrganisationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Organisation` that was created by this mutation. */
  organisation?: Maybe<Organisation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Organisation`. May be used by Relay 1. */
  organisationEdge?: Maybe<OrganisationsEdge>;
};


/** The output of our create `Organisation` mutation. */
export type CreateOrganisationPayloadOrganisationEdgeArgs = {
  orderBy?: Maybe<Array<OrganisationsOrderBy>>;
};

/** All input for the create `PermissionJoin` mutation. */
export type CreatePermissionJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionJoin` to be created by this mutation. */
  permissionJoin: PermissionJoinInput;
};

/** An input for mutations affecting `PermissionJoin` */
export type PermissionJoinInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  userOrganisationId?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
};

/** The output of our create `PermissionJoin` mutation. */
export type CreatePermissionJoinPayload = {
  __typename?: 'CreatePermissionJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionJoin` that was created by this mutation. */
  permissionJoin?: Maybe<PermissionJoin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PermissionJoin`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `UserOrganisation` that is related to this `PermissionJoin`. */
  userOrganisationByUserOrganisationId?: Maybe<UserOrganisation>;
  /** Reads a single `PermissionName` that is related to this `PermissionJoin`. */
  permissionNameByPermissionNameId?: Maybe<PermissionName>;
  /** An edge for our `PermissionJoin`. May be used by Relay 1. */
  permissionJoinEdge?: Maybe<PermissionJoinsEdge>;
};


/** The output of our create `PermissionJoin` mutation. */
export type CreatePermissionJoinPayloadPermissionJoinEdgeArgs = {
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
};

/** All input for the create `PermissionName` mutation. */
export type CreatePermissionNameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionName` to be created by this mutation. */
  permissionName: PermissionNameInput;
};

/** An input for mutations affecting `PermissionName` */
export type PermissionNameInput = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

/** The output of our create `PermissionName` mutation. */
export type CreatePermissionNamePayload = {
  __typename?: 'CreatePermissionNamePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionName` that was created by this mutation. */
  permissionName?: Maybe<PermissionName>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PermissionName`. May be used by Relay 1. */
  permissionNameEdge?: Maybe<PermissionNamesEdge>;
};


/** The output of our create `PermissionName` mutation. */
export type CreatePermissionNamePayloadPermissionNameEdgeArgs = {
  orderBy?: Maybe<Array<PermissionNamesOrderBy>>;
};

/** All input for the create `PermissionPolicy` mutation. */
export type CreatePermissionPolicyInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionPolicy` to be created by this mutation. */
  permissionPolicy: PermissionPolicyInput;
};

/** An input for mutations affecting `PermissionPolicy` */
export type PermissionPolicyInput = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  rules?: Maybe<Scalars['JSON']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<PermissionPolicyType>;
};

/** The output of our create `PermissionPolicy` mutation. */
export type CreatePermissionPolicyPayload = {
  __typename?: 'CreatePermissionPolicyPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionPolicy` that was created by this mutation. */
  permissionPolicy?: Maybe<PermissionPolicy>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PermissionPolicy`. May be used by Relay 1. */
  permissionPolicyEdge?: Maybe<PermissionPoliciesEdge>;
};


/** The output of our create `PermissionPolicy` mutation. */
export type CreatePermissionPolicyPayloadPermissionPolicyEdgeArgs = {
  orderBy?: Maybe<Array<PermissionPoliciesOrderBy>>;
};

/** All input for the create `Review` mutation. */
export type CreateReviewInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Review` to be created by this mutation. */
  review: ReviewInput;
};

/** An input for mutations affecting `Review` */
export type ReviewInput = {
  id: Scalars['BigInt'];
  applicationId?: Maybe<Scalars['BigInt']>;
  status?: Maybe<ReviewStatus>;
  comment?: Maybe<Scalars['String']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
};

/** The output of our create `Review` mutation. */
export type CreateReviewPayload = {
  __typename?: 'CreateReviewPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Review` that was created by this mutation. */
  review?: Maybe<Review>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Review`. May be used by Relay 1. */
  reviewEdge?: Maybe<ReviewsEdge>;
};


/** The output of our create `Review` mutation. */
export type CreateReviewPayloadReviewEdgeArgs = {
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
};

/** All input for the create `ReviewResponse` mutation. */
export type CreateReviewResponseInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewResponse` to be created by this mutation. */
  reviewResponse: ReviewResponseInput;
};

/** An input for mutations affecting `ReviewResponse` */
export type ReviewResponseInput = {
  id?: Maybe<Scalars['BigInt']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  comment: Scalars['String'];
  reviewDecision?: Maybe<ReviewDecision>;
};

/** The output of our create `ReviewResponse` mutation. */
export type CreateReviewResponsePayload = {
  __typename?: 'CreateReviewResponsePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewResponse` that was created by this mutation. */
  reviewResponse?: Maybe<ReviewResponse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ApplicationResponse` that is related to this `ReviewResponse`. */
  applicationResponseByApplicationResponseId?: Maybe<ApplicationResponse>;
  /** An edge for our `ReviewResponse`. May be used by Relay 1. */
  reviewResponseEdge?: Maybe<ReviewResponsesEdge>;
};


/** The output of our create `ReviewResponse` mutation. */
export type CreateReviewResponsePayloadReviewResponseEdgeArgs = {
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
};

/** All input for the create `ReviewSection` mutation. */
export type CreateReviewSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSection` to be created by this mutation. */
  reviewSection: ReviewSectionInput;
};

/** An input for mutations affecting `ReviewSection` */
export type ReviewSectionInput = {
  id?: Maybe<Scalars['BigInt']>;
  reviewDecision?: Maybe<ReviewDecision>;
  comment: Scalars['String'];
};

/** The output of our create `ReviewSection` mutation. */
export type CreateReviewSectionPayload = {
  __typename?: 'CreateReviewSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSection` that was created by this mutation. */
  reviewSection?: Maybe<ReviewSection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ReviewSection`. May be used by Relay 1. */
  reviewSectionEdge?: Maybe<ReviewSectionsEdge>;
};


/** The output of our create `ReviewSection` mutation. */
export type CreateReviewSectionPayloadReviewSectionEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionsOrderBy>>;
};

/** All input for the create `ReviewSectionAssignment` mutation. */
export type CreateReviewSectionAssignmentInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionAssignment` to be created by this mutation. */
  reviewSectionAssignment: ReviewSectionAssignmentInput;
};

/** An input for mutations affecting `ReviewSectionAssignment` */
export type ReviewSectionAssignmentInput = {
  id?: Maybe<Scalars['BigInt']>;
  reviewerId?: Maybe<Scalars['BigInt']>;
  assignerId?: Maybe<Scalars['BigInt']>;
  stageId?: Maybe<Scalars['BigInt']>;
  sectionId: Scalars['BigInt'];
  level: Scalars['Int'];
};

/** The output of our create `ReviewSectionAssignment` mutation. */
export type CreateReviewSectionAssignmentPayload = {
  __typename?: 'CreateReviewSectionAssignmentPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionAssignment` that was created by this mutation. */
  reviewSectionAssignment?: Maybe<ReviewSectionAssignment>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByReviewerId?: Maybe<User>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByAssignerId?: Maybe<User>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ReviewSectionAssignment`. */
  applicationStageHistoryByStageId?: Maybe<ApplicationStageHistory>;
  /** An edge for our `ReviewSectionAssignment`. May be used by Relay 1. */
  reviewSectionAssignmentEdge?: Maybe<ReviewSectionAssignmentsEdge>;
};


/** The output of our create `ReviewSectionAssignment` mutation. */
export type CreateReviewSectionAssignmentPayloadReviewSectionAssignmentEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
};

/** All input for the create `ReviewSectionJoin` mutation. */
export type CreateReviewSectionJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionJoin` to be created by this mutation. */
  reviewSectionJoin: ReviewSectionJoinInput;
};

/** An input for mutations affecting `ReviewSectionJoin` */
export type ReviewSectionJoinInput = {
  id?: Maybe<Scalars['BigInt']>;
  reviewId: Scalars['Int'];
  sectionAssignmentId: Scalars['BigInt'];
  reviewSectionId: Scalars['BigInt'];
  sendToApplicant?: Maybe<Scalars['Boolean']>;
};

/** The output of our create `ReviewSectionJoin` mutation. */
export type CreateReviewSectionJoinPayload = {
  __typename?: 'CreateReviewSectionJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionJoin` that was created by this mutation. */
  reviewSectionJoin?: Maybe<ReviewSectionJoin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Review` that is related to this `ReviewSectionJoin`. */
  reviewByReviewId?: Maybe<Review>;
  /** Reads a single `ReviewSectionAssignment` that is related to this `ReviewSectionJoin`. */
  reviewSectionAssignmentBySectionAssignmentId?: Maybe<ReviewSectionAssignment>;
  /** Reads a single `ReviewSection` that is related to this `ReviewSectionJoin`. */
  reviewSectionByReviewSectionId?: Maybe<ReviewSection>;
  /** An edge for our `ReviewSectionJoin`. May be used by Relay 1. */
  reviewSectionJoinEdge?: Maybe<ReviewSectionJoinsEdge>;
};


/** The output of our create `ReviewSectionJoin` mutation. */
export type CreateReviewSectionJoinPayloadReviewSectionJoinEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
};

/** All input for the create `ReviewSectionResponseJoin` mutation. */
export type CreateReviewSectionResponseJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionResponseJoin` to be created by this mutation. */
  reviewSectionResponseJoin: ReviewSectionResponseJoinInput;
};

/** An input for mutations affecting `ReviewSectionResponseJoin` */
export type ReviewSectionResponseJoinInput = {
  id?: Maybe<Scalars['BigInt']>;
  reviewSectionJoinId: Scalars['BigInt'];
  reviewResponseId: Scalars['BigInt'];
  sendToApplicant?: Maybe<Scalars['Boolean']>;
};

/** The output of our create `ReviewSectionResponseJoin` mutation. */
export type CreateReviewSectionResponseJoinPayload = {
  __typename?: 'CreateReviewSectionResponseJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionResponseJoin` that was created by this mutation. */
  reviewSectionResponseJoin?: Maybe<ReviewSectionResponseJoin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ReviewSectionJoin` that is related to this `ReviewSectionResponseJoin`. */
  reviewSectionJoinByReviewSectionJoinId?: Maybe<ReviewSectionJoin>;
  /** Reads a single `ReviewResponse` that is related to this `ReviewSectionResponseJoin`. */
  reviewResponseByReviewResponseId?: Maybe<ReviewResponse>;
  /** An edge for our `ReviewSectionResponseJoin`. May be used by Relay 1. */
  reviewSectionResponseJoinEdge?: Maybe<ReviewSectionResponseJoinsEdge>;
};


/** The output of our create `ReviewSectionResponseJoin` mutation. */
export type CreateReviewSectionResponseJoinPayloadReviewSectionResponseJoinEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionResponseJoinsOrderBy>>;
};

/** All input for the create `Template` mutation. */
export type CreateTemplateInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Template` to be created by this mutation. */
  template: TemplateInput;
};

/** An input for mutations affecting `Template` */
export type TemplateInput = {
  id?: Maybe<Scalars['Int']>;
  versionId?: Maybe<Scalars['Int']>;
  templateName?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  status?: Maybe<TemplateStatus>;
};

/** The output of our create `Template` mutation. */
export type CreateTemplatePayload = {
  __typename?: 'CreateTemplatePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Template` that was created by this mutation. */
  template?: Maybe<Template>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateVersion` that is related to this `Template`. */
  templateVersionByVersionId?: Maybe<TemplateVersion>;
  /** An edge for our `Template`. May be used by Relay 1. */
  templateEdge?: Maybe<TemplatesEdge>;
};


/** The output of our create `Template` mutation. */
export type CreateTemplatePayloadTemplateEdgeArgs = {
  orderBy?: Maybe<Array<TemplatesOrderBy>>;
};

/** All input for the create `TemplateAction` mutation. */
export type CreateTemplateActionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateAction` to be created by this mutation. */
  templateAction: TemplateActionInput;
};

/** An input for mutations affecting `TemplateAction` */
export type TemplateActionInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  actionId?: Maybe<Scalars['Int']>;
  previousActionId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  conditions?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplateAction` mutation. */
export type CreateTemplateActionPayload = {
  __typename?: 'CreateTemplateActionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateAction` that was created by this mutation. */
  templateAction?: Maybe<TemplateAction>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateAction`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByActionId?: Maybe<Action>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByPreviousActionId?: Maybe<Action>;
  /** An edge for our `TemplateAction`. May be used by Relay 1. */
  templateActionEdge?: Maybe<TemplateActionsEdge>;
};


/** The output of our create `TemplateAction` mutation. */
export type CreateTemplateActionPayloadTemplateActionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
};

/** All input for the create `TemplateElement` mutation. */
export type CreateTemplateElementInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateElement` to be created by this mutation. */
  templateElement: TemplateElementInput;
};

/** An input for mutations affecting `TemplateElement` */
export type TemplateElementInput = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplateElement` mutation. */
export type CreateTemplateElementPayload = {
  __typename?: 'CreateTemplateElementPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateElement` that was created by this mutation. */
  templateElement?: Maybe<TemplateElement>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateSection` that is related to this `TemplateElement`. */
  templateSectionBySectionId?: Maybe<TemplateSection>;
  /** Reads a single `TemplateElement` that is related to this `TemplateElement`. */
  templateElementByNextElementId?: Maybe<TemplateElement>;
  /** An edge for our `TemplateElement`. May be used by Relay 1. */
  templateElementEdge?: Maybe<TemplateElementsEdge>;
};


/** The output of our create `TemplateElement` mutation. */
export type CreateTemplateElementPayloadTemplateElementEdgeArgs = {
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
};

/** All input for the create `TemplateInformation` mutation. */
export type CreateTemplateInformationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateInformation` to be created by this mutation. */
  templateInformation: TemplateInformationInput;
};

/** An input for mutations affecting `TemplateInformation` */
export type TemplateInformationInput = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  type?: Maybe<InformationType>;
  parameters?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplateInformation` mutation. */
export type CreateTemplateInformationPayload = {
  __typename?: 'CreateTemplateInformationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateInformation` that was created by this mutation. */
  templateInformation?: Maybe<TemplateInformation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateInformation`. May be used by Relay 1. */
  templateInformationEdge?: Maybe<TemplateInformationsEdge>;
};


/** The output of our create `TemplateInformation` mutation. */
export type CreateTemplateInformationPayloadTemplateInformationEdgeArgs = {
  orderBy?: Maybe<Array<TemplateInformationsOrderBy>>;
};

/** All input for the create `TemplatePermission` mutation. */
export type CreateTemplatePermissionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplatePermission` to be created by this mutation. */
  templatePermission: TemplatePermissionInput;
};

/** An input for mutations affecting `TemplatePermission` */
export type TemplatePermissionInput = {
  id?: Maybe<Scalars['Int']>;
  permissionJoinId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplatePermission` mutation. */
export type CreateTemplatePermissionPayload = {
  __typename?: 'CreateTemplatePermissionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplatePermission` that was created by this mutation. */
  templatePermission?: Maybe<TemplatePermission>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PermissionJoin` that is related to this `TemplatePermission`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `Template` that is related to this `TemplatePermission`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `TemplateSection` that is related to this `TemplatePermission`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** Reads a single `PermissionPolicy` that is related to this `TemplatePermission`. */
  permissionPolicyByPermissionPolicyId?: Maybe<PermissionPolicy>;
  /** An edge for our `TemplatePermission`. May be used by Relay 1. */
  templatePermissionEdge?: Maybe<TemplatePermissionsEdge>;
};


/** The output of our create `TemplatePermission` mutation. */
export type CreateTemplatePermissionPayloadTemplatePermissionEdgeArgs = {
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
};

/** All input for the create `TemplateQuestion` mutation. */
export type CreateTemplateQuestionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestion` to be created by this mutation. */
  templateQuestion: TemplateQuestionInput;
};

/** An input for mutations affecting `TemplateQuestion` */
export type TemplateQuestionInput = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  questionTypeId?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  isEditable?: Maybe<Scalars['Boolean']>;
  parameters?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplateQuestion` mutation. */
export type CreateTemplateQuestionPayload = {
  __typename?: 'CreateTemplateQuestionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestion` that was created by this mutation. */
  templateQuestion?: Maybe<TemplateQuestion>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestionType` that is related to this `TemplateQuestion`. */
  templateQuestionTypeByQuestionTypeId?: Maybe<TemplateQuestionType>;
  /** An edge for our `TemplateQuestion`. May be used by Relay 1. */
  templateQuestionEdge?: Maybe<TemplateQuestionsEdge>;
};


/** The output of our create `TemplateQuestion` mutation. */
export type CreateTemplateQuestionPayloadTemplateQuestionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionsOrderBy>>;
};

/** All input for the create `TemplateQuestionOption` mutation. */
export type CreateTemplateQuestionOptionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionOption` to be created by this mutation. */
  templateQuestionOption: TemplateQuestionOptionInput;
};

/** An input for mutations affecting `TemplateQuestionOption` */
export type TemplateQuestionOptionInput = {
  id?: Maybe<Scalars['Int']>;
  questionId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplateQuestionOption` mutation. */
export type CreateTemplateQuestionOptionPayload = {
  __typename?: 'CreateTemplateQuestionOptionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionOption` that was created by this mutation. */
  templateQuestionOption?: Maybe<TemplateQuestionOption>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestion` that is related to this `TemplateQuestionOption`. */
  templateQuestionByQuestionId?: Maybe<TemplateQuestion>;
  /** An edge for our `TemplateQuestionOption`. May be used by Relay 1. */
  templateQuestionOptionEdge?: Maybe<TemplateQuestionOptionsEdge>;
};


/** The output of our create `TemplateQuestionOption` mutation. */
export type CreateTemplateQuestionOptionPayloadTemplateQuestionOptionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionOptionsOrderBy>>;
};

/** All input for the create `TemplateQuestionType` mutation. */
export type CreateTemplateQuestionTypeInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionType` to be created by this mutation. */
  templateQuestionType: TemplateQuestionTypeInput;
};

/** An input for mutations affecting `TemplateQuestionType` */
export type TemplateQuestionTypeInput = {
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<QuestionType>;
  defaultOptionName?: Maybe<Scalars['String']>;
  defaultOptionValue?: Maybe<Scalars['JSON']>;
};

/** The output of our create `TemplateQuestionType` mutation. */
export type CreateTemplateQuestionTypePayload = {
  __typename?: 'CreateTemplateQuestionTypePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionType` that was created by this mutation. */
  templateQuestionType?: Maybe<TemplateQuestionType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateQuestionType`. May be used by Relay 1. */
  templateQuestionTypeEdge?: Maybe<TemplateQuestionTypesEdge>;
};


/** The output of our create `TemplateQuestionType` mutation. */
export type CreateTemplateQuestionTypePayloadTemplateQuestionTypeEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionTypesOrderBy>>;
};

/** All input for the create `TemplateReviewStage` mutation. */
export type CreateTemplateReviewStageInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateReviewStage` to be created by this mutation. */
  templateReviewStage: TemplateReviewStageInput;
};

/** An input for mutations affecting `TemplateReviewStage` */
export type TemplateReviewStageInput = {
  id?: Maybe<Scalars['Int']>;
  templateStageId?: Maybe<Scalars['Int']>;
  permissionJoinId?: Maybe<Scalars['Int']>;
  nextReviewStageId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

/** The output of our create `TemplateReviewStage` mutation. */
export type CreateTemplateReviewStagePayload = {
  __typename?: 'CreateTemplateReviewStagePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateReviewStage` that was created by this mutation. */
  templateReviewStage?: Maybe<TemplateReviewStage>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateStage` that is related to this `TemplateReviewStage`. */
  templateStageByTemplateStageId?: Maybe<TemplateStage>;
  /** Reads a single `PermissionJoin` that is related to this `TemplateReviewStage`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `TemplateReviewStage` that is related to this `TemplateReviewStage`. */
  templateReviewStageByNextReviewStageId?: Maybe<TemplateReviewStage>;
  /** An edge for our `TemplateReviewStage`. May be used by Relay 1. */
  templateReviewStageEdge?: Maybe<TemplateReviewStagesEdge>;
};


/** The output of our create `TemplateReviewStage` mutation. */
export type CreateTemplateReviewStagePayloadTemplateReviewStageEdgeArgs = {
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
};

/** All input for the create `TemplateSection` mutation. */
export type CreateTemplateSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateSection` to be created by this mutation. */
  templateSection: TemplateSectionInput;
};

/** An input for mutations affecting `TemplateSection` */
export type TemplateSectionInput = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
};

/** The output of our create `TemplateSection` mutation. */
export type CreateTemplateSectionPayload = {
  __typename?: 'CreateTemplateSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateSection` that was created by this mutation. */
  templateSection?: Maybe<TemplateSection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateSection`. */
  templateByTemplateId?: Maybe<Template>;
  /** An edge for our `TemplateSection`. May be used by Relay 1. */
  templateSectionEdge?: Maybe<TemplateSectionsEdge>;
};


/** The output of our create `TemplateSection` mutation. */
export type CreateTemplateSectionPayloadTemplateSectionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
};

/** All input for the create `TemplateStage` mutation. */
export type CreateTemplateStageInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateStage` to be created by this mutation. */
  templateStage: TemplateStageInput;
};

/** An input for mutations affecting `TemplateStage` */
export type TemplateStageInput = {
  id?: Maybe<Scalars['Int']>;
  tamplateId?: Maybe<Scalars['Int']>;
};

/** The output of our create `TemplateStage` mutation. */
export type CreateTemplateStagePayload = {
  __typename?: 'CreateTemplateStagePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateStage` that was created by this mutation. */
  templateStage?: Maybe<TemplateStage>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateStage`. */
  templateByTamplateId?: Maybe<Template>;
  /** An edge for our `TemplateStage`. May be used by Relay 1. */
  templateStageEdge?: Maybe<TemplateStagesEdge>;
};


/** The output of our create `TemplateStage` mutation. */
export type CreateTemplateStagePayloadTemplateStageEdgeArgs = {
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
};

/** All input for the create `TemplateVersion` mutation. */
export type CreateTemplateVersionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateVersion` to be created by this mutation. */
  templateVersion: TemplateVersionInput;
};

/** An input for mutations affecting `TemplateVersion` */
export type TemplateVersionInput = {
  id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['Int']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** The output of our create `TemplateVersion` mutation. */
export type CreateTemplateVersionPayload = {
  __typename?: 'CreateTemplateVersionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateVersion` that was created by this mutation. */
  templateVersion?: Maybe<TemplateVersion>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateVersion`. May be used by Relay 1. */
  templateVersionEdge?: Maybe<TemplateVersionsEdge>;
};


/** The output of our create `TemplateVersion` mutation. */
export type CreateTemplateVersionPayloadTemplateVersionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateVersionsOrderBy>>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** An input for mutations affecting `User` */
export type UserInput = {
  id?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>;
};

/** All input for the create `UserOrganisation` mutation. */
export type CreateUserOrganisationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `UserOrganisation` to be created by this mutation. */
  userOrganisation: UserOrganisationInput;
};

/** An input for mutations affecting `UserOrganisation` */
export type UserOrganisationInput = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  organistionId?: Maybe<Scalars['Int']>;
  job?: Maybe<Scalars['String']>;
};

/** The output of our create `UserOrganisation` mutation. */
export type CreateUserOrganisationPayload = {
  __typename?: 'CreateUserOrganisationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `UserOrganisation` that was created by this mutation. */
  userOrganisation?: Maybe<UserOrganisation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `UserOrganisation`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `Organisation` that is related to this `UserOrganisation`. */
  organisationByOrganistionId?: Maybe<Organisation>;
  /** An edge for our `UserOrganisation`. May be used by Relay 1. */
  userOrganisationEdge?: Maybe<UserOrganisationsEdge>;
};


/** The output of our create `UserOrganisation` mutation. */
export type CreateUserOrganisationPayloadUserOrganisationEdgeArgs = {
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
};

/** All input for the `updateAction` mutation. */
export type UpdateActionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Action` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Action` being updated. */
  actionPatch: ActionPatch;
};

/** Represents an update to a `Action`. Fields that are set will be updated. */
export type ActionPatch = {
  id?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  path?: Maybe<Scalars['String']>;
  requiredParameters?: Maybe<Scalars['JSON']>;
};

/** The output of our update `Action` mutation. */
export type UpdateActionPayload = {
  __typename?: 'UpdateActionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Action` that was updated by this mutation. */
  action?: Maybe<Action>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Action`. May be used by Relay 1. */
  actionEdge?: Maybe<ActionsEdge>;
};


/** The output of our update `Action` mutation. */
export type UpdateActionPayloadActionEdgeArgs = {
  orderBy?: Maybe<Array<ActionsOrderBy>>;
};

/** All input for the `updateActionById` mutation. */
export type UpdateActionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Action` being updated. */
  actionPatch: ActionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateActionQueue` mutation. */
export type UpdateActionQueueInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ActionQueue` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ActionQueue` being updated. */
  actionQueuePatch: ActionQueuePatch;
};

/** Represents an update to a `ActionQueue`. Fields that are set will be updated. */
export type ActionQueuePatch = {
  id?: Maybe<Scalars['Int']>;
  actionCode?: Maybe<Scalars['String']>;
  parameters?: Maybe<Scalars['JSON']>;
  status?: Maybe<ActionQueueStatus>;
  timeQueued?: Maybe<Scalars['Datetime']>;
  timeExecuted?: Maybe<Scalars['Datetime']>;
  errorLog?: Maybe<Scalars['String']>;
};

/** The output of our update `ActionQueue` mutation. */
export type UpdateActionQueuePayload = {
  __typename?: 'UpdateActionQueuePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ActionQueue` that was updated by this mutation. */
  actionQueue?: Maybe<ActionQueue>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ActionQueue`. May be used by Relay 1. */
  actionQueueEdge?: Maybe<ActionQueuesEdge>;
};


/** The output of our update `ActionQueue` mutation. */
export type UpdateActionQueuePayloadActionQueueEdgeArgs = {
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
};

/** All input for the `updateActionQueueById` mutation. */
export type UpdateActionQueueByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ActionQueue` being updated. */
  actionQueuePatch: ActionQueuePatch;
  id: Scalars['Int'];
};

/** All input for the `updateApplication` mutation. */
export type UpdateApplicationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Application` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Application` being updated. */
  applicationPatch: ApplicationPatch;
};

/** Represents an update to a `Application`. Fields that are set will be updated. */
export type ApplicationPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  serial?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  outcome?: Maybe<ApplicationOutcome>;
  isActive?: Maybe<Scalars['Boolean']>;
  triggering?: Maybe<Scalars['String']>;
};

/** The output of our update `Application` mutation. */
export type UpdateApplicationPayload = {
  __typename?: 'UpdateApplicationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Application` that was updated by this mutation. */
  application?: Maybe<Application>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `Application`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `User` that is related to this `Application`. */
  userByUserId?: Maybe<User>;
  /** An edge for our `Application`. May be used by Relay 1. */
  applicationEdge?: Maybe<ApplicationsEdge>;
};


/** The output of our update `Application` mutation. */
export type UpdateApplicationPayloadApplicationEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
};

/** All input for the `updateApplicationById` mutation. */
export type UpdateApplicationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Application` being updated. */
  applicationPatch: ApplicationPatch;
  id: Scalars['Int'];
};

/** All input for the `updateApplicationResponse` mutation. */
export type UpdateApplicationResponseInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationResponse` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ApplicationResponse` being updated. */
  applicationResponsePatch: ApplicationResponsePatch;
};

/** Represents an update to a `ApplicationResponse`. Fields that are set will be updated. */
export type ApplicationResponsePatch = {
  id?: Maybe<Scalars['Int']>;
  templateQuestionId?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  value?: Maybe<Scalars['JSON']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
};

/** The output of our update `ApplicationResponse` mutation. */
export type UpdateApplicationResponsePayload = {
  __typename?: 'UpdateApplicationResponsePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationResponse` that was updated by this mutation. */
  applicationResponse?: Maybe<ApplicationResponse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestion` that is related to this `ApplicationResponse`. */
  templateQuestionByTemplateQuestionId?: Maybe<TemplateQuestion>;
  /** Reads a single `Application` that is related to this `ApplicationResponse`. */
  applicationByApplicationId?: Maybe<Application>;
  /** An edge for our `ApplicationResponse`. May be used by Relay 1. */
  applicationResponseEdge?: Maybe<ApplicationResponsesEdge>;
};


/** The output of our update `ApplicationResponse` mutation. */
export type UpdateApplicationResponsePayloadApplicationResponseEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
};

/** All input for the `updateApplicationResponseById` mutation. */
export type UpdateApplicationResponseByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ApplicationResponse` being updated. */
  applicationResponsePatch: ApplicationResponsePatch;
  id: Scalars['Int'];
};

/** All input for the `updateApplicationSection` mutation. */
export type UpdateApplicationSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationSection` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ApplicationSection` being updated. */
  applicationSectionPatch: ApplicationSectionPatch;
};

/** Represents an update to a `ApplicationSection`. Fields that are set will be updated. */
export type ApplicationSectionPatch = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
};

/** The output of our update `ApplicationSection` mutation. */
export type UpdateApplicationSectionPayload = {
  __typename?: 'UpdateApplicationSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationSection` that was updated by this mutation. */
  applicationSection?: Maybe<ApplicationSection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Application` that is related to this `ApplicationSection`. */
  applicationByApplicationId?: Maybe<Application>;
  /** Reads a single `TemplateSection` that is related to this `ApplicationSection`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** An edge for our `ApplicationSection`. May be used by Relay 1. */
  applicationSectionEdge?: Maybe<ApplicationSectionsEdge>;
};


/** The output of our update `ApplicationSection` mutation. */
export type UpdateApplicationSectionPayloadApplicationSectionEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
};

/** All input for the `updateApplicationSectionById` mutation. */
export type UpdateApplicationSectionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ApplicationSection` being updated. */
  applicationSectionPatch: ApplicationSectionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateApplicationStageHistory` mutation. */
export type UpdateApplicationStageHistoryInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationStageHistory` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ApplicationStageHistory` being updated. */
  applicationStageHistoryPatch: ApplicationStageHistoryPatch;
};

/** Represents an update to a `ApplicationStageHistory`. Fields that are set will be updated. */
export type ApplicationStageHistoryPatch = {
  id?: Maybe<Scalars['Int']>;
  applicationId?: Maybe<Scalars['Int']>;
  stage?: Maybe<ApplicationStage>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** The output of our update `ApplicationStageHistory` mutation. */
export type UpdateApplicationStageHistoryPayload = {
  __typename?: 'UpdateApplicationStageHistoryPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStageHistory` that was updated by this mutation. */
  applicationStageHistory?: Maybe<ApplicationStageHistory>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Application` that is related to this `ApplicationStageHistory`. */
  applicationByApplicationId?: Maybe<Application>;
  /** An edge for our `ApplicationStageHistory`. May be used by Relay 1. */
  applicationStageHistoryEdge?: Maybe<ApplicationStageHistoriesEdge>;
};


/** The output of our update `ApplicationStageHistory` mutation. */
export type UpdateApplicationStageHistoryPayloadApplicationStageHistoryEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
};

/** All input for the `updateApplicationStageHistoryById` mutation. */
export type UpdateApplicationStageHistoryByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ApplicationStageHistory` being updated. */
  applicationStageHistoryPatch: ApplicationStageHistoryPatch;
  id: Scalars['Int'];
};

/** All input for the `updateApplicationStatusHistory` mutation. */
export type UpdateApplicationStatusHistoryInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationStatusHistory` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ApplicationStatusHistory` being updated. */
  applicationStatusHistoryPatch: ApplicationStatusHistoryPatch;
};

/** Represents an update to a `ApplicationStatusHistory`. Fields that are set will be updated. */
export type ApplicationStatusHistoryPatch = {
  id?: Maybe<Scalars['Int']>;
  applicationStageHistoryId?: Maybe<Scalars['Int']>;
  status?: Maybe<ApplicationStatus>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** The output of our update `ApplicationStatusHistory` mutation. */
export type UpdateApplicationStatusHistoryPayload = {
  __typename?: 'UpdateApplicationStatusHistoryPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStatusHistory` that was updated by this mutation. */
  applicationStatusHistory?: Maybe<ApplicationStatusHistory>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ApplicationStatusHistory`. */
  applicationStageHistoryByApplicationStageHistoryId?: Maybe<ApplicationStageHistory>;
  /** An edge for our `ApplicationStatusHistory`. May be used by Relay 1. */
  applicationStatusHistoryEdge?: Maybe<ApplicationStatusHistoriesEdge>;
};


/** The output of our update `ApplicationStatusHistory` mutation. */
export type UpdateApplicationStatusHistoryPayloadApplicationStatusHistoryEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
};

/** All input for the `updateApplicationStatusHistoryById` mutation. */
export type UpdateApplicationStatusHistoryByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ApplicationStatusHistory` being updated. */
  applicationStatusHistoryPatch: ApplicationStatusHistoryPatch;
  id: Scalars['Int'];
};

/** All input for the `updateOrganisation` mutation. */
export type UpdateOrganisationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Organisation` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Organisation` being updated. */
  organisationPatch: OrganisationPatch;
};

/** Represents an update to a `Organisation`. Fields that are set will be updated. */
export type OrganisationPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  licenceNumber?: Maybe<Scalars['Int']>;
  address?: Maybe<Scalars['String']>;
};

/** The output of our update `Organisation` mutation. */
export type UpdateOrganisationPayload = {
  __typename?: 'UpdateOrganisationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Organisation` that was updated by this mutation. */
  organisation?: Maybe<Organisation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Organisation`. May be used by Relay 1. */
  organisationEdge?: Maybe<OrganisationsEdge>;
};


/** The output of our update `Organisation` mutation. */
export type UpdateOrganisationPayloadOrganisationEdgeArgs = {
  orderBy?: Maybe<Array<OrganisationsOrderBy>>;
};

/** All input for the `updateOrganisationById` mutation. */
export type UpdateOrganisationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Organisation` being updated. */
  organisationPatch: OrganisationPatch;
  id: Scalars['Int'];
};

/** All input for the `updatePermissionJoin` mutation. */
export type UpdatePermissionJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PermissionJoin` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PermissionJoin` being updated. */
  permissionJoinPatch: PermissionJoinPatch;
};

/** Represents an update to a `PermissionJoin`. Fields that are set will be updated. */
export type PermissionJoinPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  userOrganisationId?: Maybe<Scalars['Int']>;
  permissionNameId?: Maybe<Scalars['Int']>;
};

/** The output of our update `PermissionJoin` mutation. */
export type UpdatePermissionJoinPayload = {
  __typename?: 'UpdatePermissionJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionJoin` that was updated by this mutation. */
  permissionJoin?: Maybe<PermissionJoin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PermissionJoin`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `UserOrganisation` that is related to this `PermissionJoin`. */
  userOrganisationByUserOrganisationId?: Maybe<UserOrganisation>;
  /** Reads a single `PermissionName` that is related to this `PermissionJoin`. */
  permissionNameByPermissionNameId?: Maybe<PermissionName>;
  /** An edge for our `PermissionJoin`. May be used by Relay 1. */
  permissionJoinEdge?: Maybe<PermissionJoinsEdge>;
};


/** The output of our update `PermissionJoin` mutation. */
export type UpdatePermissionJoinPayloadPermissionJoinEdgeArgs = {
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
};

/** All input for the `updatePermissionJoinById` mutation. */
export type UpdatePermissionJoinByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PermissionJoin` being updated. */
  permissionJoinPatch: PermissionJoinPatch;
  id: Scalars['Int'];
};

/** All input for the `updatePermissionName` mutation. */
export type UpdatePermissionNameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PermissionName` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PermissionName` being updated. */
  permissionNamePatch: PermissionNamePatch;
};

/** Represents an update to a `PermissionName`. Fields that are set will be updated. */
export type PermissionNamePatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

/** The output of our update `PermissionName` mutation. */
export type UpdatePermissionNamePayload = {
  __typename?: 'UpdatePermissionNamePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionName` that was updated by this mutation. */
  permissionName?: Maybe<PermissionName>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PermissionName`. May be used by Relay 1. */
  permissionNameEdge?: Maybe<PermissionNamesEdge>;
};


/** The output of our update `PermissionName` mutation. */
export type UpdatePermissionNamePayloadPermissionNameEdgeArgs = {
  orderBy?: Maybe<Array<PermissionNamesOrderBy>>;
};

/** All input for the `updatePermissionNameById` mutation. */
export type UpdatePermissionNameByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PermissionName` being updated. */
  permissionNamePatch: PermissionNamePatch;
  id: Scalars['Int'];
};

/** All input for the `updatePermissionPolicy` mutation. */
export type UpdatePermissionPolicyInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PermissionPolicy` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `PermissionPolicy` being updated. */
  permissionPolicyPatch: PermissionPolicyPatch;
};

/** Represents an update to a `PermissionPolicy`. Fields that are set will be updated. */
export type PermissionPolicyPatch = {
  id?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  rules?: Maybe<Scalars['JSON']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<PermissionPolicyType>;
};

/** The output of our update `PermissionPolicy` mutation. */
export type UpdatePermissionPolicyPayload = {
  __typename?: 'UpdatePermissionPolicyPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionPolicy` that was updated by this mutation. */
  permissionPolicy?: Maybe<PermissionPolicy>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PermissionPolicy`. May be used by Relay 1. */
  permissionPolicyEdge?: Maybe<PermissionPoliciesEdge>;
};


/** The output of our update `PermissionPolicy` mutation. */
export type UpdatePermissionPolicyPayloadPermissionPolicyEdgeArgs = {
  orderBy?: Maybe<Array<PermissionPoliciesOrderBy>>;
};

/** All input for the `updatePermissionPolicyById` mutation. */
export type UpdatePermissionPolicyByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `PermissionPolicy` being updated. */
  permissionPolicyPatch: PermissionPolicyPatch;
  id: Scalars['Int'];
};

/** All input for the `updateReview` mutation. */
export type UpdateReviewInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Review` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Review` being updated. */
  reviewPatch: ReviewPatch;
};

/** Represents an update to a `Review`. Fields that are set will be updated. */
export type ReviewPatch = {
  id?: Maybe<Scalars['BigInt']>;
  applicationId?: Maybe<Scalars['BigInt']>;
  status?: Maybe<ReviewStatus>;
  comment?: Maybe<Scalars['String']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
};

/** The output of our update `Review` mutation. */
export type UpdateReviewPayload = {
  __typename?: 'UpdateReviewPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Review` that was updated by this mutation. */
  review?: Maybe<Review>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Review`. May be used by Relay 1. */
  reviewEdge?: Maybe<ReviewsEdge>;
};


/** The output of our update `Review` mutation. */
export type UpdateReviewPayloadReviewEdgeArgs = {
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
};

/** All input for the `updateReviewById` mutation. */
export type UpdateReviewByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Review` being updated. */
  reviewPatch: ReviewPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateReviewResponse` mutation. */
export type UpdateReviewResponseInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewResponse` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ReviewResponse` being updated. */
  reviewResponsePatch: ReviewResponsePatch;
};

/** Represents an update to a `ReviewResponse`. Fields that are set will be updated. */
export type ReviewResponsePatch = {
  id?: Maybe<Scalars['BigInt']>;
  applicationResponseId?: Maybe<Scalars['Int']>;
  comment?: Maybe<Scalars['String']>;
  reviewDecision?: Maybe<ReviewDecision>;
};

/** The output of our update `ReviewResponse` mutation. */
export type UpdateReviewResponsePayload = {
  __typename?: 'UpdateReviewResponsePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewResponse` that was updated by this mutation. */
  reviewResponse?: Maybe<ReviewResponse>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ApplicationResponse` that is related to this `ReviewResponse`. */
  applicationResponseByApplicationResponseId?: Maybe<ApplicationResponse>;
  /** An edge for our `ReviewResponse`. May be used by Relay 1. */
  reviewResponseEdge?: Maybe<ReviewResponsesEdge>;
};


/** The output of our update `ReviewResponse` mutation. */
export type UpdateReviewResponsePayloadReviewResponseEdgeArgs = {
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
};

/** All input for the `updateReviewResponseById` mutation. */
export type UpdateReviewResponseByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ReviewResponse` being updated. */
  reviewResponsePatch: ReviewResponsePatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateReviewSection` mutation. */
export type UpdateReviewSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSection` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ReviewSection` being updated. */
  reviewSectionPatch: ReviewSectionPatch;
};

/** Represents an update to a `ReviewSection`. Fields that are set will be updated. */
export type ReviewSectionPatch = {
  id?: Maybe<Scalars['BigInt']>;
  reviewDecision?: Maybe<ReviewDecision>;
  comment?: Maybe<Scalars['String']>;
};

/** The output of our update `ReviewSection` mutation. */
export type UpdateReviewSectionPayload = {
  __typename?: 'UpdateReviewSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSection` that was updated by this mutation. */
  reviewSection?: Maybe<ReviewSection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ReviewSection`. May be used by Relay 1. */
  reviewSectionEdge?: Maybe<ReviewSectionsEdge>;
};


/** The output of our update `ReviewSection` mutation. */
export type UpdateReviewSectionPayloadReviewSectionEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionsOrderBy>>;
};

/** All input for the `updateReviewSectionById` mutation. */
export type UpdateReviewSectionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ReviewSection` being updated. */
  reviewSectionPatch: ReviewSectionPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateReviewSectionAssignment` mutation. */
export type UpdateReviewSectionAssignmentInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSectionAssignment` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ReviewSectionAssignment` being updated. */
  reviewSectionAssignmentPatch: ReviewSectionAssignmentPatch;
};

/** Represents an update to a `ReviewSectionAssignment`. Fields that are set will be updated. */
export type ReviewSectionAssignmentPatch = {
  id?: Maybe<Scalars['BigInt']>;
  reviewerId?: Maybe<Scalars['BigInt']>;
  assignerId?: Maybe<Scalars['BigInt']>;
  stageId?: Maybe<Scalars['BigInt']>;
  sectionId?: Maybe<Scalars['BigInt']>;
  level?: Maybe<Scalars['Int']>;
};

/** The output of our update `ReviewSectionAssignment` mutation. */
export type UpdateReviewSectionAssignmentPayload = {
  __typename?: 'UpdateReviewSectionAssignmentPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionAssignment` that was updated by this mutation. */
  reviewSectionAssignment?: Maybe<ReviewSectionAssignment>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByReviewerId?: Maybe<User>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByAssignerId?: Maybe<User>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ReviewSectionAssignment`. */
  applicationStageHistoryByStageId?: Maybe<ApplicationStageHistory>;
  /** An edge for our `ReviewSectionAssignment`. May be used by Relay 1. */
  reviewSectionAssignmentEdge?: Maybe<ReviewSectionAssignmentsEdge>;
};


/** The output of our update `ReviewSectionAssignment` mutation. */
export type UpdateReviewSectionAssignmentPayloadReviewSectionAssignmentEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
};

/** All input for the `updateReviewSectionAssignmentById` mutation. */
export type UpdateReviewSectionAssignmentByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ReviewSectionAssignment` being updated. */
  reviewSectionAssignmentPatch: ReviewSectionAssignmentPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateReviewSectionJoin` mutation. */
export type UpdateReviewSectionJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSectionJoin` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ReviewSectionJoin` being updated. */
  reviewSectionJoinPatch: ReviewSectionJoinPatch;
};

/** Represents an update to a `ReviewSectionJoin`. Fields that are set will be updated. */
export type ReviewSectionJoinPatch = {
  id?: Maybe<Scalars['BigInt']>;
  reviewId?: Maybe<Scalars['Int']>;
  sectionAssignmentId?: Maybe<Scalars['BigInt']>;
  reviewSectionId?: Maybe<Scalars['BigInt']>;
  sendToApplicant?: Maybe<Scalars['Boolean']>;
};

/** The output of our update `ReviewSectionJoin` mutation. */
export type UpdateReviewSectionJoinPayload = {
  __typename?: 'UpdateReviewSectionJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionJoin` that was updated by this mutation. */
  reviewSectionJoin?: Maybe<ReviewSectionJoin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Review` that is related to this `ReviewSectionJoin`. */
  reviewByReviewId?: Maybe<Review>;
  /** Reads a single `ReviewSectionAssignment` that is related to this `ReviewSectionJoin`. */
  reviewSectionAssignmentBySectionAssignmentId?: Maybe<ReviewSectionAssignment>;
  /** Reads a single `ReviewSection` that is related to this `ReviewSectionJoin`. */
  reviewSectionByReviewSectionId?: Maybe<ReviewSection>;
  /** An edge for our `ReviewSectionJoin`. May be used by Relay 1. */
  reviewSectionJoinEdge?: Maybe<ReviewSectionJoinsEdge>;
};


/** The output of our update `ReviewSectionJoin` mutation. */
export type UpdateReviewSectionJoinPayloadReviewSectionJoinEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
};

/** All input for the `updateReviewSectionJoinById` mutation. */
export type UpdateReviewSectionJoinByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ReviewSectionJoin` being updated. */
  reviewSectionJoinPatch: ReviewSectionJoinPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateReviewSectionResponseJoin` mutation. */
export type UpdateReviewSectionResponseJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSectionResponseJoin` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `ReviewSectionResponseJoin` being updated. */
  reviewSectionResponseJoinPatch: ReviewSectionResponseJoinPatch;
};

/** Represents an update to a `ReviewSectionResponseJoin`. Fields that are set will be updated. */
export type ReviewSectionResponseJoinPatch = {
  id?: Maybe<Scalars['BigInt']>;
  reviewSectionJoinId?: Maybe<Scalars['BigInt']>;
  reviewResponseId?: Maybe<Scalars['BigInt']>;
  sendToApplicant?: Maybe<Scalars['Boolean']>;
};

/** The output of our update `ReviewSectionResponseJoin` mutation. */
export type UpdateReviewSectionResponseJoinPayload = {
  __typename?: 'UpdateReviewSectionResponseJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionResponseJoin` that was updated by this mutation. */
  reviewSectionResponseJoin?: Maybe<ReviewSectionResponseJoin>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ReviewSectionJoin` that is related to this `ReviewSectionResponseJoin`. */
  reviewSectionJoinByReviewSectionJoinId?: Maybe<ReviewSectionJoin>;
  /** Reads a single `ReviewResponse` that is related to this `ReviewSectionResponseJoin`. */
  reviewResponseByReviewResponseId?: Maybe<ReviewResponse>;
  /** An edge for our `ReviewSectionResponseJoin`. May be used by Relay 1. */
  reviewSectionResponseJoinEdge?: Maybe<ReviewSectionResponseJoinsEdge>;
};


/** The output of our update `ReviewSectionResponseJoin` mutation. */
export type UpdateReviewSectionResponseJoinPayloadReviewSectionResponseJoinEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionResponseJoinsOrderBy>>;
};

/** All input for the `updateReviewSectionResponseJoinById` mutation. */
export type UpdateReviewSectionResponseJoinByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `ReviewSectionResponseJoin` being updated. */
  reviewSectionResponseJoinPatch: ReviewSectionResponseJoinPatch;
  id: Scalars['BigInt'];
};

/** All input for the `updateTemplate` mutation. */
export type UpdateTemplateInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Template` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `Template` being updated. */
  templatePatch: TemplatePatch;
};

/** Represents an update to a `Template`. Fields that are set will be updated. */
export type TemplatePatch = {
  id?: Maybe<Scalars['Int']>;
  versionId?: Maybe<Scalars['Int']>;
  templateName?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  status?: Maybe<TemplateStatus>;
};

/** The output of our update `Template` mutation. */
export type UpdateTemplatePayload = {
  __typename?: 'UpdateTemplatePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Template` that was updated by this mutation. */
  template?: Maybe<Template>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateVersion` that is related to this `Template`. */
  templateVersionByVersionId?: Maybe<TemplateVersion>;
  /** An edge for our `Template`. May be used by Relay 1. */
  templateEdge?: Maybe<TemplatesEdge>;
};


/** The output of our update `Template` mutation. */
export type UpdateTemplatePayloadTemplateEdgeArgs = {
  orderBy?: Maybe<Array<TemplatesOrderBy>>;
};

/** All input for the `updateTemplateById` mutation. */
export type UpdateTemplateByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `Template` being updated. */
  templatePatch: TemplatePatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateAction` mutation. */
export type UpdateTemplateActionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateAction` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateAction` being updated. */
  templateActionPatch: TemplateActionPatch;
};

/** Represents an update to a `TemplateAction`. Fields that are set will be updated. */
export type TemplateActionPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  actionId?: Maybe<Scalars['Int']>;
  previousActionId?: Maybe<Scalars['Int']>;
  trigger?: Maybe<Trigger>;
  conditions?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplateAction` mutation. */
export type UpdateTemplateActionPayload = {
  __typename?: 'UpdateTemplateActionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateAction` that was updated by this mutation. */
  templateAction?: Maybe<TemplateAction>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateAction`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByActionId?: Maybe<Action>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByPreviousActionId?: Maybe<Action>;
  /** An edge for our `TemplateAction`. May be used by Relay 1. */
  templateActionEdge?: Maybe<TemplateActionsEdge>;
};


/** The output of our update `TemplateAction` mutation. */
export type UpdateTemplateActionPayloadTemplateActionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
};

/** All input for the `updateTemplateActionById` mutation. */
export type UpdateTemplateActionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateAction` being updated. */
  templateActionPatch: TemplateActionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateElement` mutation. */
export type UpdateTemplateElementInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateElement` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateElement` being updated. */
  templateElementPatch: TemplateElementPatch;
};

/** Represents an update to a `TemplateElement`. Fields that are set will be updated. */
export type TemplateElementPatch = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplateElement` mutation. */
export type UpdateTemplateElementPayload = {
  __typename?: 'UpdateTemplateElementPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateElement` that was updated by this mutation. */
  templateElement?: Maybe<TemplateElement>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateSection` that is related to this `TemplateElement`. */
  templateSectionBySectionId?: Maybe<TemplateSection>;
  /** Reads a single `TemplateElement` that is related to this `TemplateElement`. */
  templateElementByNextElementId?: Maybe<TemplateElement>;
  /** An edge for our `TemplateElement`. May be used by Relay 1. */
  templateElementEdge?: Maybe<TemplateElementsEdge>;
};


/** The output of our update `TemplateElement` mutation. */
export type UpdateTemplateElementPayloadTemplateElementEdgeArgs = {
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
};

/** All input for the `updateTemplateElementById` mutation. */
export type UpdateTemplateElementByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateElement` being updated. */
  templateElementPatch: TemplateElementPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateInformation` mutation. */
export type UpdateTemplateInformationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateInformation` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateInformation` being updated. */
  templateInformationPatch: TemplateInformationPatch;
};

/** Represents an update to a `TemplateInformation`. Fields that are set will be updated. */
export type TemplateInformationPatch = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  type?: Maybe<InformationType>;
  parameters?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplateInformation` mutation. */
export type UpdateTemplateInformationPayload = {
  __typename?: 'UpdateTemplateInformationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateInformation` that was updated by this mutation. */
  templateInformation?: Maybe<TemplateInformation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateInformation`. May be used by Relay 1. */
  templateInformationEdge?: Maybe<TemplateInformationsEdge>;
};


/** The output of our update `TemplateInformation` mutation. */
export type UpdateTemplateInformationPayloadTemplateInformationEdgeArgs = {
  orderBy?: Maybe<Array<TemplateInformationsOrderBy>>;
};

/** All input for the `updateTemplateInformationById` mutation. */
export type UpdateTemplateInformationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateInformation` being updated. */
  templateInformationPatch: TemplateInformationPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplatePermission` mutation. */
export type UpdateTemplatePermissionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplatePermission` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplatePermission` being updated. */
  templatePermissionPatch: TemplatePermissionPatch;
};

/** Represents an update to a `TemplatePermission`. Fields that are set will be updated. */
export type TemplatePermissionPatch = {
  id?: Maybe<Scalars['Int']>;
  permissionJoinId?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  templateSectionId?: Maybe<Scalars['Int']>;
  permissionPolicyId?: Maybe<Scalars['Int']>;
  restrictions?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplatePermission` mutation. */
export type UpdateTemplatePermissionPayload = {
  __typename?: 'UpdateTemplatePermissionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplatePermission` that was updated by this mutation. */
  templatePermission?: Maybe<TemplatePermission>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PermissionJoin` that is related to this `TemplatePermission`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `Template` that is related to this `TemplatePermission`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `TemplateSection` that is related to this `TemplatePermission`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** Reads a single `PermissionPolicy` that is related to this `TemplatePermission`. */
  permissionPolicyByPermissionPolicyId?: Maybe<PermissionPolicy>;
  /** An edge for our `TemplatePermission`. May be used by Relay 1. */
  templatePermissionEdge?: Maybe<TemplatePermissionsEdge>;
};


/** The output of our update `TemplatePermission` mutation. */
export type UpdateTemplatePermissionPayloadTemplatePermissionEdgeArgs = {
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
};

/** All input for the `updateTemplatePermissionById` mutation. */
export type UpdateTemplatePermissionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplatePermission` being updated. */
  templatePermissionPatch: TemplatePermissionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateQuestion` mutation. */
export type UpdateTemplateQuestionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateQuestion` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateQuestion` being updated. */
  templateQuestionPatch: TemplateQuestionPatch;
};

/** Represents an update to a `TemplateQuestion`. Fields that are set will be updated. */
export type TemplateQuestionPatch = {
  id?: Maybe<Scalars['Int']>;
  sectionId?: Maybe<Scalars['Int']>;
  nextElementId?: Maybe<Scalars['Int']>;
  code?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  visibilityCondition?: Maybe<Scalars['JSON']>;
  questionTypeId?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  isRequired?: Maybe<Scalars['Boolean']>;
  isEditable?: Maybe<Scalars['Boolean']>;
  parameters?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplateQuestion` mutation. */
export type UpdateTemplateQuestionPayload = {
  __typename?: 'UpdateTemplateQuestionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestion` that was updated by this mutation. */
  templateQuestion?: Maybe<TemplateQuestion>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestionType` that is related to this `TemplateQuestion`. */
  templateQuestionTypeByQuestionTypeId?: Maybe<TemplateQuestionType>;
  /** An edge for our `TemplateQuestion`. May be used by Relay 1. */
  templateQuestionEdge?: Maybe<TemplateQuestionsEdge>;
};


/** The output of our update `TemplateQuestion` mutation. */
export type UpdateTemplateQuestionPayloadTemplateQuestionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionsOrderBy>>;
};

/** All input for the `updateTemplateQuestionById` mutation. */
export type UpdateTemplateQuestionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateQuestion` being updated. */
  templateQuestionPatch: TemplateQuestionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateQuestionOption` mutation. */
export type UpdateTemplateQuestionOptionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateQuestionOption` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateQuestionOption` being updated. */
  templateQuestionOptionPatch: TemplateQuestionOptionPatch;
};

/** Represents an update to a `TemplateQuestionOption`. Fields that are set will be updated. */
export type TemplateQuestionOptionPatch = {
  id?: Maybe<Scalars['Int']>;
  questionId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  value?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplateQuestionOption` mutation. */
export type UpdateTemplateQuestionOptionPayload = {
  __typename?: 'UpdateTemplateQuestionOptionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionOption` that was updated by this mutation. */
  templateQuestionOption?: Maybe<TemplateQuestionOption>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestion` that is related to this `TemplateQuestionOption`. */
  templateQuestionByQuestionId?: Maybe<TemplateQuestion>;
  /** An edge for our `TemplateQuestionOption`. May be used by Relay 1. */
  templateQuestionOptionEdge?: Maybe<TemplateQuestionOptionsEdge>;
};


/** The output of our update `TemplateQuestionOption` mutation. */
export type UpdateTemplateQuestionOptionPayloadTemplateQuestionOptionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionOptionsOrderBy>>;
};

/** All input for the `updateTemplateQuestionOptionById` mutation. */
export type UpdateTemplateQuestionOptionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateQuestionOption` being updated. */
  templateQuestionOptionPatch: TemplateQuestionOptionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateQuestionType` mutation. */
export type UpdateTemplateQuestionTypeInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateQuestionType` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateQuestionType` being updated. */
  templateQuestionTypePatch: TemplateQuestionTypePatch;
};

/** Represents an update to a `TemplateQuestionType`. Fields that are set will be updated. */
export type TemplateQuestionTypePatch = {
  id?: Maybe<Scalars['Int']>;
  type?: Maybe<QuestionType>;
  defaultOptionName?: Maybe<Scalars['String']>;
  defaultOptionValue?: Maybe<Scalars['JSON']>;
};

/** The output of our update `TemplateQuestionType` mutation. */
export type UpdateTemplateQuestionTypePayload = {
  __typename?: 'UpdateTemplateQuestionTypePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionType` that was updated by this mutation. */
  templateQuestionType?: Maybe<TemplateQuestionType>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateQuestionType`. May be used by Relay 1. */
  templateQuestionTypeEdge?: Maybe<TemplateQuestionTypesEdge>;
};


/** The output of our update `TemplateQuestionType` mutation. */
export type UpdateTemplateQuestionTypePayloadTemplateQuestionTypeEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionTypesOrderBy>>;
};

/** All input for the `updateTemplateQuestionTypeById` mutation. */
export type UpdateTemplateQuestionTypeByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateQuestionType` being updated. */
  templateQuestionTypePatch: TemplateQuestionTypePatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateReviewStage` mutation. */
export type UpdateTemplateReviewStageInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateReviewStage` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateReviewStage` being updated. */
  templateReviewStagePatch: TemplateReviewStagePatch;
};

/** Represents an update to a `TemplateReviewStage`. Fields that are set will be updated. */
export type TemplateReviewStagePatch = {
  id?: Maybe<Scalars['Int']>;
  templateStageId?: Maybe<Scalars['Int']>;
  permissionJoinId?: Maybe<Scalars['Int']>;
  nextReviewStageId?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

/** The output of our update `TemplateReviewStage` mutation. */
export type UpdateTemplateReviewStagePayload = {
  __typename?: 'UpdateTemplateReviewStagePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateReviewStage` that was updated by this mutation. */
  templateReviewStage?: Maybe<TemplateReviewStage>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateStage` that is related to this `TemplateReviewStage`. */
  templateStageByTemplateStageId?: Maybe<TemplateStage>;
  /** Reads a single `PermissionJoin` that is related to this `TemplateReviewStage`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `TemplateReviewStage` that is related to this `TemplateReviewStage`. */
  templateReviewStageByNextReviewStageId?: Maybe<TemplateReviewStage>;
  /** An edge for our `TemplateReviewStage`. May be used by Relay 1. */
  templateReviewStageEdge?: Maybe<TemplateReviewStagesEdge>;
};


/** The output of our update `TemplateReviewStage` mutation. */
export type UpdateTemplateReviewStagePayloadTemplateReviewStageEdgeArgs = {
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
};

/** All input for the `updateTemplateReviewStageById` mutation. */
export type UpdateTemplateReviewStageByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateReviewStage` being updated. */
  templateReviewStagePatch: TemplateReviewStagePatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateSection` mutation. */
export type UpdateTemplateSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateSection` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateSection` being updated. */
  templateSectionPatch: TemplateSectionPatch;
};

/** Represents an update to a `TemplateSection`. Fields that are set will be updated. */
export type TemplateSectionPatch = {
  id?: Maybe<Scalars['Int']>;
  templateId?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
};

/** The output of our update `TemplateSection` mutation. */
export type UpdateTemplateSectionPayload = {
  __typename?: 'UpdateTemplateSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateSection` that was updated by this mutation. */
  templateSection?: Maybe<TemplateSection>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateSection`. */
  templateByTemplateId?: Maybe<Template>;
  /** An edge for our `TemplateSection`. May be used by Relay 1. */
  templateSectionEdge?: Maybe<TemplateSectionsEdge>;
};


/** The output of our update `TemplateSection` mutation. */
export type UpdateTemplateSectionPayloadTemplateSectionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
};

/** All input for the `updateTemplateSectionById` mutation. */
export type UpdateTemplateSectionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateSection` being updated. */
  templateSectionPatch: TemplateSectionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateStage` mutation. */
export type UpdateTemplateStageInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateStage` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateStage` being updated. */
  templateStagePatch: TemplateStagePatch;
};

/** Represents an update to a `TemplateStage`. Fields that are set will be updated. */
export type TemplateStagePatch = {
  id?: Maybe<Scalars['Int']>;
  tamplateId?: Maybe<Scalars['Int']>;
};

/** The output of our update `TemplateStage` mutation. */
export type UpdateTemplateStagePayload = {
  __typename?: 'UpdateTemplateStagePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateStage` that was updated by this mutation. */
  templateStage?: Maybe<TemplateStage>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateStage`. */
  templateByTamplateId?: Maybe<Template>;
  /** An edge for our `TemplateStage`. May be used by Relay 1. */
  templateStageEdge?: Maybe<TemplateStagesEdge>;
};


/** The output of our update `TemplateStage` mutation. */
export type UpdateTemplateStagePayloadTemplateStageEdgeArgs = {
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
};

/** All input for the `updateTemplateStageById` mutation. */
export type UpdateTemplateStageByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateStage` being updated. */
  templateStagePatch: TemplateStagePatch;
  id: Scalars['Int'];
};

/** All input for the `updateTemplateVersion` mutation. */
export type UpdateTemplateVersionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateVersion` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `TemplateVersion` being updated. */
  templateVersionPatch: TemplateVersionPatch;
};

/** Represents an update to a `TemplateVersion`. Fields that are set will be updated. */
export type TemplateVersionPatch = {
  id?: Maybe<Scalars['Int']>;
  number?: Maybe<Scalars['Int']>;
  timeCreated?: Maybe<Scalars['Datetime']>;
  isCurrent?: Maybe<Scalars['Boolean']>;
};

/** The output of our update `TemplateVersion` mutation. */
export type UpdateTemplateVersionPayload = {
  __typename?: 'UpdateTemplateVersionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateVersion` that was updated by this mutation. */
  templateVersion?: Maybe<TemplateVersion>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateVersion`. May be used by Relay 1. */
  templateVersionEdge?: Maybe<TemplateVersionsEdge>;
};


/** The output of our update `TemplateVersion` mutation. */
export type UpdateTemplateVersionPayloadTemplateVersionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateVersionsOrderBy>>;
};

/** All input for the `updateTemplateVersionById` mutation. */
export type UpdateTemplateVersionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `TemplateVersion` being updated. */
  templateVersionPatch: TemplateVersionPatch;
  id: Scalars['Int'];
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  id?: Maybe<Scalars['Int']>;
  username?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  role?: Maybe<UserRole>;
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>;
};

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
  id: Scalars['Int'];
};

/** All input for the `updateUserOrganisation` mutation. */
export type UpdateUserOrganisationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `UserOrganisation` to be updated. */
  nodeId: Scalars['ID'];
  /** An object where the defined keys will be set on the `UserOrganisation` being updated. */
  userOrganisationPatch: UserOrganisationPatch;
};

/** Represents an update to a `UserOrganisation`. Fields that are set will be updated. */
export type UserOrganisationPatch = {
  id?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
  organistionId?: Maybe<Scalars['Int']>;
  job?: Maybe<Scalars['String']>;
};

/** The output of our update `UserOrganisation` mutation. */
export type UpdateUserOrganisationPayload = {
  __typename?: 'UpdateUserOrganisationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `UserOrganisation` that was updated by this mutation. */
  userOrganisation?: Maybe<UserOrganisation>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `UserOrganisation`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `Organisation` that is related to this `UserOrganisation`. */
  organisationByOrganistionId?: Maybe<Organisation>;
  /** An edge for our `UserOrganisation`. May be used by Relay 1. */
  userOrganisationEdge?: Maybe<UserOrganisationsEdge>;
};


/** The output of our update `UserOrganisation` mutation. */
export type UpdateUserOrganisationPayloadUserOrganisationEdgeArgs = {
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
};

/** All input for the `updateUserOrganisationById` mutation. */
export type UpdateUserOrganisationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** An object where the defined keys will be set on the `UserOrganisation` being updated. */
  userOrganisationPatch: UserOrganisationPatch;
  id: Scalars['Int'];
};

/** All input for the `deleteAction` mutation. */
export type DeleteActionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Action` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Action` mutation. */
export type DeleteActionPayload = {
  __typename?: 'DeleteActionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Action` that was deleted by this mutation. */
  action?: Maybe<Action>;
  deletedActionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Action`. May be used by Relay 1. */
  actionEdge?: Maybe<ActionsEdge>;
};


/** The output of our delete `Action` mutation. */
export type DeleteActionPayloadActionEdgeArgs = {
  orderBy?: Maybe<Array<ActionsOrderBy>>;
};

/** All input for the `deleteActionById` mutation. */
export type DeleteActionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteActionQueue` mutation. */
export type DeleteActionQueueInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ActionQueue` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ActionQueue` mutation. */
export type DeleteActionQueuePayload = {
  __typename?: 'DeleteActionQueuePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ActionQueue` that was deleted by this mutation. */
  actionQueue?: Maybe<ActionQueue>;
  deletedActionQueueId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ActionQueue`. May be used by Relay 1. */
  actionQueueEdge?: Maybe<ActionQueuesEdge>;
};


/** The output of our delete `ActionQueue` mutation. */
export type DeleteActionQueuePayloadActionQueueEdgeArgs = {
  orderBy?: Maybe<Array<ActionQueuesOrderBy>>;
};

/** All input for the `deleteActionQueueById` mutation. */
export type DeleteActionQueueByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteApplication` mutation. */
export type DeleteApplicationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Application` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Application` mutation. */
export type DeleteApplicationPayload = {
  __typename?: 'DeleteApplicationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Application` that was deleted by this mutation. */
  application?: Maybe<Application>;
  deletedApplicationId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `Application`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `User` that is related to this `Application`. */
  userByUserId?: Maybe<User>;
  /** An edge for our `Application`. May be used by Relay 1. */
  applicationEdge?: Maybe<ApplicationsEdge>;
};


/** The output of our delete `Application` mutation. */
export type DeleteApplicationPayloadApplicationEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationsOrderBy>>;
};

/** All input for the `deleteApplicationById` mutation. */
export type DeleteApplicationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteApplicationResponse` mutation. */
export type DeleteApplicationResponseInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationResponse` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ApplicationResponse` mutation. */
export type DeleteApplicationResponsePayload = {
  __typename?: 'DeleteApplicationResponsePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationResponse` that was deleted by this mutation. */
  applicationResponse?: Maybe<ApplicationResponse>;
  deletedApplicationResponseId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestion` that is related to this `ApplicationResponse`. */
  templateQuestionByTemplateQuestionId?: Maybe<TemplateQuestion>;
  /** Reads a single `Application` that is related to this `ApplicationResponse`. */
  applicationByApplicationId?: Maybe<Application>;
  /** An edge for our `ApplicationResponse`. May be used by Relay 1. */
  applicationResponseEdge?: Maybe<ApplicationResponsesEdge>;
};


/** The output of our delete `ApplicationResponse` mutation. */
export type DeleteApplicationResponsePayloadApplicationResponseEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationResponsesOrderBy>>;
};

/** All input for the `deleteApplicationResponseById` mutation. */
export type DeleteApplicationResponseByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteApplicationSection` mutation. */
export type DeleteApplicationSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationSection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ApplicationSection` mutation. */
export type DeleteApplicationSectionPayload = {
  __typename?: 'DeleteApplicationSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationSection` that was deleted by this mutation. */
  applicationSection?: Maybe<ApplicationSection>;
  deletedApplicationSectionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Application` that is related to this `ApplicationSection`. */
  applicationByApplicationId?: Maybe<Application>;
  /** Reads a single `TemplateSection` that is related to this `ApplicationSection`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** An edge for our `ApplicationSection`. May be used by Relay 1. */
  applicationSectionEdge?: Maybe<ApplicationSectionsEdge>;
};


/** The output of our delete `ApplicationSection` mutation. */
export type DeleteApplicationSectionPayloadApplicationSectionEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationSectionsOrderBy>>;
};

/** All input for the `deleteApplicationSectionById` mutation. */
export type DeleteApplicationSectionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteApplicationStageHistory` mutation. */
export type DeleteApplicationStageHistoryInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationStageHistory` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ApplicationStageHistory` mutation. */
export type DeleteApplicationStageHistoryPayload = {
  __typename?: 'DeleteApplicationStageHistoryPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStageHistory` that was deleted by this mutation. */
  applicationStageHistory?: Maybe<ApplicationStageHistory>;
  deletedApplicationStageHistoryId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Application` that is related to this `ApplicationStageHistory`. */
  applicationByApplicationId?: Maybe<Application>;
  /** An edge for our `ApplicationStageHistory`. May be used by Relay 1. */
  applicationStageHistoryEdge?: Maybe<ApplicationStageHistoriesEdge>;
};


/** The output of our delete `ApplicationStageHistory` mutation. */
export type DeleteApplicationStageHistoryPayloadApplicationStageHistoryEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationStageHistoriesOrderBy>>;
};

/** All input for the `deleteApplicationStageHistoryById` mutation. */
export type DeleteApplicationStageHistoryByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteApplicationStatusHistory` mutation. */
export type DeleteApplicationStatusHistoryInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ApplicationStatusHistory` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ApplicationStatusHistory` mutation. */
export type DeleteApplicationStatusHistoryPayload = {
  __typename?: 'DeleteApplicationStatusHistoryPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ApplicationStatusHistory` that was deleted by this mutation. */
  applicationStatusHistory?: Maybe<ApplicationStatusHistory>;
  deletedApplicationStatusHistoryId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ApplicationStatusHistory`. */
  applicationStageHistoryByApplicationStageHistoryId?: Maybe<ApplicationStageHistory>;
  /** An edge for our `ApplicationStatusHistory`. May be used by Relay 1. */
  applicationStatusHistoryEdge?: Maybe<ApplicationStatusHistoriesEdge>;
};


/** The output of our delete `ApplicationStatusHistory` mutation. */
export type DeleteApplicationStatusHistoryPayloadApplicationStatusHistoryEdgeArgs = {
  orderBy?: Maybe<Array<ApplicationStatusHistoriesOrderBy>>;
};

/** All input for the `deleteApplicationStatusHistoryById` mutation. */
export type DeleteApplicationStatusHistoryByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteOrganisation` mutation. */
export type DeleteOrganisationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Organisation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Organisation` mutation. */
export type DeleteOrganisationPayload = {
  __typename?: 'DeleteOrganisationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Organisation` that was deleted by this mutation. */
  organisation?: Maybe<Organisation>;
  deletedOrganisationId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Organisation`. May be used by Relay 1. */
  organisationEdge?: Maybe<OrganisationsEdge>;
};


/** The output of our delete `Organisation` mutation. */
export type DeleteOrganisationPayloadOrganisationEdgeArgs = {
  orderBy?: Maybe<Array<OrganisationsOrderBy>>;
};

/** All input for the `deleteOrganisationById` mutation. */
export type DeleteOrganisationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deletePermissionJoin` mutation. */
export type DeletePermissionJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PermissionJoin` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `PermissionJoin` mutation. */
export type DeletePermissionJoinPayload = {
  __typename?: 'DeletePermissionJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionJoin` that was deleted by this mutation. */
  permissionJoin?: Maybe<PermissionJoin>;
  deletedPermissionJoinId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PermissionJoin`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `UserOrganisation` that is related to this `PermissionJoin`. */
  userOrganisationByUserOrganisationId?: Maybe<UserOrganisation>;
  /** Reads a single `PermissionName` that is related to this `PermissionJoin`. */
  permissionNameByPermissionNameId?: Maybe<PermissionName>;
  /** An edge for our `PermissionJoin`. May be used by Relay 1. */
  permissionJoinEdge?: Maybe<PermissionJoinsEdge>;
};


/** The output of our delete `PermissionJoin` mutation. */
export type DeletePermissionJoinPayloadPermissionJoinEdgeArgs = {
  orderBy?: Maybe<Array<PermissionJoinsOrderBy>>;
};

/** All input for the `deletePermissionJoinById` mutation. */
export type DeletePermissionJoinByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deletePermissionName` mutation. */
export type DeletePermissionNameInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PermissionName` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `PermissionName` mutation. */
export type DeletePermissionNamePayload = {
  __typename?: 'DeletePermissionNamePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionName` that was deleted by this mutation. */
  permissionName?: Maybe<PermissionName>;
  deletedPermissionNameId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PermissionName`. May be used by Relay 1. */
  permissionNameEdge?: Maybe<PermissionNamesEdge>;
};


/** The output of our delete `PermissionName` mutation. */
export type DeletePermissionNamePayloadPermissionNameEdgeArgs = {
  orderBy?: Maybe<Array<PermissionNamesOrderBy>>;
};

/** All input for the `deletePermissionNameById` mutation. */
export type DeletePermissionNameByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deletePermissionPolicy` mutation. */
export type DeletePermissionPolicyInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `PermissionPolicy` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `PermissionPolicy` mutation. */
export type DeletePermissionPolicyPayload = {
  __typename?: 'DeletePermissionPolicyPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `PermissionPolicy` that was deleted by this mutation. */
  permissionPolicy?: Maybe<PermissionPolicy>;
  deletedPermissionPolicyId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `PermissionPolicy`. May be used by Relay 1. */
  permissionPolicyEdge?: Maybe<PermissionPoliciesEdge>;
};


/** The output of our delete `PermissionPolicy` mutation. */
export type DeletePermissionPolicyPayloadPermissionPolicyEdgeArgs = {
  orderBy?: Maybe<Array<PermissionPoliciesOrderBy>>;
};

/** All input for the `deletePermissionPolicyById` mutation. */
export type DeletePermissionPolicyByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteReview` mutation. */
export type DeleteReviewInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Review` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Review` mutation. */
export type DeleteReviewPayload = {
  __typename?: 'DeleteReviewPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Review` that was deleted by this mutation. */
  review?: Maybe<Review>;
  deletedReviewId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Review`. May be used by Relay 1. */
  reviewEdge?: Maybe<ReviewsEdge>;
};


/** The output of our delete `Review` mutation. */
export type DeleteReviewPayloadReviewEdgeArgs = {
  orderBy?: Maybe<Array<ReviewsOrderBy>>;
};

/** All input for the `deleteReviewById` mutation. */
export type DeleteReviewByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteReviewResponse` mutation. */
export type DeleteReviewResponseInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewResponse` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ReviewResponse` mutation. */
export type DeleteReviewResponsePayload = {
  __typename?: 'DeleteReviewResponsePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewResponse` that was deleted by this mutation. */
  reviewResponse?: Maybe<ReviewResponse>;
  deletedReviewResponseId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ApplicationResponse` that is related to this `ReviewResponse`. */
  applicationResponseByApplicationResponseId?: Maybe<ApplicationResponse>;
  /** An edge for our `ReviewResponse`. May be used by Relay 1. */
  reviewResponseEdge?: Maybe<ReviewResponsesEdge>;
};


/** The output of our delete `ReviewResponse` mutation. */
export type DeleteReviewResponsePayloadReviewResponseEdgeArgs = {
  orderBy?: Maybe<Array<ReviewResponsesOrderBy>>;
};

/** All input for the `deleteReviewResponseById` mutation. */
export type DeleteReviewResponseByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteReviewSection` mutation. */
export type DeleteReviewSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ReviewSection` mutation. */
export type DeleteReviewSectionPayload = {
  __typename?: 'DeleteReviewSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSection` that was deleted by this mutation. */
  reviewSection?: Maybe<ReviewSection>;
  deletedReviewSectionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `ReviewSection`. May be used by Relay 1. */
  reviewSectionEdge?: Maybe<ReviewSectionsEdge>;
};


/** The output of our delete `ReviewSection` mutation. */
export type DeleteReviewSectionPayloadReviewSectionEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionsOrderBy>>;
};

/** All input for the `deleteReviewSectionById` mutation. */
export type DeleteReviewSectionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteReviewSectionAssignment` mutation. */
export type DeleteReviewSectionAssignmentInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSectionAssignment` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ReviewSectionAssignment` mutation. */
export type DeleteReviewSectionAssignmentPayload = {
  __typename?: 'DeleteReviewSectionAssignmentPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionAssignment` that was deleted by this mutation. */
  reviewSectionAssignment?: Maybe<ReviewSectionAssignment>;
  deletedReviewSectionAssignmentId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByReviewerId?: Maybe<User>;
  /** Reads a single `User` that is related to this `ReviewSectionAssignment`. */
  userByAssignerId?: Maybe<User>;
  /** Reads a single `ApplicationStageHistory` that is related to this `ReviewSectionAssignment`. */
  applicationStageHistoryByStageId?: Maybe<ApplicationStageHistory>;
  /** An edge for our `ReviewSectionAssignment`. May be used by Relay 1. */
  reviewSectionAssignmentEdge?: Maybe<ReviewSectionAssignmentsEdge>;
};


/** The output of our delete `ReviewSectionAssignment` mutation. */
export type DeleteReviewSectionAssignmentPayloadReviewSectionAssignmentEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionAssignmentsOrderBy>>;
};

/** All input for the `deleteReviewSectionAssignmentById` mutation. */
export type DeleteReviewSectionAssignmentByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteReviewSectionJoin` mutation. */
export type DeleteReviewSectionJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSectionJoin` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ReviewSectionJoin` mutation. */
export type DeleteReviewSectionJoinPayload = {
  __typename?: 'DeleteReviewSectionJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionJoin` that was deleted by this mutation. */
  reviewSectionJoin?: Maybe<ReviewSectionJoin>;
  deletedReviewSectionJoinId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Review` that is related to this `ReviewSectionJoin`. */
  reviewByReviewId?: Maybe<Review>;
  /** Reads a single `ReviewSectionAssignment` that is related to this `ReviewSectionJoin`. */
  reviewSectionAssignmentBySectionAssignmentId?: Maybe<ReviewSectionAssignment>;
  /** Reads a single `ReviewSection` that is related to this `ReviewSectionJoin`. */
  reviewSectionByReviewSectionId?: Maybe<ReviewSection>;
  /** An edge for our `ReviewSectionJoin`. May be used by Relay 1. */
  reviewSectionJoinEdge?: Maybe<ReviewSectionJoinsEdge>;
};


/** The output of our delete `ReviewSectionJoin` mutation. */
export type DeleteReviewSectionJoinPayloadReviewSectionJoinEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionJoinsOrderBy>>;
};

/** All input for the `deleteReviewSectionJoinById` mutation. */
export type DeleteReviewSectionJoinByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteReviewSectionResponseJoin` mutation. */
export type DeleteReviewSectionResponseJoinInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `ReviewSectionResponseJoin` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `ReviewSectionResponseJoin` mutation. */
export type DeleteReviewSectionResponseJoinPayload = {
  __typename?: 'DeleteReviewSectionResponseJoinPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `ReviewSectionResponseJoin` that was deleted by this mutation. */
  reviewSectionResponseJoin?: Maybe<ReviewSectionResponseJoin>;
  deletedReviewSectionResponseJoinId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `ReviewSectionJoin` that is related to this `ReviewSectionResponseJoin`. */
  reviewSectionJoinByReviewSectionJoinId?: Maybe<ReviewSectionJoin>;
  /** Reads a single `ReviewResponse` that is related to this `ReviewSectionResponseJoin`. */
  reviewResponseByReviewResponseId?: Maybe<ReviewResponse>;
  /** An edge for our `ReviewSectionResponseJoin`. May be used by Relay 1. */
  reviewSectionResponseJoinEdge?: Maybe<ReviewSectionResponseJoinsEdge>;
};


/** The output of our delete `ReviewSectionResponseJoin` mutation. */
export type DeleteReviewSectionResponseJoinPayloadReviewSectionResponseJoinEdgeArgs = {
  orderBy?: Maybe<Array<ReviewSectionResponseJoinsOrderBy>>;
};

/** All input for the `deleteReviewSectionResponseJoinById` mutation. */
export type DeleteReviewSectionResponseJoinByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['BigInt'];
};

/** All input for the `deleteTemplate` mutation. */
export type DeleteTemplateInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `Template` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `Template` mutation. */
export type DeleteTemplatePayload = {
  __typename?: 'DeleteTemplatePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `Template` that was deleted by this mutation. */
  template?: Maybe<Template>;
  deletedTemplateId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateVersion` that is related to this `Template`. */
  templateVersionByVersionId?: Maybe<TemplateVersion>;
  /** An edge for our `Template`. May be used by Relay 1. */
  templateEdge?: Maybe<TemplatesEdge>;
};


/** The output of our delete `Template` mutation. */
export type DeleteTemplatePayloadTemplateEdgeArgs = {
  orderBy?: Maybe<Array<TemplatesOrderBy>>;
};

/** All input for the `deleteTemplateById` mutation. */
export type DeleteTemplateByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateAction` mutation. */
export type DeleteTemplateActionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateAction` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateAction` mutation. */
export type DeleteTemplateActionPayload = {
  __typename?: 'DeleteTemplateActionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateAction` that was deleted by this mutation. */
  templateAction?: Maybe<TemplateAction>;
  deletedTemplateActionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateAction`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByActionId?: Maybe<Action>;
  /** Reads a single `Action` that is related to this `TemplateAction`. */
  actionByPreviousActionId?: Maybe<Action>;
  /** An edge for our `TemplateAction`. May be used by Relay 1. */
  templateActionEdge?: Maybe<TemplateActionsEdge>;
};


/** The output of our delete `TemplateAction` mutation. */
export type DeleteTemplateActionPayloadTemplateActionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateActionsOrderBy>>;
};

/** All input for the `deleteTemplateActionById` mutation. */
export type DeleteTemplateActionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateElement` mutation. */
export type DeleteTemplateElementInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateElement` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateElement` mutation. */
export type DeleteTemplateElementPayload = {
  __typename?: 'DeleteTemplateElementPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateElement` that was deleted by this mutation. */
  templateElement?: Maybe<TemplateElement>;
  deletedTemplateElementId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateSection` that is related to this `TemplateElement`. */
  templateSectionBySectionId?: Maybe<TemplateSection>;
  /** Reads a single `TemplateElement` that is related to this `TemplateElement`. */
  templateElementByNextElementId?: Maybe<TemplateElement>;
  /** An edge for our `TemplateElement`. May be used by Relay 1. */
  templateElementEdge?: Maybe<TemplateElementsEdge>;
};


/** The output of our delete `TemplateElement` mutation. */
export type DeleteTemplateElementPayloadTemplateElementEdgeArgs = {
  orderBy?: Maybe<Array<TemplateElementsOrderBy>>;
};

/** All input for the `deleteTemplateElementById` mutation. */
export type DeleteTemplateElementByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateInformation` mutation. */
export type DeleteTemplateInformationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateInformation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateInformation` mutation. */
export type DeleteTemplateInformationPayload = {
  __typename?: 'DeleteTemplateInformationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateInformation` that was deleted by this mutation. */
  templateInformation?: Maybe<TemplateInformation>;
  deletedTemplateInformationId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateInformation`. May be used by Relay 1. */
  templateInformationEdge?: Maybe<TemplateInformationsEdge>;
};


/** The output of our delete `TemplateInformation` mutation. */
export type DeleteTemplateInformationPayloadTemplateInformationEdgeArgs = {
  orderBy?: Maybe<Array<TemplateInformationsOrderBy>>;
};

/** All input for the `deleteTemplateInformationById` mutation. */
export type DeleteTemplateInformationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplatePermission` mutation. */
export type DeleteTemplatePermissionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplatePermission` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplatePermission` mutation. */
export type DeleteTemplatePermissionPayload = {
  __typename?: 'DeleteTemplatePermissionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplatePermission` that was deleted by this mutation. */
  templatePermission?: Maybe<TemplatePermission>;
  deletedTemplatePermissionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `PermissionJoin` that is related to this `TemplatePermission`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `Template` that is related to this `TemplatePermission`. */
  templateByTemplateId?: Maybe<Template>;
  /** Reads a single `TemplateSection` that is related to this `TemplatePermission`. */
  templateSectionByTemplateSectionId?: Maybe<TemplateSection>;
  /** Reads a single `PermissionPolicy` that is related to this `TemplatePermission`. */
  permissionPolicyByPermissionPolicyId?: Maybe<PermissionPolicy>;
  /** An edge for our `TemplatePermission`. May be used by Relay 1. */
  templatePermissionEdge?: Maybe<TemplatePermissionsEdge>;
};


/** The output of our delete `TemplatePermission` mutation. */
export type DeleteTemplatePermissionPayloadTemplatePermissionEdgeArgs = {
  orderBy?: Maybe<Array<TemplatePermissionsOrderBy>>;
};

/** All input for the `deleteTemplatePermissionById` mutation. */
export type DeleteTemplatePermissionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateQuestion` mutation. */
export type DeleteTemplateQuestionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateQuestion` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateQuestion` mutation. */
export type DeleteTemplateQuestionPayload = {
  __typename?: 'DeleteTemplateQuestionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestion` that was deleted by this mutation. */
  templateQuestion?: Maybe<TemplateQuestion>;
  deletedTemplateQuestionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestionType` that is related to this `TemplateQuestion`. */
  templateQuestionTypeByQuestionTypeId?: Maybe<TemplateQuestionType>;
  /** An edge for our `TemplateQuestion`. May be used by Relay 1. */
  templateQuestionEdge?: Maybe<TemplateQuestionsEdge>;
};


/** The output of our delete `TemplateQuestion` mutation. */
export type DeleteTemplateQuestionPayloadTemplateQuestionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionsOrderBy>>;
};

/** All input for the `deleteTemplateQuestionById` mutation. */
export type DeleteTemplateQuestionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateQuestionOption` mutation. */
export type DeleteTemplateQuestionOptionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateQuestionOption` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateQuestionOption` mutation. */
export type DeleteTemplateQuestionOptionPayload = {
  __typename?: 'DeleteTemplateQuestionOptionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionOption` that was deleted by this mutation. */
  templateQuestionOption?: Maybe<TemplateQuestionOption>;
  deletedTemplateQuestionOptionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateQuestion` that is related to this `TemplateQuestionOption`. */
  templateQuestionByQuestionId?: Maybe<TemplateQuestion>;
  /** An edge for our `TemplateQuestionOption`. May be used by Relay 1. */
  templateQuestionOptionEdge?: Maybe<TemplateQuestionOptionsEdge>;
};


/** The output of our delete `TemplateQuestionOption` mutation. */
export type DeleteTemplateQuestionOptionPayloadTemplateQuestionOptionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionOptionsOrderBy>>;
};

/** All input for the `deleteTemplateQuestionOptionById` mutation. */
export type DeleteTemplateQuestionOptionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateQuestionType` mutation. */
export type DeleteTemplateQuestionTypeInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateQuestionType` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateQuestionType` mutation. */
export type DeleteTemplateQuestionTypePayload = {
  __typename?: 'DeleteTemplateQuestionTypePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateQuestionType` that was deleted by this mutation. */
  templateQuestionType?: Maybe<TemplateQuestionType>;
  deletedTemplateQuestionTypeId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateQuestionType`. May be used by Relay 1. */
  templateQuestionTypeEdge?: Maybe<TemplateQuestionTypesEdge>;
};


/** The output of our delete `TemplateQuestionType` mutation. */
export type DeleteTemplateQuestionTypePayloadTemplateQuestionTypeEdgeArgs = {
  orderBy?: Maybe<Array<TemplateQuestionTypesOrderBy>>;
};

/** All input for the `deleteTemplateQuestionTypeById` mutation. */
export type DeleteTemplateQuestionTypeByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateReviewStage` mutation. */
export type DeleteTemplateReviewStageInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateReviewStage` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateReviewStage` mutation. */
export type DeleteTemplateReviewStagePayload = {
  __typename?: 'DeleteTemplateReviewStagePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateReviewStage` that was deleted by this mutation. */
  templateReviewStage?: Maybe<TemplateReviewStage>;
  deletedTemplateReviewStageId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `TemplateStage` that is related to this `TemplateReviewStage`. */
  templateStageByTemplateStageId?: Maybe<TemplateStage>;
  /** Reads a single `PermissionJoin` that is related to this `TemplateReviewStage`. */
  permissionJoinByPermissionJoinId?: Maybe<PermissionJoin>;
  /** Reads a single `TemplateReviewStage` that is related to this `TemplateReviewStage`. */
  templateReviewStageByNextReviewStageId?: Maybe<TemplateReviewStage>;
  /** An edge for our `TemplateReviewStage`. May be used by Relay 1. */
  templateReviewStageEdge?: Maybe<TemplateReviewStagesEdge>;
};


/** The output of our delete `TemplateReviewStage` mutation. */
export type DeleteTemplateReviewStagePayloadTemplateReviewStageEdgeArgs = {
  orderBy?: Maybe<Array<TemplateReviewStagesOrderBy>>;
};

/** All input for the `deleteTemplateReviewStageById` mutation. */
export type DeleteTemplateReviewStageByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateSection` mutation. */
export type DeleteTemplateSectionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateSection` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateSection` mutation. */
export type DeleteTemplateSectionPayload = {
  __typename?: 'DeleteTemplateSectionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateSection` that was deleted by this mutation. */
  templateSection?: Maybe<TemplateSection>;
  deletedTemplateSectionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateSection`. */
  templateByTemplateId?: Maybe<Template>;
  /** An edge for our `TemplateSection`. May be used by Relay 1. */
  templateSectionEdge?: Maybe<TemplateSectionsEdge>;
};


/** The output of our delete `TemplateSection` mutation. */
export type DeleteTemplateSectionPayloadTemplateSectionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateSectionsOrderBy>>;
};

/** All input for the `deleteTemplateSectionById` mutation. */
export type DeleteTemplateSectionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateStage` mutation. */
export type DeleteTemplateStageInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateStage` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateStage` mutation. */
export type DeleteTemplateStagePayload = {
  __typename?: 'DeleteTemplateStagePayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateStage` that was deleted by this mutation. */
  templateStage?: Maybe<TemplateStage>;
  deletedTemplateStageId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `Template` that is related to this `TemplateStage`. */
  templateByTamplateId?: Maybe<Template>;
  /** An edge for our `TemplateStage`. May be used by Relay 1. */
  templateStageEdge?: Maybe<TemplateStagesEdge>;
};


/** The output of our delete `TemplateStage` mutation. */
export type DeleteTemplateStagePayloadTemplateStageEdgeArgs = {
  orderBy?: Maybe<Array<TemplateStagesOrderBy>>;
};

/** All input for the `deleteTemplateStageById` mutation. */
export type DeleteTemplateStageByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteTemplateVersion` mutation. */
export type DeleteTemplateVersionInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `TemplateVersion` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `TemplateVersion` mutation. */
export type DeleteTemplateVersionPayload = {
  __typename?: 'DeleteTemplateVersionPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `TemplateVersion` that was deleted by this mutation. */
  templateVersion?: Maybe<TemplateVersion>;
  deletedTemplateVersionId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `TemplateVersion`. May be used by Relay 1. */
  templateVersionEdge?: Maybe<TemplateVersionsEdge>;
};


/** The output of our delete `TemplateVersion` mutation. */
export type DeleteTemplateVersionPayloadTemplateVersionEdgeArgs = {
  orderBy?: Maybe<Array<TemplateVersionsOrderBy>>;
};

/** All input for the `deleteTemplateVersionById` mutation. */
export type DeleteTemplateVersionByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  deletedUserId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: Maybe<Array<UsersOrderBy>>;
};

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

/** All input for the `deleteUserOrganisation` mutation. */
export type DeleteUserOrganisationInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The globally unique `ID` which will identify a single `UserOrganisation` to be deleted. */
  nodeId: Scalars['ID'];
};

/** The output of our delete `UserOrganisation` mutation. */
export type DeleteUserOrganisationPayload = {
  __typename?: 'DeleteUserOrganisationPayload';
  /** The exact same `clientMutationId` that was provided in the mutation input, unchanged and unused. May be used by a client to track mutations. */
  clientMutationId?: Maybe<Scalars['String']>;
  /** The `UserOrganisation` that was deleted by this mutation. */
  userOrganisation?: Maybe<UserOrganisation>;
  deletedUserOrganisationId?: Maybe<Scalars['ID']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `UserOrganisation`. */
  userByUserId?: Maybe<User>;
  /** Reads a single `Organisation` that is related to this `UserOrganisation`. */
  organisationByOrganistionId?: Maybe<Organisation>;
  /** An edge for our `UserOrganisation`. May be used by Relay 1. */
  userOrganisationEdge?: Maybe<UserOrganisationsEdge>;
};


/** The output of our delete `UserOrganisation` mutation. */
export type DeleteUserOrganisationPayloadUserOrganisationEdgeArgs = {
  orderBy?: Maybe<Array<UserOrganisationsOrderBy>>;
};

/** All input for the `deleteUserOrganisationById` mutation. */
export type DeleteUserOrganisationByIdInput = {
  /** An arbitrary string value with no semantic meaning. Will be included in the payload verbatim. May be used to track mutations by the client. */
  clientMutationId?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
};

export type GetApplicationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetApplicationsQuery = (
  { __typename?: 'Query' }
  & { allApplications?: Maybe<(
    { __typename?: 'ApplicationsConnection' }
    & { nodes: Array<Maybe<(
      { __typename?: 'Application' }
      & Pick<Application, 'nodeId' | 'id' | 'templateId' | 'userId' | 'serial' | 'name' | 'outcome' | 'isActive' | 'triggering'>
    )>> }
  )> }
);


export const GetApplicationsDocument = gql`
    query getApplications {
  allApplications {
    nodes {
      nodeId
      id
      templateId
      userId
      serial
      name
      outcome
      isActive
      triggering
    }
  }
}
    `;

/**
 * __useGetApplicationsQuery__
 *
 * To run a query within a React component, call `useGetApplicationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApplicationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApplicationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetApplicationsQuery(baseOptions?: Apollo.QueryHookOptions<GetApplicationsQuery, GetApplicationsQueryVariables>) {
        return Apollo.useQuery<GetApplicationsQuery, GetApplicationsQueryVariables>(GetApplicationsDocument, baseOptions);
      }
export function useGetApplicationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetApplicationsQuery, GetApplicationsQueryVariables>) {
          return Apollo.useLazyQuery<GetApplicationsQuery, GetApplicationsQueryVariables>(GetApplicationsDocument, baseOptions);
        }
export type GetApplicationsQueryHookResult = ReturnType<typeof useGetApplicationsQuery>;
export type GetApplicationsLazyQueryHookResult = ReturnType<typeof useGetApplicationsLazyQuery>;
export type GetApplicationsQueryResult = Apollo.QueryResult<GetApplicationsQuery, GetApplicationsQueryVariables>;