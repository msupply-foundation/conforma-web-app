import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from '../../../utils/hooks/useRouter'
import { useUndo } from '@json-edit-react/utils'
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

  const [draft, setDraftState] = useState<FragmentRow | null>(null)
  const { set: setDraft, replace, reset, undo, redo, canUndo, canRedo } = useUndo<FragmentRow | null>(
    draft,
    setDraftState
  )
  const undoProps = { undo, redo, canUndo, canRedo }

  const selectedFragment = query.fragment
  const fragments = (data?.evaluatorFragments?.nodes ?? []) as FragmentRow[]

  const initializedForRef = useRef<string | null | undefined>(undefined)
  useEffect(() => {
    if (!selectedFragment) {
      if (initializedForRef.current !== null) {
        reset(null)
        initializedForRef.current = null
      }
      return
    }
    if (initializedForRef.current === selectedFragment) return
    const fragmentObject = fragments?.find((frag) => frag.name === selectedFragment)
    if (fragmentObject) {
      reset(fragmentObject)
      initializedForRef.current = selectedFragment
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
      updateQuery({ fragment: d.updateEvaluatorFragment?.evaluatorFragment?.name })
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

  const updateDraft = (input: Partial<FragmentRow>, type: 'expression' | 'other' | 'full') => {
    const newDraft = (
      type === 'expression'
        ? // Update only the expression
          { ...draft, expression: input }
        : type === 'other'
        ? // Update other properties
          { ...draft, ...input }
        : // Update all, when creating a new item
          input
    ) as FragmentRow

    // Strict => key order must be the same
    const isStrictlyEqual = JSON.stringify(newDraft) === JSON.stringify(draft)

    // Loose => key order not considered
    const isLooselyEqual = dequal(newDraft, draft)

    if (isLooselyEqual && !isStrictlyEqual) {
      // A cosmetic re-serialization (same data, different key order): sync the
      // value but leave the undo/redo history untouched
      replace(newDraft)
      return
    }

    if (isStrictlyEqual) return

    setIsDirty(true)
    setDraft(newDraft)
    updateQuery({ fragment: newDraft.name })
  }

  const resetDraft = () => {
    setIsDirty(false)
    reset(null)
    updateQuery({ fragment: null })
  }

  const draftState = useMemo(() => transformFragment(draft), [draft])

  return {
    fragments,
    loading,
    selectedFragment,
    draftState,
    updateDraft,
    resetDraft,
    undoProps,
    updateFragment,
    deleteFragment,
    addFragment,
    isSaving,
    isDeleting,
    isAdding,
    isDirty: isDirty && canUndo,
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
