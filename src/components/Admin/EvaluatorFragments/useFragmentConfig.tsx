import { useRouter } from '../../../utils/hooks/useRouter'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast, Position } from '../../../contexts/Toast'
import {
  useGetEvaluatorFragmentsQuery,
  useUpdateEvaluatorFragmentMutation,
  useDeleteEvaluatorFragmentMutation,
  useCreateEvaluatorFragmentMutation,
} from '../../../utils/generated/graphql'
import { useEffect } from 'react'
import useUndo from 'use-undo'

export interface Fragment {
  id: number
  name: string
  expression: object
  metadata: object | null
  frontEnd: boolean
  backEnd: boolean
  permissionNames?: string[] | null
}

export const useFragmentConfig = () => {
  const { t } = useLanguageProvider()

  const { query, updateQuery } = useRouter()

  const { showToast } = useToast({ position: Position.topLeft })

  const { data, loading, refetch } = useGetEvaluatorFragmentsQuery({
    fetchPolicy: 'cache-and-network',
  })

  const [{ present: draft }, { set: setDraft, ...undoProps }] = useUndo<Fragment | null>(null)

  const selectedFragment = query.fragment
  const fragments = (data?.evaluatorFragments?.nodes ?? []) as Fragment[]

  useEffect(() => {
    if (!selectedFragment) {
      undoProps.reset(null)
      return
    }

    if (fragments) {
      const fragmentObject = fragments.find((frag) => frag.name === selectedFragment)
      if (fragmentObject) undoProps.reset(fragmentObject)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, selectedFragment])

  const [updateFragment, { loading: isSaving }] = useUpdateEvaluatorFragmentMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_UPDATE_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      const name = d.updateEvaluatorFragment?.evaluatorFragment?.name
      showToast({ title: t('DATA_VIEW_CONFIG_SAVED'), text: name, style: 'success' })
      updateQuery({ dataView: d.updateEvaluatorFragment?.evaluatorFragment?.name })
    },
  })

  const [deleteFragment, { loading: isDeleting }] = useDeleteEvaluatorFragmentMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_DELETE_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (_) => {
      showToast({ title: t('DATA_VIEW_CONFIG_DELETED'), text: selectedFragment, style: 'success' })
      updateQuery({ fragment: null })
      refetch()
    },
  })

  const [addFragment, { loading: isAdding }] = useCreateEvaluatorFragmentMutation({
    onError: (e) =>
      showToast({ title: t('DATA_VIEW_CONFIG_ADD_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      showToast({
        title: t('DATA_VIEW_CONFIG_ADDED'),
        text: t('DATA_VIEW_CONFIG_ADD_MESSAGE'),
        style: 'success',
      })
      updateQuery({ fragment: d.createEvaluatorFragment?.evaluatorFragment?.name })
      refetch()
    },
  })

  return {
    fragments,
    loading,
    selectedFragment,
    draftState: transformFragment(draft),
    updateDraft: (data: Partial<Fragment>, type: 'expression' | 'other') =>
      updateDraft(data, type, draft, setDraft),
    undoProps,
    updateFragment,
    deleteFragment,
    addFragment,
    isSaving,
    isDeleting,
    isAdding,
  }
}

const transformFragment = (fragment: Fragment | null) => {
  if (!fragment) return {}
  const { id, expression, name, metadata, frontEnd, backEnd } = fragment

  return {
    id,
    expression,
    fragmentData: { name, metadata, frontEnd, backEnd },
  }
}

const updateDraft = (
  input: Partial<Fragment>,
  type: 'expression' | 'other',
  currentDraft: Fragment | null,
  setDraft: (newValue: Fragment | null) => void
) => {
  if (currentDraft === null) {
    return
  }
  if (type === 'expression') {
    setDraft({
      ...currentDraft,
      expression: input,
    })
  } else {
    setDraft({
      ...currentDraft,
      ...input,
    })
  }
}
