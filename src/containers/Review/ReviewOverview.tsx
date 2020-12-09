import React from 'react'
import { Link } from 'react-router-dom'
import { useRouter } from '../../utils/hooks/useRouter'

const ReviewOverview: React.FC = () => {
  // Logic for what this page will show:
  // https://github.com/openmsupply/application-manager-web-app/issues/200#issuecomment-741432161

  // Hooks (suggested):
  // - useLoadApplication
  // - useGetResponsesAndElementState
  // - new Hook to get existing Review information

  // Hook(s) will fetch Application & Review info (if it exists). If user is supposed to start a new review, there will be some information about what Sections/Questions they've been assigned to.
  // And there will be a "Start Review" button. On clicking it, a new Review will be created, its ID returned, and this page will re-direct to the new Review URL.

  const {
    params: { serialNumber },
  } = useRouter()

  return (
    <div>
      <p>This is the Overview/Start page for Reviews of Application {serialNumber}.</p>
      <p>Overview components will go here.</p>
      <p>
        See{' '}
        <Link to="https://github.com/openmsupply/application-manager-web-app/issues/200#issuecomment-741432161">
          here
        </Link>{' '}
        for explanation.
      </p>
    </div>
  )
}

export default ReviewOverview
