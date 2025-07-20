import { useEffect, useMemo, useState } from 'react'
import { useRouter } from '../../../utils/hooks/useRouter'
import useUndo from 'use-undo'
import { dequal, Fragment, FragmentMetadata } from 'fig-tree-editor-react'
import { useLanguageProvider } from '../../../contexts/Localisation'
import { useToast, Position } from '../../../contexts/Toast'
import {
  useGetEvaluatorFragmentsQuery,
  useUpdateEvaluatorFragmentMutation,
  useDeleteEvaluatorFragmentMutation,
  useCreateEvaluatorFragmentMutation,
} from '../../../utils/generated/graphql'

export interface FragmentRow {
  id: number
  name: string
  expression: Fragment
  metadata: Omit<FragmentMetadata, 'name'> | null
  frontEnd: boolean
  backEnd: boolean
  permissionNames: string[] | null
}

export const useFragmentConfig = () => {
  const { t } = useLanguageProvider()

  const { query, updateQuery } = useRouter()

  const { showToast } = useToast({ position: Position.topLeft })

  const { data, loading, refetch } = useGetEvaluatorFragmentsQuery({
    fetchPolicy: 'cache-and-network',
  })

  const [isDirty, setIsDirty] = useState(false)

  const [{ present: draft, past }, { set: setDraft, ...undoProps }] = useUndo<FragmentRow | null>(
    null
  )

  const selectedFragment = query.fragment
  const fragments = (data?.evaluatorFragments?.nodes ?? []) as FragmentRow[]

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
      showToast({
        title: t('EVALUATOR_FRAGMENTS_UPDATE_PROBLEM'),
        text: e.message,
        style: 'error',
      }),
    onCompleted: (d) => {
      const name = d.updateEvaluatorFragment?.evaluatorFragment?.name
      showToast({ title: t('EVALUATOR_FRAGMENT_SAVED'), text: name, style: 'success' })
      updateQuery({ dataView: d.updateEvaluatorFragment?.evaluatorFragment?.name })
      setIsDirty(false)
    },
  })

  const [deleteFragment, { loading: isDeleting }] = useDeleteEvaluatorFragmentMutation({
    onError: (e) =>
      showToast({ title: t('EVALUATOR_FRAGMENT_DELETE_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (_) => {
      showToast({
        title: t('EVALUATOR_FRAGMENT_DELETED'),
        text: selectedFragment,
        style: 'success',
      })
      updateQuery({ fragment: null })
      refetch()
    },
  })

  const [addFragment, { loading: isAdding }] = useCreateEvaluatorFragmentMutation({
    onError: (e) =>
      showToast({ title: t('EVALUATOR_FRAGMENT_ADD_PROBLEM'), text: e.message, style: 'error' }),
    onCompleted: (d) => {
      showToast({
        title: t('EVALUATOR_FRAGMENT_ADDED'),
        text: t('EVALUATOR_FRAGMENT_ADD_MESSAGE'),
        style: 'success',
      })
      updateQuery({ fragment: d.createEvaluatorFragment?.evaluatorFragment?.name })
      refetch()
    },
  })

  const updateDraft = (input: Partial<FragmentRow>, type: 'expression' | 'other') => {
    if (draft === null) {
      return
    }
    const newDraft = (
      type === 'expression' ? { ...draft, expression: input } : { ...draft, ...input }
    ) as FragmentRow

    // Strict => key order must be the same
    const isStrictlyEqual = JSON.stringify(newDraft) === JSON.stringify(draft)

    // Loose => key order not considered
    const isLooselyEqual = dequal(newDraft, draft)

    if (isLooselyEqual && !isStrictlyEqual) {
      undoProps.reset(newDraft)
      return
    }

    if (isStrictlyEqual) return

    setIsDirty(true)
    setDraft(newDraft)
  }

  const draftState = useMemo(() => transformFragment(draft), [draft])

  return {
    fragments,
    loading,
    selectedFragment,
    draftState,
    updateDraft,
    undoProps,
    updateFragment,
    deleteFragment,
    addFragment,
    isSaving,
    isDeleting,
    isAdding,
    isDirty: isDirty && past.length > 0,
  }
}

// The details for the fragment that are editable in the UI, not including the
// expression itself
export type FragmentDataProperties = {
  name: string
  metadata: Omit<FragmentMetadata, 'name'>
  frontEnd: boolean
  backEnd: boolean
  permissionNames: string[] | null
}

const transformFragment = (fragment: FragmentRow | null) => {
  if (!fragment) return {}
  const { id, expression, name, metadata, frontEnd, backEnd, permissionNames } = fragment

  const { description, parameters, textColor, backgroundColor } = metadata || {}

  const transformed = {
    id,
    expression,
    fragmentData: {
      name,
      metadata: {
        ...(parameters && { parameters }),
        ...(description && { description }),
        ...(textColor && { textColor }),
        ...(backgroundColor && { backgroundColor }),
      },
      frontEnd,
      backEnd,
      permissionNames,
    } as FragmentDataProperties,
  }

  if (parameters) transformed.fragmentData.metadata.parameters = parameters
  if (description) transformed.fragmentData.metadata.description = description
  if (textColor) transformed.fragmentData.metadata.textColor = textColor
  if (backgroundColor) transformed.fragmentData.metadata.backgroundColor = backgroundColor

  return transformed
}
