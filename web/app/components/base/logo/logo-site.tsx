'use client'
import type { FC } from 'react'
import classNames from '@/utils/classnames'

type LogoSiteProps = {
  className?: string
}

const LogoSite: FC<LogoSiteProps> = ({
  className,
}) => {
  return (
    <img
      src={'/logo/logo-site.png'}
      // className={classNames('block w-[22.651px] h-[24.5px]', className)}
      className={classNames('block w-auto h-[30px]', className)}
      alt='logo'
    />
  )
}

export default LogoSite
