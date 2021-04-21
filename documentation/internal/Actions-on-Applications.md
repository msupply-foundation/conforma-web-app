# Actions on Applications

Actions define what a user can do related to an existing application. The actions take in account the current user own permissions to `apply` and the application template_permission to `review` or `assign` based on the current `level` and `stage` of the review.
So basically we will define actions related to user roles of: **Applicant**, **Assigner**, **Reviewer** and **Consolidator** (basically actions are the same as Reviewer).

**Note**: The same user can have more than one user-role. e.g. Assigner and reviewer.
**Note 2**: One restriction is to not have an Applicant user with other user-role. This combination isn't prevented on the server though.

Let's have a look on the action definitions for any user-roles:

![Actions on Applications Flow](images/Actions-on-Applications-Flow.png)

## Applicant's actions

Actions are available to the applicant user for their own applications, and very basic for now:

- `Continue` -> Application created that hasn't been submitted
- `View` -> Application that has been submitted or after application process is completed
- `Update` -> After an application has been submitted and reveiwed, when there are **changes required** to the Applicant

### Other applicant's actions (todo)

- `Withdraw` -> Application that has been submitted
- `Delete` -> Application that hasn't been submitted

## Reviewer's or Consolidator's actions

Actions are available to the Reviewer user (based on `template_permission`) after the **application is submitted**.
Actions more specific to the Consolidator user are available after there is a review **stage increment** or after **review is submitted**.

- `Continue` -> Review created that hasn't been submitted
- `Start` -> Review has been assigned (or self-assigned)
- `Self-Assign` -> Review hasn't been assigned to anyone (and permission to SELF_ASSIGNMENT applies)
- `Re-Review` -> Review has been submitted and lower level Reviewer has submitted **changes requested** by you
- `Update` -> Review has been submitted and higher level Reviewer has submitted **changes requested** to you
- `View` -> Review has been submitted or after application process is completed

## Assigner's actions

The options are per section of the application, but will show on the application list as the top most possible one (combining the actions available for all sections in the application):

- `Assign` -> When no reviewer is assigned yet (checks `review_question_assignment`)
- `Re-assign` -> When reviewer is assigned

**Note**: When re-assigning section(s) when the review has been started there is some pending work todo for moving assignments

### Application list view

On server side we use smart view to calculate the count of each of the following (used to define available actions on the front-end) based on status of `review_assignment` and `review`.
The GraphQL query to application list view will fetch ALL `review_assignment` related to the current application `serial`, for all reviewer `user` of any `level` and `stage`.
The actions are available to the user (if permissions apply) when the related field(s) is above 0 or `true`.

- `Continue` -> review_draft_count
- `Start` -> review_assigned_not_started_count
- `Self-Assign` -> review_available_for_self_assignment_count
- `Re-Review` -> review_pending_count
- `Update` -> review_change_request_count
- `View` -> review_submitted_count
- `Assign` -> assign_count
- `Re-assign` -> assign_count & is_fully_assigned_level_1

**Note**: For now only the front-end is displaying all reviews associated to the current application on the "Review Home page", later when restrictions apply only users with higher permissions will be able to see other users review's status.
