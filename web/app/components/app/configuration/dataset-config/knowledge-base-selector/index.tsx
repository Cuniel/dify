'use client'
import type { FC } from 'react'
import React, { useRef, useState, useEffect } from 'react'
import { useGetState, useInfiniteScroll } from 'ahooks'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import produce from 'immer'
import TypeIcon from '@/app/components/app/configuration/dataset-config/type-icon'
import type { DataSet } from '@/models/datasets'
import Button from '@/app/components/base/button'
import { fetchDatasets } from '@/service/datasets'
import Loading from '@/app/components/base/loading'
import Badge from '@/app/components/base/badge'
import { useKnowledge } from '@/hooks/use-knowledge'
import cn from '@/utils/classnames'
import { PlusIcon } from '@heroicons/react/24/outline'

export type IKnowledgeBaseSelectorProps = {
  selectedIds: string[]
  onSelect: (dataSet: DataSet[]) => void
}

const KnowledgeBaseSelector: FC<IKnowledgeBaseSelectorProps> = ({
  selectedIds,
  onSelect,
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = React.useState<DataSet[]>(selectedIds.map(id => ({ id }) as any))
  const [loaded, setLoaded] = React.useState(false)
  const [datasets, setDataSets] = React.useState<DataSet[] | null>(null)
  const hasNoData = !datasets || datasets?.length === 0
  const canSelectMulti = true

  const listRef = useRef<HTMLDivElement>(null)
  const [page, setPage, getPage] = useGetState(1)
  const [isNoMore, setIsNoMore] = useState(false)
  const { formatIndexingTechniqueAndMethod } = useKnowledge()

  // 加载数据
  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    const { data, has_more } = await fetchDatasets({ url: '/datasets', params: { page: 1 } })
    setPage(2)
    setIsNoMore(!has_more)
    const newList = data.filter(item => item.indexing_technique || item.provider === 'external')
    setDataSets(newList)
    setLoaded(true)

    if (selectedIds.length > 0) {
      const newSelected = produce(selected, (draft) => {
        selected.forEach((item, index) => {
          if (!item.name) { // not fetched database
            const newItem = newList.find(i => i.id === item.id)
            if (newItem)
              draft[index] = newItem
          }
        })
      })
      setSelected(newSelected)
    }
  }

  useInfiniteScroll(
    async () => {
      if (!isNoMore) {
        const { data, has_more } = await fetchDatasets({ url: '/datasets', params: { page: getPage() } })
        setPage(getPage() + 1)
        setIsNoMore(!has_more)
        const newList = [...(datasets || []), ...data.filter(item => item.indexing_technique || item.provider === 'external')]
        setDataSets(newList)

        if (selected.some(item => !item.name)) {
          const newSelected = produce(selected, (draft) => {
            selected.forEach((item, index) => {
              if (!item.name) { // not fetched database
                const newItem = newList.find(i => i.id === item.id)
                if (newItem)
                  draft[index] = newItem
              }
            })
          })
          setSelected(newSelected)
        }
      }
      return { list: [] }
    },
    {
      target: listRef,
      isNoMore: () => {
        return isNoMore
      },
      reloadDeps: [isNoMore],
    },
  )

  const toggleSelect = (dataSet: DataSet) => {
    const isSelected = selected.some(item => item.id === dataSet.id)
    if (isSelected) {
      const newSelected = selected.filter(item => item.id !== dataSet.id)
      setSelected(newSelected)
      onSelect(newSelected)
    }
    else {
      if (canSelectMulti) {
        const newSelected = [...selected, dataSet]
        setSelected(newSelected)
        onSelect(newSelected)
      }
      else {
        setSelected([dataSet])
        onSelect([dataSet])
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium text-text-secondary">
          {selected.length > 0 && `${selected.length} ${t('appDebug.feature.dataSet.selected')}`}
        </div>
        <Link href="/datasets/create" className="flex items-center text-sm text-text-accent">
          <PlusIcon className="w-4 h-4 mr-1" />
          {t('appDebug.feature.dataSet.toCreate')}
        </Link>
      </div>

      {!loaded && (
        <div className='flex h-[200px] items-center justify-center'>
          <Loading type='area' />
        </div>
      )}

      {(loaded && hasNoData) && (
        <div className='mt-6 flex h-[128px] items-center justify-center space-x-1 rounded-lg border text-[13px]'
          style={{
            background: 'rgba(0, 0, 0, 0.02)',
            borderColor: 'rgba(0, 0, 0, 0.02)',
          }}
        >
          <span className='text-text-tertiary'>{t('appDebug.feature.dataSet.noDataSet')}</span>
          <Link href={'/datasets/create'} className='font-normal text-text-accent'>{t('appDebug.feature.dataSet.toCreate')}</Link>
        </div>
      )}

      {datasets && datasets?.length > 0 && (
        <div ref={listRef} className='space-y-2 overflow-y-auto' style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {datasets.map(item => (
            <div
              key={item.id}
              className={cn(
                'flex h-10 cursor-pointer items-center justify-between rounded-lg border-[0.5px] border-components-panel-border-subtle bg-components-panel-on-panel-item-bg px-2 shadow-xs hover:border-components-panel-border hover:bg-components-panel-on-panel-item-bg-hover hover:shadow-sm',
                selected.some(i => i.id === item.id) && 'border-[1.5px] border-components-option-card-option-selected-border bg-state-accent-hover shadow-xs hover:border-components-option-card-option-selected-border hover:bg-state-accent-hover hover:shadow-xs',
                !item.embedding_available && 'hover:border-components-panel-border-subtle hover:bg-components-panel-on-panel-item-bg hover:shadow-xs',
              )}
              onClick={() => {
                if (!item.embedding_available)
                  return
                toggleSelect(item)
              }}
            >
              <div className='mr-1 flex items-center overflow-hidden'>
                <div className={cn('mr-2', !item.embedding_available && 'opacity-30')}>
                  <TypeIcon type="upload_file" size='md' />
                </div>
                <div className={cn('max-w-[200px] truncate text-[13px] font-medium text-text-secondary', !item.embedding_available && '!max-w-[120px] opacity-30')}>{item.name}</div>
                {!item.embedding_available && (
                  <span className='ml-1 shrink-0 rounded-md border border-divider-deep px-1 text-xs font-normal leading-[18px] text-text-tertiary'>{t('dataset.unavailable')}</span>
                )}
              </div>
              {
                item.indexing_technique && (
                  <Badge
                    className='shrink-0'
                    text={formatIndexingTechniqueAndMethod(item.indexing_technique, item.retrieval_model_dict?.search_method)}
                  />
                )
              }
              {
                item.provider === 'external' && (
                  <Badge className='shrink-0' text={t('dataset.externalTag')} />
                )
              }
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(KnowledgeBaseSelector)
