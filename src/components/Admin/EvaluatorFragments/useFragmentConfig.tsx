import { useRouter } from '../../../utils/hooks/useRouter'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast, Position } from '../../../contexts/Toast'
import {
  EvaluatorFragment,
  useGetEvaluatorFragmentsQuery,
  useUpdateEvaluatorFragmentMutation,
  useDeleteEvaluatorFragmentMutation,
  useCreateEvaluatorFragmentMutation,
} from '../../../utils/generated/graphql'
import { useEffect, useState } from 'react'

export const useFragmentConfig = () => {
  const { t } = useLanguageProvider()

  const { query, updateQuery } = useRouter()

  const { showToast } = useToast({ position: Position.topLeft })

  const { data, loading, refetch } = useGetEvaluatorFragmentsQuery({
    fetchPolicy: 'cache-and-network',
  })

  const [draft, setDraft] = useState<EvaluatorFragment>()

  const selectedFragment = query.fragment
  const fragments = data?.evaluatorFragments?.nodes as EvaluatorFragment[] | undefined

  useEffect(() => {
    if (fragments) {
      const fragmentObject = fragments.find((frag) => frag.name === selectedFragment)
      if (fragmentObject) setDraft(fragmentObject)
    }
  }, [fragments, selectedFragment])

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

  console.log('Draft', draft)

  return {
    fragments,
    loading,
    selectedFragment,
    draftState: draft ? transformFragment(draft) : {},
    updateDraft: (data: Record<string, any>, type: 'expression' | 'other') =>
      updateDraft(data, type, setDraft as React.Dispatch<React.SetStateAction<EvaluatorFragment>>),
    updateFragment,
    deleteFragment,
    addFragment,
    isSaving,
    isDeleting,
    isAdding,
  }
}

const transformFragment = (fragment: EvaluatorFragment) => {
  const { id, expression, name, metadata, frontEnd, backEnd } = fragment

  return {
    id,
    expression,
    fragmentData: { name, metadata, frontEnd, backEnd },
  }
}

const updateDraft = (
  data: Record<string, any>,
  type: 'expression' | 'other',
  setDraft: React.Dispatch<React.SetStateAction<EvaluatorFragment>>
) => {
  if (type === 'expression') {
    setDraft((prev) => ({
      ...prev,
      expression: data,
    }))
  } else {
    setDraft((prev) => ({
      ...prev,
      ...data,
    }))
  }
}
