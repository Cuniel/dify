import React, { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { RiLayoutLeft2Line, RiLayoutRight2Line } from '@remixicon/react'
import NavLink from './navLink'
import type { NavIcon } from './navLink'
import AppBasic from './basic'
import AppInfo from './app-info'
import DatasetInfo from './dataset-info'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import { useStore as useAppStore } from '@/app/components/app/store'
import cn from '@/utils/classnames'

export type IAppDetailNavProps = {
  iconType?: 'app' | 'dataset' | 'notion'
  title: string
  desc: string
  isExternal?: boolean
  icon: string
  icon_background: string
  navigation: Array<{
    name: string
    href: string
    icon: NavIcon
    selectedIcon: NavIcon
  }>
  extraInfo?: (modeState: string) => React.ReactNode
}

const AppDetailNav = ({ title, desc, isExternal, icon, icon_background, navigation, extraInfo, iconType = 'app' }: IAppDetailNavProps) => {
  const { appSidebarExpand, setAppSiderbarExpand } = useAppStore(useShallow(state => ({
    appSidebarExpand: state.appSidebarExpand,
    setAppSiderbarExpand: state.setAppSiderbarExpand,
  })))
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const expand = appSidebarExpand === 'expand'

  const handleToggle = (state: string) => {
    setAppSiderbarExpand(state === 'expand' ? 'collapse' : 'expand')
  }

  useEffect(() => {
    if (appSidebarExpand) {
      localStorage.setItem('app-detail-collapse-or-expand', appSidebarExpand)
      setAppSiderbarExpand(appSidebarExpand)
    }
  }, [appSidebarExpand, setAppSiderbarExpand])

  return (
    <div></div>
  )
}

export default React.memo(AppDetailNav)
